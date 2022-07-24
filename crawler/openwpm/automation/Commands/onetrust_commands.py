"""
OneTrust Scraper: This file defines the scraper command used for the many variants of the OneTrust CMP.
Copyright (c) 2021  Dino Bollinger, ETH Zürich, Information Security Group
Note: This file is not part of the original OpenWPM 0.12.0 release.

This program is free software: you can redistribute it and/or modify
it under the terms of the GNU General Public License as published by
the Free Software Foundation, either version 3 of the License, or
(at your option) any later version.

This program is distributed in the hope that it will be useful,
but WITHOUT ANY WARRANTY; without even the implied warranty of
MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
GNU General Public License for more details.

You should have received a copy of the GNU General Public License
along with this program.  If not, see <https://www.gnu.org/licenses/>.
"""

import logging
import re
import json
import js2py

from typing import Optional, List, Tuple, Dict, Any

from selenium.webdriver.remote.webdriver import WebDriver
from selenium.webdriver.support.ui import WebDriverWait
from selenium.common.exceptions import TimeoutException, StaleElementReferenceException

from ..SocketInterface import clientsocket
from .utils.consent_commons import (CookieCategory, CrawlState, send_cookiedat_to_db,
                                    simple_get_request, c_logmsg,
                                    uuid_pattern, execute_in_IFrames)

# Base URL patterns required for Variant A
onetrust_pattern_A = re.compile("(https://cdn-apac\\.onetrust\\.com)")
onetrust_pattern_B = re.compile("(https://cdn-ukwest\\.onetrust\\.com)")
cookielaw_base_pattern = re.compile("(https://cdn\\.cookielaw\\.org)")
cmp_cookielaw_base_pattern = re.compile("(https://cmp-cdn\\.cookielaw\\.org)")
optanon_base_pattern = re.compile("(https://optanon\\.blob\\.core\\.windows\\.net)")
cookiecdn_base_pattern = re.compile("(https://cookie-cdn\\.cookiepro\\.com)")
cookiepro_base_pattern = re.compile("(https://cookiepro\\.blob\\.core\\.windows\\.net)")

base_patterns = [onetrust_pattern_A, onetrust_pattern_B,
                 cookielaw_base_pattern, cmp_cookielaw_base_pattern, optanon_base_pattern,
                 cookiecdn_base_pattern, cookiepro_base_pattern]

# Javascript direct links, required for Variant B
v2_onetrust_pattern_A = re.compile("https://cdn-apac\\.onetrust\\.com/consent/"
                                  + uuid_pattern.pattern + "[a-zA-Z0-9_-]*\\.js")
v2_onetrust_pattern_B = re.compile("https://cdn-ukwest\\.onetrust\\.com/consent/"
                                  + uuid_pattern.pattern + "[a-zA-Z0-9_-]*\\.js")
v2_cookielaw_pattern = re.compile("https://cdn\\.cookielaw\\.org/consent/"
                                  + uuid_pattern.pattern + "[a-zA-Z0-9_-]*\\.js")
v2_cmp_cookielaw_pattern = re.compile("https://cmp-cdn\\.cookielaw\\.org/consent/"
                                      + uuid_pattern.pattern + "[a-zA-Z0-9_-]*\\.js")
v2_optanon_pattern = re.compile("https://optanon\\.blob\\.core\\.windows\\.net/consent/"
                                + uuid_pattern.pattern + "[a-zA-Z0-9_-]*\\.js")
v2_cookiepro_cdn_pattern = re.compile("https://cookie-cdn\\.cookiepro\\.com/consent/"
                                      + uuid_pattern.pattern + "[a-zA-Z0-9_-]*\\.js")
v2_cookiepro_blob_pattern = re.compile("https://cookiepro\\.blob\\.core\\.windows\\.net/consent/"
                                       + uuid_pattern.pattern + "[a-zA-Z0-9_-]*\\.js")

variantB_patterns = [v2_onetrust_pattern_A, v2_onetrust_pattern_B,
                     v2_cookielaw_pattern, v2_cmp_cookielaw_pattern, v2_optanon_pattern,
                     v2_cookiepro_cdn_pattern, v2_cookiepro_cdn_pattern]

