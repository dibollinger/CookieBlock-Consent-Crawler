# CookieBlock - Cookie Consent Webcrawlers

* [About this repository](#about-this-repository)
  * [CookieBlock](#cookieblock)
* [Repository Contents](#repository-contents)
  * [Main Crawler Scripts](#main-crawler-scripts)
  * [Other Useful Content](#other-useful-content)
* [Credits and Acknowledgements](#credits-and-acknowledgements)
* [Additional Links](#additional-links)
* [License](#license)

## About this repository

This repository contains code for two webcrawlers that were used to gather cookie
data from websites, and to extract usage purpose for those cookies from corresponding
cookie notices. These crawlers enabled the collection of training data for the
tree ensemble model used in the CookieBlock browser extension.

### CookieBlock

CookieBlock is a browser extension developed by researchers at ETH Zürich,
which automatically enforces GDPR cookie consent preferences of the user without
having to rely on the website to respect the user's privacy. The extension is
available for most major browsers, exlcuding Safari and Vivaldi.

For more information, please visit the project's website, and the main repository:

https://karelkubicek.github.io/post/cookieblock

https://github.com/dibollinger/CookieBlock

## Repository Contents

The repository is split into two web crawler types, as well as some additional script to aid in transforming the collected data.

### Main Crawler Scripts

In the subfolder `crawler`, two webcrawlers can be found:
* One is designated as __"CMP Presence Crawler"__ which uses the Python `requests` library to quickly detect whether a website uses a cookie consent library from one of three different Consent Management Providers (CMP).
This crawler serves as a first pass to filter domains that cannot be used for extracting useful data in the slower, OpenWPM-based crawl.
* The second is designated as the __"Consent Crawler"__, which uses the OpenWPM framework to extract both cookies and their corresponding usage purposes if found.
This process uses actual Firefox browser instances to browse websites and gather cookies.
The process is slow, but it's the best method for collecting cookie data required for training a predictor.

Currently, the web crawlers support cookie banners from the following Consent Management Providers:
* Cookiebot
* OneTrust (includes OptAnon, CookiePro and CookieLaw)
* Termly

The consent crawler is based on OpenWPM v0.12.0 by _Steven Englehardt et al._, which can be found at:

https://github.com/mozilla/OpenWPM

It also uses a fork of the Consent-O-Matic extension by _Janus Bager Kristensen et al._ to automatically provide affirmative consent to cookie banners.

This allows the web crawler to gather more cookies than would normally be possible.

Its source can be found at:

https://github.com/dibollinger/Consent-O-Matic/tree/cookieblock_rules

More details are available in the README of the `crawler` subfolder:

[Crawler README](crawler/README.md)

### Other Useful Content

The repository contains additional subfolders with utility data that are related to the main web crawl.
* The folder `domain_sources` provides lists of potential target domains that can be used to
  test the crawler, and some scripts to retrieve domain sources and filter out duplicate domains.
* The folder `database_processing` offers scripts to further process the databases collected by the
  consent crawler, and to extract a JSON formatted file of each unique cookie in the database.
* The scripts in `cookie_statistics_analysis` uses the JSON file produced through `extract_cookies_from_db.py` to compute several statistics from the collected cookies. It also contains scripts that were used to automatically query cookie categories from Cookiepedia.

For more details, please refer to their respective READMEs:
* [Domain Sources](domain_sources/README.md)
* [Database Processing](database_processing/README.md)
* [Cookie Statistics](cookie_statistics_analysis/README.md)

## Credits and Acknowledgements

__Collaborators:__
* Dino Bollinger
* Karel Kubíček
* Dr. Carlos Cotrini
* Prof. Dr. David Basin

__Additional Thanks:__
* [Authors of OpenWPM](https://github.com/mozilla/OpenWPM) (v0.12.0, Copyright © 2015 Steven Englehardt)
* [Authors of Consent-O-Matic](https://github.com/cavi-au/Consent-O-Matic) (1.0.8, r431, Copyright © 2020-2022 Janus Bager Kristensen, Rolf Bagge, CAVI)
* Information Security Group at ETH Zürich

__Developed under the Department of Computer Science at ETH Zürich, Information Security Group__

## Additional Links

This repository was originally created as part of the master thesis
__"Analyzing Cookies Compliance with the GDPR"__, which can be found at:

https://www.research-collection.ethz.ch/handle/20.500.11850/477333

It is also part of the publication __"Automating Cookie Consent and GDPR Violation Detection"__,
featured at USENIX Security 2022, which can be found at:

https://www.usenix.org/conference/usenixsecurity22/presentation/bollinger

The CookieBlock project's main website is found at:

https://karelkubicek.github.io/post/cookieblock

**See also the following repositories for other components that were developed as part of the thesis:**

* [CookieBlock Browser Extension](https://github.com/dibollinger/CookieBlock)
* [Cookie Classifier](https://github.com/dibollinger/CookieBlock-Consent-Classifier)
* [Violation Detection](https://github.com/dibollinger/CookieBlock-Other-Scripts)
* [Prototype Consent Crawler](https://github.com/dibollinger/CookieBlock-Crawler-Prototype)
* [Collected Data](https://doi.org/10.5281/zenodo.5838646)

## License

__Copyright © 2021-2022 Dino Bollinger, Karel Kubíček__

All code and data contained within the `crawler/` folder is licensed under GPLv3 license.

All scripts and data within the folders `domain_sources/`, `database_processing/` and `cookie_statistics_analysis/` are released under the MIT license.
