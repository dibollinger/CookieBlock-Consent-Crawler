-- Create a view which displays consent crawl results with URL 
-- and whether the crawl was interrupted later during browse

CREATE VIEW IF NOT EXISTS view_consent_crawl_results AS
SELECT combine.*, site_visits.site_url, CASE WHEN (incomplete_visits.visit_id IS NULL) then "False" else "True" end as browse_interrupted, crawl_history.command_status as error_type, crawl_history.error as error_report
FROM consent_crawl_results as combine
JOIN site_visits ON combine.visit_id == site_visits.visit_id
LEFT JOIN incomplete_visits ON combine.visit_id == incomplete_visits.visit_id
LEFT JOIN crawl_history ON combine.visit_id == crawl_history.visit_id and command_status != "ok";