# OneTrust does not have uniform category names.
# To that end, we use regex keyword patterns to map a category name to the internally defined categories.
en_necessary_pattern = re.compile("(mandatory|necessary|essential|required)", re.IGNORECASE)
en_analytical_pattern = re.compile("(measurement|analytic|anonym|research|performance|statistic)", re.IGNORECASE)
en_functional_pattern = re.compile("(functional|preference|security|secure|video)", re.IGNORECASE)
en_targeting_pattern = re.compile("(^ads.*|.*\s+ads.*|Ad Selection|advertising|advertise|targeting"
                               "|personali[sz]ed|personali[sz]ation|sale of personal data|marketing"
                                  "|tracking|tracker|fingerprint|geolocation|personal info)", re.IGNORECASE)
en_uncat_pattern = re.compile("(uncategori[zs]e|unclassified|unknown)", re.IGNORECASE)


# german patterns
de_necessary_pattern = re.compile("(notwendig|nötig|erforderlich)", re.IGNORECASE)
de_analytical_pattern = re.compile("(analyse|analytisch|leistung|statistik|performance)", re.IGNORECASE)
de_functional_pattern = re.compile("(funktional|funktionel|sicherheit|video)", re.IGNORECASE)
de_targeting_pattern = re.compile("(werbung|werbe|marketing|anzeigen|reklame|personalisiert|tracking)", re.IGNORECASE)
de_uncat_pattern = re.compile("(unkategorisiert|unklassifiziert|unbekannt)", re.IGNORECASE)

# social media pattern
social_media_pattern = re.compile("(social.media|social.network|soziales.netzwerk|soziale.medien"
                                  "|facebook|youtube|twitter|instagram|linkedin|whatsapp|pinterest"
                                  "|\s+xing|\s+reddit|tumblr)", re.IGNORECASE)

def category_lookup_en(browser_id: int, cat_name: str) -> CookieCategory:
    """
    Map english category name defined in the CMP to the internal representation.
    """
    if en_targeting_pattern.search(cat_name): return CookieCategory.ADVERTISING
    elif en_necessary_pattern.search(cat_name): return CookieCategory.ESSENTIAL
    elif en_analytical_pattern.search(cat_name): return CookieCategory.ANALYTICAL
    elif en_functional_pattern.search(cat_name): return CookieCategory.FUNCTIONAL
    elif en_uncat_pattern.search(cat_name): return CookieCategory.UNCLASSIFIED
    elif social_media_pattern.search(cat_name): return CookieCategory.SOCIAL_MEDIA
    else:
        c_logmsg(f"ONETRUST: {cat_name} not recognized by English patterns", browser_id, logging.WARN)
        return CookieCategory.UNRECOGNIZED


def category_lookup_de(browser_id: int, cat_name: str) -> CookieCategory:
    """
    Map english category name defined in the CMP to the internal representation.
    """
    if de_targeting_pattern.search(cat_name): return CookieCategory.ADVERTISING
    elif de_necessary_pattern.search(cat_name): return CookieCategory.ESSENTIAL
    elif de_analytical_pattern.search(cat_name): return CookieCategory.ANALYTICAL
    elif de_functional_pattern.search(cat_name): return CookieCategory.FUNCTIONAL
    elif de_uncat_pattern.search(cat_name): return CookieCategory.UNCLASSIFIED
    elif social_media_pattern.search(cat_name): return CookieCategory.SOCIAL_MEDIA
    else:
        c_logmsg(f"ONETRUST: '{cat_name}' not recognized by German patterns", browser_id, logging.WARN)
        return CookieCategory.UNRECOGNIZED



