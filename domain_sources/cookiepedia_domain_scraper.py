# Author: Dino Bollinger
# LICENSE: MIT
"""
Utilizes Cookiepedia's database to find potential domains that make use of the Cookiebot
and OneTrust CMPs. We do this by crawling the domains which Cookiepedia lists as having
had the cookies "CookieConsent" and "OptanonConsent", which are indicative of the Cookiebot
resp. OneTrust CMP being present on the website.

Usage:
    cookiepedia_domain_scraper.py (cookiebot|onetrust) (--num_threads <NT>)

Options:
    cookiepedia             Extract potential candidates for the Cookiebot CMP
    onetrust                Extract potential candidates for the OneTrust CMP
    -n --num_threads <NT>   Number of parallel threads to crawl with.
    -h                      Display this help.
"""

import logging
import re
import requests
import requests.exceptions as rexcepts
import traceback

from pebble import ProcessPool
from pebble.common import ProcessExpired
from concurrent.futures import TimeoutError as CTimeoutError

from bs4 import BeautifulSoup
from docopt import docopt
from typing import Optional, Any, Set, Tuple

# Cookiebot and OneTrust cookie pages
# note: must end with slash
cp_cookiebot = "https://cookiepedia.co.uk/cookies/CookieConsent/"
cp_onetrust = "https://cookiepedia.co.uk/cookies/OptanonConsent/"
stop_page = "Sorry, your search returned no matches"

# timeout after which to kill a subprocess (for some reason cookiepedia can be terribly slow)
parse_timeout = 120

# logger name
logger = logging.getLogger("main")


def simple_get(url) -> Optional[requests.Response]:
    """
    Perform a simple GET requests using the python requests library and handle errors.
    @param url: url to send the GET request to
    @return: Response from the webserver, or None
    """
    try:
        # fake chrome user agent, required or else Cookiepedia won't answer at all
        headers = {'User-Agent': "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/70.0.3538.77 Safari/537.36"}
        r = requests.get(url, timeout=(40, 40), headers=headers)
        return r
    except (rexcepts.TooManyRedirects, rexcepts.SSLError,
            rexcepts.URLRequired, rexcepts.MissingSchema) as ex:
        logger.error(f"'{type(ex)}' exception occurred while trying to access: '{url}")
        return None
    except (rexcepts.ConnectionError, rexcepts.Timeout) as ex:
        logger.error(f"'{type(ex)}' exception occurred while trying to access: '{url}'")
        return None
    except Exception as ex:
        logger.error(f"Unexpected '{type(ex)}' exception occurred while trying to access: '{url}'")
        logger.error(traceback.format_exc())
        return None


def crawl_cookiepedia_page(target_url) -> Tuple[Set[str], int]:
    """
    Given a cookiepedia URL, attempts to extract listed domains from the page.
    @param target_url: Cookiepedia path
    @return: (set of domains, return status)
             status == -2  --> Could not connect
             status == -1  --> Page not found
             status == 0  --> Retrieved domains
             status == 1  --> 0 domains extracted
    """
    extracted_domains = set()

    r = simple_get(target_url)
    if r is None:
        return extracted_domains, -2

    soup = BeautifulSoup(r.text, 'html.parser')

    h2_tags = soup.find_all("h2")
    for h2 in h2_tags:
        inner_text = h2.get_text()
        if re.match(stop_page, inner_text):
            return extracted_domains, -1

    found_count: int = 0
    a_tags = soup.find_all('a')
    for a in a_tags:
        linktext = a.get('href')
        if linktext is None:
            continue
        elif re.match("/cookie/[0-9]*", linktext):
            potential_domain = a.get_text()
            extracted_domains.add(potential_domain)
            found_count += 1

    if len(extracted_domains) == 0:
        return extracted_domains, 1

    return extracted_domains, 0


def setup_logger() -> None:
    """
    Set up the logger instance. INFO to stderr.
    """
    logger.setLevel(logging.DEBUG)
    ch = logging.StreamHandler()
    ch.setLevel(logging.INFO)
    logger.addHandler(ch)


def main() -> int:
    """
    Run the extraction using a parallel process pool.
    """
    argv = None
    cargs = docopt(__doc__, argv=argv)
    setup_logger()

    # Storage for all domains, using a set to prune duplicates
    extracted_domains = set()

    # Which CMP to crawl Cookiepedia for
    if cargs["cookiebot"]:
        target_url = cp_cookiebot
        logger.info("Started crawl for Cookiebot URLs")
    elif cargs["onetrust"]:
        target_url = cp_onetrust
        logger.info("Started crawl for OneTrust URLs")
    else:
        raise ValueError("Invalid CMP Type")

    # Batch size is currently always same as number of threads.
    num_threads = int(cargs["--num_threads"])
    batch_size = num_threads

    # Set to false as soon as the first "Not Found" page occurs
    not_finished: bool = True

    # some counters etc.
    curr_page = 0
    batch_counter = 0
    failed_pages = []
    try:
        while not_finished:
            # Each chunk is crawled fully in parallel.
            # As soon as a chunk shows a single "not found" response, the crawl will be stopped.
            chunk = [target_url + str(i) for i in range(batch_counter * batch_size, (batch_counter + 1) * batch_size)]
            with ProcessPool(num_threads) as pool:
                future = pool.map(crawl_cookiepedia_page, chunk, timeout=parse_timeout)
                it = future.result()
                try:
                    while True:
                        try:
                            result_set, status = next(it)
                            # None result indicates the last page has been reached, in this case, do not try next batch
                            if status == -2:
                                logger.warning(f"Connection error when trying to access page {curr_page}")
                                failed_pages.append(curr_page)
                            elif status == -1:
                                logger.warning(f"End of list has been reached at {curr_page}")
                                not_finished = False
                                break
                            elif status == 1:
                                logger.warning(f"Connection established for page {curr_page}, but no domains could be extracted!")
                            else:
                                extracted_domains.update(result_set)
                        except (CTimeoutError, ProcessExpired) as ex:
                            if type(ex) is CTimeoutError:
                                logger.error(f"Page {curr_page} timed out.")
                            else:
                                logger.error(f"Page {curr_page} experienced crash -- message: {ex}")
                                logger.debug(traceback.format_exc())
                            failed_pages.append(curr_page)
                        curr_page += 1
                except StopIteration:
                    logger.info(f"Completed batch {batch_counter+1}, read {curr_page} pages")
            batch_counter += 1
        logger.info(f"Search ended on page {curr_page}")
    except KeyboardInterrupt:
        logger.info("Keyboard interrupt detected -- outputting current domains")

    logger.info(f"Number of unique domains found: {len(extracted_domains)}")

    if cargs["cookiebot"]:
        outfile = "cookiepedia_cookiebot_domains.txt"
    elif cargs["onetrust"]:
        outfile = "cookiepedia_onetrust_domains.txt"
    else:
        raise ValueError("Invalid CMP Type")

    logger.info(f"pages that could not be crawl: {failed_pages}")

    with open(outfile, "w") as fd:
        for d in sorted(extracted_domains):
            fd.write(d + "\n")

    logger.info(f"Extracted domains written to '{outfile}'")

    return 0


if __name__ == "__main__":
    exit(main())
