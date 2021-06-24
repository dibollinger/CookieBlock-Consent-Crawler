# Copyright (C) 2021 Dino Bollinger, ETH Zürich, Information Security Group
# Released under the MIT License
"""
Uses cookiepedia to query for cookie labels, compares it to the labels collected from the CMP.
Computers confusion matrix and precision/recall.
Requires a cookiepedia knowledge lookup dictionary to work.

Usage:
    cookiepedia_baseline.py <tr_data>...
"""

from docopt import docopt
from typing import Any, Dict
from sklearn.model_selection import train_test_split, KFold

from sklearn.metrics import balanced_accuracy_score
from statistics import mean, stdev
from enum import IntEnum

import numpy as np
import os
import traceback
import json
import pickle
import re

import logging

logger = logging.getLogger("cp-baseline")

class CookieCategories(IntEnum):
    Unrecognized = -1
    Necessary = 0
    Functional = 1
    Analytical = 2
    Advertising = 3
    Unknown = 4

# Dictionary to prevent us from having to repeatedly query the same cookie names from Cookiepedia
cookiepedia_knowledge = dict()

def compute_stats(confusion_matrix):
    num_classes = 4

    # Output Precision + Recall
    precision_vector = np.zeros(num_classes)
    recall_vector = np.zeros(num_classes)
    f1_score_vector = np.zeros(num_classes)
    for i in range(num_classes):
        precision = confusion_matrix[i, i] / np.sum(confusion_matrix[:, i])
        recall = confusion_matrix[i, i] / np.sum(confusion_matrix[i, :])
        precision_vector[i] = precision
        recall_vector[i] = recall
        f1_score_vector[i] = 2 * ((precision * recall) / (precision + recall))

    logger.info(f"Total Sum: {np.sum(confusion_matrix)}")

    acctotal = np.sum(np.diag(confusion_matrix)) / np.sum(confusion_matrix) * 100.0

    #logger.info("With Unknown Category")
    #logger.info(f"Confusion Matrix: \n{confusion_matrix}")
    #logger.info(f"Total Accuracy: {acctotal:.3f}%")
    #logger.info(f"Precision: {precision_vector}")
    #logger.info(f"Macro Precision: {mean(precision_vector):.3f}")
    #logger.info(f"Recall: {recall_vector}")
    #logger.info(f"Macro Recall: {mean(recall_vector):.3f}")
    #logger.info(f"F1 Score: {f1_score_vector}")
    #logger.info("------------------------------------------------------------")
    confusion_matrix = confusion_matrix[:, :4]
    precision_vector = np.zeros(num_classes)
    recall_vector = np.zeros(num_classes)
    f1_score_vector = np.zeros(num_classes)
    for i in range(num_classes):
        precision = confusion_matrix[i, i] / np.sum(confusion_matrix[:, i])
        recall = confusion_matrix[i, i] / np.sum(confusion_matrix[i, :])
        precision_vector[i] = precision
        recall_vector[i] = recall
        f1_score_vector[i] = 2 * ((precision * recall) / (precision + recall))

    acctotalnm = np.sum(np.diag(confusion_matrix)) / np.sum(confusion_matrix) * 100.0

    logger.info("\nWithout Unknown Category")
    logger.info(f"Confusion Matrix: \n{confusion_matrix}")
    logger.info(f"Total Accuracy: {acctotalnm:.3f}%")
    logger.info(f"Precision: {precision_vector}")
    logger.info(f"Macro Precision: {mean(precision_vector):.3f}")
    logger.info(f"Recall: {recall_vector}")
    logger.info(f"Macro Recall: {mean(recall_vector):.3f}")
    logger.info(f"F1 Score: {f1_score_vector}")
    logger.info("------------------------------------------------------------")
    return acctotal, acctotalnm

