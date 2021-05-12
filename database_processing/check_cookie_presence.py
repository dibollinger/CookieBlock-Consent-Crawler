"""
Check if given cookies are found in the collected cookie database.


Usage:
  check_registration_cookie <db_path>...

Options:
  -h --help   Show this help message
"""

import csv
import re
import sqlite3
import logging
import traceback
import os
import json

from statistics import mean, stdev
from datetime import datetime
from typing import List, Set, Dict, Any, Tuple
from docopt import docopt

QUERY = """
SELECT DISTINCT j.visit_id,
        j.name,
        j.host,
        j.path
FROM javascript_cookies j
WHERE j.record_type <> "deleted"
ORDER BY j.visit_id, j.name, j.time_stamp ASC;
"""

logger = logging.getLogger("reg")

def canonical_domain(dom: str) -> str:
    """
    Transform a provided URL into a uniform domain representation for string comparison.
    """
    canon_dom = re.sub("^http(s)?://", "", dom)
    canon_dom = re.sub("^www", "", canon_dom)
    canon_dom = re.sub("^\\.", "", canon_dom)
    return canon_dom

def setupLogger(logpath: str) -> None:
    """
    Set up the logger instance
    """
    with open(logpath, 'w') as fd:
        pass

    logger.setLevel(logging.DEBUG)
    ch = logging.StreamHandler()
    ch.setLevel(logging.INFO)
    logger.addHandler(ch)

    fh = logging.FileHandler(logpath)
    fh.setLevel(logging.DEBUG)
    logger.addHandler(fh)


def main():
    argv = None
    cargs = docopt(__doc__, argv=argv)

    setupLogger("registration_dataset_check.log")

    database_paths = cargs["<db_path>"]

    for d in database_paths:
        if not os.path.exists(d):
            logger.error(f"Database file does not exist: {d}")
            return 1

    database_cookies: Set[Tuple] = set()

    for d in database_paths:
        # enable dictionary access by column name
        conn = sqlite3.connect(d)
        conn.row_factory = sqlite3.Row

        try:
            with conn:
                cur = conn.cursor()
                cur.execute(QUERY)
                for row in cur:

                    canon_adom: str = canonical_domain(row["host"])
                    cookie_key = (row["name"], canon_adom, row["path"])
                    database_cookies.add(cookie_key)

                cur.close()
        except (sqlite3.OperationalError, sqlite3.IntegrityError):
            logger.error("A database error occurred:")
            logger.error(traceback.format_exc())
            return -1
        conn.close()


    newfound = -1
    with open("regcheck.csv", 'w') as fw:
        with open("cookies_after_registration.csv") as fd:
            car = csv.reader(fd, delimiter=',')
            for row in car:
                cookie_id = (row[1], canonical_domain(row[2]), row[3])
                if (cookie_id not in database_cookies):
                    fw.write(','.join(row) + "\n")
                    newfound += 1
                else:
                    logger.info(cookie_id)

    logger.info(f"New Cookies: {newfound}")

    return 0

if __name__ == "__main__":
    exit(main())



