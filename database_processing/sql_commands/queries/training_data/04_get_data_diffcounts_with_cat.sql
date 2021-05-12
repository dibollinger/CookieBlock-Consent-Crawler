-- Get training data diffs with associated consent data
-- Requires training data constructed from 02
SELECT t1.visit_id, t1.site_url, 
       t1.cookie_name, t1.actual_domain, 
	   t1.actual_path, t2.num_diffs, 
	   t1.purpose, t1.cat_id, t1.cat_name,
	   t1.time_stamp
FROM training_data t1
JOIN training_data_diffs t2 on t1.visit_id == t2.visit_id 
     and t1.cookie_name == t2.cookie_name
	 and t1.actual_domain == t2.actual_domain
	 and t1.actual_path == t2.actual_path
GROUP BY t1.visit_id, t1.cookie_name, t1.actual_domain, t1.actual_path
