# CookieBlock Consent Webcrawler

* [Description](#description)
* [Installation](#installation)
  * [Requirements](#requirements)
  * [Install Script](#install-script)
  * [Developer Instructions](#developer-instructions)
  * [Troubleshooting](#troubleshooting)  
* [OpenWPM](#openwpm)
* [Presence Crawler](#presence-crawler)
  * [Usage](#usage-presence-crawler)
  * [Output](#output-presence-crawler)
* [Consent Crawler](#consent-crawler)
  * [Usage](#usage-consent-crawler)
  * [Output](#output-consent-crawler)
* [Directory Contents](#directory-contents)
* [Credits](#credits)
* [License](#license)

## Description

The crawlers in this directory allow the user to scrape websites for cookie consent 
purposes if the target website makes use of one of the supported Consent Management Platforms.
It automatically retrieves consent labels if possible, and if successful, browses the subpages 
of the site to record cookie data.

Currently supported by the scripts are the CMPs:
* __Cookiebot__
* __OneTrust__ 
* __Termly__ 

Due to the GDPR, websites that offer their services to users connecting from countries in the 
EU are required to request consent for storing cookies on the browser. This is commonly 
accomplished using consent notices offered by so-called Consent Management Platforms (CMPs).

These consent notices offer toggles for the visitor to accept or reject cookie
categories, which can display detailed information of the purpose of each cookie. 
This crawler specifically targets consent notices that display such information, 
for the purpose of gathering a dataset of cookie labels.

Each cookie is assigned to one of the following purpose classes:

* __Strictly Necessary Cookies__: Cookies that are required for the website to function 
    properly. These require no consent from the visitor and usually cannot be rejected, 
    but are still declared inside privacy policies and consent management popups.
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
    the category of cookies where the loss of privacy is the largest concern. 
* __Uncategorized__: Some CMPs leave cookies uncategorized. This category catches
    all such declarations.
* __Unknown__: Catch-all for the remaining categories. Some cannot easily be 
    assigned to any of the above categories. This includes category labels such as 
    "Information Storage and Access" or "Content Delivery" as these labels state 
    little about how the cookie is intended to be used. 
    In addition, some CMP use language-specific declarations.

If a cookie has multiple purposes assigned, the tool will generally assign the less 
privacy-preserving class.

## Installation

OpenWPM is tested on Ubuntu 18.04 and Debian Bullseye.

OpenWPM does not support Windows: https://github.com/mozilla/OpenWPM/issues/503

### Requirements

The main pre-requisite for OpenWPM is conda, a cross-platform package management tool.

Conda is open-source, and can be installed from https://docs.conda.io/en/latest/miniconda.html.

### Install Script

An installation script, `install.sh` is included to: install the conda environment,
install unbranded firefox, and build the instrumentation extension.

All installation is confined to your conda environment and should not affect your machine.
The installation script will, however, override any existing conda environment named openwpm.

To run the install script, run

    $ ./openwpm/install.sh

After running the install script, activate your conda environment by running:

    $ conda activate openwpm

See `openwpm/README.md` for more detailed install instructions.

### Developer instructions

Dev dependencies are installed by using the main `environment.yaml` (which
is used by `./install.sh` script).

You can install pre-commit hooks install the hooks by running `pre-commit install` to
lint all the changes before you make a commit.

### Troubleshooting

1. `make` / `gcc` may need to be installed in order to build the web extension.
   On Ubuntu, this is achieved with `apt-get install make`. On OSX the necessary
   packages are part of xcode: `xcode-select --install`.
2. On a very sparse operating system additional dependencies may need to be
   installed. See the [Dockerfile](Dockerfile) for more inspiration, or open
   an issue if you are still having problems.
3. If you see errors related to incompatible or non-existing python packages,
   try re-running the file with the environment variable
   `PYTHONNOUSERSITE` set. E.g., `PYTHONNOUSERSITE=True python demo.py`.
   If that fixes your issues, you are experiencing
   [issue 689](https://github.com/mozilla/OpenWPM/issues/689), which can be
   fixed by clearing your
   python [user site packages directory](https://www.python.org/dev/peps/pep-0370/),
   by prepending `PYTHONNOUSERSITE=True` to a specific command, or by setting
   the environment variable for the session (e.g., `export PYTHONNOUSERSITE=True`
   in bash). Please also add a comment to that issue to let us know you ran
   into this problem.

##OpenWPM

OpenWPM is a web privacy measurement framework which makes it easy to
collect data for privacy studies on a scale of thousands to millions
of websites. OpenWPM is built on top of Firefox, with automation provided
by Selenium. It includes several hooks for data collection.

The original publication on OpenWPM can be found here: [publication](http://randomwalker.info/publications/OpenWPM_1_million_site_tracking_measurement.pdf)

The official OpenWPM github repository is found at: https://github.com/mozilla/OpenWPM


## Presence Crawler
This is an efficient scraper that utilises the Python 'requests' library. Its purpose is to filter out 
potential candidates for the more costly OpenWPM crawl, which uses actual browser instances. It verifies 
whether the provided domains contain a Consent Management Platform from which we can extract category labels.

### Usage (Presence Crawler)
While in the _"openwpm"_ _conda_ environment, run the following script with the required arguments:

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

#### Arguments

Parameter `-n` specifies the total number of parallel processes to use to perform the crawl. The more
processes are used, the faster the crawl finishes.

Parameter `-b` is used to split the input into batches. After a batch is done, the result is flushed.
This is useful to reduce the memory impact.

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
This is the OpenWPM-based Crawler that retrieves the cookie labels with the associated cookies. 
This script is noticeably slower than the Presence Crawl, as actual browser instances are used
to request and browse the website. In contrast to simple GET requests, each browser takes up a
significant chunk of memory, and uses multiple threads for a single instance. This reduces the 
potential concurrency that can be achieved.

### Usage (Consent Crawler)
While in the _"openwpm"_ _conda_ environment, run this script with the following arguments:

    run_consent_crawl.py (cookiebot|onetrust|termly|all|none) (--num_browsers <NUM>) (--url <u> | --pkl <fpkl> | --file <fpath> | --csv <csvpath> )... [--use_db <DB_NAME>]

    Options:
        -n --num_browsers <NUM>   Number of browser instances to use in parallel.
        -d --use_db <DB_NAME>     Use specified database file to add rows to. Will append identities properly.
        -u --url <u>              URL string to target for crawl. Can take multiple.
        -p --pkl <fpkl>           File path to pickled list of urls to crawl. Can take multiple.
        -f --file <fpath>         Path to file containing one URL per line Can accept multiple files.
        -c --csv <csvpath>        Path to csv containing domains in second column. Separator is ",". Can accept multiple.

    Available modes are:
        * all        : Try to detect which CMP is used on the website, then retrieve data for that CMP.
        * cookiebot  : Assume website uses Cookiebot.
        * onetrust   : Assume website uses OneTrust.
        * termly     : Assume website uses Termly.
        * none       : Only gather cookies, no consent labels.

#### Arguments

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
    
    `crawler_profile_*/`: Contains the Firefox browser profile used with OpenWPM. 
                        The profile includes a pre-configured install of Consent-O-Matic that references a custom Termly ruleset found at: 
                        https://github.com/dibollinger/Consent-O-Matic/blob/termly_rule/termly_rules.json 
    
    `filtered_domains/`: Target directory for the presence crawler output.
    
    `logs/`: Target directory for OpenWPM log files.
    
    `openwpm/`: Folder that contains the modified OpenWPM codebase, version 0.12.0 
    
    `run_consent_crawl.py`: This script forms the entry point for the crawler that makes use of the OpenWPM framework, 
                            which retrieves cookies, cookie categories, and builds a SQLite3 database storing this data.
    
    `run_presence_crawl.py`: Efficient crawl that only utilises the python requests library.

## License
The additions made to this framework (instrumentation, crawling scripts) are licensed under GNU GPLv3, see LICENSE.

OpenWPM is licensed under GNU GPLv3, see [license](LICENSE). Additional code has been included from
[FourthParty](https://github.com/fourthparty/fourthparty) and
[Privacy Badger](https://github.com/EFForg/privacybadgerfirefox), both of which
are licensed GPLv3+.

