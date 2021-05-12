-- It turns out that the consent table can include the same cookie name multiple times, but for different domains.
-- This query selects these.
SELECT DISTINCT c1.visit_id, c1.domain, c1.name
FROM consent_data c1
JOIN consent_data c2 ON c1.visit_id == c2.visit_id and c1.name == c2.name and c1.domain <> c2.domain 