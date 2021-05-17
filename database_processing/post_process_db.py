#!/bin/python3
# Copyright (C) 2021 Dino Bollinger, ETH Zürich, Information Security Group
# Released under the MIT License
"""
This script runs a series of SQL commands on the specified database to remove empty tables
and add Views in order to have a better overview of the data contained within.

Also extracts some useful statistics to analyze the information in the database.

Usage:
    post_process_db.py <db_path>
"""

import sqlite3
import logging
import traceback
import os

from typing import List
from docopt import docopt

logger = logging.getLogger("main")

assertion_path = "sql_commands/assertions/"
command_path = "sql_commands/commands/"

def read_sql_script(path):
    """ utility to read sql script file """
    with open(path, 'r') as fd:
        return fd.read()


def sanity_check(conn: sqlite3.Connection) -> None:
    """
    Executes the scripts stored at the assertion path in order to verify basic
    sanity properties on the database. If these are violated, something probably
    went horribly wrong during the crawl.

    If this is the case, it will report a warning in the log file.
    @param conn: Active SQLite3 database connection
    """
    assert_files = [os.path.join(assertion_path, f) for f in os.listdir(assertion_path) if f.endswith(".sql")]
    logger.info("Executing sanity checks...")
    for a in assert_files:
        try:
            script = read_sql_script(a)
            with conn:
                cur = conn.execute(script)

                # expected format: "True" / "False"
                passed = bool(cur.fetchone()[0])
                if not passed:
                    logger.warning(f"Sanity check failed: {a}")
                cur.close()
        except (sqlite3.IntegrityError, sqlite3.OperationalError):
            logger.error(f"Failed to execute script at {a}")
            logger.error(traceback.format_exc())


def create_backup(dbpath: str, conn: sqlite3.Connection) -> int:
    """
    Creates a backup of the specified database, using the specified path dbpath,
    and an open database connection from which the backup is created.

    Backup will have the filepath "<dbpath>_backup". Will not overwrite existing backup.
    @param dbpath: Path + Filename of the original database
    @param conn: Active connection to said original database
    @return: 0 if a backup was created, 1 if it failed.
    """
    try:
        def progress(status, remaining, total):
            logger.debug(f"Copy status: {status}")
            logger.debug(f'Copied {total - remaining} of {total} pages...')

        backup_path = dbpath + '_backup'
        if os.path.exists(backup_path):
            logger.info(f"Previous backup already exists, skipping...")
            return 0

        logger.info(f"Creating a database backup at {backup_path}")
        bck = sqlite3.connect(backup_path)
        with bck:
            conn.backup(bck, pages=1, progress=progress)
        bck.close()
        return 0
    except (sqlite3.IntegrityError, sqlite3.OperationalError):
        logger.error(f"Failed to create backup of {dbpath}")
        logger.error(traceback.format_exc())
        return 1


def execute_db_transformation_commands(conn: sqlite3.Connection) -> None:
    """
    Executed commands intended to transform the database.
    Commands include: Removing leftover tables, setting up useful views.
    @param conn: Active SQLite3 database connection
    """
    command_files = [os.path.join(command_path, f) for f in os.listdir(command_path) if f.endswith(".sql")]
    logger.info("Executing database setup...")
    for c in sorted(command_files):
        script = read_sql_script(c)
        try:
            with conn:
                cur = conn.executescript(script)
                cur.close()
        except (sqlite3.IntegrityError, sqlite3.OperationalError):
            logger.error(f"Failed to execute script at {c}")
            logger.error(traceback.format_exc())
        else:
            logger.info(f"Successfully executed scriot {c}")


