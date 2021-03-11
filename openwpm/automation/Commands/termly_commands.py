# Author: Dino Bollinger
# License: GPLv3
# This file is not part of the original OpenWPM 0.12.0 release.

"""
Termly Scraper: This file defines the scraper used for the Termly Consent Management Platform
"""

import logging
import re
import json

from typing import Optional, Tuple, Dict

from selenium.webdriver.remote.webdriver import WebDriver
from selenium.webdriver.support.ui import WebDriverWait
from selenium.common.exceptions import TimeoutException, StaleElementReferenceException

from ..SocketInterface import clientsocket
from .utils.consent_commons import (CookieCategory, CrawlState, send_cookiedat_to_db,
                                    simple_get_request, c_logmsg, uuid_pattern, execute_in_IFrames)


# Unfortunately: Performance and Analytics are synonymous to many hosts.
# Some websites treat "performance" like "functional", others treat it
# synonymously to "analytical", even though it has its own category.

name_to_cat = {"essential": CookieCategory.ESSENTIAL,
               "performance": CookieCategory.FUNCTIONAL,
               "analytics": CookieCategory.ANALYTICAL,
               "advertising": CookieCategory.ADVERTISING,
               "social_networking": CookieCategory.SOCIAL_MEDIA,
               "unclassified": CookieCategory.UNCLASSIFIED}


# These are the known attributes of cookies in Termly
known_cookie_attributes = {"name", "category", "tracker_type", "country", "domain", "source",
                           "url", "value", "en_us", "service", "service_policy_link", "expire"}


# url for the termly consent
termly_base = "https://app.termly.io/api/v1/snippets/websites/"
termly_url_pattern = re.compile("https://app\\.termly\\.io/")

termly_source_href_pattern = re.compile("https://app\\.termly\\.io/embed\\.min\\.js")


class exists_script_tag_with_termly_embed():
    """
    Internal utility class to check if there exists a script tag for the termly embed banner.
    @return: The uuid string for retrieving the termly cookie policy.
    """
    def __init__(self, browser_id):
        self.browser_id = browser_id

    def __call__(self, driver):
        elems = driver.find_elements_by_tag_name("script")
        for e in elems:
            try:
                termly_found = False
                embed_src = e.get_attribute("src")
                if embed_src and termly_source_href_pattern.match(embed_src):
                    termly_found = True
                else:
                    data_name = e.get_attribute("data-name")
                    if data_name == "termly-embed-banner":
                        termly_found = True

                if termly_found:
                    uuid = e.get_attribute("id")
                    if uuid and uuid_pattern.match(uuid):
                        return uuid
                    else:
                        c_logmsg("TERMLY: Found termly embed banner script tag without a properly formatted id attribute.", self.browser_id, logging.WARN)
            except StaleElementReferenceException:
                continue

        return None


def _find_termly_script_tag(driver: WebDriver, browser_id: int, timeout: int = 5) -> Optional[str]:
    """
    Wait for the Termly embed script tag to be found, and return its UUID.
    Will return None if it cannot be found within the timeout.
    @param driver: Selenium webdriver currently used.
    @param timeout: Time to wait in seconds.
    @return: Termly script UUID, or None if not found
    """
    try:
        wait = WebDriverWait(driver, timeout)
        uuid = wait.until(exists_script_tag_with_termly_embed(browser_id))
        return uuid
    except TimeoutException:
        return None


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

    c_logmsg(f"TERMLY: Retrieved uuid1: {uuid1}", browser_id, logging.INFO)

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
                    c_logmsg("TERMLY: Found a UUID entry inside policy JSON that wasn't a UUID!", browser_id, logging.WARN)

    if uuid2 is None:
        return (cookies_json, CrawlState.PARSE_ERROR,
                "TERMLY: Failed to retrieve second UUID string from policy JSON.")

    c_logmsg(f"TERMLY: Retrieved uuid2: {uuid2}", browser_id, logging.INFO)

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



