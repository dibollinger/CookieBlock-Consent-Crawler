from __future__ import annotations

import re
from typing import Tuple, Optional, Dict, TYPE_CHECKING
import json

from selenium.webdriver.remote.webdriver import WebDriver

from crawler.enums import CookieCategory, CrawlState
from crawler.utils import uuid_pattern
from crawler.database import SiteVisit

if TYPE_CHECKING:
    from crawler.browser import CBConsentCrawlerBrowser

# url for the termly consent
termly_base = "https://app.termly.io/api/v1/snippets/websites/"
termly_url_pattern = re.compile(r"https://app\.termly\.io/")


def check_termly_presence(webdriver: WebDriver) -> bool:
    """ Check whether a Termly pattern is referenced on the website """
    psource = webdriver.page_source
    matchobj = termly_url_pattern.search(psource, re.IGNORECASE)
    return matchobj is not None


def internal_termly_scrape(url: str, browser_id: int, visit_id: int, webdriver: WebDriver) -> Tuple[CrawlState, str]:
    """
    Retrieve Termly cookie category data from URL.
    @param url: URL to crawl for category data
    @param browser_id: identifier of the browser that performs the crawl
    @param visit_id: identifier of the website being visited
    @param webdriver: selenium webdriver to browse with
    @return Tuple:
        1. crawl state (success or error)
        2. potential error message
    """
    cookies_dict, state, report = _retrieve_termly_json(webdriver, browser_id)
    if state != CrawlState.SUCCESS:
        # c_logmsg(report, browser_id, logging.ERROR)
        return state, report
    # c_logmsg("TERMLY: Found cookie json dict", browser_id, logging.INFO)


    state, report = _parse_termly_cookie_json(cookies_dict, browser_id, visit_id)
    if state != CrawlState.SUCCESS:
        # c_logmsg(report, browser_id, logging.ERROR)
        return state, report
    else:
        # c_logmsg(report, browser_id, logging.INFO)
        return state, report


def _retrieve_termly_json(webdriver: WebDriver, browser_id: int) -> Tuple[Optional[Dict], CrawlState, str]:
    """
    Use Selenium Webdriver to retrieve the termly "cookies" json file.
    @param webdriver: currently active webdriver
    @param browser_id: identifier of the active browser
    @return: Tuple:
        1. json dict or None if not found
        2. state of the crawl (success or error)
        3. error report
    """
    cookies_json = dict()

    # Try to find the Termy Script ID inside of a script tag
    uuid1: Optional[str] = execute_in_IFrames(_find_termly_script_tag, webdriver, browser_id,  timeout=3)

    if not uuid1:
        return (cookies_json, CrawlState.CMP_NOT_FOUND,
               "TERMLY: Could not find Termly UUID 1 to access cookie policies.")

    # c_logmsg(f"TERMLY: Retrieved uuid1: {uuid1}", browser_id, logging.INFO)

    policy_url = termly_base + uuid1
    resp, state, err = simple_get_request(policy_url, browser_id)
    if state != CrawlState.SUCCESS:
        return (cookies_json, state,
                f"TERMLY: Failed to retrieve Termly policy JSON from {policy_url}: " + err)

    try:
        policy_dict = json.loads(resp.text)
    except json.JSONDecodeError as ex:
        return cookies_json, CrawlState.JSON_DECODE_ERROR, f"TERMLY: Failed to decode Termly policy JSON. Details: {ex}"


    uuid2: Optional[str] = None
    if "documents" in policy_dict:
        for doc in policy_dict["documents"]:
            if "name" in doc and doc["name"] == "Cookie Policy":
                if uuid_pattern.match(doc["uuid"]):
                    uuid2 = doc["uuid"]
                    break
                else:
                    # c_logmsg("TERMLY: Found a UUID entry inside policy JSON that wasn't a UUID!", browser_id, logging.WARN)
                    pass

    if uuid2 is None:
        return (cookies_json, CrawlState.PARSE_ERROR,
                "TERMLY: Failed to retrieve second UUID string from policy JSON.")

    # c_logmsg(f"TERMLY: Retrieved uuid2: {uuid2}", browser_id, logging.INFO)

    cookies_path = termly_base + uuid1 + "/documents/" + uuid2 + "/cookies"
    resp2, state, err = simple_get_request(cookies_path, browser_id)
    if state != CrawlState.SUCCESS:
        return (cookies_json, state,
                f"TERMLY: Failed to retrieve Termly cookies JSON from {cookies_path}: " + err)

    try:
        cookies_json = json.loads(resp2.text)
    except json.JSONDecodeError as ex:
        return (cookies_json, CrawlState.JSON_DECODE_ERROR,
                f"TERMLY: Failed to decode Termly cookies JSON. Details: {ex}")

    return (cookies_json, CrawlState.SUCCESS,
            "TERMLY: Successfully retrieved Termly cookies JSON as a dictionary.")



