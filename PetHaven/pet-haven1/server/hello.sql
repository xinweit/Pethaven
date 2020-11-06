CREATE OR REPLACE FUNCTION check_leave()
RETURNS TRIGGER AS $$
DECLARE total_count INTEGER;
BEGIN
-- INSERT INTO takes_leaves VALUES (NEW.start_date, NEW.end_date, NEW.email);
    SELECT COUNT(*) INTO total_count FROM (SELECT extract(day from ((SELECT MIN(start_date) FROM takes_leaves WHERE email='facilisis.non.bibendum@Quisque.ca') - date_trunc('year', CURRENT_DATE))) AS difference 
    UNION ALL 
    SELECT table1.start_date-table1.end_date AS difference FROM (SELECT leaves.end_date AS end_date, MIN(leaves2.start_date) AS start_date 
    FROM takes_leaves AS leaves, takes_leaves AS leaves2  
    WHERE leaves2.start_date >= leaves.end_date 
    AND leaves.email = leaves2.email 
    AND leaves.email = 'facilisis.non.bibendum@Quisque.ca' 
    GROUP BY leaves.end_date) AS table1 
    UNION ALL 
    SELECT extract(day from ((date_trunc('year', CURRENT_DATE) + interval '1 year' - interval '1 day') - (SELECT MAX(end_date) FROM takes_leaves WHERE email='facilisis.non.bibendum@Quisque.ca'))) AS difference) as bigtable WHERE bigtable.difference <= 150;
IF total_count < 2 THEN
RAISE EXCEPTION('invalid leaves');
DELETE FROM takes_leaves WHERE email = NEW.email AND start_date = NEW.start_date AND end_date = NEW.end_date;
END IF;
RETURN NEW;
END; $$

CREATE TRIGGER is_valid_leave
AFTER INSERT
ON takes_leaves
FOR EACH ROW
EXECUTE PROCEDURE check_leave();



