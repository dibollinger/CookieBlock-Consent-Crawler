#!/usr/bin/python3
# Author: Dino Bollinger
# LICENSE: GPLv3
"""
OpenWPM-based Cookie-Consent Category Scraper
-----------------------------------------
Uses the OpenWPM framework 0.12.0 to scrape cookie consent category labels from websites on the internet.
Simultaneously uses browser instrumentation to collect cookie data received through HTTP requests and Javascript calls.

Works best if connecting from within an EU member state, either natively or via VPN.

Currently supports collecting data from the following CMPs:
- Cookiebot
- OneTrust (including OptAnon, CookiePro and CookieLaw domains)
- Termly
----------------------------------------
Usage:
    run_consent_crawl.py (cookiebot|onetrust|termly|all|none) (--num_browsers <NUM>) (--url <u> | --pkl <fpkl> | --file <fpath> | --csv <csvpath> )... [--use_db <DB_NAME>]
    run_consent_crawl.py --help

Options:
    -n --num_browsers <NUM>   Number of browsers to use in parallel
    -d --use_db <DB_NAME>     Use specified database file to add rows to.
    -u --url <u>              URL string to crawl
    -p --pkl <fpkl>           File path to pickled list of urls to parse
    -f --file <fpath>         Path to file containing one URL per line
    -c --csv <csvpath>        Path to csv containing domains in second column. Separator is ",".
    -h --help                 Display this help screen
"""

from docopt import docopt
from openwpm.automation import CommandSequence, TaskManager
from shared_utils import retrieve_cmdline_urls, filter_bad_urls_and_sort
from pyvirtualdisplay import Display

import sys
import os
from datetime import datetime
from typing import Set, Dict, List

# counter for completed command sequences
completed: int = 0
interrupted: int = 0


def setup_browser_config(browser_param: Dict) -> None:
    """
    Set up configuration for the given browser dictionary.
    The general idea is to have the browser be as permissive as possible towards cookies,
    so we can collect as many as possible. This includes enabling the "Consent-O-Matic" extension.
    @param browser_param: browser parameter dictionary to alter
    """
    # only option available in OpenWPM 0.12.0
    browser_param["browser"] = "firefox"

    # instrumentation options: we only need cookie data info, other extensions are disabled
    browser_param["extension_enabled"] = True
    browser_param["cookie_instrument"] = True
    browser_param["js_instrument"] = False
    browser_param["http_instrument"] = False
    browser_param["navigation_instrument"] = False
    browser_param["save_content"] = False
    browser_param["callstack_instrument"] = False

    # tar file must be named "profile.tar.gz"
    ## Firefox profile dated 24. November 2020. May need to be replaced in the future.
    ## Comes with Consent-O-Matic preinstalled and preconfigured.
    browser_param['profile_tar'] = "./crawler_profile/"

    # randomizes screen resolution and user agent string, only if browser profile not already set
    # since we have a fixed profile, we don't need this
    browser_param['random_attributes'] = False

    # place cursor on random positions, and have random page switch delay
    browser_param['bot_mitigation'] = True

    # xvfb does not clean up sessions, causes a small but significant memory
    # leak each time a site is crawled, hence we use headless mode instead
    # browser_param['display_mode'] = "headless"

    # privacy options (as lax as possible)
    browser_param['donottrack'] = False
    browser_param["tp_cookies"] = "always"
    browser_param["ghostery"] = False
    browser_param["https-everywhere"] = False
    browser_param["adblock-plus"] = False
    browser_param["ublock-origin"] = False
    browser_param["disconnect"] = False
    browser_param["tracking-protection"] = False

    # automatically accept GDPR consent notices in order to load all cookies
    # Note: this extension is also included in the profile as a safety measure
    browser_param["consentomatic"] = True

    # additional browser parameters
    browser_param['prefs'] = {"xpinstall.signatures.required": False,
                              "privacy.resistFingerprinting": False,
                              "privacy.trackingprotection.pbmode.enabled": False,
                              "privacy.trackingprotection.enabled": False,
                              "network.cookie.maxNumber": 10000,
                              "network.cookie.maxPerHost": 10000,
                              "network.cookie.quotaPerHost": 10000,
                              "privacy.socialtracking.block_cookies.enabled": False,
                              "network.cookie.thirdparty.sessionOnly": False,
                              "network.cookie.sameSite.laxByDefault": True
                              }


