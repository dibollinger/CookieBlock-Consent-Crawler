from __future__ import annotations

import argparse
import os
import sys
import re
from itertools import repeat
from logging import Logger
from typing import List, Tuple, Dict, cast
import logging
from datetime import datetime
from pathlib import Path
from importlib.metadata import version
import time
import traceback
import tarfile
import shutil
import random
import json
import psutil
from urllib.parse import urlparse

from tqdm import tqdm
from multiprocessing import Process
from psutil import TimeoutExpired
from pebble import ProcessPool
from selenium.common.exceptions import WebDriverException
from sqlalchemy import select
from sqlalchemy.orm import joinedload
from hyperlink import URL
import urllib3

from crawler.browser import Chrome
from crawler.database import (
    initialize_base_db,
    SiteVisit,
    SessionLocal,
    start_task,
    Crawl,
    register_browser_config,
    ConsentData,
    ConsentCrawlResult,
    Cookie,
)
from crawler.utils import set_log_formatter, is_on_same_domain
from crawler.enums import CrawlerType, CrawlState, PageState


class CrawlerException(Exception):
    """
    Indicates that the crawler has some unrecoverable error and should stop crawling.
    """
class ArgumentsException(Exception):
    """
    Indicates that the configuration is incalid and therefore we cannot start the crawl.
    """

log_dir = Path("./logs")
log_dir.mkdir(exist_ok=True)

chrome_profile_path = Path("./chrome_profile/")
chromedriver_path = Path("./chromedriver/chromedriver")
chrome_path = Path("./chrome/")

ver = version("cookieblock-consent-crawler")


def run_domain(
    visit: SiteVisit,
    browser_id: int,
    no_stdout: bool,
    crawl: Crawl,
    browser_params: Dict,
    num_subpages: int = 10,
) -> Tuple[ConsentCrawlResult, List[ConsentData], List[Cookie]]:
    """ """
    url = visit.site_url

    if urlparse(url).netloc == "":
        raise RuntimeError(f"Invalid URL: {url}")

    visit_id = visit.visit_id
    crawl_logger = logging.getLogger(f"visit-{visit.visit_id}")
    crawl_logger.propagate = False

    file_handler = logging.FileHandler(log_dir / f"visit_{visit_id}.log", delay=False)
    log_formatter = logging.Formatter(
        fmt="%(asctime)s %(levelname)s %(filename)s %(name)s %(processName)s: %(message)s",
        datefmt="%Y-%m-%d %H:%M:%S",
    )
    file_handler.setFormatter(log_formatter)
    crawl_logger.addHandler(file_handler)

    # Only add stdout as handler if desired
    if not no_stdout:
        stdout_handler = logging.StreamHandler()
        stdout_handler.setFormatter(log_formatter)
        crawl_logger.addHandler(stdout_handler)

    crawl_logger.setLevel(logging.INFO)
    crawl_logger.info("CookieBlock-ConsentCrawler version %s", ver)

    # Add missing protocol
    if not (url.startswith("http://") or url.startswith("https://")):
        url = "https://" + url

    crawl_logger.info("Working on %s", url)
    file_handler.flush()

    with Chrome(
        seconds_before_processing_page=1,
        chrome_profile_path=chrome_profile_path,
        chromedriver_path=chromedriver_path,
        browser_id=browser_id,
        crawl=crawl,
        logger=crawl_logger,
        **browser_params,  # type: ignore
    ) as browser:
        u = URL.from_text(url)

        page_state = browser.load_page(u)

        if page_state in [PageState.HTTP_ERROR, PageState.WRONG_URL]:
            crawl_logger.warning("Unable to connect to %s due to: %s", u, page_state)
            u = URL.from_text(url.replace("https://", "http://"))

        crawl_logger.info(
            "Loaded website %s (chrome pid: %s, chromedriver: %s) with status %s",
            u,
            browser.driver.browser_pid,
            browser.driver.service.process.pid,
            page_state,
        )

        # Add all PIDs of the browser and chromedriver to the queue
        now = datetime.now()

        # bot mitigation
        crawl_logger.info("Calling bot mitigation")
        browser.bot_mitigation(max_sleep_seconds=1)

        crawler_type, crawler_state, consent_data, result = browser.crawl_cmps(
            visit=visit
        )

        if crawler_type == CrawlerType.FAILED or crawler_state != CrawlState.SUCCESS:
            browser.collect_cookies(visit=visit)
            crawl_logger.info(
                "Aborted crawl crawl to %s [crawl_type: %s; crawler_state: %s]",
                u,
                crawler_type.name,
                crawler_state.name,
            )

            # Close file handler
            for handler in crawl_logger.handlers:
                if isinstance(handler, logging.FileHandler):
                    handler.close()
            return (result, consent_data, [])

        crawl_logger.info(
            "Ran %s CMP: %s (Found %s consents)",
            crawler_type.name,
            crawler_state.name,
            len(consent_data),
        )
        browser.load_page(u)

        # visit subpages
        links = list(
            filter(
                lambda x: is_on_same_domain(x.url.to_text(), url),
                browser.get_links(),
            )
        )
        crawl_logger.info("Found %s links", len(links))

        chosen = random.choices(links, k=min(num_subpages, len(links)))
        for i, l in enumerate(chosen):
            crawl_logger.info("Subvisiting [%i]: %s", i, l.url.to_text())
            browser.load_page(l.url)
            browser.bot_mitigation(max_sleep_seconds=1, num_mouse_moves=2)

        cookies = browser.collect_cookies(visit=visit)

        crawl_logger.info("Sucessfully finished crawl to %s", u)

        proc = psutil.Process()
        # To detect resource leakage
        crawl_logger.info("Number of open files: %s", len(proc.open_files()))
        for f in proc.open_files():
            crawl_logger.info("\tOpen file: %s", f)
        crawl_logger.info("Number of connections: %s", len(proc.net_connections()))
        crawl_logger.info("fds: %s", proc.num_fds())

        crawl_logger.info("End of crawl to %s", u)

        # Close file handler
        for handler in crawl_logger.handlers:
            if isinstance(handler, logging.FileHandler):
                handler.close()
                crawl_logger.removeHandler(handler)
        crawl_logger.info("End(2) of crawl to %s", u)

        return (result, consent_data, cookies)