def extract_debug_statistics(conn: sqlite3.Connection, debug_stats_path="./debug_stats.txt") -> None:
    """
    Runs a series of SQL queries to extract debug statistics from the consent crawl database.
    Examples: Number of successful crawls, interrupted crawls, CMP errors etc.

    These statistics will be stored in the specified stats file path.
    @param conn: Active sqlite3 database connection.
    @param debug_stats_path: Path to store the statistics in.
    """
    try:
        with conn:
            cur = conn.cursor()

            # Get total urls
            cur.execute("SELECT COUNT(visit_id) AS count FROM site_visits;")
            total_urls: int = int(cur.fetchone()["count"])

            # successful CMP crawls
            cur.execute("SELECT COUNT(visit_id) AS count FROM consent_crawl_results WHERE crawl_state == 0;")
            successful_cmp_count: int = int(cur.fetchone()["count"])

            # consent crawls with non-zero status code
            cur.execute("SELECT COUNT(visit_id) AS count FROM view_failed_consent_crawls;")
            failed_cmp_count: int = int(cur.fetchone()["count"])

            cur.execute("SELECT COUNT(visit_id) AS count FROM view_failed_visits_consent;")
            interrupts_during_consent_crawl: int = int(cur.fetchone()["count"])

            cur.execute("SELECT COUNT(visit_id) AS count FROM view_failed_visits_browse;")
            interrupts_during_browse: int = int(cur.fetchone()["count"])

            cur.execute('SELECT COUNT(visit_id) AS count FROM view_consent_crawl_results WHERE crawl_state == 0 AND browse_interrupted == "False";')
            successful_crawls_overall: int = int(cur.fetchone()["count"])

            interrupts_total: int = interrupts_during_browse + interrupts_during_consent_crawl

            interrupt_error_reports: List = []
            cur.execute('SELECT visit_id, site_url, error_type, error_report FROM view_visits_with_errors WHERE interrupted == "True" ORDER BY error_type;')
            for line in cur:
                report = f'{line["visit_id"]} -- {line["site_url"]} -- Type: {line["error_type"]}'
                if line["error_report"]:
                    report += f' -- Details: {str(line["error_report"]).strip()}\n'
                else:
                    report += "\n"
                interrupt_error_reports.append(report)

            cmp_error_reports: List = []
            cur.execute('SELECT * FROM view_failed_consent_crawls ORDER BY crawl_state ASC;')
            ctype = -1
            for line in cur:
                if ctype != int(line["crawl_state"]):
                    ctype = int(line["crawl_state"])
                    cmp_error_reports.append(f"\nType {ctype}:\n")
                report = f'{line["visit_id"]} -- {line["site_url"]} -- Type: {line["crawl_state"]} -- Details: {str(line["report"]).strip()}\n'
                cmp_error_reports.append(report)

            cur.close()

            with open(debug_stats_path, 'w') as fd:
                fd.write("\n## Debug Statistics\n")
                fd.write(f"URL Total: {total_urls}\n")
                fd.write(f"  -- success: {successful_crawls_overall}\n")
                fd.write(f"  -- failed:  {total_urls - successful_crawls_overall}\n")
                fd.write(f"Crawls Interrupted: {interrupts_total}\n")
                fd.write(f"  -- in consent phase: {interrupts_during_consent_crawl}\n")
                fd.write(f"  -- in browse phase:  {interrupts_during_browse}\n")
                # fd.write(f"Crawls Uninterrupted: {total_urls - interrupts_total }\n")
                fd.write("Consent Management Platform Data:\n")
                fd.write(f"  -- found:     {successful_cmp_count}\n")
                fd.write(f"  -- not found: {failed_cmp_count}\n")

                fd.write("\n## Interrupt Errors:\n")
                for line in interrupt_error_reports:
                    fd.write(line)

                fd.write("\n## Consent Crawl Errors:\n")
                for line in cmp_error_reports:
                    fd.write(line)

    except (sqlite3.IntegrityError, sqlite3.OperationalError):
        logger.error("A database error occurred:")
        logger.error(traceback.format_exc())
    else:
        logger.info("Debug statistics successfully extracted.")


