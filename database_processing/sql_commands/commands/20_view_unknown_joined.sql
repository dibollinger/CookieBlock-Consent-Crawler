-- all unknown cat entries, joined with actual cookies
CREATE VIEW IF NOT EXISTS view_unknown_joined AS
SELECT j.visit_id, s.site_url, 
	   j.name as name, 
	   j.host as actual_domain,
	   j.path, 
	   c.domain as consent_domain,
	   j.value as cookie_contents,
	   c.purpose,
	   c.cat_id, c.cat_name, 
	   c.type_name,
	   c.expiry as consent_expiry, 
	   j.expiry as actual_expiry, 
	   j.is_session, 
	   j.is_http_only, j.is_host_only, 
	   j.is_secure, j.same_site, 
	   j.time_stamp
FROM consent_data c
JOIN javascript_cookies j ON c.visit_id == j.visit_id and c.name == j.name 
                             and ((c.domain LIKE "%" || j.host || "%")  or (j.host LIKE "%" || c.domain || "%")) 
JOIN site_visits s ON s.visit_id == c.visit_id
WHERE j.record_type <> "deleted" and c.cat_id == 4
ORDER BY j.visit_id, name, j.time_stamp ASC;
