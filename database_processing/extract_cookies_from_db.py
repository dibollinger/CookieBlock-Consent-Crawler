#!/bin/python3
# Copyright (C) 2021 Dino Bollinger, ETH Zürich, Information Security Group
# Released under the MIT License
"""
Matches the cookies with their labels based on name and domain, stores the resulting data in JSON format.

Inside the JSON, each cookie is an object with individual attributes.
All updates for a cookie are aggregated and stored in an array "variable_data" as part of the cookie entry.
Cookie deletions, unknown category, uncategorized cookies and all cookies where the domain did not match the declaration are ignored.

This is used as the final training data format for the feature extraction in the classifier.

Output JSON structure:
    [
     "cookie_id_01": {
       "name": "<name>",
       "domain": "<domain>",
       "path": "/path",
       "cmp_origin": [0-2],
       "label": [0-3],
       "variable_data": [
         {
         "value": "<cookie content>",
         "expiry": "<expiration in seconds>",
         "session": true/false,
         "http_only": true/false,
         "host_only": true/false,
         "secure": true/false,
         "same_site": "no restriction"/"lax"/"strict"
         },
         ...
       ]
     },
     "cookie_id_02 : {
        ...
     },
     ...
    ]

Usage:
    extract_cookies_from_db.py <db_path> [--include_mismatches] [--output_mismatches]

Options:
    -m --output_mismatches     If specified, will create a database for domain mismatches.
    -e --include_mismatches    If set, will include domain mismatches in the training data.
    -h --help                  Show this help message.
"""

import re
import sqlite3
import logging
import traceback
import os
import json

from statistics import mean, stdev
from datetime import datetime
from typing import List, Dict, Any, Tuple
from docopt import docopt

logger = logging.getLogger("feature-extract")

time_format = "%Y-%m-%dT%H:%M:%S.%fZ"

### SQL COMMANDS

DROP_EXISTING = """DROP TABLE IF EXISTS mismatched_domains;"""

# SQL command to create the database for domain mismatches
MISMATCH_DB_SCHEMA = """
CREATE TABLE IF NOT EXISTS mismatched_domains(
    visit_id INTEGER NOT NULL,
    site_url TEXT NOT NULL,
    cmp_type INTEGER NOT NULL,
    name TEXT NOT NULL,
    cookie_domain TEXT NOT NULL,
    path TEXT NOT NULL,
    consent_domain TEXT,
    cookie_contents TEXT,
    purpose TEXT,
    cat_id INTEGER,
    cat_name TEXT,
    type_name TEXT,
    consent_expiry DATETIME,
    actual_expiry DATETIME,
    is_session INTEGER,
    is_http_only INTEGER,
    is_host_only INTEGER,
    is_secure INTEGER,
    same_site INTEGER,
    time_stamp DATETIME
    );
    """

# SQL command to extract the training data from the database
TRAINING_DATA_QUERY = """
SELECT DISTINCT j.visit_id,
        s.site_url,
        ccr.cmp_type as cmp_type,
        j.name,
        j.host as cookie_domain,
        j.path,
        c.domain as consent_domain,
        j.value,
        c.purpose,
        c.cat_id,
        c.cat_name,
        c.type_name,
        c.expiry as consent_expiry,
        j.expiry as actual_expiry,
        j.is_session,
        j.is_http_only,
        j.is_host_only,
        j.is_secure,
        j.same_site,
        j.time_stamp
FROM consent_data c
JOIN javascript_cookies j ON c.visit_id == j.visit_id and c.name == j.name
JOIN site_visits s ON s.visit_id == c.visit_id
JOIN consent_crawl_results ccr ON ccr.visit_id == c.visit_id
WHERE j.record_type <> "deleted"
ORDER BY j.visit_id, j.name, time_stamp ASC;
"""

consentcookie_names = re.compile("OptanonConsent|OptanonAlertBoxClosed|CookieConsent")

###
### END SQL COMMANDS

def compute_expiry_time_in_seconds(start_ts: str, end_ts: str, session:int) -> int:
    if session:
        return 0
    else:
        timedelta = datetime.strptime(end_ts, time_format) - datetime.strptime(start_ts, time_format)
        return int(timedelta.total_seconds())


def canonical_domain(dom: str) -> str:
    """
    Transform a provided URL into a uniform domain representation for string comparison.
    """
    canon_dom = re.sub("^http(s)?://", "", dom)
    canon_dom = re.sub("^www", "", canon_dom)
    canon_dom = re.sub("^\\.", "", canon_dom)
    return canon_dom


