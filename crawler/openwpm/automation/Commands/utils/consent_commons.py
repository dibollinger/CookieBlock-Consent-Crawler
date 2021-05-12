"""
Shared functions for custom OpenWPM CMP commands
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

import re
import logging
import requests
import traceback
import requests.exceptions as r_excepts

from enum import IntEnum
from typing import Any, Tuple, Optional, Dict

from selenium.webdriver.remote.webdriver import WebDriver
from selenium.common.exceptions import StaleElementReferenceException

logger = logging.getLogger('openwpm.consentcrawler')

# unique identifier pattern
uuid_pattern = re.compile("[0-9a-fA-F]{8}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{12}")

# user agent string for requests call
chrome_user_agent = "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/70.0.3538.77 Safari/537.36"

class CrawlerType(IntEnum):
    """ Identify the CMP crawler type """
    FAILED = -1
    COOKIEBOT = 0
    ONETRUST = 1
    TERMLY = 2


class CookieCategory(IntEnum):
    """ ICC categories """
    UNRECOGNIZED = -1  # A class that is not unclassified but which the crawler cannot identify.
    ESSENTIAL = 0      # Cookie necessary for the site to function.
    FUNCTIONAL = 1     # Functional and Preferences. Change website options etc.
    ANALYTICAL = 2     # Includes performance and statistics.
    ADVERTISING = 3    # Cookies for Advertising/Tracking/Social Media/Marketing/Personal Data Sale etc.
    UNCLASSIFIED = 4   # Cookies that have been explicitly labelled as unclassified
    SOCIAL_MEDIA = 5   # Not used for training, but still interesting to know


class CrawlState(IntEnum):
    """ resulting end states of the crawler """
    SUCCESS = 0                # Everything went fine
    CONN_FAILED = 1            # Connection to server could not be established.
    HTTP_ERROR = 2             # Server returned an HTTP Error response.
    PARSE_ERROR = 3            # Could not find expected data in retrieved file.
    CMP_NOT_FOUND = 4          # Could not find desired Cookie Consent library.
    # BOT_DETECTION = 5          # Could not access site due to anti-bot measures (e.g. Captcha) // UNUSED
    MALFORMED_URL = 6          # URL to browse was improperly formatted.
    SSL_ERROR = 7              # Server has invalid SSL certificates.
    LIBRARY_ERROR = 8          # Cookie consent library returned an error response. (may be set up incorrectly)
    REGION_BLOCK = 9           # IP region was prevented access.
    MALFORM_RESP = 10          # Response did not have expected format.
    NO_COOKIES = 11            # Website didn't have any cookies recorded, despite correct response
    UNKNOWN = -1               # Unaccounted for Error. If this occurs, need to extend script to handle it.


def c_logmsg(report:str, browser_id: int, loglevel:int):
    """ Wrapper to prepend a string to the report"""
    log_msg = "BROWSER %i: CONSENTCRAWLER: " % browser_id
    log_msg += report
    if loglevel == logging.INFO: logger.info(log_msg)
    elif loglevel == logging.WARN: logger.warning(log_msg)
    elif loglevel == logging.ERROR: logger.error(log_msg)
    elif loglevel == logging.DEBUG: logger.debug(log_msg)
    elif loglevel == logging.CRITICAL: logger.critical(log_msg)
    else: logger.info(log_msg)


def send_crawlstate_to_db(socket, browser_id: int, visit_id: int, crawl_state: int,
                          report: str, cmp_type: CrawlerType) -> None:
    """
    Create a crawlstate record and send it to the database.
    """
    socket.send(("consent_crawl_results", {
        "visit_id": visit_id,
        "browser_id": browser_id,
        "cmp_type": cmp_type,
        "crawl_state": crawl_state,
        "report": report
    }))


def send_cookiedat_to_db(socket, name: str, domain: str, cat_id: int, cat_name: str, browser_id: int,
                         visit_id: int, purpose: Optional[str], expiry: Optional[str],
                         type_name: Optional[str], type_id: Optional[int]) -> None:
    """
    Utility function to send CMP cookie data to the database aggregator
    """
    socket.send(("consent_data", {
        "browser_id": browser_id,
        "visit_id": visit_id,
        "name": name,
        "domain": domain,
        "cat_id": cat_id,
        "cat_name": cat_name,
        "purpose": purpose,
        "expiry": expiry,
        "type_name": type_name,
        "type_id": type_id
    }))


def execute_in_IFrames(command, driver: WebDriver, browser_id: int, timeout: int) -> Optional[Any]:
    """
    Execute the provided command in each iFrame.
    @param command: command to execute, as an executable class
    @param driver: webdriver that performs the browsing
    @param browser_id: identifier for the browser
    @param timeout: how long to wait for the result until timeout
    @return: None if not found, Any if found
    """
    result = command(driver, browser_id, timeout)
    if result:
        return result
    else:
        driver.switch_to.default_content()
        iframes = driver.find_elements_by_tag_name('iframe')

        for iframe in iframes:
            try:
                driver.switch_to.default_content()
                driver.switch_to.frame(iframe)
                result = command(driver, browser_id, timeout=0)
                if result:
                    driver.switch_to.default_content()
                    return result
            except StaleElementReferenceException:
                c_logmsg("Iframe turned stale, trying next one", browser_id, logging.WARN)
                continue

        # If we get here, search also fails in iframes
        driver.switch_to.default_content()
        return None


def simple_get_request(url: str, browser_id: int, timeout: Tuple[int,int] = (6, 30),
                       headers: Optional[Dict[str, str]] = None) -> Tuple[Optional[requests.Response], CrawlState, str]:
    """
    Performs a simple GET request using the requests library.
    This is exclusively used for URLs that are known to point to a single file,
    such as a json or javascript document. As such, this is a much faster way
    to browse to the URL than using Selenium.
    @param url: URL to send a GET request for
    @param browser_id: process id that executes the request
    @param timeout: tuple of timeouts, connection timeout and load timeout respectively
    @param headers: Header arguments for the get request, as a dictionary
    @return: Tuple:
        1. Response from requests library
        2. crawlstate result
        3. potential erro message
    """
    try:
        # add chrome header in case bot detection is present
        if headers is None:
            extended_headers = {'User-Agent': chrome_user_agent}
        else:
            extended_headers = headers.copy()
            extended_headers['User-Agent'] = chrome_user_agent

        # perform fast get request for simple applications
        r = requests.get(url, timeout=timeout, verify=True, headers=extended_headers)

        if r.status_code >= 400:
            return None, CrawlState.HTTP_ERROR, f"Error Code: {r.status_code}"
        else:
            return r, CrawlState.SUCCESS, str(r.status_code)
    except r_excepts.HTTPError as ex:
        logger.error(f"BROWSER {browser_id}: HTTP Error Exception for URL \"{url}\". Details: {ex}")
        return None, CrawlState.HTTP_ERROR, f"Selenium HTTP Error encountered: {ex}"
    except r_excepts.SSLError as ex:
        logger.error(f"BROWSER {browser_id}: SSL Certificate issue encountered when connecting to {url}. -- Details: {ex}")
        return None, CrawlState.SSL_ERROR, f"Encountered an SSL error: {ex}"
    except (r_excepts.URLRequired, r_excepts.MissingSchema) as ex:
        logger.error(f"BROWSER {browser_id}: Possibly malformed URL: \"{url}\" -- Details: \"{ex}\"")
        return None, CrawlState.MALFORMED_URL, f"Malformed URL for get request: {url}"
    except (r_excepts.ConnectionError, r_excepts.ProxyError, r_excepts.TooManyRedirects, r_excepts.Timeout) as ex:
        logger.error(f"BROWSER {browser_id}: Connection to \"{url}\" failed. -- Details: {ex}")
        return None, CrawlState.CONN_FAILED, f"Connection to host failed. Details: {ex}"
    except Exception as ex:
        logger.error(f"BROWSER {browser_id}: Unexpected Error on {url}: {ex}")
        logger.debug(traceback.format_exc())
        return None, CrawlState.UNKNOWN, f"An unexpected error occurred when accessing {url}: {ex}"