def run_domain_with_timeout(
    visit: SiteVisit,
    browser_id: int,
    no_stdout: bool,
    crawl: Crawl,
    browser_params: Dict,
) -> Tuple[ConsentCrawlResult, List[ConsentData], List[Cookie]]:
    logger = logging.getLogger("cookieblock-consent-crawler")

    try:
        url = visit.site_url

        return run_domain(visit, browser_id, no_stdout, crawl, browser_params)
    except (
        TimeoutError,
        WebDriverException,  # selenium
        urllib3.exceptions.TimeoutError,
        urllib3.exceptions.MaxRetryError,
        TimeoutExpired,
    ) as e:
        logger.warning("Website %s had an exception (%s)", visit.site_url, type(e))
        # This except block should store the websites for later to retry them

        with open("./collected_data/retry_list.txt", "a", encoding="utf-8") as file:
            file.write(url)
            file.write("\n")

        return (
            ConsentCrawlResult(
                report=f"Failure: TimeoutError: {visit.site_url}",
                browser=visit.browser,
                visit=visit,
                cmp_type=CrawlerType.FAILED.value,
                crawl_state=CrawlState.LIBRARY_ERROR.value,
            ),
            [],
            [],
        )
    except Exception as e:  # Currently unknown exceptions
        logger.error(
            "visit_id: %s Failure when crawling %s: %s",
            visit.visit_id,
            visit.site_url,
            str(e),
        )
        logger.exception(e)
        return (
            ConsentCrawlResult(
                report=f"Failure: {str(e)}",
                browser=visit.browser,
                visit=visit,
                cmp_type=CrawlerType.FAILED.value,
                crawl_state=CrawlState.LIBRARY_ERROR.value,
            ),
            [],
            [],
        )


def _setup_logger():
    logger = logging.getLogger("cookieblock-consent-crawler")
    logger.propagate = False

    set_log_formatter(
        logger, "%(asctime)s %(levelname)s %(name)s: %(message)s", "%Y-%m-%d %H:%M:%S"
    )
    log_formatter = logging.Formatter(
        "%(asctime)s %(levelname)s %(name)s %(processName)s: %(message)s",
        "%Y-%m-%d %H:%M:%S",
    )
    console_handler = logging.StreamHandler()
    console_handler.setFormatter(log_formatter)
    console_handler.setLevel(logging.INFO)
    logger.addHandler(console_handler)
    logger.setLevel(logging.INFO)

    logger.info("Starting cookieblock-consent-crawler version %s", ver)

    # Has some WARNING messages that the pool is full
    logging.getLogger("urllib3").setLevel(logging.ERROR)
    return logger


