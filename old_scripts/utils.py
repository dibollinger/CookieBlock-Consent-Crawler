# Copyright (C) 2021-2022 Dino Bollinger, ETH Zürich, Information Security Group
# Released under the MIT License
"""
Contains functions that are shared between the analysis scripts.
"""
from statistics import mean, stdev
from typing import Dict, Set, List, Tuple, Any, Union
import traceback
import sqlite3
import json
import os
import logging
from datetime import datetime
import re

# Query to match cookie declarations with observed cookies, and retrieve crawl state results.
MATCHED_COOKIEDATA_QUERY = """
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
        c.type_id,
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

# Extracts data from the cookie declaration table only, combined with crawl state results.
CONSENTDATA_QUERY = """
SELECT DISTINCT c.visit_id,
        s.site_url,
        ccr.cmp_type as cmp_type,
        ccr.crawl_state,
        c.name as consent_name,
        c.domain as consent_domain,
        c.purpose,
        c.cat_id,
        c.cat_name,
        c.type_name,
        c.type_id,
        c.expiry as consent_expiry
FROM consent_data c
JOIN site_visits s ON s.visit_id == c.visit_id
JOIN consent_crawl_results ccr ON ccr.visit_id == c.visit_id
"""

# Extracts data from the observed cookie table, match with crawl state results.
JAVASCRIPTCOOKIE_QUERY = """
SELECT DISTINCT j.visit_id,
        s.site_url,
        ccr.cmp_type as cmp_type,
        ccr.crawl_state,
        j.name,
        j.host as cookie_domain,
        j.path,
        j.value,
        j.expiry as actual_expiry,
        j.is_session,
        j.is_http_only,
        j.is_host_only,
        j.is_secure,
        j.same_site,
        j.time_stamp
