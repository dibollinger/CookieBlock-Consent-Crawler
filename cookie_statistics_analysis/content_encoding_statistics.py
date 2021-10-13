# Copyright (C) 2021 Dino Bollinger, ETH Zürich, Information Security Group
# Released under the MIT License
"""
Extract statistics about the usage of JSON, javascript objects, base64 and CSV separation,
as well as the use of UTF-8 characters in the content of cookie updates.

Requires the cookie data to be provided in JSON format.
See the example_input folder and the script "database_scripts/extract_cookies_from_db.py" for more information.

Usage:
    content_encoding_statistics <training_data>

Options:
    -h --help    Show this help message.
"""

import json
import urllib.parse
import base64
import js2py
import csv
import re
import os

from docopt import docopt
from typing import Union, List, Dict

from tqdm import tqdm

# global counters

# this counter is uncertain. These values may be base64, as they match the format, but this may be coincidence.
ctr_potential_base64_encoded_binary: int = 0
# count the number of base64 encodings we are certain about. These contain UTF-8 encoded values.
ctr_base64_encoded_strings: int = 0
# count the number of cookie strings that are definitely not base64
ctr_not_base64_encoded: int = 0

# constant. Minimum length for a string to be considered a base64 value, to reduce the number of potential false positives
MINB64LEN: int = 16

# Types accepted by the function below
CookieContentTypes = Union[List, Dict, bool, int, float, str, js2py.base.JsObjectWrapper]


def checkb64(input_object: CookieContentTypes) -> None:
    """
    Recursive function for checking whether the content of a CSV, Dict or otherwise
    is a base64 encoded string. Increments the global counter for each individual
    base64 value we find.
    :param input_object: A primitive type or list/container containing cookie data.
    """
    global ctr_not_base64_encoded, ctr_base64_encoded_strings, ctr_potential_base64_encoded_binary
    if input_object is None or type(input_object) in (bool, int, float):
        ctr_not_base64_encoded += 1
    elif type(input_object) is js2py.base.JsObjectWrapper:
        try:
            transformed_to_dict = input_object.to_dict()
            checkb64(transformed_to_dict)
        except Exception:
            ctr_not_base64_encoded += 1
    elif type(input_object) is dict:
        for key in input_object:
            checkb64(key)
            checkb64(input_object[key])
    elif type(input_object) is list:
        for l in input_object:
            checkb64(l)
    elif isinstance(input_object, str):
        if len(input_object) < MINB64LEN:
            ctr_not_base64_encoded += 1
        else:
            try:
                #b64decoded = base64.urlsafe_b64decode(unquoted_content)
                b64decoded = base64.b64decode(input_object)
                b64decoded.decode("utf-8")
                ctr_base64_encoded_strings += 1
            except UnicodeDecodeError:
                ctr_potential_base64_encoded_binary += 1
            except (base64.binascii.Error, ValueError):
                ctr_not_base64_encoded += 1
    else:
        raise RuntimeError("Unexpected Type")