class _exists_script_tag_with_ddid():
    """
    Extract "data-domain-script" attribute value from first script tag
    that contains it. This will allow us to access the OneTrust ruleset json.
    @return: data domain id string, or False if not found
    """

    def __init__(self, browser_id):
        self.browser_id = browser_id

    def __call__(self, driver):
        elems = driver.find_elements_by_tag_name("script")
        for e in elems:
            try:
                # Find a script tag with the data-domain-script attribute
                dd_id = str(e.get_attribute("data-domain-script"))
                if (dd_id is not None) and (uuid_pattern.match(str(dd_id)) or str(dd_id) == "center-center-default-stack-global-ot"):
                    source_stub = e.get_attribute("src")
                    if source_stub is None:
                        c_logmsg(f"ONETRUST: VARIANT A: Found a script tag with the data-domain attribute, "
                                 f"but no URL? Script ID: {dd_id}", self.browser_id, logging.WARN)
                        continue
                    else:
                        for pat in base_patterns:
                            m = pat.match(source_stub)
                            if m:
                                return m.group(1), dd_id
                        else:
                            c_logmsg(f"ONETRUST: VARIANT A: Found a data-domain-script tag with unknown source "
                                     f"URL: {source_stub}. Script ID: {dd_id}", self.browser_id, logging.WARN)

            except StaleElementReferenceException:
                continue
        return False


class _exists_script_tag_with_jsurl():
    """
    Directly retrieve the link to the javascript containing the OneTrust consent categories.
    Looks for domains of the form:  "https://<domain>/consent/<UUID>.js"
    @return: (base url, data domain id) or False if not found
    """

    def __init__(self, browser_id):
        self.browser_id = browser_id

    def __call__(self, driver):
        elems = driver.find_elements_by_tag_name("script")
        for e in elems:
            try:
                source = e.get_attribute("src")
                if source:
                    # any of them match --> extract URL. otherwise, continue to next script tag
                    for p in variantB_patterns:
                        matchobj = p.match(source)
                        if matchobj:
                            c_logmsg(f"ONETRUST: VARIANT B: Pattern found: {p.pattern}", self.browser_id, logging.INFO)
                            return matchobj.group(0)

            except StaleElementReferenceException:
                continue

        return False


def _variantA_try_retrieve_ddid(driver: WebDriver, browser_id: int, timeout: int = 5) -> Optional[Tuple[str, str]]:
    """
    Variant A involves the Data Domain ID we need being stored inside a script tag attribute.
    Additionally, it retrieves the OneTrust URL used for storing the cookie categories.
    This function starts the process of searching for said data domain ID, using WebDriverWait.
    @param driver: webdriver to look for the script tag with.
    @param browser_id: identifier for the browser that performs the action
    @param timeout: timeout after which the search gives up
    @return: Tuple: (base domain, data domain ID), or None if not found
        base domain: cookielaw, optanon or cookiepro
        data domain ID: unique identifier for the CDN to access the rulesets
    """
    try:
        wait = WebDriverWait(driver, timeout)
        base_domain, dd_id = wait.until(_exists_script_tag_with_ddid(browser_id))
        return base_domain, dd_id
    except TimeoutException:
        c_logmsg("ONETRUST: VARIANT A: Timeout on trying to retrieve data domain id value.", browser_id, logging.DEBUG)
        return None


def _variantA_try_retrieve_ruleset_id(domain_url: str, dd_id: str,
                                      browser_id: int) -> Tuple[List[Tuple[str,str]], CrawlState, str]:
    """
    Using the data-domain id, parse a list of rulesets from a json file stored on the domain url, and
    extract IDs that are essential for retrieving the json files storing the actual cookie category data.
    @param domain_url: Domain on which to access the ruleset json
    @param dd_id: Data domain ID (UUID) that is used to retrieve the ruleset json
    @param browser_id: identifier for the browser that performs the action
    @return: (cookie json ids, crawl state, report). List of ids may be empty if none found.
    """
    target_url = f"{domain_url}/consent/{dd_id}/{dd_id}.json"
    ruleset_json, state, report = simple_get_request(target_url, browser_id)

    if state != CrawlState.SUCCESS:
        return [], state, report

    ids = []
    rs_dict = json.loads(ruleset_json.text)

    try:
        rulesets = rs_dict["RuleSet"]
        if rulesets is None:
            return [], CrawlState.PARSE_ERROR, f"ONETRUST: VARIANT A: No valid 'RuleSet' element found on {target_url}"
        else:
            for r in rulesets:
                languageset = r["LanguageSwitcherPlaceholder"]
                if languageset is None:
                    continue
                if "en" in languageset.values():
                    ids.append(("en", r["Id"]))
                elif "en-GB" in languageset.values():
                    ids.append(("en-gb", r["Id"]))
                elif "en-US" in languageset.values():
                    ids.append(("en-us", r["Id"]))
                elif "de" in languageset.values():
                    ids.append(("de", r["Id"]))
                else:
                    c_logmsg("ONETRUST: VARIANT A: Ruleset did not have a recognized language, defaulting to english.", browser_id, logging.WARN)
                    ids.append(("en", r["Id"]))

        if len(ids) == 0:
            return [], CrawlState.PARSE_ERROR, f"ONETRUST: VARIANT A: No valid language ruleset found on {target_url}"

        return ids, CrawlState.SUCCESS, f"ONETRUST: Found {len(ids)} ruleset ids"
    except (AttributeError, KeyError) as kex:
        return [], CrawlState.PARSE_ERROR, f"ONETRUST: VARIANT A: Key Error on {target_url} -- Details: {kex}"


