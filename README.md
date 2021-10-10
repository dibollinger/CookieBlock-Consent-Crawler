# CookieBlock Consent Webcrawler and Related Scripts

* [Description](#description)
* [Repository Contents](#repository-contents)
  * [Additional Details](#additional-details)
* [Credits](#credits)
* [License](#license)

## Description

CookieBlock is a browser extension developed by researchers at ETH Zürich, 
which automatically enforces GDPR cookie consent preferences of the user without 
having to rely on the website to respect the user's privacy. The extension is 
available for all major browsers. For more information and a link to add-on stores, 
see the following repository: 

https://github.com/dibollinger/CookieBlock

To classify cookies, CookieBlock uses a gradient-boosted tree classifier. To train this 
classifier, it is necessary to retrieve a ground truth of category labels for the training 
samples. This is the main purpose of this repository.

## Repository Contents

In the subfolder `crawler` the __presence crawler__ and __consent crawler__ can be found. 
The former is a fast detection script written in Python, which detects whether a website
uses one of several so-called "Consent Management Platforms" (CMPs). If this is the case, 
cookie category labels can be gathered from that website. The latter is a slower webcrawler
that uses actual Firefox browser instances to request websites and gather cookies with their
corresponding labels.

Currently supported CMPS are:
* Cookiebot
* OneTrust (including OptAnon, CookiePro and CookieLaw domains)
* Termly

The consent crawler is based on OpenWPM v0.12.0 by _Steven Englehardt et al._, which can be found at: 

https://github.com/mozilla/OpenWPM

It also uses the Consent-O-Matic extension by _Janus Bager Kristensen et al._ to automatically 
provide affirmative consent to the consent notices. Its source can be found at: 

https://github.com/cavi-au/Consent-O-Matic

The other subfolders contain scripts that are related to the crawler.
* The folder `domain_sources` provides lists of potential target domains that can be used to
  test the crawler, and some scripts to retrieve domain sources and filter out duplicate domains.
* The folder `database_processing` offers tools to further process the databases collected by the 
  consent crawler, and to extract a JSON formatted file of each unique cookie in the database.
* The scripts in `cookie_statistics_analysis` uses the JSON file produced through 
  `extract_cookies_from_db.py` to compute several statistics, and to gather predictions from
  Cookiepedia.

The scripts in the `crawler` folder are licensed under the GPLv3 license. All scripts outside of
this folder are licensed with the MIT license. They do not depend on any code found in the crawler 
script, and simply use the outputs produced by it.

### Additional Details
For more details on the contents of the individual folders, please refer to their respective READMEs:
* [Crawler](crawler/README.md)
* [Domain Sources](domain_sources/README.md)
* [Database Processing](database_processing/README.md)
* [Cookie Statistics](cookie_statistics_analysis/README.md)

## Credits

This repository was created as part of the master thesis __"Analyzing Cookies Compliance with the GDPR"__, 
which can be found at:

https://www.research-collection.ethz.ch/handle/20.500.11850/477333

as well as the paper __"Automating Cookie Consent and GDPR Violation Detection"__, which can be found at:

https://karelkubicek.github.io/post/cookieblock.html

__Thesis supervision and co-authors:__
* Karel Kubicek
* Dr. Carlos Cotrini
* Prof. Dr. David Basin
* Information Security Group at ETH Zürich

---
See also the following repositories for other components that were developed as part of the thesis:

* [CookieBlock Browser Extension](https://github.com/dibollinger/CookieBlock)
* [Cookie Classifier](https://github.com/dibollinger/CookieBlock-Consent-Classifier)
* [Violation Detection](https://github.com/dibollinger/CookieBlock-Other-Scripts)
* [Prototype Consent Crawler](https://github.com/dibollinger/CookieBlock-Crawler-Prototype)
* [Collected Data](https://drive.google.com/drive/folders/1P2ikGlnb3Kbb-FhxrGYUPvGpvHeHy5ao)

---
Includes code from:

* [OpenWPM](https://github.com/mozilla/OpenWPM) v0.12.0, Copyright © 2015 Steven Englehardt
* [Consent-O-Matic](https://github.com/cavi-au/Consent-O-Matic) r154, Copyright (c) 2020 Janus Bager Kristensen, Rolf Bagge, CAVI
    * Note: The included browser profile references a Consent-O-Matic fork at:  
      https://github.com/dibollinger/Consent-O-Matic/tree/termly_rule

## License

__Copyright © 2021 Dino Bollinger, Department of Computer Science at ETH Zürich, Information Security Group__

Scripts contained within `crawler/` are licensed under GPLv3. 

Scripts contained within `domain_sources/`, `database_processing/` and `cookie_statistics_analysis/` are licensed under MIT.
