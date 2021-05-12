-- This retrieves all cookies that occur for more than one website
-- Note that all of these are confirmed third party cookies
SELECT *
FROM
(
	SELECT COUNT(*) as c, name, host, path
	FROM
	(
		SELECT DISTINCT visit_id, name, host, path
		from javascript_cookies
		WHERE record_type <> "deleted"
	)
	GROUP BY name, host, path
	ORDER BY c DESC
)
WHERE c > 1;
