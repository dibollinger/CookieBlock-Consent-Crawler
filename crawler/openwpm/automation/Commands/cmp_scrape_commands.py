"""
Wrapper for consent provider crawl commands
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
import time

from typing import Dict, Callable, Tuple

from selenium.webdriver.remote.webdriver import WebDriver

from ..SocketInterface import clientsocket

from .cookiebot_commands import (internal_cookiebot_scrape, check_cookiebot_presence)
from .onetrust_commands import (internal_onetrust_scrape, check_onetrust_presence)
from .termly_commands import (internal_termly_scrape, check_termly_presence)
from .browser_commands import get_website, browse_website

from .utils.webdriver_utils import wait_until_loaded
from .utils.consent_commons import (send_crawlstate_to_db, CrawlState, c_logmsg, CrawlerType)

# presence check before full crawl process
presence_check_methods = { CrawlerType.COOKIEBOT: check_cookiebot_presence,
                           CrawlerType.ONETRUST: check_onetrust_presence,
                           CrawlerType.TERMLY: check_termly_presence }

# all supported crawl methods
crawl_methods: Dict = { CrawlerType.COOKIEBOT: internal_cookiebot_scrape,
                        CrawlerType.ONETRUST: internal_onetrust_scrape,
                        CrawlerType.TERMLY: internal_termly_scrape }


def _run_scrape(scrape_call: Callable[[str, int, int, clientsocket, WebDriver], Tuple[CrawlState, str]],
                cmp_type: CrawlerType, url: str, sleep: float, visit_id:int, browser_id:int, webdriver: WebDriver,
                browser_params: Dict, manager_params: Dict, extension_socket) -> None:
    """
    Establish connection to the database, browse to the website, and execute the consent crawl command.
    Finally, send crawl results to the database.
    @param scrape_call: Method to perform the crawl with
    @param cmp_type: Consent Management Provider type that is being crawled
    @param url: URL to crawl
    """
    sock = clientsocket()
    sock.connect(*manager_params['aggregator_address'])
    try:
        get_website(url, sleep, visit_id, webdriver, browser_params, extension_socket)
        wait_until_loaded(webdriver, 5)

        state, msg = scrape_call(url, browser_id, visit_id, sock, webdriver)
        send_crawlstate_to_db(sock, browser_id, visit_id, state, msg, cmp_type)
    finally:
        sock.close()


def run_cookiebot_scrape(url: str, sleep: float, visit_id: int, browser_id: int, webdriver: WebDriver,
                        browser_params: Dict, manager_params: Dict, extension_socket) -> None:
    """
    Run Cookiebot Crawl
    """
    _run_scrape(internal_cookiebot_scrape, CrawlerType.COOKIEBOT, url, sleep, visit_id, browser_id,
                webdriver, browser_params, manager_params, extension_socket)


def run_onetrust_scrape(url: str, sleep: float, visit_id: int, browser_id: int, webdriver: WebDriver,
                        browser_params: Dict, manager_params: Dict, extension_socket) -> None:
    """
    Run OneTrust Crawl
    """
    _run_scrape(internal_onetrust_scrape, CrawlerType.ONETRUST, url, sleep, visit_id, browser_id,
                webdriver, browser_params, manager_params, extension_socket)


def run_termly_scrape(url: str, sleep: float, visit_id: int, browser_id: int, webdriver: WebDriver,
                      browser_params: Dict, manager_params: Dict, extension_socket) -> None:
    """
    Run Termly Crawl
    """
    _run_scrape(internal_termly_scrape, CrawlerType.TERMLY, url, sleep, visit_id, browser_id,
                webdriver, browser_params, manager_params, extension_socket)


def run_generic_scrape(url: str, sleep: float, visit_id: int, browser_id: int, num_links: int,
                       subpage_timeout: float, webdriver: WebDriver, abort_early:bool,
                       browser_params: Dict, manager_params: Dict, extension_socket) -> None:
    """
    Runs a Consent Management Platform crawl for all supported variants.
    Browses to the specified URL and then attempts to extract CMP data until it finds one that works.
    If the CMP data extraction fails, browsing the site for additional cookies is pointless, thus it
    is skipped. To do this anyways, set "abort_early" to False.
    @param url: URL to browse to
    @param sleep: amount of time to sleep after the GET request
    @param visit_id: unique identifier for the website
    @param browser_id: unique identifier for the browser
    @param num_links: number of internal links (subpages) to browse
    @param subpage_timeout: how long to remain on each subpage at most
    @param webdriver: webdriver instance to browse with
    @param abort_early: if true, abort browse phase if no CMP found
    """
    start = time.time()
    sock = clientsocket()
    sock.connect(*manager_params['aggregator_address'])

    try:
        get_website(url, sleep, visit_id, webdriver, browser_params, extension_socket)
        wait_until_loaded(webdriver, 5)

        state = None
        cmp_type = CrawlerType.FAILED
        try:
            no_cmp: bool = True
            c_iter = iter(presence_check_methods)
            while no_cmp:
                cmp_type = next(c_iter)
                check_call = presence_check_methods[cmp_type]
                no_cmp = not check_call(webdriver)
            state = CrawlState.SUCCESS
        except StopIteration:
            cmp_type = CrawlerType.FAILED
            state = CrawlState.CMP_NOT_FOUND
            msg = f"No known Consent Management Platform found on the given URL."
            c_logmsg(msg, browser_id, logging.ERROR)

            elapsed = time.time() - start
            c_logmsg(f"NF_ELAPSED_TIME {elapsed:.3f}", browser_id, logging.DEBUG)
            send_crawlstate_to_db(sock, browser_id, visit_id, state, msg, cmp_type)

        if state == CrawlState.SUCCESS:
            # perform CMP call
            scrape_call = crawl_methods[cmp_type]
            state, msg = scrape_call(url, browser_id, visit_id, sock, webdriver)

            send_crawlstate_to_db(sock, browser_id, visit_id, state, msg, cmp_type)
    finally:
        sock.close()

    # output time taken for CMP crawl into log
    elapsed = time.time() - start
    c_logmsg(f"CMP_ELAPSED_TIME {elapsed:.3f}", browser_id, logging.DEBUG)

    if state != CrawlState.SUCCESS and abort_early:
        c_logmsg("Aborting browse phase as CMP crawl failed.", browser_id, logging.INFO)
        return

    browse_website(url, num_links, sleep, visit_id, webdriver, subpage_timeout,
                   browser_params, manager_params, extension_socket)

    # output total time into log
    elapsed = time.time() - start
    c_logmsg(f"TOTAL_ELAPSED_TIME {elapsed:.3f}", browser_id, logging.DEBUG)

