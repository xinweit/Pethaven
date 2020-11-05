--triggers
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
BEFORE INSERT OR DELETE 
ON advertisements
FOR EACH ROW
EXECUTE PROCEDURE check_daily_price();

-- trigger for updating of a care-taker's rating and 
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

CREATE TRIGGER update_ftcaretaker_petday
AFTER UPDATE of is_successful
ON bids_for
FOR EACH ROW WHEN (OLD.rating_given = 0 and OLD.is_successful = FALSE)
EXECUTE PROCEDURE update_PetDay();

-- trigger to automatically accept bid upon successful price match

-- CREATE OR REPLACE FUNCTION assign_bidprice()
-- RETURNS TRIGGER AS $$
-- DECLARE base_dailyprice NUMERIC;
-- BEGIN
--    SELECT daily_price INTO base_dailyprice FROM advertisements WHERE 
--    email = NEW.advertisement_email AND 
--    pet_category = NEW.pet_category and 
--    start_date = NEW.start_date and 
--    end_date = NEW.end_date;
--    if NEW.bid_price >= base_dailyprice AND OLD.THEN
--     UPDATE bids_for SET is_successful = True 
--     WHERE owner_email = NEW.owner_email and 
--     pet_name = NEW.pet_name and 
--     start_date = NEW.start_date and 
--     end_date = NEW.end_date and 
--     pet_category = NEW.pet_category AND
--     advertisement_email = NEW.advertisement_email;
--    END IF;
--    RETURN NEW;
-- END; $$
--  LANGUAGE PLPGSQL;

-- CREATE TRIGGER assign_bid
-- AFTER INSERT
-- ON bids_for
-- FOR EACH ROW WHEN(NEW.bid_pri)
-- EXECUTE PROCEDURE assign_bidprice();