def _variantA_get_and_parse_json(domain_url: str, dd_id: str, ruleset_ids: List[Tuple[str, str]], browser_id: int,
                                 visit_id: int, sock: clientsocket) -> Tuple[int, CrawlState, str]:
    """
    Retrieve and parse the json files from the domain URL storing the cookie categories.
    The raw cookie data will be stored internally and can later be persisted to disk.
    @param domain_url: Domain on which to access the consent data json
    @param dd_id: Data domain ID, previously extracted before retrieving the ruleset ids.
    @param ruleset_ids: List of ids extracted from the ruleset json.
    @param browser_id: identifier for the browser that performs the action
    @return: number of cookies extracted, crawl state, report
    """
    cookie_count = 0
    for lang, i in ruleset_ids:
        curr_ruleset_url = f"{domain_url}/consent/{dd_id}/{i}/{lang}.json"
        cc_json, state, report = simple_get_request(curr_ruleset_url, browser_id=browser_id)

        if state != CrawlState.SUCCESS:
            c_logmsg(f"ONETRUST: VARIANT A: Failed to retrieve ruleset at: {curr_ruleset_url}", browser_id, logging.WARN)
            c_logmsg(f"ONETRUST: VARIANT A: Details: {state} -- {report}", browser_id, logging.DEBUG)
            continue

        try:
            json_data = json.loads(cc_json.text)
            if "DomainData" not in json_data:
                c_logmsg(f"ONETRUST: VARIANT A: Could not find \"DomainData\" attribute inside decoded JSON.", browser_id, logging.WARN)
                continue
            json_body = json_data["DomainData"]

            ## Language Detection
            if "Language" not in json_body:
                c_logmsg(f"ONETRUST: VARIANT A: Could not find \"Language\" attribute inside decoded JSON.", browser_id, logging.WARN)
                continue
            elif "Culture" not in json_body["Language"]:
                c_logmsg(f"ONETRUST: VARIANT A: Could not find \"Culture\" attribute inside decoded JSON.", browser_id, logging.WARN)
                continue
            elif any(lstring in json_body["Language"]["Culture"] for lstring in ["en", "en-GB", "en-US"]):
                cat_lookup = category_lookup_en
            elif "de" in json_body["Language"]["Culture"]:
                cat_lookup = category_lookup_de
            else:
                c_logmsg(f"ONETRUST: VARIANT A: Unrecognized language in ruleset: {json_body['Language']['Culture']}", browser_id, logging.WARN)
                c_logmsg(f"ONETRUST: VARIANT A: Trying english anyways...", browser_id, logging.WARN)
                cat_lookup = category_lookup_en

            ## Cookie Data extraction
            if "Groups" not in json_data["DomainData"]:
                c_logmsg(f"ONETRUST: VARIANT A: Could not find \"Groups\" attribute inside decoded JSON.", browser_id, logging.WARN)
                continue

            group_list = json_data["DomainData"]["Groups"]
            for g_contents in group_list:
                if "GroupName" not in g_contents:
                    c_logmsg(f"ONETRUST: VARIANT A: Could not find Category Name for group inside decoded JSON.", browser_id, logging.WARN)
                    continue
                cat_name = g_contents["GroupName"]
                cat_id = cat_lookup(browser_id, cat_name)

                if "FirstPartyCookies" in g_contents:
                    firstp_cookies = g_contents["FirstPartyCookies"]
                    for c in firstp_cookies:
                        purpose = c["description"] if "description" in c else None
                        expiry = c["Length"] if "Length" in c else None
                        if "IsSession" in c:
                            expiry = "session" if c["IsSession"] else expiry
                        send_cookiedat_to_db(sock, c["Name"], c["Host"], cat_id, cat_name,
                                             browser_id, visit_id, purpose, expiry,
                                             None, None)
                        cookie_count += 1
                else:
                    c_logmsg(f"ONETRUST: VARIANT A: No First Party Cookies inside group for decoded JSON.", browser_id, logging.WARN)

                if "Hosts" in g_contents:
                    thirdp_cookies = g_contents["Hosts"]
                    for host_dat in thirdp_cookies:
                        if "Cookies" not in host_dat:
                            continue
                        for c in host_dat["Cookies"]:
                            purpose = c["description"] if "description" in c else None
                            expiry = c["Length"] if "Length" in c else None
                            if "IsSession" in c:
                                expiry = "session" if c["IsSession"] else expiry
                            send_cookiedat_to_db(sock, c["Name"], c["Host"], cat_id, cat_name,
                                                 browser_id, visit_id, purpose, expiry,
                                                 None, None)
                            cookie_count += 1
                else:
                    c_logmsg(f"ONETRUST: VARIANT A: No Third Party Cookies inside group for decoded JSON.", browser_id, logging.WARN)
        except (AttributeError, KeyError) as ex:
            c_logmsg(f"ONETRUST: VARIANT A: Could not retrieve an expected attribute from json.", browser_id, logging.ERROR)
            c_logmsg(f"ONETRUST: VARIANT A: Details: {type(ex)} -- {ex}", browser_id, logging.ERROR)
        except json.JSONDecodeError as ex:
            c_logmsg(f"ONETRUST: VARIANT A: Failed to decode json file for ruleset : {curr_ruleset_url}", browser_id, logging.ERROR)
            c_logmsg(f"ONETRUST: VARIANT A: Details: {type(ex)} -- {ex}", browser_id, logging.ERROR)
            continue

        # stop after first successful ruleset
        if cookie_count > 0:
            break

    if cookie_count == 0:
        return 0, CrawlState.NO_COOKIES, f"ONETRUST: VARIANT A: Could not extract any cookies for ddid: {dd_id}."
    else:
        return cookie_count, CrawlState.SUCCESS, f"ONETRUST: VARIANT A: Cookies Extracted: {cookie_count}"


