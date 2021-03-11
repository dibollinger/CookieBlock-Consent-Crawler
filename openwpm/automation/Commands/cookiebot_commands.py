# Author: Dino Bollinger
# License: GPLv3
# This file is not part of the original OpenWPM 0.12.0 release.

"""
Cookiebot Scraper: This file defines the scraper functions used for
                   the Cookiebot Consent Management Platform.
"""

import logging
import re

from ast import literal_eval
from typing import Optional, Tuple

from selenium.webdriver.remote.webdriver import WebDriver
from selenium.webdriver.support.ui import WebDriverWait
from selenium.common.exceptions import TimeoutException, StaleElementReferenceException

from ..SocketInterface import clientsocket
from .utils.consent_commons import (CookieCategory, CrawlState, send_cookiedat_to_db,
                                    simple_get_request, c_logmsg,
                                    uuid_pattern, execute_in_IFrames)

name_to_cat = {"Necessary": CookieCategory.ESSENTIAL,
               "Preference": CookieCategory.FUNCTIONAL,
               "Statistics": CookieCategory.ANALYTICAL,
               "Advertising": CookieCategory.ADVERTISING,
               "Unclassified": CookieCategory.UNCLASSIFIED}


# patterns to parse the final cc.js file, which is where the actual category data is stored
category_patterns = {CookieCategory.ESSENTIAL: re.compile("CookieConsentDialog\\.cookieTableNecessary = (.*);"),
                     CookieCategory.FUNCTIONAL: re.compile("CookieConsentDialog\\.cookieTablePreference = (.*);"),
                     CookieCategory.ANALYTICAL: re.compile("CookieConsentDialog\\.cookieTableStatistics = (.*);"),
                     CookieCategory.ADVERTISING: re.compile("CookieConsentDialog\\.cookieTableAdvertising = (.*);"),
                     CookieCategory.UNCLASSIFIED: re.compile("CookieConsentDialog\\.cookieTableUnclassified = (.*);")}


# url for the cookiebot consent cdn
cb_base_url = "https://consent\\.cookiebot\\.com/"

# regex patterns for cookiebot urls
cb_base_pat = re.compile(cb_base_url)
cbid_variant2_pat = re.compile(cb_base_url + "([0-9a-fA-F]{8}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{12})/cc\\.js")
cbid_variant3_pat = re.compile("[&?]cbid=([0-9a-fA-F]{8}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{12})")


class _exists_script_tag_with_cbid():
    """
    Variant 1 Pattern: Utility class to check if there exists a script
    tag with the 'data-cbid' attribute. This attribute contains the
    desired cookiebot ID.
    :return WebElement: first matching script tag, or False otherwise
    """
    def __init__(self, browser_id):
        self.browser_id = browser_id

    def __call__(self, driver):
        elems = driver.find_elements_by_tag_name("script")
        for e in elems:
            try:
                cbid = e.get_attribute("data-cbid")
                if cbid and uuid_pattern.match(str(cbid)):
                    return e
            except StaleElementReferenceException:
                continue
        return False


def _find_cbid_script_tag(driver: WebDriver, browser_id: int, timeout: int = 5) -> Optional[str]:
    """
    Wait for the Cookie Bot ID to be found, and return it if this occurs.
    :param driver: Selenium webdriver currently used.
    :param timeout: Time to wait in seconds.
    :return Cookie bot ID, or None if none found.
    """
    try:
        wait = WebDriverWait(driver, timeout)
        element = wait.until(_exists_script_tag_with_cbid(browser_id))
        cbid = element.get_attribute("data-cbid")
        return cbid
    except TimeoutException:
        return None


def _try_retrieve_cbid_all_variants(browser_id:int, webdriver: WebDriver) -> Optional[str]:
    """
    Attempt to retrieve the 'cbid' value with both the cbid tag approach,
    as well as by simply searching the page source using a regular expression pattern.
    :param webdriver: Selenium webdriver
    :return CBID, or None if not found.
    """

    # Try to find the Cookie Bot ID inside of a script tag, using the cbid attribute.
    maybe_cbid = execute_in_IFrames(_find_cbid_script_tag, webdriver, browser_id, timeout=3)
    if maybe_cbid:
        c_logmsg(f"COOKIEBOT: Found Cookiebot ID using Variant 1", browser_id, logging.INFO)
        return maybe_cbid
    else:
        # Variant 2 & 3: CBID may actually be integrated into the URL itself, rather
        # than being an attribute. Simply use a regex on the page source for this.
        page_source = webdriver.page_source
        variant_2 = cbid_variant2_pat.search(page_source)
        variant_3 = cbid_variant3_pat.search(page_source)
        if variant_2 or variant_3:
            c_logmsg("COOKIEBOT: Found Cookiebot ID using Variant 2 or 3", browser_id, logging.INFO)
            return variant_2.group(1) if variant_2 else variant_3.group(1)
        else:
            c_logmsg("COOKIEBOT: Could not find the Cookiebot ID", browser_id, logging.ERROR)
            return None