def main():
    argv = None

    ## Set of test arguments, uncomment to try the crawler
    # argv = ["cookiebot", "-u", "https://purplemath.com/", "-u", "https://gamefly.com/", "-n", "2"]
    # argv = ["onetrust", "-n", "5", "-u", "https://www.metabomb.net/", "-u", "https://www.maytag.com/", "-u", "https://www.aveda.com/", "-u", "https://www.equipmenttrader.com/", "-u", "https://www.tiffany.com/"]
    # argv = ["all", "-n", "3", "-u", "https://www.equipmenttrader.com/"]

    # parse usage docstring and get arguments
    cargs = docopt(__doc__, argv=argv)
    sites: Set[str] = retrieve_cmdline_urls(cargs)
    filtered_sites: List[str] = filter_bad_urls_and_sort(sites)

    # safety check
    if len(filtered_sites) == 0:
        print("Website crawl list is empty. Aborting...", file=sys.stderr)
        return 1

    # set up OpenWPM
    num_browsers = int(cargs["--num_browsers"])
    manager_params, browser_params = TaskManager.load_default_params(num_browsers)
    for i in range(num_browsers):
        setup_browser_config(browser_params[i])

    # define output directories
    manager_params["output_format"] = "local"
    manager_params["log_directory"] = "./logs/"

    # define log file and database paths
    now = datetime.now().strftime('%Y%m%d_%H%M%S')
    manager_params["log_file"] = f"crawl_{now}.log"

    # Database filename
    if cargs["--use_db"]:
        db_path, db_fn = os.path.split(cargs["--use_db"])
        manager_params["data_directory"] = db_path
        manager_params["database_name"] = db_fn
    else:
        manager_params["data_directory"] = "./collected_data/"
        manager_params["database_name"] = f"crawl_data_{now}.sqlite"

    # activate pyvirtualdisplay
    disp = Display(backend="xvfb")
    disp.start()

    # prevent shutdown due to failures
    manager_params["failure_limit"] = 16384

    # setting up the TaskManager creates the logger. then we can retrieve a sub-logger, and set it up.
    manager = TaskManager.TaskManager(manager_params, browser_params)
    logger = manager.logger

    total_commands = len(filtered_sites)

    # callback, executed once command sequence completes
    def progress_report(success: bool):
        global completed, interrupted
        if success:
            completed += 1
            logger.info("Command sequence completed.")
        else:
            interrupted += 1
            logger.warning("Command sequence has been interrupted!")
        logger.info("%i/%i completed, %i/%i interrupted" % (completed, total_commands, interrupted, total_commands))


    # crawl each site
    # Can alter some parameters here if needed
    for j, site in enumerate(filtered_sites):
        command_sequence = CommandSequence.CommandSequence(site, site_rank=j, reset=True,
                                                           blocking=False, callback=progress_report)

        if cargs["all"]:
            # CMP crawl and Browse functions consolidated into the same command
            # this is done such that browse can be aborted early if CMP is not found
            command_sequence.run_consent_crawl(num_links=10, sleep=1.0, timeout=180,
                                               abort_browse_early=True, subpage_timeout=10.0)
        else:
            # legacy variants of the consent crawler commands. Only a single CMP active.
            if cargs["cookiebot"]:
                command_sequence.try_extract_cookiebot_data(sleep=1.0, timeout=60)
            elif cargs["onetrust"]:
                command_sequence.try_extract_onetrust_data(sleep=1.0, timeout=60)
            elif cargs["termly"]:
                command_sequence.try_extract_termly_data(sleep=1.0, timeout=60)

            # browse the page to retrieve additional cookies
            command_sequence.browse(num_links=20, sleep=1.0, timeout=120, subpage_timeout=10.0)


        # Execute the two commands
        manager.execute_command_sequence(command_sequence)

    # shuts down the browsers and waits for the data to finish logging
    manager.close()
    disp.stop()

    return 0


if __name__ == "__main__":
    exit(main())
