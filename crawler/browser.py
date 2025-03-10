from __future__ import annotations

import json
from abc import ABC, abstractmethod
import time
from datetime import datetime
import os
import signal

import logging
from logging import Logger
import shutil
import tempfile
from pathlib import Path
from types import TracebackType
from typing import (
    Optional,
    Any,
    List,
    TypeVar,
    Callable,
    cast,
    Generator,
    Dict,
    Tuple,
    NamedTuple,
)

from urllib.parse import urldefrag
from psutil import Process, TimeoutExpired, NoSuchProcess

from bs4 import BeautifulSoup
from hyperlink import URL, URLParseError
from numpy import random
import random as prandom
import string
import undetected_chromedriver as uc
from undetected_chromedriver.patcher import Patcher
from html2text import HTML2Text
from ftfy import fix_encoding

from selenium.common.exceptions import (
    NoAlertPresentException,
    TimeoutException,
    WebDriverException,
    JavascriptException,
    UnexpectedAlertPresentException,
    StaleElementReferenceException,
    MoveTargetOutOfBoundsException,
    InvalidArgumentException,
)
from selenium.webdriver import ActionChains
from selenium.webdriver.common.by import By
from selenium.webdriver.common.keys import Keys
from selenium.webdriver.firefox.options import Options as FirefoxOptions
from selenium.webdriver.firefox.service import Service as FirefoxService
from selenium.webdriver.remote.webelement import WebElement
from selenium.webdriver.support.expected_conditions import staleness_of
from selenium.webdriver.support.wait import WebDriverWait

from selenium_stealth import stealth

from seleniumwire import webdriver

from crawler.database import Crawl, SiteVisit, ConsentData, ConsentCrawlResult, Cookie
from crawler.enums import PageState, CookieTuple, CrawlerType, CrawlState

from crawler.cmps.cookiebot import CookiebotCMP
from crawler.cmps.onetrust import OnetrustCMP
# from crawler.cmps.termly import check_termly_presence, internal_termly_scrape

FuncT = TypeVar("FuncT", bound=Callable[..., Any])

COOKIEBLOCK_EXTENSION_ID = "fbhiolckidkciamgcobkokpelckgnnol"


class LinkTuple(NamedTuple):
    url: URL
    texts: list[str]


# Find all href tags
# JavaScript efficient implementation
GET_LINK_JS = (Path(__file__).parent / "js/get_links.js").read_text()


def post_load_routine(func: FuncT, browser_init: Optional[Browser] = None) -> FuncT:
    """
    Collects cookies and dismisses alert windows after the decorated function is run
    """

    def func_wrapper(*args: Any, **kwargs: Any) -> None:
        ret = func(*args, **kwargs)

        # check if self (Browser) is the first argument
        browser: Browser = args[0]
        if not isinstance(browser, Browser):
            if browser_init:
                browser = browser_init
            else:
                browser.logger.error(
                    "Browser not provided to the post_routine decorator"
                )
                return ret

        browser.logger.debug("executing post function routine")
        browser.dismiss_dialogs()
        return ret

    return cast(FuncT, func_wrapper)


