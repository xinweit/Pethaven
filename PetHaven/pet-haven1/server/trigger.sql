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
    is_successful = True;

    SELECT COUNT(*) INTO isPart_time
    FROM pt_caretakers
    WHERE email = OLD.advertisement_email;
    
    UPDATE 
    SET f.pet_day = (currentPetDay + OLD.bid_end_date -
                    OLD.bid_start_date)
    WHERE f.email = OLD.advertisement_email;

    if (isPart_time not NULL) THEN        
    UPDATE salaries SET 
    payment_amount = currentPay + 
    SELECT SUM((end_date - start_date)* bid_price *0.75) AS salary FROM  /*for part timer*/
    bids_for WHERE is_successful = True 
    and advertisement_email = OLD.advertisement_email
    WHERE email = OLD.advertisement_email + NEW.CURRENT_TIME;

    ELSE 
    UPDATE salaries SET 
    payment_amount = currentPay + 
    SELECT SUM((end_date - start_date)* bid_price) AS salary FROM  /*for full timer*/
    bids_for WHERE is_successful = True 
    and advertisement_email = OLD.advertisement_email
    WHERE email = OLD.advertisement_email + NEW.CURRENT_TIME;
    END IF;
    RETURN NEW;
END; $$
LANGUAGE PLPGSQL;

CREATE TRIGGER update_ftcaretaker_petday
AFTER UPDATE 
ON bids_for
FOR EACH ROW WHEN (NEW.is_successful = true)
EXECUTE PROCEDURE update_PetDay();

/*to prevent further bidding  */
CREATE OR REPLACE FUNCTION check_bid()
RETURNS TRIGGER AS $$
DECLARE bid_status INTEGER;
DECLARE base_dailyprice NUMERIC;
BEGIN
   SELECT COUNT(*) INTO bid_status FROM bids_for WHERE  
   (is_successful = true) AND 
   (bids_for.advertisement_email = OLD.advertisement_email or 
    bids_for.advertisement_email = NEW.advertisement_email) and 
   (pet_category = OLD.pet_category or pet_category = NEW.pet_category)and 
   (start_date = OLD.start_date  or start_date = NEW.start_date)and 
   (end_date = OLD.end_date or end_date = NEW.end_date);
   
   SELECT daily_price INTO base_dailyprice FROM advertisements WHERE 
   email = NEW.advertisement_email AND 
   pet_category = NEW.pet_category and 
   start_date = NEW.start_date and 
   end_date = NEW.end_date;
   
   IF bid_status > 0 and NEW.is_successful = TRUE  
   RAISE EXCEPTION 'advertisement has been succesfully taken.';
   
   elsif NEW.bid_price >= base_dailyprice then
    UPDATE bids_for SET is_successful = True 
    WHERE owner_email = NEW.owner_email and 
    pet_name = NEW.pet_name and 
    start_date = NEW.start_date and 
    end_date = NEW.end_date and 
    pet_category = NEW.pet_category AND
    advertisement_email = NEW.advertisement_email;
   END IF;
   RETURN NEW;
END; $$
 LANGUAGE PLPGSQL;

CREATE TRIGGER prevent_insert_bidding
BEFORE INSERT
ON bids_for
FOR EACH ROW
EXECUTE PROCEDURE check_bid();

CREATE TRIGGER prevent_update_bidding
BEFORE UPDATE 
ON bids_for WHEN(OLD.is_successful = false)
FOR EACH ROW
EXECUTE PROCEDURE check_bid();


/*update the caretaker */
CREATE OR REPLACE FUNCTION give_rating_and_update()
RETURNS TRIGGER AS $$
DECLARE rating INTEGER;
DECLARE is_fulltimer INTEGER;
BEGIN
   SELECT rating_given INTO rating FROM bids_for WHERE 
   advertisement_email = OLD.advertisement_email AND 
   is_successful = true and 
   pet_category = OLD.pet_category and 
   start_date = OLD.start_date and 
   end_date = OLD.end_date;
   SELECT COUNT(*) INTO is_fulltimer FROM ft_caretakers AS f WHERE NEW.advertisement_email = f.email;
   IF is_fulltimer >= 1 THEN
   UPDATE ft_caretakers SET rating = (SELECT AVG(a.rating_given) FROM (SELECT * FROM bids_for WHERE email = NEW.advertisement_email AND is_successful = true) AS a) WHERE ft_caretakers.email = NEW.advertisement_email;
   ELSE
   UPDATE pt_caretakers SET rating = (SELECT AVG(a.rating_given) FROM (SELECT * FROM bids_for WHERE email = NEW.advertisement_email AND is_successful = true) AS a) WHERE pt_caretakers.email = NEW.advertisement_email;
   END IF;
   RETURN NEW;
END; $$
 LANGUAGE PLPGSQL;

CREATE TRIGGER update_caretaker_rating
AFTER UPDATE
ON bids_for
FOR EACH ROW WHEN (NEW.is_successful = true)
EXECUTE PROCEDURE give_rating_and_update();

/*salary for part time care taker*/

/*trigger for th */
CREATE OR REPLACE FUNCTION Assign_bid_proccess()
RETURNS TRIGGER AS $$
DECLARE base_dailyprice NUMERIC;
BEGIN
   SELECT daily_price INTO base_dailyprice FROM advertisements WHERE 
   email = NEW.advertisement_email AND 
   pet_category = NEW.pet_category and 
   start_date = NEW.start_date and 
   end_date = NEW.end_date;
   
    -- SELECT COUNT(*) INTO bid_status FROM bids_for WHERE  
    -- is_successful = true AND 
    -- bids_for.advertisement_email = NEW.advertisement_email and 
    -- pet_category = NEW.pet_category and 
    -- start_date = NEW.start_date and 
    -- end_date = NEW.end_date;


   if NEW.bid_price >= base_dailyprice THEN
    UPDATE bids_for SET is_successful = True 
    WHERE owner_email = NEW.owner_email and 
    pet_name = NEW.pet_name and 
    start_date = NEW.start_date and 
    end_date = NEW.end_date and 
    pet_category = NEW.pet_category AND
    advertisement_email = NEW.advertisement_email;
   END IF;
   RETURN NEW;
END; $$
 LANGUAGE PLPGSQL;

CREATE TRIGGER assign_bid
AFTER INSERT
ON bids_for
FOR EACH ROW 
EXECUTE PROCEDURE Assign_bid_proccess();


/*Query to calculate the salary of the part time caretakers
  $50 per pet day for pt caretakers
*/

SELECT start_date , end_date, bid_price FROM 
bids_for WHERE is_successful = True 
and advertisement_email =  '$1'





