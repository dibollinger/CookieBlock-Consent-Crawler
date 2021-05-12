-- Get all cookies that match a specific pattern name
SELECT DISTINCT visit_id, name, cat_id
FROM consent_data_with_cmp
WHERE name REGEXP "AMCV_[0-9A-F]{24}%40AdobeOrg" and cat_id == 3

-- "_gat_UA-[0-9]{8}-[0-9]"
-- "intercom-id-[a-z0-9]{8}"
-- "lpv[0-9]{6}"
