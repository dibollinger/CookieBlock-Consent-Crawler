-- Select all unique cookies from consent_data
CREATE VIEW IF NOT EXISTS view_unique_consent_cookies AS
SELECT DISTINCT name, domain
FROM consent_data
