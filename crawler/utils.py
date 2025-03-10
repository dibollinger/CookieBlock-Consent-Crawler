import logging
from logging import Logger
import re
import sys
import traceback
import requests
import requests.exceptions
from typing import Tuple, Optional, Dict, Any

from selenium.webdriver.remote.webdriver import WebDriver
from selenium.common.exceptions import TimeoutException

from tldextract import tldextract

from crawler.enums import CrawlState

# unique identifier pattern
uuid_pattern = re.compile(
    r"[0-9a-fA-F]{8}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{12}"
)


def set_log_formatter(logger: Logger, fmt: str, date_format: str) -> None:
    """
    Sets the given format for the root logger and all its handlers.
    The handlers may be to a file or to console. It also ensures that
    at least one console handler exists.
    """
    log_formatter = logging.Formatter(
        fmt=fmt,
        datefmt=date_format,
    )
    # Set the log_formatter from above for all and ensure
    # that at lest one handler is present
    for handler in logger.handlers:
        handler.setFormatter(log_formatter)


def is_on_same_domain(u1: str, u2: str) -> bool:
    extract1 = tldextract.extract(u1)
    extract2 = tldextract.extract(u2)
    return extract1.domain == extract2.domain

