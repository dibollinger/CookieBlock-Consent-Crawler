-- Retrieve the most common domains
SELECT count(host) as c, host
from (
SELECT DISTINCT visit_id, name, host, path
FROM javascript_cookies j
WHERE j.record_type <> "deleted"
)
group by host
ORDER BY c DESC
