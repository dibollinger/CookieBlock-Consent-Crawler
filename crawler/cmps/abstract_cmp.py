from __future__ import annotations

from abc import ABC, abstractmethod
from typing import Tuple, List, TYPE_CHECKING

from logging import Logger

from selenium.webdriver.remote.webdriver import WebDriver

from crawler.enums import CrawlState
from crawler.database import SiteVisit, ConsentData

if TYPE_CHECKING:
    from crawler.browser import CBConsentCrawlerBrowser

class AbstractCMP(ABC):

    def __init__(self, logger: Logger, name: str, browser_id: int):
        """
        Abstracts a Content Management Platform detector and scraper.

        """
        self.logger = logger
        self.name = name
        self.browser_id = browser_id

    @abstractmethod
    def check_presence(self, webdriver: WebDriver) -> bool:
        ...

    @abstractmethod
    def scrape(self, url: str, visit: SiteVisit, webdriver: CBConsentCrawlerBrowser) -> Tuple[CrawlState, str, List[ConsentData]]:
        ...