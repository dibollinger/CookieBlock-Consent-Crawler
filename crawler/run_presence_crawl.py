#!/usr/bin/python3
"""
CMP Presence Crawler
Copyright (c) 2021-2022  Dino Bollinger, ETH Zürich, Information Security Group
Licensed under the GPLv3, see included LICENSE file.
-----------------------------------------
Fast presence crawl -- does not retrieve cookie data nor CMP labels, but rather checks whether
the website is reachable, and whether a supported CMP exists on the given domain.

This is done using the requests library, with simple GET requests.
It can be executed to reduce the number of domains that need to be targeted with browser instances,
and thus reduce the time required to crawl all domains.

Writes the filtered domains to disk, into the subfolder "./filtered_domains/".

Currently supported CMPs are:
  - Cookiebot
  - OneTrust (includes: Cookielaw, OptAnon, Cookiepro)
  - Termly
-----------------------------------
Usage:
    run_presence_crawl.py (--numthreads <NUM>) (--url <u> | --pkl <fpkl> | --file <fpath> | --csv <csvpath>)... [--batches <BCOUNT>]

Options:
    -n --numthreads <NUM>       Number of processes to run in parallel.
    -b --batches <BCOUNT>       Number of batches to split the input into. More batches lessens memory impact. [Default: 1]
    -u --url <u>                Domain string to check for reachability.
    -p --pkl <fpkl>             Path to pickled domains.
    -f --file <fpath>           Path to file containing one domain per line.
    -c --csv <csvpath>          Path to csv containing domains in second column. Separator is ",".
    -h --help                   Display this help message.
"""

import requests
import requests.exceptions as rexcepts
from docopt import docopt

from pebble import ProcessPool
from pebble.common import ProcessExpired

import logging
import traceback
import time
import re
import os
from enum import IntEnum
from urllib.parse import urlparse
from typing import List, Tuple, Optional, Dict, Any
from concurrent.futures import TimeoutError as CTimeoutError

from shared_utils import retrieve_cmdline_urls

logger = logging.getLogger("presence-crawl")

# Cookiebot CDN domain
cb_base_pat = re.compile("https://consent\\.cookiebot\\.(com|eu)/")
cb_script_name = re.compile("cb-main\\.js")  # for websites the load CB dynamically

# OneTrust CDNs
onetrust_pattern_A = re.compile("(https://cdn-apac\\.onetrust\\.com)")
onetrust_pattern_B = re.compile("(https://cdn-ukwest\\.onetrust\\.com)")
cookielaw_base_pattern = re.compile("(https://cdn\\.cookielaw\\.org)")
cmp_cookielaw_base_pattern = re.compile("(https://cmp-cdn\\.cookielaw\\.org)")
optanon_base_pattern = re.compile("(https://optanon\\.blob\\.core\\.windows\\.net)")
cookiecdn_base_pattern = re.compile("(https://cookie-cdn\\.cookiepro\\.com)")
cookiepro_base_pattern = re.compile("(https://cookiepro\\.blob\\.core\\.windows\\.net)")

# Tuple of the above, for iteration
onetrust_patterns: Tuple = (onetrust_pattern_A, onetrust_pattern_B, cmp_cookielaw_base_pattern,
                            cookielaw_base_pattern, optanon_base_pattern,
                            cookiecdn_base_pattern, cookiepro_base_pattern)

# Termly CDN domain
termly_url_pattern = re.compile("https://app\\.termly\\.io/")

# timeout in seconds
connect_timeout = 60  # how long to connect at most
load_timeout = 60     # how long to wait for website content
parse_timeout = 120

# Toggle for checking for CMPs. Set this to "False" to only perform reachability check.
check_cmp = True

# output additional reports for connection errors into the log file (not stderr though)
# this is slow if True
debug_mode = False


