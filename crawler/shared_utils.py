"""
Shared functions for Consent and Presence crawler
Copyright (c) 2021  Dino Bollinger, ETH Zürich, Information Security Group

This program is free software: you can redistribute it and/or modify
it under the terms of the GNU General Public License as published by
the Free Software Foundation, either version 3 of the License, or
(at your option) any later version.

This program is distributed in the hope that it will be useful,
but WITHOUT ANY WARRANTY; without even the implied warranty of
MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
GNU General Public License for more details.

You should have received a copy of the GNU General Public License
along with this program.  If not, see <https://www.gnu.org/licenses/>.
"""

import os
import sys
import pickle
import re

from typing import List, Set, Dict


def retrieve_cmdline_urls(cargs: Dict) -> Set[str]:
    """
    Retrieve URLs to be crawled from the docopt input arguments.
    Expected keys are: --url, --pkl and --file
    Will not verify whether the input is a valid URL.
    @param cargs: docopt arguments
    @return: set of unique strings, assumed to be URLs
    """
    sites: Set[str] = set()

    # Retrieve URLs directly from command line
    for u in cargs["--url"]:
        sites.add(u)

    # Retrieve data from pickle files
    for p in cargs["--pkl"]:
        if os.path.exists(p):
            with open(p, 'rb') as fd:
                contents = pickle.load(fd, encoding="utf-8")
                for c in contents:
                    sites.add(c)
        else:
            print(f"Provided pickle file path is invalid: \"{p}\"", file=sys.stderr)

    # Retrieve urls from plaintext files, one url per line
    for fn in cargs["--file"]:
        if os.path.exists(fn):
            with open(fn, 'r', encoding="utf-8") as fd:
                for line in fd:
                    line_no_trail: str = line.strip()
                    if len(line_no_trail) == 0 or line_no_trail.startswith("#"):
                        continue
                    line_no_trail = line_no_trail.split()[0]
                    sites.add(line_no_trail)
        else:
            print(f"Provided plaintext file path is invalid: \"{fn}\"", file=sys.stderr)

    # No header, expected format per line: ranking,domain
    for csvfn in cargs["--csv"]:
        if os.path.exists(csvfn):
            with open(csvfn, 'r') as fd:
                for line in fd:
                    domain = line.split(sep=",")[1].strip()
                    sites.add(domain)
        else:
            print(f"Provided csv path is invalid: \"{csvfn}\"", file=sys.stderr)

    return sites


def filter_bad_urls_and_sort(sites: Set[str]) -> List[str]:
    """
    Filters out bad urls and comments, sorts the result.
    @param sites: urls to filter
    @return: sorted urls
    """
    to_sort = []
    for url in sites:
        if not url or len(url.strip()) == 0 or url.startswith("#"):
            continue
        elif not re.match("^http[s]?://", url, re.IGNORECASE):
            to_sort.append("https://www." + url)
        else:
            to_sort.append(url)
    return sorted(to_sort)
