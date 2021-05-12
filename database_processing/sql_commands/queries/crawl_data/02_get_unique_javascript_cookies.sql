-- Select all unique cookies from javascript_cookies
SELECT DISTINCT visit_id, name, host, path
FROM javascript_cookies
WHERE record_type <> "deleted"