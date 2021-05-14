# Copyright (C) 2021 Dino Bollinger, ETH Zürich, Information Security Group
# Released under the MIT License
"""
Takes as input an analysis file produced by cookie_stats.py in mode 6/7 and produces a lookup file.
This lookup file can then be used with cookiepedia_baseline.py.
"""
import numpy as np
import sys
import pickle

cookiepedia_knowledge = dict()

if len(sys.argv) < 2:
    print("error: need to specify analysis file")
    exit(1)

num_classes = 4

confusion_matrix = np.zeros((5,4))

with open(sys.argv[1], 'r') as fd:
    for line in fd:
        l = line.strip()
        entries = l.split("|")

        if entries[0] not in cookiepedia_knowledge:
            cookiepedia_knowledge[entries[0]] = entries[4]


print(f"Number of unique entries: {len(cookiepedia_knowledge)}")

with open("cookiepedia_knowledge_repo.pkl", 'wb') as fd:
    pickle.dump(cookiepedia_knowledge, fd, pickle.HIGHEST_PROTOCOL)

