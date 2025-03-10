# Copyright (C) 2021-2022 Dino Bollinger, ETH Zürich, Information Security Group
# Released under the MIT License
"""
Using a database of collected cookie + label data, determine potential GDPR violations
by detecting cookies that have never been declared by the corresponding consent notice.
This could potentially mean that these cookies cannot be consented to or rejected.
----------------------------------
Required arguments:
    <db_path>   Path to database to analyze.
Optional arguments:
    --out_path <out_path>: Directory to store the resutls.
Usage:
    method5_undeclared_cookies.py <db_path> [--out_path <out_path>]
"""

from docopt import docopt
import os
import sqlite3
import traceback
import re

import logging
from utils import (setupLogger, CONSENTDATA_QUERY, write_vdomains,
                   JAVASCRIPTCOOKIE_QUERY, write_json, canonical_domain)


logger = logging.getLogger("vd")

def main():
    """
    Try to detect potential violations by detecting cookies that
    have never been declared by the consent notice.
    @return: exit code, 0 for success
    """
    argv = None
    cargs = docopt(__doc__, argv=argv)

    setupLogger(".")

    logger.info("Running method 05: Undeclared Cookies")

    database_path = cargs["<db_path>"]
    if not os.path.exists(database_path):
        logger.error("Database file does not exist.")
        return 1

    logger.info(f"Database used: {database_path}")

    # enable dictionary access by column name
    conn = sqlite3.connect(database_path)
    conn.row_factory = sqlite3.Row

    ctable_cookies = set()

    # Retrieve data from consent table
    with conn:
        cur = conn.cursor()
        cur.execute(CONSENTDATA_QUERY)
        for row in cur:
            fpd = row["site_url"]

            if re.search("<br/>", row["consent_domain"]):
                consent_domains = row["consent_domain"].split("<br/>")
            elif re.search(",", row["consent_domain"]):
                consent_domains = row["consent_domain"].split(",")
            else:
                consent_domains = [row["consent_domain"]]

            for domain_entry in consent_domains:
                d = domain_entry.strip()
                #if re.search("\s+", d):
                #    print("Whitespace found:")
                #    print(consent_domains)

                ctable_cookies.add((row["consent_name"], canonical_domain(d), fpd))

    unique_cookie_identifiers = set()
    full_cookie_details = dict()

    # Retrieve data from Javascript Cookies table
    try:
        with conn:
            cur = conn.cursor()
            cur.execute(JAVASCRIPTCOOKIE_QUERY)
            for row in cur:
                if row["cmp_type"] == -1 or row["crawl_state"] != 0:
                    #logger.info(f"No CMP found on domain {row['site_url']}, skipping...")
                    continue
                ident = (row["name"], canonical_domain(row["cookie_domain"]), row["site_url"])
                unique_cookie_identifiers.add(ident)
                # just add the first instance for some basic info on the cookie
                if ident not in full_cookie_details:
                    full_cookie_details[ident] = row
            cur.close()
    except (sqlite3.OperationalError, sqlite3.IntegrityError):
        logger.error("A database error occurred:")
        logger.error(traceback.format_exc())
        return -1

    violation_details = dict()
    violation_domains = set()
    violation_count = 0
    total_domains = set()
    total = 0

    for uident in unique_cookie_identifiers:
        vdomain = uident[2]
        if uident not in ctable_cookies:
            violation_domains.add(vdomain)
            violation_count += 1

            if vdomain not in violation_details:
                violation_details[vdomain] = list()

            violation_details[vdomain].append({
                "name": full_cookie_details[uident]["name"],
                "domain": full_cookie_details[uident]["cookie_domain"],
                "path": full_cookie_details[uident]["path"],
                "value": full_cookie_details[uident]["value"],
                "cmp_type": full_cookie_details[uident]["cmp_type"],
                "expiry": full_cookie_details[uident]["actual_expiry"],
                "is_session": full_cookie_details[uident]["is_session"],
                "http_only": full_cookie_details[uident]["is_http_only"],
                "host_only": full_cookie_details[uident]["is_host_only"],
                "secure": full_cookie_details[uident]["is_secure"],
                "same_site": full_cookie_details[uident]["time_stamp"]
            })
        total_domains.add(vdomain)
        total += 1

    conn.close()

    logger.info(f"Total cookies collected from websites with a CMP: {total}")
    logger.info(f"Number of cookies that have not been found in consent notices: {violation_count}")
    logger.info(f"Total sites with a supported, functioning CMP: {len(total_domains)}")
    logger.info(f"Number of sites with undeclared cookies on said CMP: {len(violation_domains)}")

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
    write_json(violation_details, "method5_cookies.json", out_path)
    write_vdomains(violation_domains, "method5_domains.txt", out_path)

    return 0


if __name__ == '__main__':
    exit(main())
