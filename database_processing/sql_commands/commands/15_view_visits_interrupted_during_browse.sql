
-- Display visits that were interrupted during the "browse" phase.
CREATE VIEW IF NOT EXISTS view_failed_visits_browse AS
SELECT site_visits.*, hist.command_status, hist.error, hist.dtg
FROM incomplete_visits as ic
JOIN site_visits ON ic.visit_id == site_visits.visit_id
LEFT JOIN crawl_history hist ON hist.visit_id == ic.visit_id and hist.command_status != "ok"
WHERE site_visits.visit_id not in
(
    SELECT s1.visit_id
    FROM site_visits s1
    WHERE s1.visit_id not in
    (
        SELECT c1.visit_id 
        FROM consent_crawl_results as c1
    )
);
