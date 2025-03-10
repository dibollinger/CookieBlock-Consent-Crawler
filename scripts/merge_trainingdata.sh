#!/bin/bash

# Script used to merge all json files given via arguments.
# Remove the -c to get pretty json

# Example ./scripts/merge_trainingdata.sh crawl_data_A.json crawl_data_B.json crawl_data_C.json > merged_trainingdata.json

jq -cs add $@