class Browser(ABC):
    driver: uc.Chrome | webdriver.Firefox

    """
    Abstracts driver for Selenium
    """

    def __init__(
        self,
        timeout: float,
        seconds_before_processing_page: float,
        logger: Logger,
        proxy: Optional[str] = None,
    ) -> None:
        """This implements an abstract basic browser which provides some common settings (screenshots, proxy, timeout and the seconds_before_processing_page).
        And also dumping logic, link collecion and other shared logic.

        Args:
            timeout (float): Timeout for a page to load.
            seconds_before_processing_page (float): Seconds to wait before determining the status of a page.
            proxy (Optional[str], optional): Proxy url. Defaults to None.
        """

        # Contains a dictionary from all URLs of loaded resources to their state
        self._load_status: dict[str, PageState] = {}

        self.last_loaded_url: Optional[URL] = None

        self.proxy = proxy
        self.timeout = timeout
        self.seconds_before_processing_page = seconds_before_processing_page
        self.logger = logger

        # Needs to also have enfbots_ prefix as this is also deleted
        # via 'run-crawler.sh' in case the crawler crashes.
        self.temp_download_directory = tempfile.TemporaryDirectory(
            prefix="enfbots_download_dir_"
        )

    @property
    @abstractmethod
    def requests(self) -> list[Any]: ...

    @abstractmethod
    def __enter__(self) -> Browser: ...

    def __exit__(
        self,
        exc_type: type[BaseException] | None,
        exc_val: BaseException | None,
        exc_tb: TracebackType | None,
    ) -> None:
        self.logger.info("Exiting selenium driver %s, %s, %s", exc_type, exc_val, exc_tb)

        # noinspection PyBroadException
        try:
            self._press_key(Keys.ESCAPE)
            self.driver.quit()
        except Exception as e:
            # some errors (like KeyboardInterrupt) might crash Selenium and we cannot quit it like this
            self.logger.warning("Driver failed to quit gracefully, due to %s", e)

    def dismiss_dialogs(self) -> None:
        # try to dismiss alert windows
        try:
            for _ in range(10):
                self.driver.switch_to.alert.dismiss()
                self.logger.debug("Dismissed alert")
                time.sleep(0.2 + random.rand() * 0.3)
        except (NoAlertPresentException, TimeoutException):
            pass

    @property
    def user_agent(self) -> str:
        agent = self.execute_script("return navigator.userAgent;")
        if agent:
            return agent
        logging.warning("Browser returned no user agent!")
        return "Mozilla/5.0 (X11; Linux x86_64; rv:94.0) Gecko/20100101 Firefox/94.0"

    @property
    def current_url(self) -> URL:
        try:
            # Even though the type from driver.current_url says it can never be None
            # it sometimes is and we have to handle this case here
            return URL.from_text(self.driver.current_url)
        except TypeError:
            return URL.from_text("")

    @post_load_routine
    def load_page(self, url: URL, timeout: Optional[float] = None) -> PageState:
        timeout = self.seconds_before_processing_page if timeout is None else timeout

        # this function is NOT thread safe
        # selenium wire will add a trailing slash, so we add it before to be able to match requests later
        # adds a trailing slash if it does not exist

        if not url.path:
            url = url.child("")

        self.logger.debug("Loading page %s", url)
        self.last_loaded_url = url
        error = None
        try:
            str_url = str(url)
            self.logger.info("Calling driver.get %s", str_url)
            self.driver.get(str_url)
        except TimeoutException:
            self.logger.warning("Timeout on: %s", url)
            return PageState.TIMEOUT
        except InvalidArgumentException:
            # Happens if the protocol is missing (not only then)
            return PageState.WRONG_URL
        except WebDriverException as e:
            if "net::ERR_NAME_NOT_RESOLVED" in str(e.msg):
                return PageState.DNS_ERROR
            # other exceptions in Chrome.
            # actual error is in load status
            error = e

        # this may add up to 40 s to the whole crawl execution
        if timeout == 0:
            timeout = 0.8 + random.random() * 1.2
        self.logger.info("Waiting for %0.2f seconds", timeout)
        time.sleep(timeout)

        if str_url in self._load_status:
            self.logger.info("load status is: %s", self._load_status[str_url])
            return self._load_status[str_url]
        else:
            self.logger.info("NO load status found for %s", str_url)

        try:
            self.logger.info("Pressing escape")
            self._press_key(Keys.ESCAPE)
        except (
            WebDriverException,
        ) as e:
            self.logger.exception(e)
            # Also continue

        if str(url) in self._load_status:
            tries = 3
            while tries > 0:
                try:
                    status = self._load_status[str(url)]
                    if status == PageState.REDIRECT:
                        return self._load_status[str(self.last_loaded_url)]
                    return status
                except KeyError:
                    pass
                tries -= 1
            # End of tries
            self.logger.error("No status for URL: %s", url)
            return PageState.UNKNOWN_ERROR
        if error:
            # an error on get without extra
            self.logger.error(
                "Unknown error occurred on page load of %s.", str(url), exc_info=error
            )
            return PageState.UNKNOWN_ERROR

        # this indicates the list was probably an anchor and no reload happened (e.g. SPA)
        return PageState.OK

    def full_dump(self, output_dir: Path, name: str) -> None:
        path = output_dir / "dump_urls.txt"
        with path.open("a") as file:
            print(f"{name}: {self.current_url.to_text()}", file=file)

        self.dump_html(output_dir, name)

    def dump_html(self, output_dir: Path, name: str) -> Path:
        """
        Save page as html. Returns the filename of the stored file.
        :param output_dir: storage path
        :param name: file name
        """
        current_url = self.current_url
        self.logger.info("Dumping HTML: %s on page: %s", name, current_url)

        if str(current_url).strip().lower().endswith(".pdf"):
            self.logger.error("Dumping html on pdf page %s", current_url)

        content = self.get_html()
        file_name = output_dir / f"{name}.html"

        # Write out
        output_dir.mkdir(parents=True, exist_ok=True)
        with file_name.open("w") as out_file:
            out_file.write(content)
        return file_name

    def get_html(self) -> str:
        return str(self.driver.page_source)

    def get_soup(self) -> BeautifulSoup:
        """
        Parse the content of the web page
        :return: BeautifulSoup of the page content
        """
        soup = BeautifulSoup(
            self.driver.page_source, "html.parser", multi_valued_attributes=None
        )
        for nos in soup.find_all("noscript"):
            nos.decompose()
        return soup

    def get_content(self, url: str) -> Tuple[PageState, str]:
        status = self.load_page(URL.from_text(url))

        formatter = HTML2Text()
        formatter.ignore_images = True
        content = formatter.handle(fix_encoding(self.driver.page_source))

        return (status, content)

    def get_links(self) -> List[LinkTuple]:
        """
        For currently loaded page, locate all links and their accompanying text
        """

        links = self.execute_script(GET_LINK_JS)

        if links is None:
            return []

        current_url = self.current_url

        results = []
        for item in links:
            if item is None:
                continue

            if "href" in item:
                if item["href"]:
                    href = item["href"].strip()
                    try:
                        url = URL.from_text(urldefrag(href).url)
                    except URLParseError:
                        self.logger.warning("Badly formatted url encountered %s", href)
                        continue
                    except ValueError:
                        self.logger.warning(
                            "Badly formatted url encountered, other ValueError %s", href
                        )
                        continue
                    # check for valid scheme (not mailto...)
                    if url.scheme not in ("http", "https", ""):
                        continue
                    if not url.absolute:
                        try:
                            url = current_url.click(url)
                        except NotImplementedError as e:
                            self.logger.warning(
                                "NotImplementedError when clicking: %s on link %s",
                                e,
                                url,
                            )
                            continue

                    path_only = url.replace(scheme=None, host=None, port=None).to_text()
                    test_str = [item["text"], path_only, item["alt_text"]]
                    results.append(LinkTuple(url, test_str))
            else:
                self.logger.error("Strange link found: %s", item)
        return results

    @post_load_routine
    def activate(self, el: WebElement) -> None:
        """
        Using this function, one is also able to click on partially hidden html elements, which would otherwise cause
        an exception when trying to simulate a click on it :param el: element to make active
        """
        self.driver.execute_script("arguments[0].click();", el)

    @post_load_routine
    def execute_script(
        self, script: str, *args: Any, raise_exception: bool = False
    ) -> Any:
        """
        Wrapper of browser execute_script. Raises JavascriptException
        """
        self.logger.debug("Executing JS code in selenium: %s", script)
        for i in range(3):
            try:
                res = self.driver.execute_script(script, *args)
                # self.logger.info("> Result was: %s", res)
                return res
            except JavascriptException as e:
                if raise_exception:
                    raise e
                else:
                    self.logger.exception(f"JavaScript exception encountered {e}")
            except TimeoutException as e:
                if i >= 2:
                    raise e
                self.logger.info("Timed out when executing script")

    @post_load_routine
    def _press_key(self, key: Any) -> None:
        """
        Operate the browser via keyboard.
        :param key: keyboard keys to press
        """
        actions = ActionChains(self.driver)
        actions.send_keys(key)
        actions.perform()


