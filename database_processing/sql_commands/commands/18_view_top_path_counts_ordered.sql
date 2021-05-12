-- Create a view of the most common cookie paths
CREATE VIEW IF NOT EXISTS view_most_common_paths AS
SELECT path, COUNT(path) as cnt
FROM view_unique_train_cookies
GROUP BY path
ORDER BY cnt DESC;
