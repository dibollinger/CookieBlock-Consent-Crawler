-- Select failed consent crawls and attach corresponding URL (interrupted crawls not included)
SELECT res.*, site_visits.site_url
FROM consent_crawl_results as res
JOIN site_visits ON res.visit_id == site_visits.visit_id
WHERE res.crawl_state <> 0;
