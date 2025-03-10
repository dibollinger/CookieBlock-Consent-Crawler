# Copyright (C) 2021-2022 Dino Bollinger, ETH Zürich, Information Security Group
# Released under the MIT License
"""
Using a database of collected cookie + label data, find potential GDPR violations by
outputting all deviations from the majority opinion for a cookie identified by name
and domain, where the occurrences for that cookie need to be greater than a threshold.
----------------------------------
Required arguments:
    <db_path>   Path to database to analyze.
Optional arguments:
    --out_path <out_path>: Directory to store the resutls.
Usage:
    method2_majority_deviation.py <db_path> [--out_path <out_path>]
"""

import os
import sqlite3
import logging
import re

from docopt import docopt
from numpy import argmax
from typing import Dict, List, Any, Tuple

from utils import (setupLogger, write_json, CONSENTDATA_QUERY,
                   write_vdomains, get_violation_details_consent_table)

logger = logging.getLogger("vd")

unclass_pattern = re.compile("(unclassified|uncategorized|Unclassified Cookies|no clasificados)", re.IGNORECASE)

# Minimum number of occurrences needed to apply the majority
threshold = 10

# Minimal size the majority opinion needs to be in order for a cookie to be recongized as misclassified
min_ratio = (2.0/3.0)


def get_category_counts(cookie_data: Dict[str, Dict[str, Any]]) -> Dict[Tuple[str,str], List[int]]:
    """
    Retrieve category counts for each cookie, to then be able to compute the majority opinion.
    Cookies are identified by (name, domain).
    @param cookie_data: Storage for the cookie data, needs to contain "name", "domain", "label"
    @return: Dictionary of category counts per cookie identifier, keys being (name, domain)
    """
    # for each cookie and domain, set up an array of category counts, and update the array
    label_by_ident_dict: Dict[Tuple[str, str], List[int]] = dict()

    for _, entry in cookie_data.items():

        c_cat = entry["label"]

        key = (entry["name"], entry["domain"])
        if key in label_by_ident_dict:
            cat_list = label_by_ident_dict[key]
        else:
            # ne, fu, an, ad, uncat, socmedia, unknown
            cat_list = [0, 0, 0, 0, 0, 0, 0]
            label_by_ident_dict[key] = cat_list

        # increment the counters
        cat_id = int(c_cat)
        if 0 <= cat_id < 5:
            cat_list[cat_id] += 1
        elif cat_id == -1:
            cat_list[6] += 1
        elif cat_id == 99:
            cat_list[5] += 1

    return label_by_ident_dict



def main():
    """
    Script that finds potential GDPR violations by outputting all deviations from the majority
    opinion for a cookie identified by name and domain.
    @return: exit code, 0 for success
    """
    argv = None
    cargs = docopt(__doc__, argv=argv)

    setupLogger(".")

    logger.info("Running method 02: Identifying Outlier Labels")

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
            key = row["site_url"].strip() + ";" + row['consent_name'].strip() + ";" + row["consent_domain"].strip()
            if key in cookies_dict:
                # logger.warning(f"Duplicate found: {key}")
                continue

            cookies_dict[key] = get_violation_details_consent_table(row)

    l_ident = get_category_counts(cookies_dict)

    violation_count = 0
    violation_details = dict()
    violation_domains = set()
    total_domains = set()
    total_cookies = 0
    for k_item, val in cookies_dict.items():

        total_cookies += 1
        total_domains.add(val["site_url"])

        # only consider main 4 categories
        if val["label"] < 0 or val["label"] > 3:
            continue

        # do not consider unknown category cookies
        # if val["label"] == -1 or val["label"] == 6:
        #    continue

        key = (val["name"], val["domain"])
        sum_total = sum(l_ident[key][0:6])
        expected_label = int(argmax(l_ident[key][0:6]))

        # Only recognize majorities for necessary, functional, analytics, advertising and social media
        if (expected_label < 0 or expected_label > 3) and expected_label != 5:
            continue

        maj_ratio = l_ident[key][expected_label] / sum_total if sum_total > 0 else 0
        if sum_total >= threshold and maj_ratio > min_ratio and int(val["label"]) != expected_label:
            #logger.info(f"Potential Violation found for cookie {val['name']}, {val['domain']}, {val['site_url']}"
            #            + f" -- actual label {val['label']} -- majority label: {expected_label}")

            vdomain = val["site_url"]
            if vdomain not in violation_details:
                violation_details[vdomain] = list()
            dat = val.copy()
            dat["majority"] = int(expected_label)
            dat["maj_count"] = l_ident[key][expected_label]
            dat["maj_ratio"] = maj_ratio
            violation_details[vdomain].append(dat)

            violation_domains.add(vdomain)
            violation_count += 1

    conn.close()
    logger.info(f"Total cookies analyzed: {total_cookies}")
    logger.info(f"Number of potential violations: {violation_count}")
    logger.info(f"Number of sites in total: {len(total_domains)}")
    logger.info(f"Number of sites with potential violations: {len(violation_domains)}")

    v_per_cmp = [0, 0, 0]
    for url, violating_cookies in violation_details.items():
        for c in violating_cookies:
            assert(c["cmp_type"] >= 0)
            v_per_cmp[c["cmp_type"]] += 1

    confusion_matrix = [[0, 0, 0, 0, 0, 0], [0, 0, 0, 0, 0, 0], [0, 0, 0, 0, 0, 0], [0, 0, 0, 0, 0, 0],
                        [0, 0, 0, 0, 0, 0], [0, 0, 0, 0, 0, 0]]
    for url, violating_cookies in violation_details.items():
        for c in violating_cookies:
            confusion_matrix[int(c["majority"])][int(c["label"])] += 1

    logger.info(f"Majority Necessary: {confusion_matrix[0][0:4]}")
    logger.info(f"Majority Functional: {confusion_matrix[1][0:4]}")
    logger.info(f"Majority Analytics: {confusion_matrix[2][0:4]}")
    logger.info(f"Majority Advertising: {confusion_matrix[3][0:4]}")
#    logger.info(f"Majority Uncategorized: {confusion_matrix[4]}")
#    logger.info(f"Majority Social Media: {confusion_matrix[5]}")

    logger.info(f"Potential Violations per CMP Type: {v_per_cmp}")

    if cargs["--out_path"]:
        out_path = cargs["--out_path"]
    else:
        out_path = "./violation_stats/"
    write_json(violation_details, "method2_cookies.json", out_path)
    write_vdomains(violation_domains, "method2_domains.txt", out_path)

    return 0


if __name__ == '__main__':
    exit(main())
