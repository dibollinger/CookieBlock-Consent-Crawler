# Database Scripts

This subfolder contains scripts to perform operations on the database produced by the consent label crawler.

This includes altering/sanetizing the database using SQL commands as well as extracting the JSON training data
from the retrieved database of cookies.

## Folder Contents

`example_db/`: Contains a database produced from a consent crawl targetting 300 domains, 100 for each CMP.

---

`sql_commands/`: Contains queries, commands and assertions which may be useful. Some of these are used by `post_process_db.py`.

---

`stats/`: Target folder for the statistics files as output by: `post_process_db.py`

---

`training_data_output/`: Contains the training data, i.e. the JSON files produced by `extract_cookie_data.py`.

---

`extract_cookie_data.py`:

Matches the observed cookies stored in the `javascript_cookies` table with the declarations in the `consent_data`
table of the given input database by name and domain. This produces a list of cookies with associated consent
label and purpose description, which can be used as input to a classifier.

Any cookies that do not belong to the main 4 categories `(0: necessary, 1: functional, 2: analytics, 3: advertising)`
are filtered out from the resulting dataset. Cookie deletions are ignored.

Output JSON structure:
```
[
 "cookie_id_01": {
   "name": "<name>",
   "domain": "<domain>",
   "path": "/path",
   "cmp_origin": [0-2],
   "label": [0-3],
   "variable_data": [
     {
     "value": "<cookie content>",
     "expiry": "<expiration in seconds>",
     "session": true/false,
     "http_only": true/false,
     "host_only": true/false,
     "secure": true/false,
     "same_site": "no restriction"/"lax"/"strict"
     },
     ...
   ]
 },
 "cookie_id_02 : {
    ...
 },
 ...
]
```
Where `variable_data` contains all updates for a single cookie.

In addition, some statistics are also produced, such as counts of cookies per CMP.

---

`post_process_db.py`:

   First, backs up the database. Then, cleans empty tables out of the database and runs some sanity checks on them.
   Next, it creates a number of views inside the database to allow easier analysis of certain datapoints in the database.

   Finally, it runs a number of queries to output a large range of statistics. This includes:
   - Total URLs visited.
   - Number of successful CMP crawls.
   - Number of CMP crawl failures.
   - How many crawls were interrupted before retrieving the CMP data?
   - How many crawls were interrupted during the browse phase?
   - All errors ordered by type.
   - Number of cookies in database
   - Number of declarations in database
   - How many unique cookies and declarations
   - Cookie counts separated by purpose.
