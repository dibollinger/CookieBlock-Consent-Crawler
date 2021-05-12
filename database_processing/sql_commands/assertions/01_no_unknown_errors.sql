-- Verify that no unknown crawl errors occurred
SELECT CASE WHEN (COUNT(c.crawl_state) == 0) then "True" else "False" end as result
FROM consent_crawl_results c
WHERE c.crawl_state < 0;