-- Verify that all visits that are not in consent crawl results have been interrupted
SELECT CASE WHEN (COUNT(s1.visit_id) == 0) then "True" else "False" end as result
FROM site_visits s1
WHERE s1.visit_id not in
(
	SELECT c1.visit_id 
	FROM consent_crawl_results as c1
) AND s1.visit_id not in incomplete_visits;