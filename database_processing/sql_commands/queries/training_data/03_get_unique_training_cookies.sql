-- Select all unique cookies
-- Requires training_data view constructed from 02
SELECT DISTINCT visit_id, cookie_name, actual_domain, actual_path
FROM training_data
