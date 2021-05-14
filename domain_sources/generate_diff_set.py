# Copyright (C) 2021 Dino Bollinger, ETH Zürich, Information Security Group
# Released under the MIT License
"""
Very simple utility script to generate the difference between two tranco domain lists.

Used to remove duplicate domains.
"""

set_a = set()
set_b = set()


# Load Tranco 1 Million
count = 0

with open("Tranco_Worldwide_05_May_2021/tranco_P63J-1m.csv", 'r') as fd:
    for line in fd:
        set_a.add(line.strip().split(sep=",")[1])
        count += 1

print(f"Num total: {count}")


# Load all paid domains present in Google Chrome survey, from the region Europe.
count = 0

with open("Tranco_Worldwide_05_May_2021/tranco_9YK2.csv", 'r') as fd:
    for line in fd:
        set_b.add(line.strip().split(sep=",")[1])
        count += 1

print(f"Num top europe: {count}")


# Compute domains that are not present in top 1 million
new_domains = sorted(set_b - set_a)
print(f"Num new URLs: {len(new_domains)}")

with open("./new_domains.txt", 'w') as fd:
    for n in new_domains:
        fd.write(n + "\n")
