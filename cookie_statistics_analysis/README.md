
# Cookie Statistics Analysis
This subfolder contains scripts that serve to extract cookie statistics from a cookie data JSON.
It also contains scripts to query the Cookiepedia repository and thus retrieve the evaluation for the baseline.

The input data must be provided in the form of JSON, as extracted by `database_scripts/extract_cookie_data.py`.

## Folder Contents

* `example_input`: Contains a small example JSON computed from a crawl of ~600 websites, 200 for each supported CMP.
* `stats_out`: Target folder for all statistics scripts.
* `content_encoding_statistics.py`: Verifies whether certain features can be found in the given cookie data JSON. 
   This involves JSON and CSV separated data, as well as base64 and URL encoding.
* `cookie_stats.py`: Generally a script used to check how often a cookie name and domain appears, compute majority deviation and lower-bounds noise analysis, and similar stats.
   Also queries the Cookiepedia repository to retrieve cookie labels, to compare them to the majority opinion. Supports 8 different modes.
* `cookiepedia_baseline.py`: Computes the confusion matrix + precision and recall statistics based on the cookiepedia baseline. Uses 5-folds to take an average score.
* `cookiepedia_repo.py`: Simple script to create a cookie - label lookup table from the retrieved Cookiepedia results.
* `get_cookiepedia_accuracy.py`: Computes the accuracy over all cookie samples, no splitting. Requires the outputs of `cookie_stats.py`.