class QuickCrawlResult(IntEnum):
    # General results
    CRAWL_TIMEOUT = -1
    OK = 0
    CONNECT_FAIL = 1
    HTTP_ERROR = 2
    BOT = 3
    # CMP detection results -- replace OK if cmp_check is enabled
    NOCMP = 4
    COOKIEBOT = 5
    ONETRUST = 6
    TERMLY = 7


def check_cookiebot_presence(resp: requests.Response) -> bool:
    """ Check whether Cookiebot is referenced on the website """
    psource = resp.text
    matchobj1 = cb_base_pat.search(psource, re.IGNORECASE)
    matchobj2 = cb_script_name.search(psource, re.IGNORECASE)
    return matchobj1 is not None or matchobj2 is not None


def check_onetrust_presence(resp: requests.Response) -> bool:
    """ Check whether a OneTrust pattern is referenced on the website """
    psource = resp.text
    found = False
    ot_iters = iter(onetrust_patterns)
    try:
        while not found:
            pattern = next(ot_iters)
            found = pattern.search(psource, re.IGNORECASE) is not None
    except StopIteration:
        found = False

    return found


def check_termly_presence(resp: requests.Response) -> bool:
    """ Check whether a Termly pattern is referenced on the website """
    psource = resp.text
    matchobj = termly_url_pattern.search(psource, re.IGNORECASE)
    return matchobj is not None


def run_reachability_check(input_domain: str) -> Tuple[Optional[str], int]:
    """
    Try to retrieve the webpage at the given domain, which need not be
    a valid HTTP schema URL. Instead, the script assumes this to be a
    website domain, and will attempt different HTTP schema variants to connect.

    Any connection, SSL error or HTTP error code excluding 403 and 406
    will result in the URL being filtered out.

    @param input_domain: domain to attempt to connect to, via HTTPS/HTTP
    @return: Tuple of two values:
            1. final URL the browser ended up at, after redirects
            2. Status of the connection.
               Either OK, HTTP Error, Connection Failure, or Bot Response
    """
    # If URL already has the HTTP schema, use that.
    # If not, try 3 different potential schemes
    component_tuple = urlparse(input_domain)
    if component_tuple[0] == "http" or component_tuple[0] == "https":
        url_suffix = input_domain
        prefix_list = [""] # empty prefix
    else:
        url_suffix = re.sub("^www\\.", "", input_domain)
        prefix_list = ["https://www.", "https://", "http://"]

    final_url: Optional[str] = None

    r = None
    # we try prefixes until we don't get a connection error, or we run out of prefixes
    for prefix in prefix_list:
        completed_url = prefix + url_suffix

        try:
            # fake chrome user agent
            headers = {'User-Agent': "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/70.0.3538.77 Safari/537.36"}
            r = requests.get(completed_url, timeout=(connect_timeout, load_timeout), headers=headers)
        except (rexcepts.TooManyRedirects, rexcepts.SSLError,
                rexcepts.URLRequired, rexcepts.MissingSchema) as ex:
            if debug_mode:
                logger.debug(f"'{type(ex)}' exception occurred while trying to access: '{completed_url}'")
            return input_domain, QuickCrawlResult.CONNECT_FAIL
        except (rexcepts.ConnectionError, rexcepts.Timeout) as ex:
            # in this case, the URL may have been wrong, retry with different prefix
            if debug_mode:
                logger.debug(f"'{type(ex)}' exception occurred while trying to access: '{completed_url}'")
            continue
        except Exception as ex:
            if debug_mode:
                logger.error(f"Unexpected '{type(ex)}' exception occurred while trying to access: '{completed_url}'")
                logger.debug(traceback.format_exc())
            return input_domain, QuickCrawlResult.CONNECT_FAIL


        if r is None:
            if debug_mode:
                logger.debug(f"Prefix: '{prefix}' failed due to connection error. Trying next URL.")
            continue
        elif not r.ok:
            # Error 403 and 406 are common responses with bot detection
            # Assume this is a bot blocker response, and return completed url
            # We can later bypass this using Selenium
            if r.status_code == 403 or r.status_code == 406:
                if debug_mode:
                    logger.debug(f"Received status code: {r.status_code} on '{completed_url}' -- Reason: {r.reason}")
                return completed_url, QuickCrawlResult.BOT
            else:
                # If this occurs, the URL was likely correct, but site is broken, so we abort
                if debug_mode:
                    logger.debug(f"Received status code: {r.status_code} on '{completed_url}' -- Reason: {r.reason}")
                return completed_url, QuickCrawlResult.HTTP_ERROR
        else:
            final_url = r.url
            break

    # Check for the presence of a Consent Management Provider
    if final_url is not None and check_cmp:
        # Check Cookiebot
        found_cmp: bool = check_cookiebot_presence(r)
        if found_cmp:
            return final_url, QuickCrawlResult.COOKIEBOT

        # Check OneTrust
        found_cmp = check_onetrust_presence(r)
        if found_cmp:
            return final_url, QuickCrawlResult.ONETRUST

        # Check Termly
        found_cmp = check_termly_presence(r)
        if found_cmp:
            return final_url, QuickCrawlResult.TERMLY

        return final_url, QuickCrawlResult.NOCMP

    elif final_url is not None:
        return final_url, QuickCrawlResult.OK

    else:
        return input_domain, QuickCrawlResult.CONNECT_FAIL