def _parse_termly_cookie_json(cookie_dict: Dict, browser_id: int, visit_id: int) -> Tuple[CrawlState, str]:
    """
    Parse the cookies json dictionary and retrieve cookie data + labels.
    @param cookie_dict: dict from transformed JSON
    @param browser_id: identifier for the browser performing the action
    @param visit_id: identifier that uniquely identifies the website
    @return: crawl state, report
    """
    cookie_count = 0
    if "cookies" in cookie_dict:
        try:
            for catname, entry in cookie_dict["cookies"].items():
                # Handle case where unknown categories appear in JSON
                if catname not in name_to_cat:
                    # c_logmsg(f"TERMLY: UNKNOWN CATEGORY: {catname}", browser_id, logging.WARN)
                    cat_id = CookieCategory.UNRECOGNIZED
                else:
                    cat_id = name_to_cat[catname]

                # Then for each cookie in the category, extract its attributes
                for cookie in entry:
                    for k in cookie.keys():
                        if k not in known_cookie_attributes:
                            # c_logmsg(f"TERMLY: UNKNOWN COOKIE ATTRIBUTE: {k}", browser_id, logging.WARN)
                            pass
                    cookie_count += 1

                    # Handle nameless case
                    if "name" not in cookie:
                        # c_logmsg(f"TERMLY: Cookie #{cookie_count} has no name!", browser_id, logging.WARN)
                        name = None
                    else:
                        name = cookie["name"]

                    # Handle category mismatch
                    if "category" in cookie and cookie["category"] != catname:
                        pass
                        # c_logmsg(f"TERMLY: Category in cookie mismatches category array!! "
                                 # f"array: {catname}, cookie: {cookie['category']}", browser_id, logging.WARN)

                    domain = cookie["domain"] if "domain" in cookie else None
                    purpose = cookie["en_us"] if "en_us" in cookie else None
                    expiry = cookie["expire"] if "expire" in cookie else None
                    tracker_type = cookie["tracker_type"] if "tracker_type" in cookie else None

                    # country = cookie["country"] if "country" in cookie else None
                    # source = cookie["source"] if "source" in cookie else None
                    # url = cookie["url"] if "url" in cookie else None
                    # value = cookie["value"] if "value" in cookie else None
                    # service = cookie["service"] if "service" in cookie else None
                    # service_policy_link = cookie["service_policy_link"] if "service_policy_link" in cookie else None
                    
                    # TODO
                    # send_cookiedat_to_db(sock, name, domain, cat_id, catname, browser_id,
                                         # visit_id, purpose, expiry, tracker_type, None)
        except Exception as ex:
            report = f"TERMLY: Unexpected error while extracting Cookies from Termly Dict: : {type(ex)} {ex}"
            return CrawlState.PARSE_ERROR, report
    else:
        return CrawlState.MALFORM_RESP, "TERMLY: No 'cookies' attribute in cookies JSON!"

    if cookie_count == 0:
        return CrawlState.NO_COOKIES, "TERMLY: No cookies found in Termly JSON!!"
    else:
        return CrawlState.SUCCESS, f"Number of Cookies extracted: {cookie_count}"