def _parse_arguments() -> argparse.Namespace:
    """
    Parse the input arguments.

    Returns:
        argparse.Namespace: The parsed arguments
    """
    parser = argparse.ArgumentParser()

    run_group = parser.add_mutually_exclusive_group(required=True)

    run_group.add_argument(
        "-f", "--file", help="Path to file containing one URL per line"
    )
    run_group.add_argument(
        "--launch-browser",
        help="Only launches the browser which allows modification of the current profile",
        action="store_true",
        default=False,
    )
    run_group.add_argument("-u", "--url", help="Url to crawl once")
    run_group.add_argument(
        "--resume",
        help="Resume crawl in given database.",
        action="store_true",
        default=False,
    )

    parser.add_argument(
        "-n",
        "--num-browsers",
        help="Number of browsers to use in parallel",
        dest="num_browsers",
        default=1,
        type=int,
    )

    parser.add_argument(
        "--offset",
        help="From which website to start the crawl",
        dest="offset",
        default=-1,
        type=int,
    )

    parser.add_argument(
        "--batch-size",
        help="Number of websites to process in a batch",
        dest="batch_size",
        default=-1,
        type=int,
    )
    parser.add_argument(
        "-d",
        "--use-db",
        help="Use specified database file to add rows to. Format: DATA_PATH/FILENAME.sqlite",
        dest="use_db",
    )
    parser.add_argument(
        "--profile-tar", help="Location of a tar file containing the browser profile"
    )
    parser.add_argument(
        "--no-headless",
        help="Start the browser with GUI (headless disabled)",
        action="store_true",
        default=False,
    )
    parser.add_argument(
        "--no-stdout",
        help="Do not print crawl results to stdout",
        action="store_true",
        default=False,
    )
    parser.add_argument(
        "--num-subpages",
        help="Amount of links to follow when visiting a domain",
        default=10,
        type=int,
    )
    parser.add_argument(
        "--timeout",
        help="Amount of seconds to spend on one website",
        default=600,
        type=int,
    )

    return parser.parse_args()


def _args_check(args: argparse.Namespace) -> None:
    """
    Check the input arguments.

    Args:
        args (argparse.Namespace): The parsed arguments
    """
    # simple checks
    if args.file and (not os.path.exists(args.file)):
        raise ArgumentsException(f"File at {args.file} does not exist")
    if args.resume and (not args.use_db or not args.offset >= 0):
        raise ArgumentsException("--use-db and --offset are required when using --resume")
    if args.no_headless and args.launch_browser:
        raise ArgumentsException("--launch-browser cannot be combined with --no_headless")
    if args.num_browsers and args.num_browsers < 1:
        raise ArgumentsException("Number of browsers must be at least 1")
    if args.num_subpages and args.num_subpages < 0:
        raise ArgumentsException("Number of subpages must be at least 0")
    if args.timeout and args.timeout < 0:
        raise ArgumentsException("Timeout must be at least 0")

    # checks with preparations
    if args.profile_tar:
        if not os.path.exists(args.profile_tar):
            raise ArgumentsException(f"File at {args.profile_tar} does not exist")
        with tarfile.open(args.profile_tar, errorlevel=0) as tfile:
            tfile.extractall(".", filter="data")
    else:
        # Simply use existing
        pass


def _database_setup(logger: Logger, args: argparse.Namespace) -> Tuple[str, str]:
    """
    Setup the database.
    """
    is_sqlite = True
    if args.use_db:
        if str(args.use_db).startswith("postgresql://"):
            is_sqlite = False
            data_path = ""
            database_file = args.use_db
        else:
            splitted = os.path.split(args.use_db)
            if len(splitted) != 2:
                raise CrawlerException("--use_db is wrongly formatted")
            data_path = splitted[0]
            database_file = splitted[1]
    else:
        now = datetime.now().strftime("%Y%m%d_%H%M%S")
        data_path = "./collected_data"
        database_file = f"crawl_data_{now}.sqlite"

    if is_sqlite:
        logger.info("Using data_path %s and file %s", data_path, database_file)

        os.makedirs(data_path, exist_ok=True)

        # Connect to sqlite
        db_file = Path(data_path) / database_file
        create = not db_file.exists()

        initialize_base_db(
            db_url="sqlite:///" + str(db_file),
            create=create,
            alembic_root_dir=Path(__file__).parent,
            pool_size=int(4 + args.num_browsers * 1.5),
        )
    else:
        initialize_base_db(
            db_url=args.use_db,
            create=True,
            alembic_root_dir=Path(__file__).parent,
            pool_size=int(4 + args.num_browsers * 1.5),
        )

    logger.info("Finished database setup")
    return data_path, database_file