def setupLogger(logdir:str) -> None:
    """
    Set up the logger instance. INFO output to stderr, DEBUG output to log file.
    :param logdir: Directory for the log file.
    """
    os.makedirs(logdir, exist_ok=True)
    logger.setLevel(logging.DEBUG)
    logfile = os.path.join(logdir, "presence_crawl.log")

    # log to stderr
    ch = logging.StreamHandler()
    ch.setLevel(logging.INFO)
    logger.addHandler(ch)

    # log file output
    fh = logging.FileHandler(filename=logfile, mode="w", encoding="utf8")
    fh.setLevel(logging.DEBUG)
    logger.addHandler(fh)


def open_filedescriptors(outdir: str) -> Dict[int, Any]:
    """
    Open all output files we need, and create a dictionary associating the status code
    to the proper file descriptor.
    @param outdir: Output directory for the files
    @return: dictionary mapping status code to file descriptor
    """
    fd_dict = dict()

    fd_dict[QuickCrawlResult.CRAWL_TIMEOUT] = open(os.path.join(outdir, "crawler_timeouts.txt"), 'w')
    fd_dict[QuickCrawlResult.CONNECT_FAIL] = open(os.path.join(outdir, "failed_urls.txt"), 'w')
    fd_dict[QuickCrawlResult.HTTP_ERROR] = open(os.path.join(outdir, "http_responses.txt"), 'w')
    fd_dict[QuickCrawlResult.BOT] = open(os.path.join(outdir, "bot_responses.txt"), 'w')

    if check_cmp:
        fd_dict[QuickCrawlResult.NOCMP] = open(os.path.join(outdir, "nocmp_responses.txt"), 'w')
        fd_dict[QuickCrawlResult.COOKIEBOT] = open(os.path.join(outdir, "cookiebot_responses.txt"), 'w')
        fd_dict[QuickCrawlResult.ONETRUST] = open(os.path.join(outdir, "onetrust_responses.txt"), 'w')
        fd_dict[QuickCrawlResult.TERMLY] = open(os.path.join(outdir, "termly_responses.txt"), 'w')
    else:
        fd_dict[QuickCrawlResult.OK] = open(os.path.join(outdir, "ok_responses.txt"), 'w')

    return fd_dict


def flush_filedescriptors(fd_dict: Dict[int, Any]) -> None:
    """
    Flush the filedescriptors of the dictionary, writing data to disk.
    @param fd_dict: Values contain filedescriptors
    """
    for fd in fd_dict.values():
        fd.flush()


