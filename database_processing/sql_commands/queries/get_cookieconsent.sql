SELECT DISTINCT s.site_url
FROM javascript_cookies j
JOIN site_visits s ON s.visit_id == j.visit_id
JOIN consent_crawl_results cs on j.visit_id == cs.visit_id and cs.crawl_state == 0
WHERE j.name == "CookieConsent" and j.value like "%necessary:true%" and j.value like "%preferences:true%"  and j.value like "%statistics:true%" and j.value like "%marketing:true%"
	  AND s.site_url not in (
	SELECT DISTINCT site_url
	FROM javascript_cookies j
	JOIN site_visits s on s.visit_id == j.visit_id
	JOIN consent_crawl_results cs on j.visit_id == cs.visit_id and cs.crawl_state == 0
	WHERE j.name == "CookieConsent" and j.value like "%necessary:true%" and j.value like "%preferences:false%"  and j.value like "%statistics:false%" and j.value like "%marketing:false%"
) 
-- Tranco Crawl, no special values
-----------------------------------
-- 13371 -- total
-- 12582 -- interacted with cookie banner
-- 12427 -- set preferences to "true" as well
-- 12419 -- set statistics to "true" as well (8 did not but had preferences:true)
-- 12260 -- accepted all
----------------------------------

-- Tranco, reject all consent except necessary
-- 13227 -- CookieConsent urls in total
-- 12487 -- could be interacted with
-- 9487 -- rejectes preferences; 3052 -- still accepted preferences
-- 9463 -- rejected analytics; 3076 still accepted analytics
-- 9463 -- rejected all
-- 2961 -- accepted marketing still
-- 2948 -- still accepted all consent types, ignored the signal entirely
------------------------------------

-- Tranco, no interaction
-- 13336 -- in total
-- 5481 -- set the cookie without me ever having interacted with it
-- 3763 -- set functionlity to true
-- 737 -- set some combination of reject and accept
-- 1610 -- reject all consent without ever interacting with the site
-- 3134 -- accepted all consent without ever interacting with the site