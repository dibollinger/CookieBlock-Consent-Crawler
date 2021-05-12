SELECT DISTINCT visit_id, actual_domain, name, cookie_contents, COUNT(cookie_contents), length(cookie_contents), cat_name
FROM view_training_data
GROUP BY cookie_contents
ORDER BY length(cookie_contents), cookie_contents ASC