def _variantB_try_retrieve_jsurl(driver: WebDriver, browser_id: int, timeout: int = 5) -> Optional[str]:
    """
    Find OneTrust javascript URL inside the HTML of the current webdriver page.
    @param driver: Selenium webdriver currently active
    @param browser_id: browser that performs the action
    @param timeout: Time to wait in seconds.
    @return URL pattern, or None if none found.
    """
    try:
        wait = WebDriverWait(driver, timeout)
        js_url = wait.until(_exists_script_tag_with_jsurl(browser_id))
        return js_url
    except TimeoutException:
        c_logmsg("ONETRUST: VARIANT B: Timeout on trying to retrieve javascript link.", browser_id, logging.DEBUG)
        return None


def _variantB_parse_script_for_object(script_url: str, browser_id: int) -> Tuple[Optional[Dict], CrawlState, str]:
    """
    Use the requests library to retrieve the OneTrust Javascript document containing
    the cookie consent categories, and transform it into a dictionary.
    @param script_url: URL to retrieve the javascript file from
    @param browser_id: process that performs the action
    @return: Tuple:
        data_dict: Dictionary of JSON data from which the cookie categories can be retrieved.
        state: Result status
        msg: Potential Error Report
    """
    r, state, report = simple_get_request(script_url, browser_id)
    if state != CrawlState.SUCCESS:
        return None, state, report

    onetrust_script: str = r.text.strip()

    # purge newlines
    onetrust_script = re.sub('\n', ' ', onetrust_script)

    # Find the start of the group array
    matchobj = re.search(",\\s*Groups:\\s*\\[", onetrust_script)
    try:
        if matchobj:
            startpoint = matchobj.start(0)

            # Get the end of the group array
            i = matchobj.end(0)
            open_brackets = 1
            in_quotes = False
            while i < len(onetrust_script) and open_brackets > 0:
                if onetrust_script[i] == '"':
                    in_quotes = not in_quotes
                if not in_quotes:
                    if onetrust_script[i] == "[":
                        open_brackets += 1
                    elif onetrust_script[i] == "]":
                        open_brackets -= 1
                i += 1
            group_string = onetrust_script[startpoint + 1:i]

            # put the object into a javascript function, and evaluate it
            # This returns a dict of the cookie consent data we need.
            js_object_string = "function $() {return {" + group_string + "}};"
            data_dict = js2py.eval_js(js_object_string)()

            return data_dict, CrawlState.SUCCESS, "ONETRUST: VARIANT B: Successfully extracted objects from javascript"
        else:
            return None, CrawlState.PARSE_ERROR, "ONETRUST: VARIANT B: Failed to find desired javascript object in Onetrust consent script."
    except Exception as ex:
        return None, CrawlState.UNKNOWN, f"ONETRUST: VARIANT B: Unexpected error while parsing OneTrust javascript: : {type(ex)} {ex}"