def extract_content_statistics(conn: sqlite3.Connection, stats_path: str) -> None:
    """
    Runs a series of SQL queries to extract content statistics from the consent crawl database.
    Examples: number of records collected per category, training data records, etc.

    These statistics will be stored in the specified stats file path.
    @param conn: Active sqlite3 database connection.
    @param stats_path: Path to store the statistics in.
    """
    try:
        with conn:
            cur = conn.cursor()

            cur.execute('SELECT COUNT("True") AS count FROM javascript_cookies WHERE record_type <> "deleted";')
            total_js_cookie_records : int = int(cur.fetchone()["count"])

            cur.execute('SELECT count("True") AS count FROM ( SELECT DISTINCT visit_id, name, host, path FROM javascript_cookies);')
            js_cookie_records_without_updates: int = int(cur.fetchone()["count"])

            cur.execute('SELECT COUNT("True") AS count FROM view_unique_js_cookies')
            unique_js_cookies: int = int(cur.fetchone()["count"])

            cur.execute('SELECT COUNT("True") AS count FROM consent_data;')
            total_consent_records : int = int(cur.fetchone()["count"])

            cur.execute('SELECT COUNT("True") AS count FROM view_unique_consent_cookies')
            unique_consent_cookies: int = int(cur.fetchone()["count"])

            crcounts: List[int]= []
            for i in range(-1, 4):
                cur.execute(f'SELECT COUNT(visit_id) AS count FROM consent_data WHERE cat_id == {i};')
                crcounts.append(int(cur.fetchone()["count"]))

            # Social Media Count
            cur.execute(f'SELECT COUNT(visit_id) AS count FROM consent_data WHERE cat_id == 5;')
            crcounts.append(int(cur.fetchone()["count"]))

            # Training data stats
            cur.execute('SELECT COUNT("True") AS count FROM view_training_data;')
            training_data_entries: int = int(cur.fetchone()["count"])

            cur.execute('SELECT COUNT("True") AS count FROM view_unique_train_cookies;')
            unique_training_data_without_updates: int = int(cur.fetchone()["count"])

            cur.execute('SELECT COUNT("True") AS count FROM (SELECT DISTINCT name, actual_domain, path FROM view_unique_train_cookies);')
            unique_training_cookies: int = int(cur.fetchone()["count"])

            tr_cat_counts: List[int]= []
            for i in range(-1, 4):
                cur.execute(f'SELECT COUNT("True") AS count FROM (SELECT DISTINCT visit_id, name, actual_domain, path, cat_id FROM view_training_data) as tr WHERE tr.cat_id == {i};')
                tr_cat_counts.append(int(cur.fetchone()["count"]))

            # Social media count
            cur.execute(f'SELECT COUNT("True") AS count FROM (SELECT DISTINCT visit_id, name, actual_domain, path, cat_id FROM view_training_data) as tr WHERE tr.cat_id == 5;')
            tr_cat_counts.append(int(cur.fetchone()["count"]))

            cur.execute("SELECT AVG(num_diffs) as avg_diffs FROM view_num_updates_per_cookie;")
            avg_num_diffs = int(cur.fetchone()["avg_diffs"])

            cur.execute("SELECT MAX(num_diffs) as max_diffs FROM view_num_updates_per_cookie;")
            max_num_diffs = int(cur.fetchone()["max_diffs"])

            cur.close()

            with open(stats_path, 'w') as fd:
                fd.write("\n## Content Statistics\n")
                fd.write(f"Total # of Cookie Records:      {total_js_cookie_records}\n")
                fd.write(f"Cookie Records without Updates: {js_cookie_records_without_updates}\n")
                fd.write(f"Unique Cookies from Websites:   {unique_js_cookies}\n\n")

                fd.write(f"Total CMP Cookie Records:       {total_consent_records}\n")
                fd.write(f"Unique Cookies in CMPs:         {unique_consent_cookies}\n\n")

                fd.write("## Count for each category of data collected from the Consent Management Platforms\n")
                fd.write(f"Unknown Count:       {crcounts[0]}\n")
                fd.write(f"Necessary Count:     {crcounts[1]}\n")
                fd.write(f"Functional Count:    {crcounts[2]}\n")
                fd.write(f"Analytical Count:    {crcounts[3]}\n")
                fd.write(f"Advertising Count:   {crcounts[4]}\n")
                fd.write(f"Social Media Count:  {crcounts[5]}\n")

                fd.write("\n## Training Data Statistics\n")

                fd.write(f"Total Training Data Records:      {training_data_entries}\n")
                fd.write(f"Training Records without Updates: {unique_training_data_without_updates}\n")
                fd.write(f"Unique Training Data Cookies:     {unique_training_cookies}\n\n")

                fd.write(f"## Count for each category, after consent categories has been matched with the actual cookies\n")
                fd.write(f"## In the following, all cookie updates have been removed, i.e. we count (cookie name, domain, path) per visit_id once\n")
                fd.write(f"Unknown Count:       {tr_cat_counts[0]}\n")
                fd.write(f"Necessary Count:     {tr_cat_counts[1]}\n")
                fd.write(f"Functional Count:    {tr_cat_counts[2]}\n")
                fd.write(f"Analytical Count:    {tr_cat_counts[3]}\n")
                fd.write(f"Advertising Count:   {tr_cat_counts[4]}\n")
                fd.write(f"Social Media Count:  {tr_cat_counts[5]}\n")

                fd.write(f"Average Cookie Updates: {avg_num_diffs}\n")
                fd.write(f"Max Cookie Updates:     {max_num_diffs}\n")

    except (sqlite3.IntegrityError, sqlite3.OperationalError):
        logger.error("A database error occurred:")
        logger.error(traceback.format_exc())
    else:
        logger.info("Content Statistics successfully extracted.")


