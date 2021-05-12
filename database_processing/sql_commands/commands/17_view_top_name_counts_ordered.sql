-- Create a view of the most common cookie names
CREATE VIEW IF NOT EXISTS view_most_common_names AS
SELECT name, COUNT(name) as cnt
FROM view_unique_train_cookies
GROUP BY name
ORDER BY cnt DESC;
