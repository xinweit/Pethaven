--triggers

--trigger to check the daily price
CREATE OR REPLACE FUNCTION check_daily_price()
RETURNS TRIGGER AS $$
DECLARE correct_price INTEGER;
BEGIN 
  SELECT base_daily_price INTO correct_price FROM specifies s WHERE s.ft_email = NEW.email AND NEW.pet_category = s.pet_category; 
  if (NEW.daily_price < correct_price) THEN 
  RAISE EXCEPTION 'invalid daily price. Please enter price more than your base daily price';
  RETURN NULL;
  END IF;
  RETURN NEW;
END; $$
LANGUAGE PLPGSQL;

CREATE TRIGGER valid_daily_price_check
BEFORE INSERT
ON advertisements
FOR EACH ROW
EXECUTE PROCEDURE check_daily_price();

-- trigger for updating of a care-taker's rating
CREATE OR REPLACE FUNCTION give_rating_and_update()
RETURNS TRIGGER AS $$
DECLARE rating INTEGER;
DECLARE is_fulltimer INTEGER;
BEGIN
   SELECT rating_given INTO rating FROM bids_for WHERE advertisement_email = OLD.advertisement_email
   AND is_successful = true
   AND pet_category = OLD.pet_category
   AND start_date = OLD.start_date
   AND end_date = OLD.end_date
   AND OLD.rating_given = 0;
   SELECT COUNT(*) INTO is_fulltimer FROM ft_caretakers AS f WHERE OLD.advertisement_email = f.email;
   IF is_fulltimer >= 1 THEN
   UPDATE ft_caretakers SET rating = (SELECT AVG(a.rating_given) FROM (SELECT * FROM bids_for WHERE advertisement_email = OLD.advertisement_email AND is_successful = true) AS a) WHERE ft_caretakers.email = OLD.advertisement_email;
   ELSE
   UPDATE pt_caretakers SET rating = (SELECT AVG(a.rating_given) FROM (SELECT * FROM bids_for WHERE advertisement_email = OLD.advertisement_email AND is_successful = true) AS a) WHERE pt_caretakers.email = OLD.advertisement_email;
   END IF;
   RETURN NEW;
END; $$
 LANGUAGE PLPGSQL;

CREATE TRIGGER update_caretaker_rating
AFTER UPDATE
ON bids_for
FOR EACH ROW WHEN(OLD.is_successful = TRUE AND OLD.rating_given = 0)
EXECUTE PROCEDURE give_rating_and_update();

-- trigger to check if bid has been taken by another pet_owner 
CREATE OR REPLACE FUNCTION check_bid()
RETURNS TRIGGER AS $$
DECLARE bid_status INTEGER;
BEGIN
   SELECT COUNT(*) INTO bid_status FROM bids_for WHERE  
   is_successful = true AND 
   (bids_for.advertisement_email = OLD.advertisement_email or 
    bids_for.advertisement_email = NEW.advertisement_email) and 
   (pet_category = OLD.pet_category or pet_category = NEW.pet_category)and 
   (start_date = OLD.start_date  or start_date = NEW.start_date) and 
   (end_date = OLD.end_date or end_date = NEW.end_date);
   IF bid_status > 0 AND OLD.rating_given > 0 THEN 
   RAISE EXCEPTION 'advertisement has been succesfully taken.';
   RETURN NULL;
   END IF;
   RETURN NEW;
END; $$
 LANGUAGE PLPGSQL;

CREATE TRIGGER prevent_further_bidding
BEFORE INSERT OR UPDATE
ON bids_for
FOR EACH ROW
EXECUTE PROCEDURE check_bid();

-- trigger to update pet day of caretaker when bid is successfully made
CREATE OR REPLACE FUNCTION update_PetDay()
RETURNS TRIGGER AS $$
  DECLARE 
    currentPetDay integer;
  BEGIN
    SELECT pet_day into currentPetDay 
    FROM ft_caretakers 
    WHERE email= OLD.advertisement_email;
    UPDATE ft_caretakers 
    SET pet_day = (currentPetDay + OLD.end_date -
                    OLD.start_date)
    WHERE email = OLD.advertisement_email;
    RETURN NEW;
END; $$
LANGUAGE PLPGSQL;
-- testing new updatePetDay

/*Query to update petday upon sucessful bid*/
CREATE OR REPLACE FUNCTION update_PetDay()
RETURNS TRIGGER AS $$
  DECLARE 
    currentPetDay integer;
    currentPay numeric;
    isPart_time integer;
  BEGIN
    SELECT pet_day into currentPetDay FROM ft_caretakers
    WHERE email = OLD.advertisement_email and 
    NEW.is_successful = True;

    SELECT COUNT(*) INTO isPart_time
    FROM pt_caretakers
    WHERE email = OLD.advertisement_email;
    
    SELECT payment_amount into currentPay FROM salaries
    WHERE email = OLD.advertisement_email
    -- month for payment 
    and payment_date = OLD.end_date;
    
    UPDATE ft_caretakers SET pet_day = 
    (currentPetDay + OLD.bid_end_date -
                    OLD.bid_start_date)
    WHERE email = OLD.advertisement_email;

    if (isPart_time is not NULL) THEN        
    UPDATE salaries SET 
    payment_amount = currentPay + 
    (SELECT (end_date - start_date)* bid_price *0.75 FROM  /*for part timer*/
    bids_for WHERE is_successful = True 
    and advertisement_email = OLD.advertisement_email
    and pet_category = OLD.pet_category
    and start_date = OLD.start_date
    and end_date = OLD.end_date
    and owner_email = OLD.owner_email
    and pet_name = OLD.pet_name)
    WHERE email = OLD.advertisement_email AND payment_date = NEW.end_date;

    ELSE 
    UPDATE salaries SET 
    payment_amount = currentPay + 
    (SELECT (end_date - start_date)* bid_price FROM  /*for full timer*/
     bids_for WHERE is_successful = True 
    and advertisement_email = OLD.advertisement_email
    and pet_category = OLD.pet_category
    and start_date = OLD.start_date
    and end_date = OLD.end_date
    and owner_email = OLD.owner_email
    and pet_name = OLD.pet_name)
    WHERE email = OLD.advertisement_email AND payment_date = NEW.end_date;
    END IF;
    RETURN NEW;
