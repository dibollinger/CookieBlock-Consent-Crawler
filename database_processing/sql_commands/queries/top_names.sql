-- Retrieve the most common names
SELECT count(name) as c, name
from (
SELECT DISTINCT visit_id, name, host, path
FROM javascript_cookies j
WHERE j.record_type <> "deleted"
)
group by name
ORDER BY c DESC
