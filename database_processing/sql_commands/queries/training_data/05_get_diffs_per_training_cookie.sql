-- Find number of updates performed on each cookie per website
-- requires taining data table from 02
SELECT visit_id, site_url, cookie_name, actual_domain, actual_path, COUNT(training_data.visit_id) as num_diffs
FROM training_data
GROUP BY visit_id, cookie_name, actual_domain, actual_path