def setupLogger(logdir:str, loglevel:str) -> None:
    """
    Set up the logger instance, which will write its output to a log file.
    :param logdir: Directory for the log file.
    :param loglevel: Log level at which to record.
    """
    loglevel = logging.getLevelName(loglevel)
    logger.setLevel(loglevel)

    os.makedirs(logdir, exist_ok=True)
    logfile = os.path.join(logdir, "db_transform.log")

    with open(logfile, 'w') as fd:
        pass

    """ Enables logging to stderr """
    formatter = logging.Formatter('%(asctime)s :: %(name)s :: %(levelname)s :: %(message)s', datefmt="%Y-%m-%d-%H:%M:%S")
    ch = logging.StreamHandler()
    ch.setLevel(loglevel)
    ch.setFormatter(formatter)
    logger.addHandler(ch)

    # log file output
    fh = logging.FileHandler(filename=logfile, mode="w", encoding="utf8")
    fh.setLevel(loglevel)
    fh.setFormatter(formatter)
    logger.addHandler(fh)


def main() -> int:
    """
    Perform sanity check, backup, transform db, extract debug stats, extract content stats.
    @return: exit code, 0 for success
    """
    argv = None
    # argv = ["./example_db/example_crawl_20210213_153228.sqlite"]

    args = docopt(__doc__, argv=argv)

    setupLogger(".", "INFO")

    database_path = args["<db_path>"]
    if not os.path.exists(database_path):
        logger.error("Database does not exist.")
        return 1

    root, _ = os.path.splitext(database_path)
    _, filename = os.path.split(root)
    debug_statistics_path = f"stats/debug_stats_{filename}.txt"
    content_statistics_path = f"stats/content_stats_{filename}.txt"

    # enable access by column name
    conn = sqlite3.connect(database_path)
    conn.row_factory = sqlite3.Row

    sanity_check(conn)
    status = create_backup(database_path, conn)
    if status != 0:
        logger.error("Backup failed, aborting further processing.")
        return status
    execute_db_transformation_commands(conn)

    extract_debug_statistics(conn, debug_statistics_path)
    extract_content_statistics(conn, content_statistics_path)

    conn.close()

    return 0


if __name__ == "__main__":
    exit(main())