END; $$
LANGUAGE PLPGSQL;

--testing above
CREATE TRIGGER update_ftcaretaker_petday
AFTER UPDATE of is_successful
ON bids_for
FOR EACH ROW WHEN (OLD.rating_given = 0 and OLD.is_successful = FALSE)
EXECUTE PROCEDURE update_PetDay();

--change the salary and petday to 0 at the end of the month
CREATE OR REPLACE FUNCTION reset_salaryAndPetDay()
RETURNS TRIGGER AS $$
DECLARE min_bid_price NUMERIC;
DECLARE num_successful INTEGER;
BEGIN
    UPDATE salaries
    SET payment_amount = 0
    WHERE payment_amount <> 0;
    
    UPDATE ft_caretakers
    SET pet_day = 0 
    WHERE pet_day <> 0; 
    RETURN NEW;
END; $$
LANGUAGE PLPGSQL;


--trigger to update salary by restting it to zero and reset the pet day for the pet month
CREATE TRIGGER reset_pet_day
AFTER UPDATE of payment_amount
On salaries 
FOR EACH ROW 
EXECUTE PROCEDURE reset_salaryAndPetDay();

-- trigger to automatically accept bid upon successful price match
CREATE OR REPLACE FUNCTION check_bidding_price()
RETURNS TRIGGER AS $$
DECLARE min_bid_price NUMERIC;
DECLARE num_successful INTEGER;
BEGIN
    SELECT COUNT(*) INTO num_successful FROM bids_for WHERE 
    is_successful = true AND 
    advertisement_email = NEW.advertisement_email AND 
    pet_category = NEW.pet_category and 
    start_date = NEW.start_date and 
    end_date = NEW.end_date;
    SELECT daily_price INTO min_bid_price FROM advertisements WHERE
    pet_category = NEW.pet_category AND
    email = NEW.advertisement_email AND
    start_date = NEW.start_date AND
    end_date =  NEW.end_date;
    IF num_successful > 0 THEN
    RAISE EXCEPTION 'advertisment has been taken. No further bids allowed';
    ELSIF NEW.bid_price >= min_bid_price THEN 
    UPDATE bids_for SET is_successful = true WHERE 
    advertisement_email = NEW.advertisement_email AND 
    pet_category = NEW.pet_category and 
    start_date = NEW.start_date and 
    end_date = NEW.end_date and 
    owner_email = NEW.owner_email;
    END IF;
    RETURN NEW;
END; $$
LANGUAGE PLPGSQL;

CREATE TRIGGER check_if_successful
AFTER INSERT OR UPDATE
ON bids_for
FOR EACH ROW
EXECUTE PROCEDURE check_bidding_price();

-- Check whether new leave results in no 2x 150 consecutive days
CREATE OR REPLACE FUNCTION check_leave()
RETURNS TRIGGER AS $$
DECLARE total_count INTEGER;
BEGIN
SELECT COUNT(*) INTO total_count
FROM (
    SELECT extract(day from (( SELECT MIN(start_date)
            FROM takes_leaves
            WHERE email=NEW.email) - date_trunc('year', CURRENT_DATE))) AS difference 
    UNION ALL
    SELECT table1.start_date-table1.end_date AS difference
        FROM (SELECT leaves.end_date AS end_date, MIN(leaves2.start_date) AS start_date 
            FROM takes_leaves AS leaves, takes_leaves AS leaves2
            WHERE leaves2.start_date >= leaves.end_date
            AND leaves.email = leaves2.email
            AND leaves.email = NEW.email
            GROUP BY leaves.end_date) AS table1
    UNION ALL 
    SELECT extract(day from ((date_trunc('year', CURRENT_DATE) + interval '1 year' - interval '1 day') - (SELECT MAX(end_date) FROM takes_leaves WHERE email=NEW.email))) AS difference) as bigtable WHERE bigtable.difference >= 150;
IF total_count < 2 THEN
RAISE EXCEPTION 'invalid leaves';
DELETE FROM takes_leaves WHERE email = NEW.email AND start_date = NEW.start_date AND end_date = NEW.end_date;
END IF;
RETURN NEW;
END; $$
LANGUAGE plpgsql;

CREATE TRIGGER is_valid_leave
AFTER INSERT
ON takes_leaves
FOR EACH ROW
EXECUTE PROCEDURE check_leave();


