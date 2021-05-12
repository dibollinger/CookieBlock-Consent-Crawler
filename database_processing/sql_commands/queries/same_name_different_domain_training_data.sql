-- It turns out that the consent table can include the same cookie name multiple times, but for different domains.
-- This query returns training data records where there are multiple domains for the same cookie name, from the same website.
-- generally, these are automatically filtered out in a later script
SELECT DISTINCT v1.visit_id, v1.site_url, v1.name, v1.actual_domain
FROM view_training_data v1
JOIN view_training_data v2 ON v1.visit_id == v2.visit_id and v1.name == v2.name and v1.actual_domain <> v2.actual_domain 