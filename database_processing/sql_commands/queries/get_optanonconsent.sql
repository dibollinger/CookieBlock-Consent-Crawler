SELECT DISTINCT site_url
FROM javascript_cookies j
JOIN site_visits s on s.visit_id == j.visit_id
JOIN consent_crawl_results cs on j.visit_id == cs.visit_id and cs.crawl_state == 0
WHERE j.name == "OptanonConsent" and value like "%&groups=%" -- and value like "%!%3A0!%2C%"
ESCAPE '!'