class CBConsentCrawlerBrowser(Browser):
    def __init__(
        self,
        seconds_before_processing_page: float,
        logger: Logger,
        browser_id: int,
        proxy: Optional[str] = None,
    ) -> None:
        super().__init__(
            timeout=7,
            seconds_before_processing_page=seconds_before_processing_page,
            proxy=proxy,
            logger=logger,
        )

        self.cookie_tracker: set[CookieTuple] = set()
        self.browser_id = browser_id

    def load_page(self, url: URL, timeout: Optional[float] = None) -> PageState:
        return super().load_page(url, timeout)

    def crawl_cmps(self, visit: SiteVisit) -> Tuple[CrawlerType, CrawlState, List[ConsentData], ConsentCrawlResult]:
        self.logger.info("Checking for CMPs")

        if self.browser_id is None:
            raise RuntimeError(
                "This instance cannot be used to crawl as 'crawl' was not set when initializing this browser"
            )

        results: Dict[CrawlerType, Any] = dict()

        cookiebot_cmp = CookiebotCMP(self.logger, self.browser_id)
        onetrust_cmp = OnetrustCMP(self.logger, self.browser_id)

        # Presence check before full crawl process
        presence_check_methods = {
            CrawlerType.ONETRUST: onetrust_cmp.check_presence,
            CrawlerType.COOKIEBOT: cookiebot_cmp.check_presence,
            # CrawlerType.TERMLY: check_termly_presence,
        }

        # All supported crawl methods
        crawl_methods: Dict = {
            CrawlerType.ONETRUST: onetrust_cmp.scrape,
            CrawlerType.COOKIEBOT: cookiebot_cmp.scrape,
            # CrawlerType.TERMLY: internal_termly_scrape,
        }

        for crawl_type, check_presence in presence_check_methods.items():
            is_present = check_presence(self.driver)

            self.logger.info("Result when checking for %s: %s", crawl_type.name, is_present)
            results[crawl_type] = is_present

        for crawl_type, found in results.items():
            if found:
                self.logger.info("Crawling for %s", crawl_type.name)

                crawl_state, message, consent_data = crawl_methods[crawl_type](
                    str(self.current_url), visit=visit, webdriver=self
                )

                self.logger.info("%s Result %s, %s", crawl_type.name, crawl_state, message)

                result = ConsentCrawlResult(
                    browser_id=self.browser_id,
                    visit_id=visit.visit_id,
                    crawl_state=crawl_state.value,
                    cmp_type=crawl_type.value,
                    report=message,
                )
                return crawl_type, crawl_state, consent_data, result  # original crawler only crawls first one
        result = ConsentCrawlResult(
            browser_id=self.browser_id,
            visit_id=visit.visit_id,
            crawl_state=CrawlState.CMP_NOT_FOUND,
            cmp_type=CrawlerType.FAILED,
            report="No known Consent Management Platform found on the given URL.",
        )

        return CrawlerType.FAILED, CrawlState.CMP_NOT_FOUND, [], result

    # TODO: add type to command
    def execute_in_IFrames(self, command, timeout: int) -> Optional[Any]:
        """
        Execute the provided command in each iFrame.
        @param command: command to execute, as an executable class
        @param timeout: how long to wait for the result until timeout
        @return: None if not found, Any if found
        """

        if self.browser_id is None:
            raise RuntimeError(
                "This instance cannot be used to crawl as 'crawl' was not set when initializing this browser"
            )

        result = command(self.driver, timeout)
        if result:
            return result
        else:
            self.driver.switch_to.default_content()
            iframes = self.driver.find_elements(By.TAG_NAME, "iframe")

            for iframe in iframes:
                try:
                    self.driver.switch_to.default_content()
                    self.driver.switch_to.frame(iframe)
                    result = command(self.driver, timeout=0)
                    if result:
                        self.driver.switch_to.default_content()
                        return result
                except StaleElementReferenceException:
                    self.logger.warning(
                        "iframe turned stale, trying next one (browser_id %s)"
                    )
                    continue

            # If we get here, search also fails in iframes
            self.driver.switch_to.default_content()
            return None

    def collect_cookies(self, visit: SiteVisit) -> List[Cookie]:
        """Collects actual stored cookies using the CookieBlock extension"""

        # TODO: how is record_type stored?

        self.logger.info("Collecting cookies")

        if self.browser_id is None:
            raise RuntimeError(
                "This instance cannot be used to crawl as 'crawl' was not set when initializing this browser"
            )

        url = f"chrome-extension://{COOKIEBLOCK_EXTENSION_ID}/options/cookieblock_options.html"

        self.driver.get(url)

        indexeddb_script = """
        function getCookieBlockHistory() {
            return new Promise((resolve, reject) => {
                var request = window.indexedDB.open("CookieBlockHistory", 1);

                request.onerror = function(event) {
                    reject("Error opening IndexedDB: " + event.target.errorCode);
                };

                request.onsuccess = function(event) {
                    var db = event.target.result;
                    var transaction = db.transaction(["cookies"], "readonly");
                    var objectStore = transaction.objectStore("cookies");
                    var data = [];
                    objectStore.openCursor().onsuccess = function(event) {
                        var cursor = event.target.result;
                        if (cursor) {
                            data.push(cursor.value);
                            cursor.continue();
                        }
                    };

                    transaction.oncomplete = function() {
                        resolve(JSON.stringify(data));
                    };

                    transaction.onerror = function(event) {
                        reject("Transaction error: " + event.target.errorCode);
                    };
                };
            });
        }

        // Usage:
        return getCookieBlockHistory().then(data => {
            return data;
        }).catch(error => {
            return error;
        });
        """
        indexeddb_data = self.execute_script(indexeddb_script)

        try:
            cookies = json.loads(indexeddb_data)
        except TypeError as e:
            self.logger.error(e)
            self.logger.error("Running script returned: %s", indexeddb_data)
            cookies = []

        self.logger.info("There are %i actual cookies stored.", len(cookies))

        result: List[Cookie] = []

        for x in cookies:
            self.logger.debug("Storing cookie (DEBUG OUTPUT)\n%s\n", x)

            if "variable_data" not in x or len(x["variable_data"]) == 0:
                raise RuntimeError("Unexpected. Variable_data missing in cookie")

            def host_only_fn(var_data: Dict[str, Any], prop: str) -> Optional[int]:
                if prop not in var_data:
                    return None
                return 1 if var_data[prop] else 0

            for var_data in x["variable_data"]:
                time_stamp = (
                    datetime.fromtimestamp(var_data["timestamp"] / 1000)
                    if "timestamp" in var_data
                    else datetime.now()
                )

                if "expirationDate" in var_data:
                    expiry = datetime.fromtimestamp(int(var_data["expirationDate"]))
                else:
                    # 9999-12-31T21:59:59.000Z
                    expiry = datetime.fromisoformat("9999-12-31T21:59:59.000Z")

                js_cookie = Cookie(
                    visit=visit,
                    visit_id=visit.visit_id,
                    browser_id=self.browser_id,
                    extension_session_uuid=None,
                    event_ordinal=None,
                    record_type="unknown",
                    change_cause="unknown",
                    # For compitability with older scripts
                    expiry=(
                        expiry.strftime("%Y-%m-%dT%H:%M:%S.%f")[:-3] + "Z"
                    ),
                    is_host_only=host_only_fn(var_data, "host_only"),
                    is_http_only=host_only_fn(var_data, "http_only"),
                    is_secure=host_only_fn(var_data, "secure"),
                    is_session=host_only_fn(var_data, "session"),
                    host=x["domain"] if "domain" in x else None,
                    name=x["name"] if "name" in x else None,
                    path=x["path"] if "path" in x else None,
                    value=var_data["value"] if "value" in var_data else None,
                    same_site=(
                        var_data["same_site"] if "same_site" in var_data else None
                    ),
                    first_party_domain=None,
                    store_id=None,
                    # For compitability with older scripts
                    time_stamp=(time_stamp.strftime("%Y-%m-%dT%H:%M:%S.%f")[:-3]) + "Z",
                )
                result.append(js_cookie)

                # Warn if timestamp was generated
                if "timestamp" not in var_data:
                    self.logger.error(
                        "timestamp missing in cookie: %s on %s", x, visit.site_url
                    )
        # End iterating over cookies
        return result

    def scroll_down(self, prob_scroll: float = 0.8) -> None:
        """
        Scroll down the current page a random amount.
        """
        at_bottom = False
        while random.random() > (1.0 - prob_scroll) and not at_bottom:
            self.driver.execute_script(
                "window.scrollBy(0,%d)" % (10 + int(200 * random.random()))
            )
            at_bottom = self.driver.execute_script("""
                if (document.body != null && 'clientHeight' in document.body) {
                    return ((window.scrollY + window.innerHeight) + 100 > document.body.clientHeight)
                } else {
                    return true
                }
                """
            )
            time.sleep(0.01 + random.random())

    def bot_mitigation(
        self,
        max_sleep_seconds: int = 7,
        prob_scrolling: float = 0.8,
        num_mouse_moves=10,
    ) -> None:
        RANDOM_SLEEP_LOW = 1  # low (in sec) for random sleep between page loads
        """ Performs a number of commands intended for bot mitigation """

        # bot mitigation 1: move the randomly around a number of times
        window_size = self.driver.get_window_size()
        num_moves = 0
        num_fails = 0

        while num_moves < num_mouse_moves + 1 and num_fails < num_mouse_moves:
            try:
                if num_moves == 0:  # move to the center of the screen
                    x = int(round(window_size["height"] / 2))
                    y = int(round(window_size["width"] / 2))
                    action = ActionChains(self.driver)
                    action.move_by_offset(x, y)
                    action.perform()
                else:  # move a random amount in some direction
                    move_max = prandom.randint(0, 200)
                    x = prandom.randint(-move_max, move_max)
                    y = prandom.randint(-move_max, move_max)

                    action = ActionChains(self.driver)
                    action.move_by_offset(x, y)
                    action.perform()
                num_moves += 1
            except (WebDriverException, MoveTargetOutOfBoundsException) as e:
                num_fails += 1
                # self.logger.error(e)
        self.logger.info("Moved mouse %s times (fails: %s)", num_moves, num_fails)

        # bot mitigation 2: scroll in random intervals down page
        self.scroll_down(prob_scroll=prob_scrolling)
        self.logger.info("Scrolled down")

        # bot mitigation 3: randomly wait so page visits happen with irregularity
        if max_sleep_seconds <= RANDOM_SLEEP_LOW:
            time.sleep(max_sleep_seconds)
        else:
            time.sleep(
                prandom.randrange(
                    min(RANDOM_SLEEP_LOW, max_sleep_seconds), max_sleep_seconds
                )
            )
        self.logger.info("Random sleep finished.")


