# CookieBlock - ConsentCrawler Changelog

## 0.7.27 - 04.12.2024
* Add support for postgres database
* Implement --resume to continue an aborted or crashed crawl

## 0.7.26 - 04.12.2024
* No longer track started chromium processes as this is now handled with the watcher checking all processes with 'chrome' in the process name
* Store results in the sqlite database as they come and not in one bulk at the end
    * Needed to implement resumable crawls

## 0.7.25 - 27.11.2024
* Allow running with a batchsize bigger than the number of websites

## 0.7.24 - 27.11.2024
* Use Europe/Zurich as timezone in docker containers
* Remove necessary ENTER when crawl finishes
* Fix alembic execption

## 0.7.23 - 27.11.2024
* Script to merge json trainingdata
* Move run_consent_crawl_uc.py to `crawler/` directory

## 0.7.22 - 21.11.2024
* Watcher: Print name and creation time of the checked process
* Leave watcher running when crawl finishes to kill remaining processes

## 0.7.21 - 20.11.2024
* Handle any exception then checking progress

...

