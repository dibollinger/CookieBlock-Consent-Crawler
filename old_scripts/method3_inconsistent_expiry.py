# Copyright (C) 2021-2022 Dino Bollinger, ETH Zürich, Information Security Group
# Released under the MIT License
"""
Using a database of collected cookie + label data, determine inconsistencies in the CMP
by comparing the actual expiration date of a cookie to the declared expiration date.
----------------------------------
Required arguments:
    <db_path>  Path to database to analyze.
Optional arguments:
    --out_path <out_path>: Directory to store the resutls.
Usage:
    method3_inconsistent_expiry.py <db_path> [--out_path <out_path>]
"""


import os
import sqlite3
import re
import datetime
import traceback
import logging

from docopt import docopt
from utils import (setupLogger, retrieve_matched_cookies_from_DB,
                                       write_json, write_vdomains)

logger = logging.getLogger("vd")

global inconsistency_details, inconsistency_domains, inconsistency_count


second_pattern = re.compile("(second(s)?|sekunde(n)?)", re.IGNORECASE)
minute_pattern = re.compile("(minute[ns]?)", re.IGNORECASE)
hour_pattern = re.compile("(hour(s)?|stunde(n)?)", re.IGNORECASE)
day_pattern = re.compile("(day(s)?|日|วัน|дней|deň|dies|diena|dni|dní|den|dan|dag(en)?|dia|día|gün|nap|lá|dana|giorn[oi]|tag(e)?|zi(le)?|jour(s)?|días|dienos|päev|päivää|päivä|ημέρα|ημέρες|dzień|день|днів|дни|ден|laethanta|일)", re.IGNORECASE)
week_pattern = re.compile("(week(s)?|woche(n)?)", re.IGNORECASE)
month_pattern = re.compile("(month(s)?|maand(en)?|månad|měsíců|mesi|kuud|ay|md\.|mdr\.|mois|monat(e)?|meses|mēneši|mesec[ai]|míonna|måneder|місяців|месеца|mjeseci|miesiące|kuukautta|μήνες|luni|mėnesiai|månader|mánuðir|hónap|месяцы|mesos|ヶ月)", re.IGNORECASE)
year_pattern = re.compile("(year(s)?|jahr(e)?|anno|ปี|année|anni|gads|gadi|an|ár|jaar(en)?|rok|lat|év|ani|tahun|år|років|urte|año|ano|yıl|blianta|bliain|let|aastat|urte|aasta|godin[ae]?|έτος|έτη|vuosi|vuotta|metai|год|годы|рік|年|년|سنة)", re.IGNORECASE)

# 1 month
min_diff = 3600 * 24


def convert_consent_expiry_to_seconds(expiry_string: str, cmp_type: int) -> int:
    """
    Transform the input string into a numerical format (seconds)
    @param expiry_string: String in the format (count, time)
    @return: expiration time in seconds
    """
    assert expiry_string, "Empty string received."

    t_string = expiry_string.strip().lower()
    assert t_string != "session" and t_string != "persistent", "Session and Persistent times should not be handled here"

    # OneTrust
    if cmp_type == 1:
        if t_string == "0":
            # "a few seconds"
            totalcount = 60
        else:
            # Otherwise, expiry always specified in days
            totalcount = int(t_string) * 3600 * 24
    else:
        if t_string == "less than 1 minute":
            totalcount = 60
        elif re.match("(1 á dag|1 egun bat)", t_string):
            totalcount = 3600 * 24
        elif re.match("1 urte bat", t_string):
            totalcount = 3600 * 24 * 365
        else:
            splits = t_string.split()
            expiry_iterator = iter(splits)
            totalcount = 0
            try:
                while True:
                    count = int(next(expiry_iterator))
                    interval = next(expiry_iterator)

                    if second_pattern.match(interval):
                        totalcount += count
                    elif minute_pattern.match(interval):
                        totalcount += count * 60
                    elif hour_pattern.match(interval):
                        totalcount += count * 3600
                    elif day_pattern.match(interval):
                        totalcount += count * 3600 * 24
                    elif week_pattern.match(interval):
                        totalcount += count * 3600 * 24 * 7
                    elif month_pattern.match(interval):
                        totalcount += count * 3600 * 24 * 30
                    elif year_pattern.match(interval):
                        totalcount += count * 3600 * 24 * 365
                    else:
                        logger.debug(f"Unknown date format: {expiry_string}")
                        return -1
            except StopIteration:
                pass
            except ValueError:
                logger.debug(traceback.format_exc())
                return -1

    return totalcount



