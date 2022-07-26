# Copyright (C) 2021-2022 Dino Bollinger, ETH Zürich, Information Security Group
# Released under the MIT License

""" Infinite loop to get cookiepedia categories """


import requests
import pickle
import re
import requests.exceptions as rexcepts
import sys
import logging
from enum import IntEnum
from typing import Tuple, Dict, Optional
import traceback

logger = logging.getLogger("main")
logger.setLevel("INFO")
logger.addHandler(logging.StreamHandler(sys.stdout))

global failed_count
failed_count = 0

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
        r = requests.get(url, timeout=(180, 180), headers=headers)
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

def get_cookiepedia_opinion(cookiepedia_lookup:dict, cookie_name: str) -> Tuple[CookieCategories, str]:
    """
    Send a request to Cookiepedia to get their category for the given cookie name, if present.
    Unknown category, connection errors and cookie not found are all translated to category id -1.
    @param cookie_name: Cookie name to retrieve category for.
    @return: Tuple of Category ID and Category Name
    """
    global failed_count
    if cookie_name in cookiepedia_lookup and cookiepedia_lookup[cookie_name][1] != "Connection Failed":
        #logger.info(f"Found {cookie_name} in lookup")
        return cookiepedia_lookup[cookie_name]

    logger.info(f"Retrieving category for {cookie_name}")

    result = simple_get(f"https://cookiepedia.co.uk/cookies/{cookie_name}")

    cookiepedia_category: str = "Not Found"
    if result is not None:
        m_obj = re.search("The main purpose of this cookie is:\\s*<strong>(.*)</strong>", result.text)
        if m_obj is not None:
            cookiepedia_category = m_obj.group(1)
    else:
        cookiepedia_category = "Connection Failed"
        logger.error(f"Failed to connect: '{cookie_name}'")
        failed_count += 1

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

    logger.info(f"Category for {cookie_name} is: {cookiepedia_category}")
    return cp_id, cookiepedia_category


def main() -> int:
    global failed_count
    cookiepedia_lookup = None
    failed_count = 1
    with open("cookiepedia_lookup_29May.pkl", 'rb') as fd:
        cookiepedia_lookup = pickle.load(fd)

    failed_count = 0
    for cname in cookiepedia_lookup.keys():
        get_cookiepedia_opinion(cookiepedia_lookup, cname)
    logger.info(f"Connection Failed Count: {failed_count}")


    with open("cookiepedia_lookup_new.pkl", 'wb') as fw:
        pickle.dump(cookiepedia_lookup, fw, pickle.HIGHEST_PROTOCOL)

    return 0

if __name__ == "__main__":
    exit(main())