def main():
    """
    Query Cookiepedia
    :return:
    """
    argv = None

    # Init docopt and stream handler
    cargs = docopt(__doc__, argv=argv)
    logger.setLevel(logging.INFO)
    sh = logging.StreamHandler()
    sh.setLevel(logging.INFO)
    logger.addHandler(sh)

    fh = logging.FileHandler("baseline_stats.log")
    fh.setLevel(logging.INFO)
    logger.addHandler(fh)

    acctotal_list = []
    acctotalnm_list = []

    #with open("cookiepedia_knowledge_repo.pkl", 'rb') as fd:
    #    cookiepedia_knowledge = pickle.load(fd)

    name_lookup = dict()
    with open("cookiepedia_lookup_June4_complete.pkl", 'rb') as fd:
        name_lookup = pickle.load(fd)

    # load the inputs and check for errors
    input_data: Dict[str, Dict[str, Any]] = dict()
    for t in cargs["<tr_data>"]:
        try:
            if os.path.exists(t):
                with open(t, 'r') as fd:
                    t_data = json.load(fd)
            else:
                logger.error(f"Invalid data path specified: {t}")
                return 1
        except json.JSONDecodeError:
            logger.error(f"Input data is not a valid JSON file: {t}")
            logger.error(traceback.format_exc())
            return 2

        logger.info(f"Successfully retrieved json data from '{t}'")
        input_data = {**input_data, **t_data}

    logger.info(f"Number of cookies loaded: {len(input_data)}")
    #train, test = train_test_split(input_data.values(), test_size=0.2, shuffle=True)
    kf = KFold(n_splits=5, shuffle=True)
    cookies = list(input_data.values())

    #rrr = re.compile("\('(.*)',.*,.*\)")
    #name_lookup = dict()
    #for key, value in cookiepedia_knowledge.items():
    #    mobj = rrr.match(key)
    #    if mobj:
    #        name_lookup[mobj.group(1)] = value

    count_unlabel = 0

    unknown_names = set()
    total_unknown = 0
    total_unknown_name = 0
    for k in cookies:
        key = str((k["name"], k["domain"], k["path"]))
        #if key not in cookiepedia_knowledge:
        #    total_unknown += 1
        if k["name"] not in name_lookup:
            total_unknown_name += 1
            unknown_names.add(k["name"])
        else:
            if name_lookup[k["name"]][1] in ("Unknown", "Not Found", "Connection Failed"):
                count_unlabel += 1

    print(f"Number of cookies Cookiepedia doesn't recognize: {count_unlabel}")

    with open("unknown_names.txt", 'w') as fd:
        for k in unknown_names:
            fd.write(k + "\n")

    with open("known_names.txt", 'w') as fd:
        for k, v in name_lookup.items():
            fd.write(f"{k},{v}\n")


    unknown_count = 0
    for train_indices, test_indices in kf.split(cookies):
        confusion_matrix = np.zeros((5, 4))

        a_list = []
        b_list = []
        for i in test_indices:
            key = str((cookies[i]["name"], cookies[i]["domain"], cookies[i]["path"]))
            actual_label = int(cookies[i]["label"])

            if cookies[i]["name"] not in name_lookup: #cookiepedia_knowledge:
                unknown_count += 1
                continue

            cookiepedia_label = name_lookup[cookies[i]["name"]][1] # cookiepedia_knowledge[key]

            predicted_label = -1
            if cookiepedia_label == "Strictly Necessary":
                predicted_label = 0
            elif cookiepedia_label == "Functionality":
                predicted_label = 1
            elif cookiepedia_label == "Performance":
                predicted_label = 2
            elif cookiepedia_label == "Targeting/Advertising":
                predicted_label = 3
            elif cookiepedia_label in ("Unknown", "Not Found", "Connection Failed"):
                predicted_label = 4
            else:
                raise ValueError(f"Unexpected content: {cookiepedia_label}")

            confusion_matrix[predicted_label][actual_label] += 1

            if predicted_label != 4:
                a_list.append(actual_label)
                b_list.append(predicted_label)

        logger.info(f"Balanced Accuracy: {balanced_accuracy_score(a_list,b_list)}")
        logger.info(f"Unknown Count: {unknown_count}")
        confusion_matrix = np.transpose(confusion_matrix)
        acc_total, acc_no_missing = compute_stats(confusion_matrix)
        acctotal_list.append(acc_total)
        acctotalnm_list.append(acc_no_missing)

    logger.info(f"Total Unknowns: {total_unknown}")
    logger.info(f"Unknown by name: {total_unknown_name}")
    logger.info(f">> Average Total Accuracy with missing Info: {mean(acctotal_list):.3f}")
    logger.info(f">> Stddev Accuracy with missing Info: {stdev(acctotal_list):.3f}")
    logger.info(f"!! Average Total Accuracy without missing Info: {mean(acctotalnm_list):.3f}")
    logger.info(f"!! Stddev Accuracy without missing Info: {stdev(acctotalnm_list):.3f}")

if __name__ == '__main__':
    exit(main())