def _variantB_extract_cookies_from_dict(consent_data: Dict[str, Any], browser_id: int, visit_id: int,
                                        sock: clientsocket) -> Tuple[int, CrawlState, str]:
    """
    Using the dictionary from the previous step, extract the useful data contained within.
    @param consent_data: Cookie data dictionary retrieved from previous step.
    @param browser_id: process that performs the action
    @return: number of cookies extracted, crawl state, report
    """
    cookie_count = 0
    try:
        # If we arrive here, "Groups" must be in the dictionary
        g_data = consent_data["Groups"]
        for g_contents in g_data:

            # Try to retrieve the category name, and transform it to the internally defined categories
            try:
                if "Parent" not in g_contents or g_contents["Parent"] is None:
                    langproplist = g_contents["GroupLanguagePropertiesSets"]
                else:
                    langproplist = g_contents["Parent"]["GroupLanguagePropertiesSets"]

                if len(langproplist) > 0:
                    cat_name = langproplist[0]["GroupName"]["Text"]
                    cat_id = category_lookup_en(browser_id, cat_name)
                    if cat_id == CookieCategory.UNRECOGNIZED:
                        cat_id = category_lookup_de(browser_id, cat_name)

                else:
                    raise AttributeError("Empty Group")
            except (AttributeError, KeyError):
                cat_name = "undefined"
                cat_id = -1
                c_logmsg("ONETRUST: Unable to find category name. Attempting cookie retrieval anyways...", browser_id, logging.WARNING)

            for cookie_dat in g_contents["Cookies"]:
                cname = cookie_dat["Name"]  # not null
                chost = cookie_dat["Host"]  # not null
                cdesc = cookie_dat["description"] if "description" in cookie_dat else None
                cexpiry = cookie_dat["Length"] if "Length" in cookie_dat else None
                if "IsSession" in cookie_dat:
                    cexpiry = "session" if cookie_dat["IsSession"] else cexpiry

                send_cookiedat_to_db(sock, cname, chost, cat_id, cat_name,
                                     browser_id, visit_id, cdesc, cexpiry,
                                     None, None)
                cookie_count += 1

    except (AttributeError, KeyError) as ex:
        return 0, CrawlState.PARSE_ERROR, f"ONETRUST: VARIANT B: Could not retrieve an expected attribute from consent data dict. -- {type(ex)} - {ex}"
    if cookie_count == 0:
        return 0, CrawlState.NO_COOKIES, "ONETRUST: VARIANT B: Consent Platform Script contained zero cookies!"
    else:
        return cookie_count, CrawlState.SUCCESS, f"ONETRUST: VARIANT B: Successfully retrieved {cookie_count} cookies."


def check_onetrust_presence(webdriver: WebDriver) -> bool:
    """ Check whether a OneTrust pattern is referenced on the website """
    psource = webdriver.page_source
    found = False
    ot_iters = iter(base_patterns)
    try:
        while not found:
            pattern = next(ot_iters)
            found = pattern.search(psource, re.IGNORECASE) is not None
    except StopIteration:
        found = False

    return found


