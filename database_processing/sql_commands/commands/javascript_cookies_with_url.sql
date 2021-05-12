-- Create a view of the javascript cookie results with corresponding URL
CREATE VIEW javascript_cookies_with_url AS
SELECT sv.site_url, c.* 
FROM javascript_cookies c
JOIN site_visits sv ON sv.visit_id == c.visit_id
