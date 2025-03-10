# Useful SQL Queries

# Select result of a crawl to a website. Includes how many cookies we gave consent to:
```SQL
-- consent_data
SELECT * FROM consent_crawl_results results
    INNER JOIN site_visits sv on sv.visit_id = results.visit_id
    order by site_rank
```

# Count number of crawl_states for a specified cmp_type:
```SQL
SELECT ccr.crawl_state, count(*)
FROM consent_crawl_results ccr
-- JOIN consent_data cd ON ccr.visit_id == cd.visit_id
where ccr.cmp_type = 0 -- 0 is cookiebot; 1 is onetrust
group by ccr.crawl_state
```

# Get all URLs for Cookiebot and Onetrust from gathered CMP data
```SQL
SELECT site_url FROM site_visits sv
    LEFT JOIN consent_crawl_results results ON sv.visit_id = results.visit_id
    WHERE results.cmp_type IN (0, 1)
```

# Count the number of websites per cmp_type (0 is cookiebot; 1 is onetrust)
```SQL
-- count amount of websites per cmp_type
SELECT results.cmp_type, count(*) FROM consent_crawl_results results
    group by results.cmp_type
```

```SQL
-- cookies we gave consent to
SELECT DISTINCT c.visit_id,
        s.site_url,
        ccr.cmp_type as cmp_type,
        ccr.crawl_state,
        c.name as consent_name,
        c.domain as consent_domain,
        c.purpose,
        c.cat_id,
        c.cat_name,
        c.type_name,
        c.type_id,
        c.expiry as consent_expiry
FROM consent_data c
JOIN site_visits s ON s.visit_id == c.visit_id
JOIN consent_crawl_results ccr ON ccr.visit_id == c.visit_id
```

```SQL
-- actual cookies
SELECT * FROM javascript_cookies
    INNER JOIN consent_crawl_results ccr on ccr.visit_id = javascript_cookies.visit_id
    order by ccr.visit_id
```

```SQL
-- count cmp_types of actual cookies
SELECT ccr.cmp_type, count(*) FROM javascript_cookies
    INNER JOIN consent_crawl_results ccr on ccr.visit_id = javascript_cookies.visit_id
    group by ccr.cmp_type
```
