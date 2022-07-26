# Copyright (C) 2021-2022 Dino Bollinger, ETH Zürich, Information Security Group
# Released under the MIT License
"""
Takes as input an analysis file produced by cookie_stats.py in mode 6/7 and computes Cookiepedia's overall accuracy based on it.
"""
import re
import numpy as np
import sys

if len(sys.argv) < 2:
    print("error: need to specify analysis file")
    exit(1)


num_classes = 4

confusion_matrix = np.zeros((5,4))

with open(sys.argv[1], 'r') as fd:
    for line in fd:
        l = line.strip()
        entries = l.split("|")
        mobj = re.match("\[([0-9]+), ([0-9]+), ([0-9]+), ([0-9]+), ([0-9]+), ([0-9]+), ([0-9]+)\]", entries[2])
        if mobj is None:
            print("Unparseable line:")
            print(line)
            continue

        nec_count = int(mobj.group(1))
        func_count = int(mobj.group(2))
        anal_count = int(mobj.group(3))
        adv_count = int(mobj.group(4))


        if entries[4] == "Strictly Necessary":
            confusion_matrix[0][:] += np.array([nec_count,func_count,anal_count,adv_count])
        elif entries[4] == "Functionality":
            confusion_matrix[1][:] += np.array([nec_count,func_count,anal_count,adv_count])
        elif entries[4] == "Performance":
            confusion_matrix[2][:] += np.array([nec_count,func_count,anal_count,adv_count])
        elif entries[4] == "Targeting/Advertising":
            confusion_matrix[3][:] += np.array([nec_count,func_count,anal_count,adv_count])
        elif entries[4] == "Unknown":
            confusion_matrix[4][:] += np.array([nec_count,func_count,anal_count,adv_count])
        elif entries[4] == "Not Found":
            confusion_matrix[4][:] += np.array([nec_count,func_count,anal_count,adv_count])
        elif entries[4] == "Connection Failed":
            print("Connection Failed")
            print(line)
        else:
            raise ValueError(f"Unexpected content: {entries[4]}")

confusion_matrix = np.transpose(confusion_matrix)

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

print(f"Total Sum: {np.sum(confusion_matrix)}")

print("With Unknown Category")
print(f"Confusion Matrix: \n{confusion_matrix}")
print(f"Total Accuracy: {np.sum(np.diag(confusion_matrix)) / np.sum(confusion_matrix) * 100.0:.3f}%")
print(f"Precision: {precision_vector}")
print(f"Recall: {recall_vector}")
print(f"F1 Score: {f1_score_vector}")


confusion_matrix = confusion_matrix[:,:4]
precision_vector = np.zeros(num_classes)
recall_vector = np.zeros(num_classes)
f1_score_vector = np.zeros(num_classes)
for i in range(num_classes):
    precision = confusion_matrix[i, i] / np.sum(confusion_matrix[:, i])
    recall = confusion_matrix[i, i] / np.sum(confusion_matrix[i, :])
    precision_vector[i] = precision
    recall_vector[i] = recall
    f1_score_vector[i] = 2 * ((precision * recall) / (precision + recall))

print("\nWithout Unknown Category")
print(f"Confusion Matrix: \n{confusion_matrix}")
print(f"Total Accuracy: {np.sum(np.diag(confusion_matrix)) / np.sum(confusion_matrix) * 100.0:.3f}%")
print(f"Precision: {precision_vector}")
print(f"Recall: {recall_vector}")
print(f"F1 Score: {f1_score_vector}")
