# Copyright (C) 2021 Dino Bollinger, ETH Zürich, Information Security Group
# Released under the MIT License
"""
This script takes as input a json file as produced by the script `database_scripts/extract_cookies_from_db.py`,
which is a list of cookies with matching consent label declaration.

This script can extract a number of additional statistics on this data, such as the majority opinion to
the categorisation provided by Cookiepedia, and the ratio of disagreement on the label of a cookie name.

Cookiepedia hereby provides a large database of cookies, where each cookie is assigned one out of 5 categories, those being:
   1. Strictly Necessary
   2. Functional
   3. Performance (Analytics)
   4. Targeting/Advertising
   5. Unknown
Where the latter category is usually given when Cookiepedia does not have enough data to form a categorization.


<mode> options:
   0 : In the top N cookie identifiers by occurrences, get the overall average deviation from the majority.
   1 : Get a deviation analysis and Cookiepedia opinion for cookies with lower and upper bound on occurrences
   2 : Extracts the top N most common domains by unique cookie identifier, sorted descending.
   3 : Aggregate domains by count, filter those below a lower bound, then sort by certainty of class label.
   4 : Extract a alphabetically sorted list of cookie names for further analysis.
   5 : Aggregate names by count, filter those below a lower bound, then sort by disagreement descending.
   6 : Get the top N most common cookies, query Cookiepedia for label, compute deviation from majority opinion, and output the results into a file.
   7 : Same as 6, but with N random cookies instead.

----------------------------------
Usage:
    category_stats <mode> <tr_data>... (--byname |--bydomain | --bypath)

    -n, --byname               Match cookies by name (aggregate first-party and third-party cookies) (this is how Cookiepedia is queried)
    -d, --bydomain             Match cookies by name + domain.
    -p, --bypath               Match cookies by name + domain + path. (aggregate only third-party cookies)
    -h --help                  Show this help message.
"""
from docopt import docopt
import requests
import requests.exceptions as rexcepts

import pickle
import os
import json
import random
import re
import traceback
import logging

from enum import IntEnum
from typing import Tuple, List, Dict, Optional, Any

logger = logging.getLogger("stats")

subfolder = "./stats_out/"

# for mode 1
upper_n = 100
lower_n = 10

# Number of entries to extract, for modes 0, 2, 6, 7
top_n: int = -1 #1000
random_n: int = 1000

# Minimum number of required domains for inclusion, for modes 3 and 5
domain_lower_bound = 100
name_lower_bound = 100

# Lookup dictionary for cookiepedia names
cookiepedia_lookup = dict()

class CookieCategories(IntEnum):
    Unrecognized = -1
    Necessary = 0
    Functional = 1
    Analytical = 2
    Advertising = 3
    Unknown = 4


def simple_get(url) -> Optional[requests.Response]:
    """
    Perform a simple GET request to the target address, and handle errors.
    @param url: URL to send the GET request to
    @return: Response object, or None if an error occurred
    """
    try:
        # fake chrome user agent, required or else Cookiepedia will not respond
        headers = {'User-Agent': "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/70.0.3538.77 Safari/537.36"}
        r = requests.get(url, timeout=(15, 15), headers=headers)
        return r
    except (rexcepts.TooManyRedirects, rexcepts.SSLError,
            rexcepts.URLRequired, rexcepts.MissingSchema) as ex:
        logger.debug(f"'{type(ex)}' exception occurred while trying to access: '{url}'")
        return None
    except (rexcepts.ConnectionError, rexcepts.Timeout) as ex:
        logger.debug(f"'{type(ex)}' exception occurred while trying to access: '{url}'")
        return None
    except Exception as ex:
        logger.error(f"Unexpected '{type(ex)}' exception occurred while trying to access: '{url}'")
        logger.error(traceback.format_exc())
        return None


def setup_logger(logpath: str = "./category_stats.log") -> None:
    """ Set up the logger instance. INFO to stderr and logfile """
    with open(logpath, 'w'):
        pass

    logger.setLevel(logging.DEBUG)
    ch = logging.StreamHandler()
    ch.setLevel(logging.INFO)
    logger.addHandler(ch)

    fh = logging.FileHandler(logpath)
    fh.setLevel(logging.INFO)
    logger.addHandler(fh)