def found_inconsistency(key, full_cookie_data, update, diff):
    """
    Add inconsistency record to the dictionary.
    """
    global inconsistency_details, inconsistency_domains, inconsistency_count

    diffseconds = None
    if diff != "persistent_as_session" and diff != "session_as_persistent":
        diffseconds = convert_consent_expiry_to_seconds(full_cookie_data['consent_expiry'], full_cookie_data["cmp_type"])
        consent_expiry_str = str(datetime.timedelta(seconds=diffseconds))
    else:
        consent_expiry_str = full_cookie_data['consent_expiry']

    actual_expiry_str = update['expiry'] if type(update['expiry']) is str else str(datetime.timedelta(seconds=update['expiry']))
    diff_expiry_str = diff if type(diff) is str else str(datetime.timedelta(seconds=diff))

    #logger.info(f"Potential violation found for {key} "
    #            f"-- Consent Expiry: {consent_expiry_str}"
    #            f"-- Name: {full_cookie_data['consent_expiry']} "
    #            f"-- Actual Expiry: {actual_expiry_str}"
    #            f"-- expiry difference: {diff_expiry_str}")

    vdomain = full_cookie_data["site_url"]
    inconsistency_domains.add(vdomain)
    inconsistency_count += 1

    if vdomain not in inconsistency_details:
        inconsistency_details[vdomain] = list()

    inconsistency_details[vdomain].append({
        **full_cookie_data,
        "consent_expiry_str": consent_expiry_str,
        "true_expiry_str": actual_expiry_str,
        "expiry_diff": diff_expiry_str,
        "expiry_diff_seconds": None if type(diff) is str else diff,
        "expiry_ratio": None if not diffseconds else update['expiry'] / diffseconds
    })



def main():
    """
      Determine expiration date inconsistencies between actual cookie, and declared cookie.
      @return: exit code, 0 for success
    """
    global inconsistency_details, inconsistency_domains, inconsistency_count
    argv = None
    cargs = docopt(__doc__, argv=argv)

    setupLogger(".", logging.INFO)
    logger.info("Running method 03: Incorrect Retention Period")

    database_path = cargs["<db_path>"]
    if not os.path.exists(database_path):
        logger.error("Database file does not exist.")
        return 1
    logger.info(f"Database used: {database_path}")

    # enable dictionary access by column name
    conn = sqlite3.connect(database_path)
    conn.row_factory = sqlite3.Row

    logger.info("Extract cookies from database...")
    cookies_dict, _ = retrieve_matched_cookies_from_DB(conn)

    total_domains = set()
    inconsistency_details = dict()
    inconsistency_domains = set()
    inconsistency_count = 0
    total_cookies = 0

    # number of persistent cookies declared as session cookies
    pers_as_session_count = 0

    # number of session cookies declared as persistent
    sess_as_persistent = 0

    # number of persistent cookies with wrong expiration date
    wrong_expiry = 0

    for key, val in cookies_dict.items():
        # In the dataset collected from November 2020, this cookie always had an inconsistency.
        # It was set with an empty value before the user chose any consent, with an expiration time of around 40 years.
        # After it is updated, the expiration time is corrected.
        if val["name"] == "CookieConsent" or val["consent_expiry"] is None:
            continue
        total_cookies += 1
        total_domains.add(val["site_url"])

        if val["consent_expiry"].lower() == "session":
            for v in val["variable_data"]:
                if not v["session"]:
                    found_inconsistency(key, val, v, "persistent_as_session")
                    pers_as_session_count += 1
                    break
        elif val["consent_expiry"].lower() in ["persistent", "persistant"]:
            for v in val["variable_data"]:
                if v["session"]:
                    found_inconsistency(key, val, v, "session_as_persistent")
                    sess_as_persistent += 1
                    break
        elif val["consent_expiry"]:
            for v in val["variable_data"]:
                if v["session"]:
                    found_inconsistency(key, val, v, "session_as_persistent")
                    sess_as_persistent += 1
                    break
                else:
                    converted = convert_consent_expiry_to_seconds(val["consent_expiry"], val["cmp_type"])
                    if converted != -1:
                        diff = abs(v["expiry"] - converted)
                        if diff >= min_diff and v["expiry"] > converted * 1.5:
                            found_inconsistency(key, val, v, diff)
                            wrong_expiry += 1
                            break
                    else:
                        logger.warning(f"Skipped because could not convert date: {val['consent_expiry']}")
                        break
        else:
            logger.info(f"Expiry string was empty for cookie: {val['name']};{val['domain']}")
    conn.close()

    logger.info(f"Number of cookies with expiries: {total_cookies}")
    logger.info(f"Number of inconsistencies: {inconsistency_count}")
    logger.info(f"Total number of domains that specified an expiration date: {len(total_domains)}")
    logger.info(f"Number of sites with inconsistencies: {len(inconsistency_domains)}")

    v_per_cmp = [0, 0, 0]
    for url, violating_cookies in inconsistency_details.items():
        for c in violating_cookies:
            assert (c["cmp_type"] >= 0)
            v_per_cmp[c["cmp_type"]] += 1

    logger.info(f"Inconsistencies per CMP Type: {v_per_cmp}")
    logger.info(f"Number of persistent cookies declared as session cookies: {pers_as_session_count}")
    logger.info(f"Number of session cookies declared as persistent cookies: {sess_as_persistent}")
    logger.info(f"Number of persistent cookies with wrong expiration date: {wrong_expiry}")

    if cargs["--out_path"]:
        out_path = cargs["--out_path"]
    else:
        out_path = "./violation_stats/"
    write_json(inconsistency_details, "method3_cookies.json", out_path)
    write_vdomains(inconsistency_domains, "method3_domains.txt", out_path)

    return 0


if __name__ == '__main__':
    exit(main())
