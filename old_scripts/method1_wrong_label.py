# Copyright (C) 2021-2022 Dino Bollinger, ETH Zürich, Information Security Group
# Released under the MIT License
"""
Using a database of collected cookie + label data, determine potential GDPR violations by checking whether
Google Analytics cookie variants (or another known cookie, can be specified) were misclassified.
----------------------------------
Required arguments:
    <db_path>   Path to database to analyze.
Optional arguments:
    <name_pattern>: Specifies the regex pattern for the cookie name.
    <domain_pattern>: Specifies the regex pattern for the cookie domain.
    <expected_label>: Expected label for the cookie.
    --out_path <out_path>: Directory to store the resutls.
Usage:
    method1_wrong_label.py <db_path> [<name_pattern> <domain_pattern> <expected_label> --out_path <out_path>]
"""

from docopt import docopt
import os
import sqlite3
import re

import logging
from utils import (setupLogger, CONSENTDATA_QUERY, write_json,
                   get_violation_details_consent_table, write_vdomains)

logger = logging.getLogger("vd")


def main():
    """
    Try to detect potential violations by analyzing the category of specific cookies.
    @return: exit code, 0 for success
    """
    argv = None
    cargs = docopt(__doc__, argv=argv)

    setupLogger(".", logging.INFO)

    logger.info("Running method 01: Wrong Label for Known Cookie")

    # Specify name, domain patter and expected label by input, or
    if cargs["<name_pattern>"]:
        name_pattern = re.compile(cargs["<name_pattern>"])
        domain_pattern = re.compile(cargs["<domain_pattern>"])
        expected_label = int(cargs["<expected_label>"])
    else:
        logger.info("Using default GA check:")
        name_pattern = re.compile("(^_ga$|^_gat$|^_gid$|^_gat_gtag_UA_[0-9]+_[0-9]+|^_gat_UA-[0-9]+-[0-9]+)")
        domain_pattern = re.compile(".*")
        expected_label = 2

    # Verify that database exists
    database_path = cargs["<db_path>"]
    if not os.path.exists(database_path):
        logger.error("Database file does not exist.")
        return 1

    logger.info(f"Database used: {database_path}")

    # enable dictionary access by column name, access database
    conn = sqlite3.connect(database_path)
    conn.row_factory = sqlite3.Row

    # some variables to collect violation details with
    violation_details = dict()
    violation_domains = set()
    violation_counts = [0, 0, 0, 0, 0, 0, 0]
    total_domains = set()
    total_matching_cookies = 0

    logger.info("Extracting info from database...")

    with conn:
        cur = conn.cursor()
        cur.execute(CONSENTDATA_QUERY)
        for row in cur:

            # Duplicate check, not necessary anymore
            #transform = {**row}
            #if transform.values() in duplicate_reject:
            #    logger.info("Skipped exact duplicate entry")
            #    continue
            #duplicate_reject.add(transform.values())

            if name_pattern.match(row["consent_name"]) and domain_pattern.search(row["consent_domain"]):
                total_domains.add(row["site_url"])
                total_matching_cookies += 1
                if row["cat_id"] != expected_label and row["cat_id"] != -1:
                    #logger.info(f"Potential Violation on website: {row['site_url']} for cookie entry: {row['consent_name']};{row['consent_domain']}")
                    #logger.info(f"Entry matches pattern, but given label was {row['cat_id']}")

                    cat_id = row["cat_id"]
                    if cat_id == 99:
                        cat_id = 5

                    vdomain = row["site_url"]
                    violation_domains.add(vdomain)
                    violation_counts[cat_id] += 1

                    if vdomain not in violation_details:
                        violation_details[vdomain] = list()
                    violation_details[vdomain].append(get_violation_details_consent_table(row))

    conn.close()
    logger.info(f"Total matching cookies found: {total_matching_cookies}")
    logger.info(f"Number of potential violations: {violation_counts}")
    logger.info(f"Number of sites that have the cookie in total: {len(total_domains)}")
    logger.info(f"Number of sites with potential violations: {len(violation_domains)}")

    v_per_cmp = [0, 0, 0]
    for url, violating_cookies in violation_details.items():
        for c in violating_cookies:
            assert (c["cmp_type"] >= 0)
            v_per_cmp[c["cmp_type"]] += 1

    logger.info(f"Potential Violations per CMP Type: {v_per_cmp}")

    if cargs["--out_path"]:
        out_path = cargs["--out_path"]
    else:
        out_path = "./violation_stats/"
    write_json(violation_details, "method1_cookies.json", out_path)
    write_vdomains(violation_domains, "method1_domains.txt", out_path)

    return 0


if __name__ == '__main__':
    exit(main())