def get_cookiepedia_opinion(cookie_name: str) -> Tuple[CookieCategories, str]:
    """
    Send a request to Cookiepedia to get their category for the given cookie name, if present.
    Unknown category, connection errors and cookie not found are all translated to category id -1.
    @param cookie_name: Cookie name to retrieve category for.
    @return: Tuple of Category ID and Category Name
    """
    if cookie_name in cookiepedia_lookup:
        return cookiepedia_lookup[cookie_name]

    result = simple_get(f"https://cookiepedia.co.uk/cookies/{cookie_name}")

    cookiepedia_category: str = "Not Found"
    if result is not None:
        m_obj = re.search("The main purpose of this cookie is:\\s*<strong>(.*)</strong>", result.text)
        if m_obj is not None:
            cookiepedia_category = m_obj.group(1)
    else:
        cookiepedia_category = "Connection Failed"

    # Translate string category name to an integer for comparison purposes
    cp_id: CookieCategories
    if cookiepedia_category == "Strictly Necessary":
        cp_id = CookieCategories.Necessary
    elif cookiepedia_category == "Functionality":
        cp_id = CookieCategories.Functional
    elif cookiepedia_category == "Performance":
        cp_id = CookieCategories.Analytical
    elif cookiepedia_category == "Targeting/Advertising":
        cp_id = CookieCategories.Advertising
    elif re.match("(Unknown|Not Found|Connection Failed)", cookiepedia_category):
        cp_id = CookieCategories.Unknown
    else:
        logger.warning(f"Unrecognized category name: {cookiepedia_category}")
        cp_id = CookieCategories.Unrecognized

    cookiepedia_lookup[cookie_name] = (cp_id, cookiepedia_category)

    return cp_id, cookiepedia_category


def construct_output_line(k: Tuple[Any], cat_counts: List[int]) -> str:
    """ Just a utility function to prevent code duplication"""
    cookie_name = k[0]
    cp_id, cp_catname = get_cookiepedia_opinion(cookie_name)

    max_cat = max(cat_counts)
    total_size = sum(cat_counts)
    majority_cat = cat_counts.index(max_cat)

    rstring = f"{k}|{total_size}|{cat_counts}"
    rstring += f"|{(total_size - max_cat) / total_size:.3f}"
    rstring += f"|{cp_catname}"
    if cp_id == -1 or cp_id == 4:
        rstring += "|invalid\n"
    elif cp_id != majority_cat:
        rstring += "|disagree\n"
    else:
        rstring += "|agree\n"

    return rstring


def get_category_counts(cargs:Dict, training_data: Dict[str, Dict[str, Any]]):

    # for each cookie and domain, set up an array of category counts, and update the array
    name_dict: Dict[Tuple, List] = dict()
    domain_dict: Dict[Tuple, List] = dict()

    # count cookies by which CMP they were extracted from
    # nocmp, cookiebot, onetrust, termly
    counts_by_cmp = [0, 0, 0, 0]
    logger.info("Reading cookie data from the provided dictionary...")
    for k, cookie in training_data.items():

        c_name = cookie["name"]
        c_domain = cookie["domain"]
        c_path = cookie["path"]
        c_cat = cookie["label"]
        cmp_type = cookie["cmp_origin"]

        # increment the CMP counts
        counts_by_cmp[int(cmp_type) + 1] += 1

        # using which keys should the cookies be identified?
        if cargs["--byname"]:
            key = (c_name,)
        elif cargs["--bydomain"]:
            key = (c_name, c_domain)
        elif cargs["--bypath"]:
            key = (c_name, c_domain, c_path)
        else:
            raise RuntimeError("This should never happen.")

        # set up counter dictionary for names if necessary
        if key in name_dict:
            cat_list = name_dict[key]
        else:
            # ne, fu, an, ad, uncat, social, unknown
            cat_list = [0, 0, 0, 0, 0, 0, 0]
            name_dict[key] = cat_list

        # set up counters for domains
        if c_domain in domain_dict:
            domain_list = domain_dict[c_domain]
        else:
            domain_list = [0, 0, 0, 0, 0, 0, 0]
            domain_dict[c_domain] = domain_list

        # increment the counters
        cat_id = int(c_cat)
        if 0 <= cat_id < 4:
            cat_list[cat_id] += 1
            domain_list[cat_id] += 1
        # Special handling for unrecognized cookies
        elif cat_id == -1:
            cat_list[6] += 1
            domain_list[6] += 1
        # old social media category number
        elif cat_id == 99:
            cat_list[5] += 1
            domain_list[5] += 1

    logger.info(f"Unique Training Data Entries by CMP: {counts_by_cmp}")
    return name_dict, domain_dict


