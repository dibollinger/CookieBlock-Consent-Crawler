-- Create a view of the most common cookie domains in the training set, ordered with counts
CREATE VIEW IF NOT EXISTS view_most_common_domains AS
SELECT actual_domain, COUNT(actual_domain) as cnt
FROM view_unique_train_cookies
GROUP BY actual_domain
ORDER BY cnt DESC;