def setupLogger(logpath: str = "./extract_cookie_data.log") -> None:
    """
    Set up the logger instance
    """
    with open(logpath, 'w') as fd:
        pass

    logger.setLevel(logging.DEBUG)
    ch = logging.StreamHandler()
    ch.setLevel(logging.INFO)
    logger.addHandler(ch)

    fh = logging.FileHandler(logpath)
    fh.setLevel(logging.DEBUG)
    logger.addHandler(fh)


def main() -> int:
    """
    Extracts rows from the training_data view, timestamps ascending.
    @return: exit code, 0 for success
    """
    argv = None
    #argv = ["./example_db/example_crawl_20210213_153228.sqlite"]
    cargs = docopt(__doc__, argv=argv)

    setupLogger()

    database_path = cargs["<db_path>"]
    if not os.path.exists(database_path):
        logger.error("Database file does not exist.")
        return 1

    create_mismatch_db: bool = cargs["--output_mismatches"]
    include_mismatch: bool = cargs["--include_mismatches"]

    # enable dictionary access by column name
    conn = sqlite3.connect(database_path)
    conn.row_factory = sqlite3.Row

    # create a database containing the domain mismatches
    if create_mismatch_db and not include_mismatch:
        bp, fn = os.path.split(database_path)
        new_db_path = os.path.join(bp, "mismatch_" + fn)
        mismatch_conn = sqlite3.connect(new_db_path)
        mcur = mismatch_conn.cursor()
        mcur.execute(DROP_EXISTING)
        mcur.execute(MISMATCH_DB_SCHEMA)

    logger.info("Begin training data extraction.")
    json_training_data: Dict[str, Dict[str, Any]] = dict()
    updates_per_cookie_entry: Dict[Tuple[str,int], int] = dict()

    # blacklist, and detailed blacklist
    blacklist = set()
    blacklist_entries_with_details = list()

    # while collecting the data, also determine how many training entries were collected for each label
    # [necessary, functional, analytic, advertising]
    counts_per_unique_cookie = [0, 0, 0, 0]
    counts_per_cookie_update = [0, 0, 0, 0]
    mismatch_count = 0
    update_count = 0
    consentcookie_count = 0
    # counts the number of times a data entry was rejected due to blacklist
    blacklisted_encounters = 0
    try:
        with conn:
            cur = conn.cursor()
            cur.execute(TRAINING_DATA_QUERY)
            for row in cur:

                cat_id = int(row["cat_id"])

                # for now, skip anything that isn't the main 4 categories
                if not (0 <= cat_id <= 3):
                    continue

                # In rare cases, the expiration date can be set to the year 10000 and upwards.
                # This forces a different ISO time format than the one we normally expect.
                # Since these cases are exceedingly rare (2 instances out of 300000), we will ignore them.
                if row["actual_expiry"].startswith("+0"):
                    continue

                ## Verify that the cookie's domain matches the joined consent domain.
                ## This requires string processing more complex than what's available in SQL.
                canon_adom: str = canonical_domain(row["cookie_domain"])

                if not include_mismatch:
                    # Consent Management Platforms may specify multiple possible domains, split by linebreaks.
                    # If the correct host occurs in the set, accept the training entry, else reject.
                    consent_domains = row["consent_domain"].split("<br/>")
                    domains_match: bool = False
                    for domain_entry in consent_domains:
                        canon_cdom = canonical_domain(domain_entry)
                        try:
                            if re.search(re.escape(canon_cdom), canon_adom, re.IGNORECASE):
                                domains_match = True
                                break
                        except:
                            logger.error(f"Regex error with the following domain: {canon_cdom}")

                    if not domains_match:
                        logger.debug(f"Consent domain: '{row['consent_domain']}' does not match actual: '{row['cookie_domain']}'")
                        if create_mismatch_db:
                            # data rows that have mismatched domains are output into a new database
                            mcur.execute("INSERT INTO mismatched_domains "
                                         "VALUES (?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?);", tuple(row))
                        mismatch_count += 1
                        continue

                json_cookie_key = row["name"] + ";" + row["cookie_domain"] + ";" + row["path"] + ";" + row["site_url"]
                if json_cookie_key in blacklist:
                    blacklisted_encounters += 1
                    continue

                try:
                    if json_cookie_key not in json_training_data:

                        json_training_data[json_cookie_key] = {
                            "visit_id": row["visit_id"],
                            "name": row["name"],
                            "domain": row["cookie_domain"],
                            "path": row["path"],
                            "first_party_domain": row["site_url"],
                            "label": cat_id,
                            "cmp_origin": row["cmp_type"],
                            "variable_data": []
                        }

                        if consentcookie_names.match(row["name"]):
                            consentcookie_count += 1

                        counts_per_unique_cookie[cat_id] += 1
                        updates_per_cookie_entry[(json_cookie_key, cat_id)] = 1
                    else:
                        # Verify that the values match
                        assert json_training_data[json_cookie_key]["name"] == row["name"], f"Stored name: '{json_training_data[json_cookie_key]['name']}' does not match new name: '{row['name']}'"
                        assert json_training_data[json_cookie_key]["domain"] == row["cookie_domain"], f"Stored domain: '{json_training_data[json_cookie_key]['domain']}' does not match new domain: '{row['cookie_domain']}'"
                        assert json_training_data[json_cookie_key]["path"] == row["path"], f"Stored path: '{json_training_data[json_cookie_key]['path']}' does not match new path: '{row['path']}'"
                        assert json_training_data[json_cookie_key]["first_party_domain"] == row["site_url"], f"Stored FPO: '{json_training_data[json_cookie_key]['first_party_domain']}' does not match new FPO: '{row['site_url']}'"
                        assert json_training_data[json_cookie_key]["label"] == cat_id, f"Stored label: '{json_training_data[json_cookie_key]['label']}' does not match new label: '{cat_id}'"
                        assert json_training_data[json_cookie_key]["cmp_origin"] == row["cmp_type"], f"Stored CMP: '{json_training_data[json_cookie_key]['cmp_origin']}' does not match new CMP: '{row['cmp_type']}'"
                        updates_per_cookie_entry[(json_cookie_key, cat_id)] += 1
                except AssertionError as e:
                    # If one of the above assertions fails, we have a problem in the dataset, and need to prune the offending entries
                    logger.debug(e)
                    logger.debug(f"Existing Data: {json_training_data[json_cookie_key]}")
                    logger.debug(f"Offending Cookie: {dict(row)}")
                    counts_per_unique_cookie[int(json_training_data[json_cookie_key]["label"])] -= 1
                    blacklist.add(json_cookie_key)
                    blacklist_entries_with_details.append(json_cookie_key + ";" + str(json_training_data[json_cookie_key]["label"]) + ";" + str(cat_id))
                    blacklisted_encounters += 2 # both current and removed previous cookie
                    del json_training_data[json_cookie_key]
                    continue

                counts_per_cookie_update[cat_id] += 1

                json_training_data[json_cookie_key]["variable_data"].append({
                    "value": row["value"],
                    "expiry": compute_expiry_time_in_seconds(row["time_stamp"], row["actual_expiry"], int(row["is_session"])),
                    "session": bool(row["is_session"]),
                    "http_only": bool(row["is_http_only"]),
                    "host_only": bool(row["is_host_only"]),
                    "secure": bool(row["is_secure"]),
                    "same_site": row["same_site"]
                })

                update_count += 1
            cur.close()
    except (sqlite3.OperationalError, sqlite3.IntegrityError):
        logger.error("A database error occurred:")
        logger.error(traceback.format_exc())
        return -1
    else:
        logger.info(f"Extracted {update_count} cookie updates.")
        if not include_mismatch:
            logger.info(f"Encountered {mismatch_count} domain mismatches.")
        logger.info(f"Unique training data entries in dictionary: {len(json_training_data)}")
        logger.info(f"Number of unique cookies blacklisted due to inconsistencies {len(blacklist)}")
        logger.info(f"Number of training data updates rejected due to blacklist: {blacklisted_encounters}")
        logger.info(f"Number of CMP specific consent cookies: {consentcookie_count}")
        logger.info(counts_per_unique_cookie)
        logger.info(counts_per_cookie_update)

        all_temp: List[int] = []
        stats_temp: List[List[int]] = [[], [], [], []]
        for (k, l), c in updates_per_cookie_entry.items():
            stats_temp[l].append(c)
            all_temp.append(c)

        for i in range(4):
            print(f"Average number of updates for category {i}: {mean(stats_temp[i])}")
            print(f"Standard Deviation of updates for category {i}: {stdev(stats_temp[i])}")
        print(f"Total average of updates: {mean(all_temp)}")
        print(f"Standard Deviation of updates: {stdev(all_temp)}")


    conn.close()

    if create_mismatch_db and not include_mismatch:
        # Commit and close new db
        mcur.close()
        mismatch_conn.commit()
        mismatch_conn.close()
        logger.info(f"Mismatched domain rows are written to '{new_db_path}'")

    # Construct the output filename from the input database
    root, _ = os.path.splitext(database_path)
    _, filename = os.path.split(root)

    output_path = "./training_data_output/"
    os.makedirs(output_path, exist_ok=True)
    json_outfile = os.path.join(output_path, f"{filename}.json")

    with open("blacklist.out", 'w') as fd:
        for b in blacklist_entries_with_details:
            fd.write(b + "\n")

    with open(json_outfile, 'w') as fd:
        json.dump(json_training_data, fd)
    logger.info(f"Training data output to: '{json_outfile}'")

    return 0


if __name__ == "__main__":
    exit(main())