def main() -> int:
    """
    Produce the analysis.
    @return: Return code, 0 for no errors.
    """
    argv = None
    cargs = docopt(__doc__, argv=argv)
    setup_logger()

    os.makedirs(subfolder, exist_ok=True)
    training_data: Dict[str, Dict[str, Any]] = dict()

    tr_data_path = cargs["<tr_data>"]
    for t in tr_data_path:
        if os.path.exists(t):
            with open(t, 'r') as fd:
                t_data = json.load(fd)
        else:
            logger.error("Invalid training data path specified")
            return 1
        logger.info(f"Opened training data dict from '{t}'")

        training_data = {**training_data, **t_data}

    # for each cookie and domain, set up an array of category counts, and update the array
    name_dict: Dict[Tuple, List]
    domain_dict: Dict[Tuple, List]
    name_dict, domain_dict = get_category_counts(cargs, training_data)


    if cargs["<mode>"] == "0":
        logger.info("Getting the average deviation from the majorities overall")
        max_total: int = 0
        total: int = 0
        most_common = sorted(name_dict.items(), key=(lambda x: sum(x[1])), reverse=True)
        for k, cat_counts in most_common[:top_n]:
            max_total += max(cat_counts)
            total += sum(cat_counts)
        logger.info(f"Majorities Total: {max_total} -- Total: {total} -- Deviation Overall: {(total - max_total) / total}")

    elif cargs["<mode>"] == "1":
        logger.info("Getting deviation from majority and cookipedia opinion of all cookies with upper and lower bound on occurrences")
        upper_lower_bounded = [k for k in name_dict.items() if lower_n <= sum(k[1]) <= upper_n]
        with open(subfolder + f"analysis_u100l10_cookies.csv", 'w') as fd:
            for k, cat_counts in upper_lower_bounded:
                line = construct_output_line(k, cat_counts)
                fd.write(line)

    elif cargs["<mode>"] == "2":
        logger.info(" Extracting most common domains")
        most_common_domains = sorted(domain_dict.items(), key=(lambda x:  sum(x[1])), reverse=True)
        with open(subfolder + f"analysis_top{top_n}_domains.txt", 'w') as fd:
            for k, cat_counts in most_common_domains[:top_n]:
                fd.write(f"{k}|{sum(cat_counts)}|{cat_counts}"
                         f"|{cat_counts.index(max(cat_counts))}"
                         f"|{max(cat_counts) / sum(cat_counts)}\n")

    elif cargs["<mode>"] == "3":
        logger.info("Extracting domains with a lower bound of occurrences, then sort by certainty of class")
        most_significant_domains = [k for k in domain_dict.items() if sum(k[1]) > domain_lower_bound]
        with open(subfolder + "domains_by_certainty.csv", 'w') as fd:
            for k, cat_counts in sorted(most_significant_domains, key=(lambda x: max(x[1])/sum(x[1])), reverse=True):
                fd.write(f"{k}|{sum(cat_counts)}|{cat_counts}"
                         f"|{cat_counts.index(max(cat_counts))}"
                         f"|{max(cat_counts) / sum(cat_counts)}\n")

    elif cargs["<mode>"] == "4":
        logger.info("Extracting sorted names to check for pattern type cookies manually")
        all_names = [d[0][0] for d in sorted(name_dict.items(), key=(lambda x: x[0][0]))]
        with open(subfolder + "cookie_names_sorted.txt", 'w') as fw:
            for n in all_names:
                fw.write(n + "\n")

    elif cargs["<mode>"] == "5":
        logger.info("Extracting names with a lower bound on occurrences, then sort by disagreement ascending")
        most_significant_names = [k for k in name_dict.items() if sum(k[1]) > name_lower_bound]
        by_disagreement = sorted(most_significant_names, key=(lambda y: (sum(y[1]) - max(y[1])) / sum(y[1])))
        with open(subfolder + "names_by_disagreement.csv", 'w') as fd:
            for k, cat_counts in sorted(by_disagreement, key=(lambda x: max(x[1])/sum(x[1]))):
                line = construct_output_line(k, cat_counts)
                fd.write(line)

    elif cargs["<mode>"] == "6":
        logger.info("Sorting the cookies by the most common occurrence...")
        most_common = sorted(name_dict.items(), key=(lambda x:  sum(x[1])), reverse=True)
        outpath = subfolder + f"analysis_top{top_n}_cookies.csv"
        with open(outpath, 'w') as fd:
            for k, cat_counts in most_common[:top_n]:
                line = construct_output_line(k, cat_counts)
                fd.write(line)
        with open("cookiepedia_lookup.pkl", 'wb') as fd:
            pickle.dump(cookiepedia_lookup, fd)

    elif cargs["<mode>"] == "7":
        logger.info("Get an analysis of random cookies...")
        random_cookies = random.sample(list(name_dict.items()), random_n)
        with open(subfolder + f"analysis_random{random_n}_cookies.csv", 'w') as fd:
            for k, cat_counts in random_cookies:
                line = construct_output_line(k, cat_counts)
                fd.write(line)
    else:
        logger.info("Invalid mode chosen: " + cargs["<mode>"])
        return 1

    logger.info(f"Analysis written to '{subfolder}'")

    return 0


if __name__ == "__main__":
    exit(main())