def _kill_browsers_deamon(logger: Logger, args: argparse.Namespace) -> None:
    """
    Checks all running chrome processes.
    Some processes that are spawned by this process launch the chromedriver and chrome processes.
    If these are killed the children of them (chrome/chromedriver) are adopted by the container.
    We iterate over all processes and kill those that are too old.
    """
    file = open("watcher.log", "a+")

    logger.info("Starting watcher")

    while True:
        current_time = datetime.now()

        print("Checking at ", current_time, file=file)

        # Kill browser processes that are older than X minutes
        # Iterate over all processes as each pebble worker
        # is its own process, and if he dies the chrome/chromedriver child
        # process is adopted by the docker container init process.
        proc: psutil.Process

        for proc in psutil.process_iter():
            try:
                if "chrome" not in proc.name():
                    continue

                # Kill if older than four times the timeout
                if (
                    proc.create_time()
                    and (current_time.timestamp() - proc.create_time())
                    >= args.timeout * 4
                ):
                    print("Found too old process: ", proc, file=file)

                    if proc.status() == psutil.STATUS_ZOMBIE:
                        try:
                            # Attempt to reap the zombie by waiting for it
                            os.waitpid(proc.pid, os.WNOHANG)
                            print(f"Reaped zombie process: {proc.pid}")
                        except ChildProcessError as e:
                            print(e)
                            pass  # Zombie process might be gone by now
                    else:
                        file.flush()
                        proc.kill()
                        proc.wait(timeout=10)
                        print("Killed", file=file)
                else:
                    print("Process without starttime found: ", proc, file=file)
                file.flush()
            except Exception as e:
                print(e, file=file)
                pass

        file.flush()
        time.sleep(10)

        print(file=file)
        file.flush()


