# Domain Sources
This subfolder contains domain sources for use with the presence crawler and consent data crawler.

The purpose of the scripts in the folder is to collect this data and to filter duplicates.

## Folder Contents
* `BuiltWith/`: Contains all domains sourced from BuiltWith's Privacy Compliance List: https://trends.builtwith.com/widgets/privacy-compliance/
* `Cookiepedia/`: Contains all domains that could be scraped from Cookiepedia's records of websites that contained the "CookieConsent" and "OptAnonConsent" cookies.
* `Tranco_Europe_22_November_2020/`: Contains the Tranco domains top 600'000 with European focus.
* `Tranco_Worldwide_20_November_2020/`: Contains Tranco top 1 million worldwide domains.
* `cookiepedia_url_crawler.py`: Script to crawl Cookiepedia for domains of websites that held the "OptAnonConsent" and "CookieConsent" cookies at one point.
* `filter_duplicate_netlocs.py`: Filters duplicate domains by transforming the URL into a uniform format. Also filters domains with same domain string but different TLD.
* `generate_diff_set.py`: Used to compare the Tranco lists and produce a list of domains without overlap.