def internal_onetrust_scrape(url: str, browser_id: int, visit_id: int, sock: clientsocket,
                             webdriver: WebDriver) -> Tuple[CrawlState, str]:
    """
    Extract cookie category data from the variants of the OneTrust Cookie Consent Platform.
    The category data is found in json, either separate or as an inline document inside javascript.
    The crawling process attempts to obtain this data and read the data from it.
    @param url: The website we are trying to crawl. (performs a GET request)
    @param browser_id: Browser ID as specified by the Browser Manager. Will be recorded in the database.
    @param visit_id: Visit ID as specified by the Task Manager. Will be recorded in the database.
    @param sock: Socket connection to the database aggregator.
    @param webdriver: The Selenium webdriver we use to request the page.
    @return: A tuple consisting of 2 values:
        1. Resulting crawl state.
        2. Error report, or number of extracted cookies if successful.
    """

    # Variant A, Part 1: Try to retrieve data domain id
    c_logmsg(f"ONETRUST: Attempting Variant A", browser_id, logging.INFO)
    result = execute_in_IFrames(_variantA_try_retrieve_ddid, webdriver, browser_id, timeout=5)

    if result:
        domain_url = result[0]
        dd_id = result[1]
        c_logmsg(f"ONETRUST: VARIANT A: OneTrust data domain url = {domain_url}/{dd_id}", browser_id, logging.INFO)

        # Variant A, Part 2: Using the data domain ID, retrieve ruleset ID list
        rs_ids, state, report = _variantA_try_retrieve_ruleset_id(domain_url, dd_id, browser_id)
        if state != CrawlState.SUCCESS:
            c_logmsg(report, browser_id, logging.ERROR)
            return state, report
        c_logmsg(f"ONETRUST: VARIANT A: Found {len(rs_ids)} ruleset ids", browser_id, logging.INFO)
        c_logmsg(f"ONETRUST: VARIANT A: Retrieved ruleset ids {rs_ids}", browser_id, logging.DEBUG)

        # Variant A, Part 3: For each ruleset id, retrieve cookie json
        cookie_count, state, report = _variantA_get_and_parse_json(domain_url, dd_id, rs_ids, browser_id, visit_id, sock)
        if state != CrawlState.SUCCESS:
            c_logmsg(report, browser_id, logging.ERROR)
            return state, report

        c_logmsg(f"ONETRUST: VARIANT A: Retrieved {cookie_count} cookies", browser_id, logging.INFO)
    else:
        # Variant B, Part 1: Obtain the javascript URL
        c_logmsg(f"ONETRUST: Attempting Variant B", browser_id, logging.INFO)
        script_url = execute_in_IFrames(_variantB_try_retrieve_jsurl, webdriver, browser_id, timeout=5)
        if not script_url:
            report = "ONETRUST: Could not find a valid OneTrust CMP Variant on this URL."
            c_logmsg(report, browser_id, logging.ERROR)
            return CrawlState.CMP_NOT_FOUND, report
        c_logmsg(f"ONETRUST: VARIANT B: Onetrust Javascript URL = {script_url}", browser_id, logging.INFO)

        # Variant B, Part 2: Access the script and retrieve raw data from it
        data_dict, state, report = _variantB_parse_script_for_object(script_url, browser_id)
        if state != CrawlState.SUCCESS:
            c_logmsg(report, browser_id, logging.ERROR)
            return state, report
        c_logmsg(f"ONETRUST: VARIANT B: Successfully retrieved OneTrust Consent javascript object data.",
                 browser_id, logging.INFO)

        # Variant B, Part 3: Extract the cookie values from raw data
        cookie_count, state, report = _variantB_extract_cookies_from_dict(data_dict, browser_id, visit_id, sock)
        if state != CrawlState.SUCCESS:
            c_logmsg(report, browser_id, logging.ERROR)
            return state, report

        c_logmsg(f"ONETRUST: VARIANT B: Retrieved {cookie_count} cookies", browser_id, logging.INFO)

    return CrawlState.SUCCESS, f"Extracted {cookie_count} cookie entries."