def close_filedescriptors(fd_dict: Dict[int, Any]) -> None:
    """
    Close the file descriptors of the dictionary.
    @param fd_dict: Values contain filedescriptors
    """
    for fd in fd_dict.values():
        fd.close()


def main():
    """
    In a multi-processing approach, try to determine the actual URL from a basic
    domain string, and check for reachability of the site.
    Can also check for Consent Management Platform, but this may be inaccurate.
    """
    argv = None

    ## Test arguments, uncomment to try the crawler
    # argv = ["-u", "https://purplemath.com/", "-u", "https://gamefly.com/", "-n", "2"]
    # argv = ["-n", "5", "-u", "https://www.metabomb.net/", "-u", "https://www.maytag.com/", "-u", "https://www.aveda.com/", "-u", "https://www.equipmenttrader.com/", "-u", "https://www.tiffany.com/"]

    cargs = docopt(__doc__, argv=argv)
    setupLogger(".")

    sites: List[str] = list(retrieve_cmdline_urls(cargs))
    num_threads = int(cargs["--numthreads"])

    logger.info("Start fast crawl")
    startt = time.time()

    # split generator computation
    num_sites = len(sites)
    splits = int(cargs["--batches"])
    chunksize = num_sites // splits
    chunks = (sites[i:min(i+chunksize, num_sites)] for i in range(0, num_sites, chunksize))

    outdir = "./filtered_domains"
    os.makedirs(outdir, exist_ok=True)
    fd_dict = open_filedescriptors(outdir)

    # current batch
    c_batch = 1

    finished_domains = set()

    try:
        with ProcessPool(num_threads) as pool:
            crawled_site_batch: List[Tuple]
            for c in chunks:
                cr_count = 0
                c_chunk_length = len(c)
                output_interval = max(c_chunk_length // 1000, 125)

                future = pool.map(run_reachability_check, c, timeout=parse_timeout)
                it = future.result()
                try:
                    periodic_flush_start = time.time()
                    while True:
                        try:
                            final_domain, status_code = next(it)
                        except (CTimeoutError, ProcessExpired) as ex:
                            if type(ex) is CTimeoutError:
                                logger.error(f"Crawl {cr_count} for domain '{c[cr_count]}' timed out.")
                            else:
                                logger.error(f"Process {cr_count} crashed for domain '{c[cr_count]}' -- message: {ex}")
                            fd_dict[QuickCrawlResult.CRAWL_TIMEOUT].write(c[cr_count] + "\n")
                            finished_domains.add(c[cr_count])
                            continue

                        # write to proper file
                        fd_dict[status_code].write(final_domain + "\n")

                        # output progress counter
                        if cr_count % output_interval == 0:
                            # also flush fds if at least 2 minutes passed
                            if time.time() - periodic_flush_start >= 120:
                                flush_filedescriptors(fd_dict)
                                periodic_flush_start = time.time()
                            print(f"Completed: {cr_count}/{c_chunk_length}        ", end="\r")

                        # add input to finished domain set
                        finished_domains.add(c[cr_count])
                        cr_count += 1
                except StopIteration:
                    print("", end="\r")
                    logger.info(f"Completed batch {c_batch} with {cr_count} sites -- {splits - c_batch} batches remain")
                    flush_filedescriptors(fd_dict)

                c_batch += 1
    except KeyboardInterrupt:
        remaining_domains = set(sites) - finished_domains
        rem_outpath = os.path.join(outdir, "uncrawled_domains.txt")
        with open(rem_outpath, 'w') as fd:
            for r in remaining_domains:
                fd.write(r + "\n")
        logger.info("Output uncrawled domains to : " + rem_outpath)

    close_filedescriptors(fd_dict)
    elapsed = time.time() - startt
    logger.info(f"Crawl time: {elapsed:.2f}s")

    return 0


if __name__ == "__main__":
    exit(main())