def _parse_termly_cookie_json(cookie_dict: Dict, browser_id: int, visit_id: int,
                              sock: clientsocket) -> Tuple[CrawlState, str]:
    """
    Parse the cookies json dictionary and retrieve cookie data + labels.
    @param cookie_dict: dict from transformed JSON
    @param browser_id: identifier for the browser performing the action
    @param visit_id: identifier that uniquely identifies the website
    @param sock: client socket that connects to the Database aggregator
    @return: crawl state, report
    """
    cookie_count = 0
    if "cookies" in cookie_dict:
        try:
            for catname, entry in cookie_dict["cookies"].items():
                # Handle case where unknown categories appear in JSON
                if catname not in name_to_cat:
                    c_logmsg(f"TERMLY: UNKNOWN CATEGORY: {catname}", browser_id, logging.WARN)
                    cat_id = CookieCategory.UNRECOGNIZED
                else:
                    cat_id = name_to_cat[catname]

                # Then for each cookie in the category, extract its attributes
                for cookie in entry:
                    for k in cookie.keys():
                        if k not in known_cookie_attributes:
                            c_logmsg(f"TERMLY: UNKNOWN COOKIE ATTRIBUTE: {k}", browser_id, logging.WARN)
                    cookie_count += 1

                    # Handle nameless case
                    if "name" not in cookie:
                        c_logmsg(f"TERMLY: Cookie #{cookie_count} has no name!", browser_id, logging.WARN)
                        name = None
                    else:
                        name = cookie["name"]

                    # Handle category mismatch
                    if "category" in cookie and cookie["category"] != catname:
                        c_logmsg(f"TERMLY: Category in cookie mismatches category array!! "
                                 f"array: {catname}, cookie: {cookie['category']}", browser_id, logging.WARN)

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
                    send_cookiedat_to_db(sock, name, domain, cat_id, catname, browser_id,
                                         visit_id, purpose, expiry, tracker_type, None, None)
        except Exception as ex:
            report = f"TERMLY: Unexpected error while extracting Cookies from Termly Dict: : {type(ex)} {ex}"
            return CrawlState.PARSE_ERROR, report
    else:
        return CrawlState.MALFORM_RESP, "TERMLY: No 'cookies' attribute in cookies JSON!"

    if cookie_count == 0:
        return CrawlState.NO_COOKIES, "TERMLY: No cookies found in Termly JSON!!"
    else:
        return CrawlState.SUCCESS, f"Number of Cookies extracted: {cookie_count}"


def check_termly_presence(webdriver: WebDriver) -> bool:
    """ Check whether a Termly pattern is referenced on the website """
    psource = webdriver.page_source
    matchobj = termly_url_pattern.search(psource, re.IGNORECASE)
    return matchobj is not None


def internal_termly_scrape(url: str, browser_id: int, visit_id: int, sock: clientsocket,
                           webdriver: WebDriver) -> Tuple[CrawlState, str]:
    """
    Retrieve Termly cookie category data from URL.
    @param url: URL to crawl for category data
    @param browser_id: identifier of the browser that performs the crawl
    @param visit_id: identifier of the website being visited
    @param sock: socket connection to the Database aggregator
    @param webdriver: selenium webdriver to browse with
    @return Tuple:
        1. crawl state (success or error)
        2. potential error message
    """
    cookies_dict, state, report = _retrieve_termly_json(webdriver, browser_id)
    if state != CrawlState.SUCCESS:
        c_logmsg(report, browser_id, logging.ERROR)
        return state, report
    c_logmsg("TERMLY: Found cookie json dict", browser_id, logging.INFO)


    state, report = _parse_termly_cookie_json(cookies_dict, browser_id, visit_id, sock)
    if state != CrawlState.SUCCESS:
        c_logmsg(report, browser_id, logging.ERROR)
        return state, report
    else:
        c_logmsg(report, browser_id, logging.INFO)
        return state, report