def run_crawler(logger: Logger) -> None:
    """
    This file contains all the main functionality and the entry point.
    """
    # Clear existing profile
    if os.path.exists(chrome_profile_path):
        shutil.rmtree(chrome_profile_path)

    os.makedirs(chrome_profile_path, exist_ok=True)

    args = _parse_arguments()
    _args_check(args)

    if args.launch_browser:
        with Chrome(
            seconds_before_processing_page=1,
            headless=False,  # Definitely start headfull
            use_temp=False,
            chrome_profile_path=chrome_profile_path,
            chromedriver_path=chromedriver_path,
            chrome_path=str(chrome_path),
            browser_id=-1,
            logger=logger,
        ) as browser:
            browser.load_page(URL.from_text("about:blank"))
            time.sleep(60 * 60)  # wait one hour
        return

    data_path, database_file = _database_setup(logger, args)

    visits: List[SiteVisit] = []

    if args.resume:
        logger.info("Resuming crawl")

        visits = []
        with SessionLocal.begin() as session:
            unfinished_visits_query = select(SiteVisit).order_by(SiteVisit.visit_id)

            if args.offset >= 0:
                unfinished_visits_query = unfinished_visits_query.offset(args.offset)

            if args.batch_size > 0:
                unfinished_visits_query = unfinished_visits_query.limit(args.batch_size)

            visits = list(
                session.execute(unfinished_visits_query).scalars()
            )

            if len(visits) == 0:
                logging.error("Crawl already finished")
                return
            browser_id = visits[0].browser_id
            crawls = list(session.execute(select(Crawl)).scalars())

            crawl = crawls[0]
            browser_params = json.loads(crawls[0].browser_params)
    else:
        # Load new sites
        if args.file:
            with open(args.file, "r", encoding="utf-8") as fo:
                urls = [x.strip() for x in fo.readlines()]
                urls = list(filter(lambda x: x.strip() != "", urls))
        else:
            assert args.url
            urls = [args.url]

        parameters = {
            "data_directory": str(data_path),
            "log_directory": str(log_dir),
            "database_name": str(database_file),
            "num_browsers": str(args.num_browsers),
        }
        task = start_task(
            browser_version="Chrome 126", manager_params=json.dumps(parameters)
        )
        task_id = task.task_id

        logger.info("Task: %s", task)

        browser_params = {
            "use_temp": True,
            "chrome_path": str(chrome_path.absolute()),
            "headless": not (args.no_headless),
        }

        # Add browser config to the database
        crawl = register_browser_config(
            task_id=task_id, browser_params=json.dumps(browser_params)
        )
        assert crawl.browser_id
        browser_id = crawl.browser_id

        # Prepare all visits in one thread
        logger.info("Creating visits and browsers")
        with SessionLocal.begin() as session:
            visits = [
                SiteVisit(browser_id=browser_id, site_url=u, site_rank=-1) for u in urls
            ]

            session.add_all(visits)
        logger.info("Created visits")

        with SessionLocal.begin() as session:
            for visit in tqdm(visits, desc="Populating visits"):
                session.add(visit)
                session.refresh(visit)
                session.refresh(visit.browser)

        if args.batch_size > 0:
            visits = visits[: args.batch_size]

    # Debugging
    proc = psutil.Process()

    watcher = Process(target=_kill_browsers_deamon, args=(logger, args), daemon=True)
    watcher.start()

    # Run a warmup browser to check if the current profile works
    # Also patches the executable for patching the chromedriver executable
    # to run concurrently and not need patching in each thread.
    # Also prints the browser version.

    logger.info("Starting warmup browser")
    null_logger = logging.getLogger("empty")
    null_logger.setLevel(logging.ERROR)

    with Chrome(
        seconds_before_processing_page=1,
        chrome_profile_path=chrome_profile_path,
        chromedriver_path=chromedriver_path,
        browser_id=browser_id,
        crawl=crawl,
        logger=null_logger,
        **browser_params,  # type: ignore
    ) as browser:
        _, content = browser.get_content("chrome://version")

        ver_pat = r"Chromium[\s]*\|[\s]*([\d\.]+)"
        match = re.search(ver_pat, content)

        if not match or not match.groups() or len(match.groups()) == 0:
            raise RuntimeError(f"Unable to detect chrome version in {content}")

        groups = match.groups()
        logger.info("Chrome version: %s", groups[0])

    if args.num_browsers == 1:
        with SessionLocal.begin() as session:
            crawl = session.merge(crawl)

            for i, arg in enumerate(visits):
                arg = session.merge(arg)

                crawl_result, cds, cookies = run_domain_with_timeout(
                    arg, browser_id, args.no_stdout, crawl, browser_params
                )

                logger.info("Finished %s/%s", i + 1, len(visits))

                session.merge(crawl_result)

                for cd in cds:
                    session.merge(cd)
                for c in cookies:
                    session.merge(c)
        logger.info("%s crawls have finished.", len(visits))
    else:
        n_jobs = min(args.num_browsers, len(visits))

        with ProcessPool(max_workers=n_jobs, max_tasks=1) as pool:
            fut = pool.map(
                run_domain_with_timeout,
                visits,
                repeat(browser_id),
                repeat(args.no_stdout),
                repeat(crawl),
                repeat(browser_params),
                timeout=args.timeout,
            )

            all_true = True
            it = fut.result()
            try:
                print("starting")
                for i in tqdm(range(len(visits)), total=len(visits), desc="Crawling"):
                    try:
                        with SessionLocal.begin() as session:
                            crawl_result, cds, cookies = cast(
                                Tuple[
                                    ConsentCrawlResult, List[ConsentData], List[Cookie]
                                ],
                                next(it),
                            )

                            session.merge(crawl_result)

                            for cd in cds:
                                session.merge(cd)
                            for c in cookies:
                                session.merge(c)

                            # TODO: warn of unseccessfull crawls; if next_result[0].report
                            # logger.warning("Crawl to %s finished", visits[i])
                    except TimeoutError as e:
                        logger.warning("Crawl to %s froze", visits[i])

                        with open("./retry_list.txt", "a", encoding="utf-8") as file:
                            file.write(visits[i].site_url)
                            file.write("\n")
                        logger.error(e)
                    except Exception as e:
                        logger.error("Error when crawling %s", visits[i])
                        with open("./retry_list.txt", "a", encoding="utf-8") as file:
                            file.write(visits[i].site_url)
                            file.write("\n")
                        logger.error(e)
            except StopIteration:
                pass

            all_succeeded = all_true
        logger.info(
            "All %s crawls have finished. Success: %s", len(visits), all_succeeded
        )

    logger.info("Number of open files: %s", len(proc.open_files()))
    for f in proc.open_files():
        logger.info("\tOpen file: %s", f)
    logger.info("Number of connections: %s", len(proc.net_connections()))
    logger.info("fds: %s", proc.num_fds())

    logger.info("CB-CCrawler has finished.")
    logging.shutdown()

    logging.info("All browser should be stopped.")
    watcher.kill()


def main() -> None:
    """
    Call run_crawler and if any exception occurs we'll stop with code 1.
    Exit code 1 means that there is something fundamentally wrong and
    cb-cc should not be called again.
    """

    logger = _setup_logger()
    try:
        run_crawler(logger)

    # pylint: disable=broad-exception-caught
    except CrawlerException as e:
        logger.error(e)
        sys.exit(1)
    except Exception as e:
        print(traceback.format_exc())
        sys.exit(1)


if __name__ == "__main__":
    main()
