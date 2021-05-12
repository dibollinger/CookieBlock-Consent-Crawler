-- Display incomplete visits with URL
SELECT site_visits.*, hist.command_status, hist.error, hist.dtg
FROM incomplete_visits as ic
JOIN site_visits ON ic.visit_id == site_visits.visit_id
LEFT JOIN crawl_history hist ON hist.visit_id == ic.visit_id and hist.command_status != "ok";