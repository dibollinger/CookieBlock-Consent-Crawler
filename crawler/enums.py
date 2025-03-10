from enum import Enum, IntEnum
from typing import NamedTuple


class PageState(Enum):
    """
    Enum to represent state of index page
    """

    # When the domain name cannot be resolved
    DNS_ERROR = 15

    # Everything OK
    OK = 0
    REDIRECT = 2
    TIMEOUT = 3
    BAD_CONTENT_TYPE = 11
    HTTP_ERROR = 12
    TCP_ERROR = 13
    UNKNOWN_ERROR = 14
    WRONG_URL = 15


class CookieTuple(NamedTuple):
    name: str
    value: str
    path: str
    domain: str
    secure: bool
    http_only: bool
    expiry: int
    same_site: str


class CookieCategory(IntEnum):
    """ ICC categories """
    UNRECOGNIZED = -1  # A class that is not unclassified but which the crawler cannot identify.
    ESSENTIAL = 0      # Cookie necessary for the site to function.
    FUNCTIONAL = 1     # Functional and Preferences. Change website options etc.
    ANALYTICAL = 2     # Includes performance and statistics.
    ADVERTISING = 3    # Cookies for Advertising/Tracking/Social Media/Marketing/Personal Data Sale etc.
    UNCLASSIFIED = 4   # Cookies that have been explicitly labelled as unclassified
    SOCIAL_MEDIA = 5   # Not used for training, but still interesting to know

class CrawlerType(IntEnum):
    """ Identify the CMP crawler type """
    FAILED = -1
    COOKIEBOT = 0
    ONETRUST = 1
    TERMLY = 2


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