FROM javascript_cookies j
JOIN site_visits s ON s.visit_id == j.visit_id
JOIN consent_crawl_results ccr ON ccr.visit_id == j.visit_id
WHERE j.record_type <> "deleted"
ORDER BY j.visit_id, j.name, time_stamp ASC;
"""

logger = logging.getLogger("vd")
time_format = "%Y-%m-%dT%H:%M:%S.%fZ"

def setupLogger(logdir:str, logLevel=logging.DEBUG):
    """
    Set up the logger instance. INFO output to stderr, DEBUG output to log file.
    :param logdir: Directory for the log file.
    """
    os.makedirs(logdir, exist_ok=True)
    logger.setLevel(logLevel)
    logfile = os.path.join(logdir, "presence_crawl.log")

    # log to stderr
    ch = logging.StreamHandler()
    ch.setLevel(logging.INFO)
    logger.addHandler(ch)

    fh = logging.FileHandler("detector.log")
    fh.setLevel(logging.DEBUG)
    logger.addHandler(fh)

    logger.info("---------------------------------")
    return logger


def compute_expiry_time_in_seconds(start_ts: str, end_ts: str, session: int) -> int:
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


def retrieve_matched_cookies_from_DB(conn: sqlite3.Connection):
    """
    Retrieves cookies that were found in both the javascript cookies table, and the consent table.
    @param conn: Database connection
    @return: Extracted records in JSON format, cookie update counts, cookies that were labelled twice on a single website
    """
    json_data: Dict[str, Dict[str, Any]] = dict()
    updates_per_cookie_entry: Dict[Tuple[str, int], int] = dict()

    # cookies that will be filtered due to having multiple categories assigned
    blacklist = set()

    # while collecting the data, also determine how many training entries were collected for each label
    # [necessary, functional, analytic, advertising]
    counts_per_unique_cookie = [0, 0, 0, 0, 0, 0, 0]
    counts_per_cookie_update = [0, 0, 0, 0, 0, 0, 0]
    mismatch_count = 0
    update_count = 0

    # counts the number of times a data entry was rejected due to multiple categories
    blacklisted_encounters = 0
    try:
        with conn:
            cur = conn.cursor()
            cur.execute(MATCHED_COOKIEDATA_QUERY)
            for row in cur:

                cat_id = int(row["cat_id"])

                if cat_id == 4:
                    cat_id = 4
                elif cat_id == 99:
                    cat_id = 5
                elif cat_id == -1:
                    cat_id = 6

                # In rare cases, the expiration date can be set to the year 10000 and upwards.
                # This forces a different ISO time format than the one we normally expect.
                # Since these cases are exceedingly rare (2 instances out of 300000), we will ignore them.
                if row["actual_expiry"].startswith("+0"):
                    continue

                # Verify that the observed cookie's domain matches the declared domain.
                # This requires string processing more complex than what's available in SQL.
                canon_adom: str = canonical_domain(row["cookie_domain"])

                # Consent Management Platforms may specify multiple possible domains, split by linebreaks.
                # If the correct host occurs in the set, accept the training entry, else reject.
                consent_domains = row["consent_domain"].split("<br/>")
                domains_match: bool = False
                for domain_entry in consent_domains:
                    canon_cdom = canonical_domain(domain_entry)
                    if re.search(re.escape(canon_cdom), canon_adom, re.IGNORECASE):
                        domains_match = True
                        break

                if not domains_match:
                    mismatch_count += 1
                    continue

                json_cookie_key = row["name"] + ";" + row["cookie_domain"] + ";" + row["path"] + ";" + row["site_url"]
                if json_cookie_key in blacklist:
                    blacklisted_encounters += 1
                    continue

                try:
                    if json_cookie_key not in json_data:
                        json_data[json_cookie_key] = {
                            "visit_id": row["visit_id"],
                            "name": row["name"],
                            "domain": row["cookie_domain"],
                            "consent_domain": row["consent_domain"],
                            "path": row["path"],
                            "site_url": row["site_url"],
                            "label": cat_id,
                            "cat_name": row["cat_name"],
                            "cmp_type": row["cmp_type"],
                            "consent_expiry": row["consent_expiry"],
                            "timestamp": row["time_stamp"],
                            #"purpose": row["purpose"],
                            "variable_data": []
                        }
                        counts_per_unique_cookie[cat_id] += 1
                        updates_per_cookie_entry[(json_cookie_key, cat_id)] = 1
                    else:
                        # Verify that the values match
                        assert json_data[json_cookie_key]["name"] == row[
                            "name"], f"Stored name: '{json_data[json_cookie_key]['name']}' does not match new name: '{row['name']}'"
                        assert json_data[json_cookie_key]["domain"] == row[
                            "cookie_domain"], f"Stored domain: '{json_data[json_cookie_key]['domain']}' does not match new domain: '{row['cookie_domain']}'"
                        assert json_data[json_cookie_key]["path"] == row[
                            "path"], f"Stored path: '{json_data[json_cookie_key]['path']}' does not match new path: '{row['path']}'"
                        assert json_data[json_cookie_key]["site_url"] == row[
                            "site_url"], f"Stored FPO: '{json_data[json_cookie_key]['site_url']}' does not match new FPO: '{row['site_url']}'"
                        assert json_data[json_cookie_key][
                                   "label"] == cat_id, f"Stored label: '{json_data[json_cookie_key]['label']}' does not match new label: '{cat_id}'"
                        assert json_data[json_cookie_key]["cmp_type"] == row[
                            "cmp_type"], f"Stored CMP: '{json_data[json_cookie_key]['cmp_origin']}' does not match new CMP: '{row['cmp_type']}'"
                        updates_per_cookie_entry[(json_cookie_key, cat_id)] += 1
                except AssertionError as e:
                    # If one of the above assertions fails, we have a problem in the dataset, and need to prune the offending entries
                    logger.debug(e)
                    logger.debug(f"Existing Data: {json_data[json_cookie_key]}")
                    logger.debug(f"Offending Cookie: {dict(row)}")
                    counts_per_unique_cookie[int(json_data[json_cookie_key]["label"])] -= 1
                    blacklist.add(json_cookie_key)
#                    blacklist_entries_with_details.append( {
#                        'name': json_data[json_cookie_key]["name"],
#                        "1st_name": str(json_data[json_cookie_key]["cat_name"]),
#                        "1st_label": int(json_data[json_cookie_key]["label"]),
#                        "2nd_name": str(row["cat_name"]),
#                        "2nd_label": int(row["cat_id"]),
#                        "site_url": json_data[json_cookie_key]["site_url"],
#                        "details": json_data[json_cookie_key]
#                    })
                    blacklisted_encounters += 2  # both current and removed previous cookie
                    del json_data[json_cookie_key]
                    continue

                counts_per_cookie_update[cat_id] += 1

                json_data[json_cookie_key]["variable_data"].append({
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
        raise
    else:
        logger.info(f"Extracted {update_count} cookie updates.")
        logger.info(f"Encountered {mismatch_count} domain mismatches.")
        logger.info(f"Unique training data entries in dictionary: {len(json_data)}")
        logger.info(f"Number of unique cookies blacklisted due to inconsistencies {len(blacklist)}")
        logger.info(f"Number of training data updates rejected due to blacklist: {blacklisted_encounters}")
        logger.info(counts_per_unique_cookie)
        logger.info(counts_per_cookie_update)

        all_temp: List[int] = []
        stats_temp: List[List[int]] = [[], [], [], [], [], [], []]
        for (k, l), c in updates_per_cookie_entry.items():
            stats_temp[l].append(c)
            all_temp.append(c)

        for i in range(len(stats_temp)):
            if len(stats_temp[i]) > 1:
                logger.info(f"Average number of updates for category {i}: {mean(stats_temp[i])}")
                logger.info(f"Standard Deviation of updates for category {i}: {stdev(stats_temp[i])}")
        if len(all_temp) > 1:
            logger.info(f"Total average of updates: {mean(all_temp)}")
            logger.info(f"Standard Deviation of updates: {stdev(all_temp)}")

    return json_data, counts_per_unique_cookie



def get_violation_details_consent_table(row: Dict) -> Dict:
    """ entry for the json file when the consent table is used only """
    return { "visit_id": row["visit_id"],
             "site_url": row["site_url"],
             "cmp_type": row["cmp_type"],
             "name": row["consent_name"],
             "domain": row["consent_domain"],
             "purpose": row["purpose"],
             "label": row["cat_id"],
             "cat_name": row["cat_name"],
             "cookiebot_type_id": row["type_id"],
             "cookiebot_type_name": row["type_name"],
             "expiry": row["consent_expiry"]}



def write_json(violation_details: Union[List,Dict], filename: str, output_path: str = "./violation_stats/") -> None:
    """
    Write pretty-printed JSON with indentation
    @param violation_details: Details of the offending cookie or consent table entry.
    @param filename: File to write it to.
    """
    os.makedirs(output_path, exist_ok=True)
    json_outfile = os.path.join(output_path, filename)

    with open(json_outfile, 'w') as fd:
        json.dump(violation_details, fd, indent=4, sort_keys=True)
    logger.info(f"Violations output to: '{json_outfile}'")


def write_vdomains(vdomains: Set, fn: str, output_path: str = "./violation_stats/") -> None:
    """
    Write a list of offending domains to disk.
    @param vdomains: offending domains
    @param fn: filename
    """
    os.makedirs(output_path, exist_ok=True)
    path =  output_path + fn
    logger.info(f"Writing domains to {path}")
    with open(path, 'w') as fd:
        for d in sorted(vdomains):
            fd.write(d + "\n")
    logger.info(f"Violations output to: '{path}'")