def _try_find_correct_referer(webdriver: WebDriver, browser_id: int, cbid: str, fallback: str) -> str:
    """
    The referer required to access the Cookiebot data may differ from the site the request
    is made from. In this case, the referer is listed as an argument inside the cc.js URL
    itself. This extracts said URL.
    :param webdriver: current webdriver
    :param cbid: cookiebot ID previously discovered
    :param fallback: referer string to use if the referer URL cannot be found. Typically set to be the current URL.
    :return: Referer string, or defined fallback if referer cannot be found.
    """
    source = webdriver.page_source
    ref_pattern = re.compile(f"https://consent\\.cookiebot\\.com/{cbid}/cc\\.js.*(\\?|&amp;)referer=(.*?)&.*")
    m = ref_pattern.search(source)
    if m:
        new_referer = m.group(2)
        c_logmsg(f"COOKIEBOT: Found referer: {new_referer}", browser_id, logging.INFO)
        return new_referer
    else:
        c_logmsg(f"COOKIEBOT: No referer specified, using default.", browser_id, logging.INFO)
        return fallback


def check_cookiebot_presence(webdriver: WebDriver) -> bool:
    """ Check whether Cookiebot is referenced on the website """
    psource = webdriver.page_source
    matchobj = cb_base_pat.search(psource, re.IGNORECASE)
    return matchobj is not None


def internal_cookiebot_scrape(url: str, browser_id: int, visit_id: int, sock: clientsocket,
                              webdriver: WebDriver) -> Tuple[CrawlState, str]:
    """
    Cookiebot stores its cookie category data in a javascript file called cc.js
    The crawling process attempts to obtain this file and read the data from it.
    @param url: URL to crawl for the category data
    @param browser_id: identifies the browser that is performing the crawl
    @param visit_id: uniquely identifies the url being crawled
    @param sock: Socket connection to the database aggregator.
    @param webdriver: driver instance used to perform the crawl
    @return: A tuple consisting of 2 values:
        1. Resulting crawl state.
        2. Error report, or number of extracted cookies if successful.
    """

    # try to retrieve cookiebot ID required to access cc.js
    cbid: Optional[str] = _try_retrieve_cbid_all_variants(browser_id, webdriver)
    if cbid is None:
        report = f"COOKIEBOT: Failed to find cbid on {url}"
        c_logmsg(report, browser_id, logging.ERROR)
        return CrawlState.PARSE_ERROR, report

    c_logmsg(f"COOKIEBOT: Cookiebot UUID = {cbid}", browser_id, logging.INFO)

    # retrieve cc.js file from cookiebot cdn domain using the requests library
    referer = _try_find_correct_referer(webdriver, browser_id, cbid, url)
    cc_url = f"https://consent.cookiebot.com/{cbid}/cc.js?referer={referer}"
    r, crawlstate, report = simple_get_request(cc_url, browser_id=browser_id, timeout=(6, 30), headers={"Referer": url})
    if r is None:
        msg = f"COOKIEBOT: Failed to retrieve cc.js for {cc_url} -- Details: {report}"
        c_logmsg(msg, browser_id, logging.ERROR)
        return crawlstate, msg

    # some required structural checks on the javascript file contents
    js_contents = r.text
    if "CookieConsent.setOutOfRegion" in js_contents:
        msg = f"COOKIEBOT: Received an out-of-region response from \"{cc_url}\""
        c_logmsg(msg, browser_id, logging.ERROR)
        return CrawlState.REGION_BLOCK, msg
    elif re.search("cookiedomainwarning='Error: .* is not a valid domain.", js_contents):
        msg = f"COOKIEBOT: Unrecognized referer: {referer}."
        c_logmsg(msg, browser_id, logging.ERROR)
        return CrawlState.LIBRARY_ERROR, msg
    elif len(js_contents.strip()) == 0:
        msg = f"COOKIEBOT: Empty response when trying to retrieve \"{cc_url}\"."
        c_logmsg(msg, browser_id, logging.ERROR)
        return CrawlState.MALFORM_RESP, msg

    c_logmsg(f"COOKIEBOT: Successfully accessed \"https://consent.cookiebot.com/{cbid}/cc.js\"", browser_id,logging.INFO)

    # finally, if we arrived here we (most likely) found our cookie category data
    cookie_count = 0
    try:
        for cat_name in name_to_cat.keys():
            cat_id = name_to_cat[cat_name]
            matchobj = category_patterns[cat_id].search(js_contents)
            if not matchobj:
                c_logmsg(f"COOKIEBOT: Could not find array for category {cat_name}", browser_id, logging.WARN)
                continue

            # transform the string arrays to python arrays
            cookies = literal_eval(matchobj.group(1))

            for c in cookies:
                cookie_count += 1
                send_cookiedat_to_db(sock, c[0], c[1], cat_id, cat_name, browser_id, visit_id, c[2], c[3], c[4], c[5], None)

    # format of the cookiebot data should be uniform, but in case this happens
    # to be violated, this try-except block catches it
    except Exception as ex:
        msg = f"COOKIEBOT: Failed to extract cookie data from {cc_url}: {type(ex)} {ex}"
        c_logmsg(msg, browser_id, logging.ERROR)
        return CrawlState.MALFORM_RESP, msg

    if cookie_count == 0:
        msg = f"COOKIEBOT: No cookies found in {cc_url}"
        c_logmsg(msg, browser_id, logging.ERROR)
        return CrawlState.NO_COOKIES, msg

    c_logmsg(f"COOKIEBOT: Extracted {cookie_count} cookie entries.", browser_id, logging.INFO)
    return CrawlState.SUCCESS, f"Extracted {cookie_count} cookie entries."
