#!/bin/sh

set -e

mypy --config=pyproject.toml \
      --ignore-missing-imports \
      crawler/run_consent_crawl_uc.py \
      crawler/utils.py \
      crawler/browser.py \
      crawler/database.py \
      crawler/enums.py \
      crawler/cmps/onetrust.py \
      crawler/cmps/cookiebot.py \
      crawler/cmps/abstract_cmp.py
