
-- This SQL query retrieves all pairs of records of distinct consent cookie records
-- where name and domain match exactly, but the categories do not match up.
-- The results are displayed such that the records can be compared easily.

-- We exclude "unknown" (-1) as this category mainly exists due to laziness or 
-- incompetence of the website host, and is furthermore not trained on for the 
-- classifier. Hence we always consider a non-unknown category more specific.

-- Note: The result may be exponentially larger than the input.

CREATE VIEW IF NOT EXISTS view_all_category_mismatches AS
SELECT c1.id as c1_id, c1.visit_id as c1_visit_id, v1.site_url as c1_url,   
       c2.id as c2_id, c2.visit_id as c2_visit_id, v2.site_url as c2_url,   
	   c1.name as name, c1.domain as domain,
	   c1.purpose as c1_purpose, c2.purpose as c2_purpose,
	   c1.cat_id as c1_cat_id, c2.cat_id as c2_cat_id, 
	   c1.cat_name as c1_cat_name, c2.cat_name as c2_cat_name
FROM consent_data c1, consent_data c2
LEFT JOIN site_visits as v1 ON c1.visit_id == v1.visit_id
LEFT JOIN site_visits as v2 ON c2.visit_id == v2.visit_id
WHERE c1.id <> c2.id and c1.name = c2.name and c1.domain == c2.domain 
      and c1.cat_id > -1 and c2.cat_id > -1 and c1.cat_id <> c2.cat_id;