class Chrome(CBConsentCrawlerBrowser):
    def __init__(
        self,
        seconds_before_processing_page: float,
        chrome_path: str,
        chromedriver_path: Path,
        chrome_profile_path: Path,
        logger: Logger,
        browser_id: int,
        use_temp: bool = True,
        intercept_network: bool = True,
        headless: bool = True,
        *args: Any,
        **kwargs: Any,
    ) -> None:
        """
        Creates a CBConsentCrawlerBrwoser using Chrome via the webdriver.

        Args:
            use_temp (bool, optional): If a temporary directory should be used for the profile data which will be altered. Defaults to True.
        """
        super().__init__(
            seconds_before_processing_page=seconds_before_processing_page,
            browser_id=browser_id,
            logger=logger,
        )
        self._requests: list[Any] = []
        self.use_temp = use_temp

        # By default we use a temporary directory to always have a fresh chrome profile
        if self.use_temp:
            rand_str = ''.join(prandom.SystemRandom().choice(string.ascii_uppercase + string.digits) for _ in range(6))
            self._temp_dir = tempfile.TemporaryDirectory(prefix="enfbots_", suffix=rand_str, ignore_cleanup_errors=True, delete=True)
            self.profile_path = Path(self._temp_dir.name) / "chrome_profile"

            # copy profile to the temporary directory
            shutil.copytree(
                chrome_profile_path,
                self.profile_path,
                ignore_dangling_symlinks=True,
            )
        else:
            self.profile_path = chrome_profile_path
        self.headless = headless

        self.chrome_path = Path(chrome_path)
        self.driver_path = chromedriver_path

    @property
    def requests(self) -> list[Any]:
        return self._requests

    def __enter__(self) -> Chrome:
        options = uc.ChromeOptions()

        # required in docker (no X11 context)
        # More info on flags: https://peter.sh/experiments/chromium-command-line-switches/
        # options.add_argument("--no-sandbox")

        # if len(self.languages) > 0:
        #     options.add_argument("--accept-lang=" + ",".join(self.languages))
        #     options.add_argument("--lang=" + ",".join(self.languages))
        #     logging.info("Preferring languages: %s", ",".join(self.languages))

        # just some options passing in to skip annoying popups
        options.add_argument("--no-first-run")
        options.add_argument("--no-service-autorun")
        options.add_argument("--password-store=basic")
        if self.proxy:
            options.add_argument(f"--proxy-server={self.proxy}")

        # Or use --shm-size=4G when starting docker container
        options.add_argument("--disable-dev-shm-usage")

        prefs = {
            "download_restrictions": 0,  # Allows the browser to download all content; https://chromeenterprise.google/policies/?policy=DownloadRestrictions
            "download.default_directory": self.temp_download_directory.name,
            "download.prompt_for_download": False,
            "download.directory_upgrade": True,
            "profile.default_content_settings.popups": False,
            "plugins.always_open_pdf_externally": True,
        }
        options.add_experimental_option("prefs", prefs)

        # For debugging
        # options.add_argument("--enable-logging")
        # options.add_argument("--v=1")

        options.headless = self.headless

        options.page_load_strategy = "normal"

        self.logger.info(
            "Instantiating chrome %s using %s with profile_path %s",
            self.chrome_path,
            self.driver_path,
            self.profile_path,
        )

        # Copy chromedriver to patchers directory
        Path(Patcher.data_path).mkdir(exist_ok=True)
        if not (Path(Patcher.data_path) / "chromedriver").exists():
            shutil.copy(self.driver_path, Patcher.data_path)

        self.driver = uc.Chrome(
            options=options,
            driver_executable_path=str(self.driver_path),
            browser_executable_path=str(self.chrome_path / "chrome"),
            headless=self.headless,
            version_main=126,
            user_data_dir=str(self.profile_path),
            enable_cdp_events=True,
            use_subprocess=True,
            user_multi_procs=True,
        )

        stealth(
            self.driver,
            languages=["en-US", "en"],
            vendor="Google Inc.",
            platform="Win32",
            webgl_vendor="Intel Inc.",
            renderer="Intel Iris OpenGL Engine",
            fix_hairline=True,
        )

        # Time to wait when calling driver.get
        self.driver.set_page_load_timeout(23)
        self.driver.set_script_timeout(25)
        self.driver.implicitly_wait(27)

        self.driver.add_cdp_listener(
            "Network.responseReceived", self._handle_cdp_response_received
        )

        return self

    def _handle_cdp_response_received(self, data: Any) -> None:
        """
        This function is analogous to _process_intercepted_request but is directly called
        from undetected-chromedriver instead of using node to communicate with the CDP endpoint.
        The javascript is still used for captcha solving.

        This handles the response and adds usefull information to self._load_status.
        """
        if data["method"] == "Network.responseReceived":
            url = data["params"]["response"]["url"]
            http_status = data["params"]["response"]["status"]

            if http_status == 404:
                self._load_status[url] = (
                    PageState.HTTP_ERROR
                )  # TODO : add pagestate HTTP_404?
            if 200 <= http_status < 300:
                self._load_status[url] = PageState.OK

    def _process_intercepted_request(self, data: Any) -> None:
        self.requests.append(data)
        url = URL.from_text(data["request"]["url"])
        response = data["response"]
        if url == self.last_loaded_url:
            error = response.get("error_reason")
            if error:
                self.logger.warning(
                    "Load of page %s was interrupted with status %s.", url, error
                )
                # Failed, Aborted, TimedOut, AccessDenied, ConnectionClosed, ConnectionReset,
                # ConnectionRefused, ConnectionAborted, ConnectionFailed, NameNotResolved,
                # InternetDisconnected, AddressUnreachable, BlockedByClient, BlockedByResponse
                if error == "NameNotResolved":
                    self._load_status[str(url)] = PageState.DNS_ERROR
                elif error == "TimedOut":
                    self._load_status[str(url)] = PageState.TIMEOUT
                else:
                    self._load_status[str(url)] = PageState.TCP_ERROR
            else:
                headers = response["headers"]
                status_code = response["http_status"]
                location = headers.get("Location")
                content_type = headers.get("Content-Type")
                if 300 <= status_code < 400 and location:
                    loc = URL.from_text(location)
                    if not loc.absolute:
                        loc = url.click(loc)
                    self.last_loaded_url = loc
                    self._load_status[str(url)] = PageState.REDIRECT
                elif status_code >= 400:
                    self.logger.error(
                        "On %s: HTTP status_code %s and response: %s",
                        url,
                        status_code,
                        response,
                    )
                    self.logger.error("Data: %s", data)
                    self._load_status[str(url)] = PageState.HTTP_ERROR
                else:
                    self._load_status[str(url)] = PageState.OK
                    self.logger.debug(
                        "Fetched the page %s with status %s and content type %s",
                        url,
                        status_code,
                        content_type,
                    )

    def __exit__(
        self,
        exc_type: type[BaseException] | None,
        exc_val: BaseException | None,
        exc_tb: TracebackType | None,
    ) -> None:

        super().__exit__(exc_type, exc_val, exc_tb)

        browser_pid = self.driver.browser_pid

        self.logger.info("browser_pid: %s", self.driver.browser_pid)

        # Ensure chrome is no longer running before removing _temp_dir

        if browser_pid is not None:
            p = Process(browser_pid)
            self.logger.info("Parent PID: %s", p.ppid())

            i = 0
            while p.is_running():
                self.logger.info("Chromium browser is still running")
                try:
                    p.wait(timeout=10)
                except TimeoutExpired:
                    pass

                if i > 5:
                    try:
                        self.logger.info("Sending kill/term")
                        p.kill()
                        p.wait(timeout=10)
                        p.terminate()
                    except NoSuchProcess:
                        break
                    except TimeoutExpired:
                        pass
                if i > 10:
                    self.logger.error("Unable to kill chromium")
                    raise Exception("Unable to kill browser")
                i+= 1
            # Chrome is gone

            if self.driver.service and self.driver.service.process and self.driver.service.process.pid:
                chromedriver_pid = self.driver.service.process.pid
                self.logger.info("chromedriver PID: %s", chromedriver_pid)

                try:
                    self.logger.info("chromedriver PPID: %s", Process(chromedriver_pid).ppid())

                    if isinstance(chromedriver_pid, int):
                        chromedriver = Process(chromedriver_pid)

                        self.logger.info("Sending SIGKILL to chromedriver")
                        chromedriver.kill()

                        self.logger.info("waiting")
                        chromedriver.wait(10)

                        self.logger.info("terminating check")
                        if Process(chromedriver_pid).is_running():
                            self.logger.info("Chromium is still running. Sending SIGTERM")
                            chromedriver.terminate()
                except NoSuchProcess:
                    pass
                except TimeoutExpired:
                    self.logger.error("Unable to kill chromedriver")

        # noinspection PyBroadException
        try:
            if self.use_temp:
                self._temp_dir.cleanup()
            if self.temp_download_directory:
                self.temp_download_directory.cleanup()
        except Exception as e:
            self.logger.warning(
                "Unable to remove the temporary directory %s", e, stack_info=False
            )

