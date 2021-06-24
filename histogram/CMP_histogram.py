# Copyright (C) 2021 Dino Bollinger, ETH Zürich, Information Security Group
# Released under the MIT License
"""
This is a script that takes the database of crawled websites (with the OpenWPM Consent Crawler),
the ranking of Tranco domains, and then computes a histogram of how many websites contain a CMP
at which positions.

Usage:
    CMP_histogram.py <database> <tranco_csv>

Options:
    -h   Show this usage message
"""

from docopt import docopt
from urllib.parse import urlparse
import logging
import sqlite3
import os
import re

import numpy as np
import matplotlib.pyplot as plt

logger = logging.getLogger("main")
cmp_types = [0, 1, 2]
binrange_tiny = [*range(0, 110, 10)]
binrange_small = [*range(0, 1100, 100)]
binrange_medium = [*range(0, 11000, 1000)]
binrange_large = [*range(0, 110000, 10000)]
binrange_huge = [*range(0, 1010000, 10000)]
binrange_all = [*range(0, 6100000, 100000)]


def cmp_query(i):
    return f"""SELECT DISTINCT s.site_url
               FROM consent_crawl_results c
               JOIN site_visits s ON s.visit_id == c.visit_id
               WHERE c.cmp_type == {i} and c.crawl_state == 0"""

def setupLogger() -> None:
    # log to stderr
    ch = logging.StreamHandler()
    ch.setLevel(logging.INFO)
    logger.addHandler(ch)
    logger.setLevel(logging.INFO)

    logger.info("logger initialized")


def uniform_domain_transform(url):
    domain = urlparse(url.strip()).netloc
    domain = re.sub("^\\.", "", domain)
    domain = re.sub("^http(s)?://", "", domain)
    domain = re.sub("^\\.", "", domain)
    domain = re.sub("^www\.", "", domain)
    domain = re.sub("/.*$", "", domain)
    return domain


def main() -> int :
    argv = None
    args = docopt(__doc__, argv)
    setupLogger()

    database_path = args["<database>"]
    tranco_csv = args["<tranco_csv>"]

    if not (os.path.exists(database_path) and os.path.exists(tranco_csv)):
        logger.error("One of the specified files doesn't exist.")
        return 1

    lookup = {}
    with open(tranco_csv, 'r') as fr:
        for line in fr:
            rank, domain = line.split(sep=",")
            lookup[domain.strip()] = rank


    # enable dictionary access by column name, access database
    conn = sqlite3.connect(database_path)
    conn.row_factory = sqlite3.Row

    with conn:
        cur = conn.cursor()
        for c in cmp_types:
            cur.execute(cmp_query(c))
            missing = []
            newd = []
            for row in cur:
                dclean = uniform_domain_transform(row["site_url"])
                if dclean in lookup:
                    rank = lookup[dclean]
                    newd.append((rank,dclean))
                else:
                    missing.append(dclean)

            hi, bin_edges = np.histogram([int(r) for r, _ in newd], bins=binrange_huge)
            logger.info(f"Number of websites with CMP Type {c} in top 1 million: {sum(hi)} -- {sum(hi) / 1000000.0 :.5f}")
            #logger.info(hi)
            #logger.info(bin_edges)

            brcount = 0
            for br in [binrange_tiny, binrange_small, binrange_medium, binrange_large, binrange_huge, binrange_all]:
                plt.clf()
                n, bins, patches = plt.hist(x=[int(r) for r, _ in newd], bins=br, color='#0504aa', alpha=0.7, rwidth=0.85)
                plt.grid(axis='y', alpha=0.75)
                plt.xlabel('rank')
                plt.ylabel('count')
                plt.title('Occurrence of CMPs on Tranco ranking')
                plt.text(23, 45, r'$\mu=15, b=3$')
                maxfreq = n.max()
                plt.ylim(ymax=np.ceil(maxfreq / 10) * 10 if maxfreq % 10 else maxfreq + 10)
                plt.savefig(f"histogram_cmptype{c}_br{brcount}.png")
                brcount += 1

            with open(f"cmp_result{c}.csv", 'w') as fw:
                for rank, dclean in sorted(newd, key=lambda x : int(x[0])):
                    fw.write(f"{rank},{dclean}\n")

            with open(f"cmp_missing{c}.csv", 'w') as fw:
                for c in sorted(missing):
                    fw.write(c + "\n")




    conn.close()

    return 0


if __name__ == "__main__":
    exit(main())
