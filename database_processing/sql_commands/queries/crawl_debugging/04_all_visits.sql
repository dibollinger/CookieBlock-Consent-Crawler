-- Display all visits with potential errors
SELECT v.*, CASE WHEN (incomplete_visits.visit_id IS NULL) then "False" else "True" end as interrupted, crawl_history.command_status as error_type, crawl_history.error as error_report
FROM site_visits as v
LEFT JOIN incomplete_visits ON v.visit_id == incomplete_visits.visit_id
LEFT JOIN crawl_history ON v.visit_id == crawl_history.visit_id and command_status != "ok";
