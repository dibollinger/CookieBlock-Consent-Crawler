-- all unknown cat entries from CONSENT table
CREATE VIEW IF NOT EXISTS view_unknown_consent AS
SELECT *
FROM consent_data c
WHERE c.cat_id == 4