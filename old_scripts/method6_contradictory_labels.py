# Copyright (C) 2021-2022 Dino Bollinger, ETH Zürich, Information Security Group
# Released under the MIT License
"""
Using a database of collected cookie + label data, determine potential GDPR violations
by checking whether the website defines two differing labels for the same cookie.
----------------------------------
Required arguments:
    <db_path>   Path to database to analyze.
Optional arguments:
    --out_path <out_path>: Directory to store the resutls.
Usage:
    method6_contradictory_labels.py <db_path> [--out_path <out_path>]
"""

from docopt import docopt
import os
import sqlite3

import logging
from utils import (setupLogger, CONSENTDATA_QUERY, get_violation_details_consent_table,
                   write_json, write_vdomains)

logger = logging.getLogger("vd")


def main():
    """
      Determine potential violations by checking if a website defines two differing labels for the same cookie.
      @return: exit code, 0 for success
    """
    argv = None
    cargs = docopt(__doc__, argv=argv)

    setupLogger(".")

    logger.info("Running method 06: Contradictory Labels")

    database_path = cargs["<db_path>"]
    if not os.path.exists(database_path):
        logger.error("Database file does not exist.")
        return 1

    logger.info(f"Database used: {database_path}")

    # enable dictionary access by column name
    conn = sqlite3.connect(database_path)
    conn.row_factory = sqlite3.Row

    cookies_dict = dict()
    logger.info("Extracting consent data entries from database...")
    with conn:
        cur = conn.cursor()
        cur.execute(CONSENTDATA_QUERY)
        for row in cur:
            key = row["site_url"] + ";" + row['consent_name'] + ";" + row['consent_domain']
            if key in cookies_dict:
                if cookies_dict[key]["label"] != row["cat_id"]:
                    cookies_dict[key]["additional_labels"].append(row["cat_id"])
            else:
                cookies_dict[key] = get_violation_details_consent_table(row)
                cookies_dict[key]["additional_labels"] = list()

    # some variables to collect violation details with
    violation_details = dict()
    violation_domains = set()
    violation_count = 0
    total_domains = set()
    total_entries = 0

    num_necessary_viol = 0
    set_nec_sites = set()

    for key, cookie in cookies_dict.items():
        vdomain = cookie["site_url"]
        if len(cookie["additional_labels"]) > 0:
            violation_domains.add(vdomain)
            violation_count += 1
            if cookie["label"] == 0 or 0 in cookie["additional_labels"]:
                num_necessary_viol += 1
                set_nec_sites.add(vdomain)

            if vdomain not in violation_details:
                violation_details[vdomain] = list()
            violation_details[vdomain].append(cookie)
        total_domains.add(vdomain)
        total_entries += 1
    conn.close()

    logger.info(f"Total number of consent table entries: {total_entries}")
    logger.info(f"Number of declared cookies with multiple conflicting labels: {violation_count}")
    logger.info(f"Number of sites with working CMP and declared cookies in total: {len(total_domains)}")
    logger.info(f"Number of sites that declare conflicting labels: {len(violation_domains)}")

    logger.info(f"Number of conflicting labels with necessary cookies: {num_necessary_viol}")
    logger.info(f"Number of sites that declare conflicting labels with necessary cookies: {len(set_nec_sites)}")

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
    write_json(violation_details, "method6_cookies.json", out_path)
    write_vdomains(violation_domains, "method6_domains.txt", out_path)
    write_vdomains(set_nec_sites, "method6_necessary_domains.txt", out_path)

    return 0


if __name__ == '__main__':
    exit(main())
