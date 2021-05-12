# Domain Sources & Scripts
This subfolder contains the domain sources that were used for the presence crawler and consent data crawler.

In principle, this data can be used to reproduce the results, simply:
1. Run the presence crawler on the complete set of domains to filter out domains that likely don't contain a CMP.
2. Run the consent crawler to retrieve cookies with labels.
3. Extract the cookies JSON from the database produced by the consent crawler.
4. Provide the JSON file as input to the feature extraction, retrieve a sparse feature matrix.
5. This is then passed as input to train a new classifier.
6. Extract the model from the classifier implementation, in JSON format.
7. Plug the model into the extension.

The purpose of the scripts in the folder is to collect this data and to filter duplicates.


## Folder Contents
* `BuiltWith/`: Contains all domains sourced from BuiltWith's Privacy Compliance List: https://trends.builtwith.com/widgets/privacy-compliance/
* `Cookiepedia/`: Contains all domains that could be scraped from Cookiepedia's records of websites that contained the "CookieConsent" and "OptAnonConsent" cookies.
* `Tranco_Europe_22_November_2020/`: Contains the Tranco domains top 600'000 with European focus.
* `Tranco_Worldwide_20_November_2020/`: Contains Tranco top 1 million worldwide domains.
* `cookiepedia_url_crawler.py`: Script to crawl Cookiepedia for domains of websites that held the "OptAnonConsent" and "CookieConsent" cookies at one point.
* `filter_duplicate_netlocs.py`: Filters duplicate domains by transforming the URL into a uniform format. Also filters domains with same domain string but different TLD.
* `generate_diff_set.py`: Used to compare the Tranco lists and produce a list of domains without overlap.