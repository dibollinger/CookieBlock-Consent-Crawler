-- Create a view of the consent crawl results where the website is also listed.
CREATE VIEW consent_data_with_cmp AS
SELECT sv.site_url, v.cmp_type, c.* 
FROM consent_data c
JOIN consent_crawl_results v ON v.visit_id == c.visit_id
JOIN site_visits sv ON sv.visit_id == c.visit_id
