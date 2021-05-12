-- Select all unique cookies from javascript_cookies
CREATE VIEW IF NOT EXISTS view_unique_js_cookies AS
SELECT DISTINCT name, host, path
FROM javascript_cookies
WHERE record_type <> "deleted"
