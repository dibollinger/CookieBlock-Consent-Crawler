# CookieBlock Consent Webcrawler

* [Description](#description)
* [Installation](#installation)
  * [Requirements](#requirements)
  * [Install Script](#install-script)
  * [Developer Instructions](#developer-instructions)
  * [Troubleshooting](#troubleshooting)
* [Presence Crawler](#presence-crawler)
  * [Usage](#usage-presence-crawler)
  * [Arguments](#arguments-presence-crawler)
  * [Output](#output-presence-crawler)
* [Consent Crawler](#consent-crawler)
  * [Usage](#usage-consent-crawler)
  * [Arguments](#arguments-consent-crawler)
  * [Output](#output-consent-crawler)
* [Directory Contents](#directory-contents)
* [License](#license)

## Description

The crawlers in this directory allow the user to scrape websites for cookie consent
purposes if the target website makes use of one of the supported Consent Management Providers (CMPs).

It automatically retrieves purpose categories for cookies if possible, and browses the subpages of the site to record the actual cookie data.

Currently supported by the scripts are the Consent Management Providers:
* __Cookiebot__
* __OneTrust__
* (not yet) __Termly__

Due to the GDPR, websites that offer their services to users connecting from countries in the
EU are required to request consent for storing cookies on the browser. This is commonly
accomplished using consent notices offered by Consent Management Providers.

These consent notices provide toggles for the visitor to accept or reject cookie
categories, which can display detailed information of the purpose of each cookie.
This crawler specifically targets consent notices that display such information,
for the purpose of gathering a dataset of cookie with purposes.

Each cookie is assigned to one of the following purpose classes:

* __Strictly Necessary Cookies__: Cookies that are required for the website to function
    properly. These require no consent from the visitor and usually cannot be rejected.
* __Functional Cookies__: Cookies that provide additional services or improve the user
    experience, but are not strictly necessarily for the website to function. This
    includes cookies such as website style settings, user preferences, etc.
* __Performance/Analytical Cookies__: These are cookies that gather anonymized data
    from the user in order to report statistics of the website usage or website
    performance to the host. This data is used to improve the site and the browsing
    experience for the visitors.
* __Advertising/Tracking__: This category encompasses all cookies that are used for
    advertising and tracking. Often this also involves the collection of sensitive
    personal data, which may be sold to other interested parties. This is generally
    the category of cookies where privacy is the biggest concern.
* __Social Media__: Some cookies are explicitly declared as serving purposes of social media integration. These are rare, and it is difficult to distinguish these with functional or tracking cookies.
* __Uncategorized__: Some CMPs leave cookies uncategorized.
This category catches all such declarations.
* __Unknown__: Catch-all for the remaining categories. Some cannot easily be
    assigned to any of the above categories. This includes category labels such as
    "Information Storage and Access" or "Content Delivery".

If a cookie has multiple purposes assigned, the tool will generally assign the less privacy-preserving class.
This is ordered from most to least privacy-preserving as {"Necessary", "Functionality", "Analytics", "Advertising"}.

## Installation

Create a virtual environment and install all dependencies via `poetry` OR use the built docker image at `infsec-server.inf.ethz.ch/cb-cc/crawler` (when connected to the ETH network):

```python
python -m venv .venv
source .venv/bin/activate
pip install poetry
source .venv/bin/activate
poetry install
```

Afterwards make sure to have chrome installed via `./install_uc.sh`

### Developer instructions

## Upgrading chrome
* Find branch-position on https://chromiumdash.appspot.com/releases?platform=Linux by clicking on a desired version
* Search branch-position folder on https://commondatastorage.googleapis.com/chromium-browser-snapshots/index.html?prefix=Linux_x64/
    * There exists a search field but the
    * branch position may be off by +- 10. This can be accounted for by removing the last digit from the exact branch position
* Update download links in `./install_uc.sh` for the file `chromedriver_linux64.zip` and `chrome-linux.zip`

## Creating a profile
* Run `run_consent_crawl_uc.py` with `--launch-browser`
* Now you can make adjustments to the profile or the settings of the browser
* When finished (Ctrl+C in the terminal) one can create an archive via
    * ` tar -acf profile_NAME.tar.gz chrome_profile`
* This file can then later be used via the `--profile_tar` argument

### Troubleshooting

`Nothing yet`

## Presence Crawler
This is an efficient scraper that utilises `pebble` and the Python `requests` library. Its purpose is to filter out
potential candidates for the more costly crawl with a real browser, which uses actual browser instances. It verifies
whether the provided domains contain a Consent Management Provider from which we can extract category labels.

### Usage (Presence Crawler)
The script at `crawler/run_presence_crawl.py` accepts the following arguments:

    run_presence_crawl.py (--numthreads <NUM>) (--url <u> | --pkl <fpkl> | --file <fpath> | --csv <csvpath>)... [--batches <BCOUNT>]

    - The first required argument specifies the number of concurrent processes to launch to crawl domains with.
    - The second required argument specifies the domains to crawl.

    Options:
        -n --numthreads <NUM>       Required. Number of processes to run in parallel.
        -b --batches <BCOUNT>       Optional. Number of batches to split the input into. More batches lessens memory impact. [Default: 1]
        -u --url <u>                Domain string to check for reachability. Can take multiple.
        -p --pkl <fpkl>             Path to pickled domains. Can take multiple.
        -f --file <fpath>           Path to file containing one domain per line. Can be multiple.
        -c --csv <csvpath>          Path to csv containing domains in second column. Separator is ",". Can be multiple

### Arguments (Presence Crawler)

Parameter `-n` specifies the total number of parallel processes to use to perform the crawl.
The more processes can be used, the faster the crawl finishes, but the higher the RAM and CPU usage.

Parameter `-b` is used to split the input into batches.
After a batch is done, the result is flushed.
This is useful to reduce the memory impact and prevent crashes for large input sizes.

### Output (Presence-Crawler)

The presence crawl automatically attempts to find the correct URL for the given domain, and the
results are dumped into the subfolder  `./filtered_urls/`. Results are split into:
* `bot_responses`: Crawls that failed likely because a bot detection script prevented access to the website. These are HTTP errors 403 and 406.
* `cookiebot_responses`: URLs that contain a valid Cookiebot CDN domain in its page source.
* `failed_urls`: URLs for which the connection failed. (SSL errors are included)
* `http_responses`: URLs that reported a HTTP error which is not commonly associated with bot detection.
* `nocmp_responses`: URLs where no supported Consent Management Platform was found.
* `onetrust_responses`: URLs where the OneTrust CMP was found.
* `termly_responses`: URLs where the Termly CMP was found.

Note that this script does not guarantee that the resulting filtered URLs actually use the CMP that are
referenced on the HTML. It is still possible for the website to not have set up the CMP properly, or at all.
False negatives are also possible, as websites may not show all content when not loaded by an actual browser.

Best used with an active VPN connection to a country currently in the EU. Due to GDPR, this increases the
chance for the consent management platform to be shown to the user. In addition, Cookiebot uses region-blocking,
making crawling the data from outside the EU impossible.

## Consent Crawler
This is the undetected-chromedriver Crawler that retrieves the cookie labels with the associated cookies.
This script is noticeably slower than the Presence Crawl, as actual browser instances are used
to request and browse the websites. In contrast to simple GET requests, each browser takes up a
significant chunk of memory, and uses multiple threads for a single instance. This reduces the
potential concurrency that can be achieved.

### Usage (Consent Crawler)
The script at `./run_consent_crawl_uc.py` accepts the following arguments:

usage: run_consent_crawl_uc.py [-h] (-f FILE | --launch-browser | --url URL) [-n NUM_BROWSERS]
        [-d USE_DB] [--profile_tar PROFILE_TAR] [--no-headless] [--no-stdout]
        [--num-subpages NUM_SUBPAGES] [--timeout TIMEOUT]

options:
  -h, --help            show this help message and exit
  -f FILE, --file FILE  Path to file containing one URL per line
  --launch-browser      Only launches the browser which allows modification of the current profile
  -u --url URL          Url to crawl once
  -n NUM_BROWSERS, --num-browsers NUM_BROWSERS
                        Number of browsers to use in parallel
  -d USE_DB, --use-db USE_DB
                        Use specified database file to add rows to. Format: DATA_PATH/FILENAME.sqlite
  --profile_tar PROFILE_TAR
                        Location of a tar file containing the browser profile
  --no-headless         Start the browser with GUI (headless disabled)
  --no-stdout           Do not print crawl results to stdout
  --num-subpages NUM_SUBPAGES
                        Amount of links to follow when visiting a domain
  --timeout TIMEOUT     Amount of seconds to spend on one website


### Arguments (Consent Crawler)

The first positional argument defines which CMP to look for and extract category labels from.
If one specifies `all`, the crawl will look for each CMP in sequence until it finds a valid match.

Parameter `-n` specifies the number of concurrent browsers to use. Since each Firefox browser takes
up a large amount of memory and processing power, this number should be chosen conservatively.

Parameter `--use_db <DB_NAME>` specifies the given SQLite database as output path. If not provided,
a new database will be created inside the subfolder `./collected_data`. This is useful for continuing
crawls if one was interrupted prematurely.


### Output (Consent Crawler)

The results of the crawl are by default written into a newly created sqlite database. OpenWPM creates
a large number of tables by default, the most relevant for the consent crawl are the following:

__consent_data__: Stores declared cookies collected from the consent notice, including purpose label.

    TABLE consent_data
        id INTEGER PRIMARY KEY,           -- Unique record identifier.
        browser_id INTEGER NOT NULL,      -- Index of browser instance that collected the data.
        visit_id INTEGER NOT NULL,        -- A unique foreign key corresponding to the website that was targetted.
        name TEXT NOT NULL,               -- Cookie name as specified in the consent notice declaration.
        domain TEXT NOT NULL,             -- Cookie origin as specified in the consent notice declaration.
        cat_id INTEGER NOT NULL,          -- Internal category index. (0 == necessary; 1 == functional; 2 == analytics; 3 == advertising; 4 == uncategorized; 5 == social media; -1 == unknown)
        cat_name VARCHAR(256) NOT NULL,   -- Actual declared name of the purpose category. May differ from the internal category index.
        purpose TEXT,                     -- String description that specifies the purpose of the cookie. May be empty.
        expiry TEXT,                      -- Declared expiration time, given in some text metric. Can also be "Session".
        type_name VARCHAR(256),           -- Name of the tracking technology type, as specified by Cookiebot.
        type_id INTEGER                   -- Index of the tracking technology type. (0 == HTTP cookie; 1 == Javascript cookie; 4 == tracking pixel)


__javascript_cookies__: Stores the data of the observed cookies that were encountered during the crawl.

    TABLE javascript_cookies
      id INTEGER PRIMARY KEY ASC,       -- Unique record identifier.
      browser_id INTEGER NOT NULL,      -- Index of browser instance that collected the data.
      visit_id INTEGER NOT NULL,        -- A unique foreign key corresponding to the website that was targetted.
      record_type TEXT,                 -- Through what action the cookie was recorded. Either "added-or-changed" or "deleted".
      time_stamp DATETIME               -- Timestamp on which the cookie was created.
      name TEXT,                        -- Name of the actual cookie.
      host TEXT,                        -- Origin domain of the actual cookie.
      path TEXT,                        -- Path under which the actual cookie is valid.
      value TEXT,                       -- Content of the cookie. A contiguous string of data. May be empty.
      expiry DATETIME,                  -- Actual expiration date of the cookie.
      is_http_only INTEGER,             -- Boolean HTTP_ONLY flag. Indicates that the cookie can only be accessed via HTTP requests.
      is_host_only INTEGER,             -- Boolean HOST_ONLY flag. Indicates that the cookie is only valid for the current domain, and no subdomains.
      is_session INTEGER,               -- Boolean that indicates whether it is a session cookie.
      is_secure INTEGER,                -- Boolean flag that indicates whether the cookie can only be sent over secure connections.
      same_site TEXT,                   -- Either "no_restriction", "lax" or "strict. Controls how the cookie can be accessed through cross-site links.


__consent_crawl_results__: Records whether a crawl succeeded or failed, and for what reason in the latter case.

    TABLE consent_crawl_results
      id INTEGER PRIMARY KEY,                  -- Unique record identifier.
      browser_id INTEGER NOT NULL,             -- Index of the browser instance that collected the data.
      visit_id INTEGER NOT NULL,               -- A unique foreign key corresponding to the website that was targetted.
      cmp_type INTEGER NOT NULL,               -- The type of the CMP that was found at the site. (0: Cookiebot, 1: OneTrust, 2: Termly, -1: None)
      crawl_state INTEGER NOT NULL,            -- Resulting error state. Zero is success. Nonzero is failure.
      report TEXT                              -- Report describing the error, or number of cookies extracted if successful.


## Directory Contents
This folder contains the following subfolders and scripts:

    `collected_data/` : This is the default target directory for the consent webcrawler output.

    `chrome_profile/`:  Contains the chrome profile data. The following profiles can be downloaded and extracted into this folder:
            * https://sybilmail.de/files/cookieblock/profile_consentomatic_accept_all.tar.gz
            * https://sybilmail.de/files/cookieblock/profile_consentomatic_accept_none.tar.gz
            * https://sybilmail.de/files/cookieblock/profile_consentomatic_without_consentomatic.tar.gz

    `filtered_domains/`: Target directory for the presence crawler output.

    `logs/`: Target directory for log files.

    `run_consent_crawl_uc.py`: This script forms the entry point for the crawler that makes use of the Selenium library to instrument
                               a real browser. This crawler retrieves cookies, cookie categories, and builds a SQLite3 database from the
                               collected data.

    `run_presence_crawl.py`: Efficient crawl that only utilises the python requests library.

## License
The additions made to this framework (instrumentation, crawling scripts) are licensed under GNU GPLv3, see LICENSE.

Code has been included from
[FourthParty](https://github.com/fourthparty/fourthparty) and
[Privacy Badger](https://github.com/EFForg/privacybadgerfirefox), both of which
are licensed GPLv3+.
