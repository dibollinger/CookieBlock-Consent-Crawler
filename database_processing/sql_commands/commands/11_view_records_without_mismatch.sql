
-- Retrieve all consent data records where no two websites disagree about the same cookie's categories.

CREATE VIEW IF NOT EXISTS view_cookies_without_mismatch AS
SELECT *
FROM consent_data
WHERE id not in 
(
    SELECT c1.id
    FROM consent_data c1, consent_data c2
    WHERE c1.id <> c2.id and c1.name = c2.name and c1.domain == c2.domain 
          and c1.cat_id > -1 and c2.cat_id > -1 and c1.cat_id <> c2.cat_id
);

