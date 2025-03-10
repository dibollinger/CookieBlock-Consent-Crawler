# Copyright (C) 2021-2022 Dino Bollinger, ETH Zürich, Information Security Group
# Released under the MIT License
"""
Using a database of collected cookie + label data, determine potential GDPR violations by
determining uncategorized cookies, which usually cannot be rejected and have no description.
----------------------------------
Required arguments:
    <db_path>  Path to database to analyze.
Optional arguments:
    --out_path <out_path>: Directory to store the resutls.
Usage:
    method4_unclassified_cookies.py <db_path> [--out_path <out_path>]
"""

from docopt import docopt
import os
import sqlite3
import re

import logging
from utils import (setupLogger, CONSENTDATA_QUERY, write_json,
                                       write_vdomains, get_violation_details_consent_table)

logger = logging.getLogger("vd")
unclass_pattern = re.compile("(unclassified|uncategorized|Unclassified Cookies|no clasificados)", re.IGNORECASE)

def main():
    """
      Detect potential violations by extracting all cookies that are unclassified.
      @return: exit code, 0 for success
    """
    argv = None
    cargs = docopt(__doc__, argv=argv)

    setupLogger(".")

    logger.info("Running method 04: Unclassified Cookies")

    database_path = cargs["<db_path>"]
    if not os.path.exists(database_path):
        logger.error("Database file does not exist.")
        return 1

    logger.info(f"Database used: {database_path}")

    # enable dictionary access by column name
    conn = sqlite3.connect(database_path)
    conn.row_factory = sqlite3.Row

    # variables to collection violation details
    total_domains = set()
    violation_details = dict()
    violation_domains = set()
    violation_count = 0
    total_count = 0

    logger.info("Extracting info from database...")

    with conn:
        cur = conn.cursor()
        cur.execute(CONSENTDATA_QUERY)
        for row in cur:
            if row["cat_id"] == 4 or unclass_pattern.match(row["cat_name"]):
                #logger.debug(f"Potential Violation: {row['consent_name']};{row['consent_domain']};{row['cat_name']}")
                vdomain = row["site_url"]
                violation_domains.add(vdomain)
                violation_count += 1

                if vdomain not in violation_details:
                    violation_details[vdomain] = list()
                violation_details[vdomain].append(get_violation_details_consent_table(row))
            total_domains.add(row["site_url"])
            total_count += 1

    conn.close()

    logger.info(f"Total number of cookies: {total_count}")
    logger.info(f"Number of unclassified cookies: {violation_count}")

    logger.info(f"Number of sites in total: {len(total_domains)}")
    logger.info(f"Number of sites with unclassified cookies: {len(violation_domains)}")

    v_per_cmp = [0, 0, 0]
    for url, violating_cookies in violation_details.items():
        for c in violating_cookies:
            assert(c["cmp_type"] >= 0)
            v_per_cmp[c["cmp_type"]] += 1
    logger.info(f"Potential Violations per CMP Type: {v_per_cmp}")

    if cargs["--out_path"]:
        out_path = cargs["--out_path"]
    else:
        out_path = "./violation_stats/"
    write_json(violation_details, "method4_cookies.json", out_path)
    write_vdomains(violation_domains, "method4_domains.txt", out_path)

    return 0


if __name__ == '__main__':
    exit(main())