def main() -> int:
    """
    Extract statistics about the content encodings of cookies.
    :return: exit code
    """
    global ctr_not_base64_encoded, ctr_base64_encoded_strings, ctr_potential_base64_encoded_binary

    argv = None
    #argv = ["../training_data/tranco_training_cookies_20201125_231612.json"]
    # argv = ["../training_data/cookiepedia_training_cookies_20201130_161942.json"]
    cargs = docopt(__doc__, argv=argv)

    input_file: str = cargs["<training_data>"]

    if os.path.exists(input_file):
        with open(input_file) as fd:
            training_data = json.load(fd)
    else:
        print(f"Did not find input file '{input_file}'")
        return 1

    # training_data = {"example": { "variable_data": [ {"value": "{stamp:%27+5dSZH3Ijxf4Kmt7FaTIvhheXertoIlYT4iM1c0WX4WjftpIkYbJnw==%27%2Cnecessary:true%2Cpreferences:true%2Cstatistics:true%2Cmarketing:true%2Cver:1%2Cutc:1606342686111%2Cregion:%27nl%27}"}]}}

    # Local counters
    ctr_total: int = 0
    ctr_was_quoted: int = 0
    ctr_ascii: int = 0
    ctr_utf8: int = 0
    ctr_javascript_objects: int = 0
    ctr_json_objects: int = 0
    ctr_no_split: int = 0
    ctr_csv: int = 0

    sniffer: csv.Sniffer = csv.Sniffer()
    valid_delimiters: str = ",|#:;&.% "
    delimiter_counts: Dict[str, int] = {",":0, "|":0, "#":0, ":":0, ";":0, "&":0, ".":0, "%":0, " ":0}

    try:
        for t in tqdm(training_data.values()):
            for c in t["variable_data"]:
                ctr_total += 1
                cookie_content = c["value"]
                unquoted = urllib.parse.unquote(cookie_content)

                # check is cookie update content was URL encoded
                if unquoted != cookie_content:
                    ctr_was_quoted += 1

                # check if cookie update content can be decoded in ASCII
                try:
                    unquoted.encode("utf-8").decode("ascii")
                    ctr_ascii += 1
                except UnicodeDecodeError:
                    ctr_utf8 += 1

                result_object: Union[None, dict, list, js2py.base.JsObjectWrapper] = None
                contains_json_or_jsobject = "{" in unquoted

                # First, try JSON format
                if contains_json_or_jsobject:
                    try:
                        result_object = json.loads(unquoted)
                        ctr_json_objects += 1
                    except json.decoder.JSONDecodeError:
                        pass

                # If still None, JSON approach failed, try javascript object
                if contains_json_or_jsobject and result_object is None:
                    try:
                        javascript_func = js2py.eval_js("function get_dict() { return " + unquoted + " }")
                        result_object = javascript_func()
                        ctr_javascript_objects += 1
                    except (js2py.internals.simplex.JsException, NotImplementedError):
                        pass

                # If still None, might be a Delimiter Separated String
                if result_object is None:
                    try:
                        if not re.search("http(s)?://", unquoted):
                            dialect = sniffer.sniff(unquoted, valid_delimiters)
                            if unquoted.count(dialect.delimiter) >= 1:
                                result_object = list(csv.reader((unquoted,), dialect))
                                delimiter_counts[dialect.delimiter] += 1
                                ctr_csv += 1
                    except csv.Error:
                        pass

                # Finally, if it was a split value, check contents, else, check unquoted string directly
                if result_object is None:
                    ctr_no_split += 1
                    checkb64(unquoted)
                else:
                    checkb64(result_object)
    except KeyboardInterrupt:
        pass

    outpath = ".stats_out/encoding_stats_new.txt"
    with open(outpath, 'w') as fd:
        fd.write(f"Encoding Statistics for '{input_file}'\n")
        fd.write("-----------------------------------------\n")
        fd.write(f"Total number of cookie updates: {ctr_total}\n")
        fd.write(f"Number of cookie updates that were URL encoded: {ctr_was_quoted}\n")
        fd.write(f"Number of ascii content strings: {ctr_ascii}\n")
        fd.write(f"Number of utf-8 only content strings: {ctr_utf8}\n\n")

        fd.write(f"Number of javascript object content: {ctr_javascript_objects}\n")
        fd.write(f"Number of json content: {ctr_json_objects}\n")
        fd.write(f"Number of csv content: {ctr_csv}\n")
        fd.write(f"Delimiter counts: {delimiter_counts}\n")
        fd.write(f"No split at all: {ctr_no_split}\n\n")

        fd.write(f"Number of base 64 encoded strings: {ctr_base64_encoded_strings}\n")
        fd.write(f"Number of base 64 encoded binary values: {ctr_potential_base64_encoded_binary}\n")
        fd.write(f"Number not b64 encoded: {ctr_not_base64_encoded}\n")

    print(f"Results written to '{outpath}'")

    return 0

if __name__ ==  "__main__":
    exit(main())
