CREATE DATABASE pethaven;

CREATE TABLE pet_owners(
    email VARCHAR(255) PRIMARY KEY,
    password VARCHAR (255),
    name VARCHAR(255),
    credit_card VARCHAR(255)
);

 CREATE TABLE caretakers(
    email VARCHAR(255) PRIMARY KEY
);

CREATE TABLE pt_caretakers(
    email VARCHAR(255) PRIMARY KEY,
    password VARCHAR (255),
    name VARCHAR(255),
    rating float8 default 0,
    FOREIGN KEY(email) REFERENCES caretakers(email)
);

CREATE TABLE ft_caretakers(
    email VARCHAR(255) PRIMARY KEY,
    password VARCHAR (255),
    name VARCHAR(255),
    rating float8 default 0,
    pet_day integer,
    FOREIGN KEY(email) REFERENCES caretakers(email)
);

CREATE TABLE pcs_admins(
    email VARCHAR(255) PRIMARY KEY,
    password VARCHAR (255),
    name VARCHAR(255)
);

CREATE TABLE owns_pets(
    email VARCHAR(255) REFERENCES pet_owners(email),
    pet_name VARCHAR(50),
    special_requirments VARCHAR(255),
    pet_category VARCHAR(255),
    pet_age integer,
    PRIMARY KEY(email, pet_name)
);

CREATE TABLE advertisements(
    pet_category VARCHAR(255),
    start_date date,
    end_date date,
    daily_price NUMERIC,
    email VARCHAR(255) REFERENCES caretakers(email),
    PRIMARY KEY(email, pet_category, start_date, end_date)
);

CREATE TABLE specifies_available_days(
    start_date date,
    end_date date,
    email VARCHAR(255) REFERENCES pt_caretakers(email),
    PRIMARY KEY(start_date, end_date, email)
);

CREATE TABLE salaries(
    payment_date date,
    payment_amount integer,
    email VARCHAR(255) REFERENCES caretakers(email),
    PRIMARY KEY(payment_date, email)
);

CREATE TABLE takes_leaves(
    start_date date,
    end_date date,
    email VARCHAR(255) REFERENCES ft_caretakers(email),
    PRIMARY KEY(start_date, end_date, email)
);

CREATE TABLE specifies(
    pet_category VARCHAR(255),
    base_daily_price NUMERIC,
    ft_email VARCHAR(255) REFERENCES ft_caretakers(email),
    pcs_email VARCHAR(255) REFERENCES pcs_admins(email),
    PRIMARY KEY(ft_email, pcs_email)
);

CREATE TABLE bids_for(
    bid_start_date date,
    bid_end_date date,
    transfer_method VARCHAR(255),
    bid_price NUMERIC,
    timestamp time,
    payment_method VARCHAR(255),
    rating_given NUMERIC,
    is_successful BOOLEAN,
    feedback VARCHAR(255),
    start_date DATE,
    end_date DATE,
    pet_category VARCHAR(255),
    advertisement_email VARCHAR(255),  
    pet_email VARCHAR(255),
    pet_name VARCHAR(255),
    FOREIGN KEY (start_date, end_date, pet_category, advertisement_email) REFERENCES advertisements(start_date, end_date, pet_category, email),
    FOREIGN KEY(pet_email, pet_name) REFERENCES owns_pets(email, pet_name),
    PRIMARY KEY(advertisement_email, pet_category, start_date, end_date, pet_email, pet_name)
    CONSTRAINT ('rating must be between 0 and 10') CHECK(rating_given >= 0 AND rating_given <= 10);
);

CREATE OR REPLACE FUNCTION check_email_signup(
  type VARCHAR,
  input_email VARCHAR)
  RETURNS BOOLEAN AS
  $t$ BEGIN
    RETURN CASE
      WHEN type='pet_owner'
      THEN EXISTS(SELECT *
                  FROM pet_owners p
                  WHERE p.email=input_email)
      WHEN type='pt_caretaker' OR type='ft_caretaker'
      THEN EXISTS(SELECT *
                  FROM caretakers c
                  WHERE c.email=input_email)
      WHEN type='pt_user' OR type='ft_user'
      THEN EXISTS(SELECT email
                    FROM caretakers
                    WHERE email=input_email
                    UNION
                    SELECT email
                    FROM pet_owners
                    WHERE email=input_email)
      WHEN type='pcs_admin'
      THEN EXISTS(SELECT *
                  FROM pcs_admins p
                  WHERE p.email=input_email)
      ELSE FALSE END; END; $t$
  LANGUAGE plpgsql;

CREATE OR REPLACE FUNCTION check_email_signin(
  type VARCHAR,
  input_email VARCHAR)
  RETURNS BOOLEAN AS
  $t$ BEGIN
    RETURN CASE
      WHEN type='pet_owner'
      THEN EXISTS(SELECT *
                  FROM pet_owners p
                  WHERE p.email=input_email)
      WHEN type='pt_caretaker' OR type='ft_caretaker'
      THEN EXISTS(SELECT *
                  FROM caretakers c
                  WHERE c.email=input_email)
      WHEN type='pt_user' OR type='ft_user'
      THEN EXISTS(SELECT c.email
                    FROM caretakers c JOIN pet_owners p ON c.email=p.email
                    WHERE c.email=input_email)
      WHEN type='pcs_admin'
      THEN EXISTS(SELECT *
                  FROM pcs_admins p
                  WHERE p.email=input_email)
      ELSE FALSE END; END; $t$
  LANGUAGE plpgsql;

CREATE OR REPLACE FUNCTION check_password(
  type VARCHAR,
  input_email VARCHAR)
  RETURNS VARCHAR AS 
  $t$ BEGIN
    RETURN CASE
      WHEN type='pet_owner'
      THEN (SELECT p.password
                  FROM pet_owners p
                  WHERE p.email=input_email)
      WHEN type='pt_caretaker' OR type='ft_caretaker'
      THEN (SELECT pt.password
                  FROM pt_caretakers pt
                  WHERE pt.email=input_email
                  UNION
                  SELECT password
                  FROM ft_caretakers
                  WHERE email=input_email)
      WHEN type='pt_user' OR type='ft_user'
      THEN (SELECT p.password
                  FROM caretakers c JOIN pet_owners p ON c.email=p.email
                  WHERE c.email=input_email)
      WHEN type='pcs_admin'
      THEN (SELECT p.password
            FROM pcs_admins p
            WHERE p.email=input_email)
      ELSE NULL END; END; $t$
  LANGUAGE plpgsql;

CREATE OR REPLACE FUNCTION add_ft_caretaker(name VARCHAR, email VARCHAR, password VARCHAR)
RETURNS VARCHAR AS
' BEGIN
INSERT INTO caretakers VALUES(email); INSERT INTO ft_caretakers VALUES(email, password, name, 0); RETURN email; END; '
LANGUAGE plpgsql;

CREATE OR REPLACE FUNCTION add_pt_caretaker(name VARCHAR, email VARCHAR, password VARCHAR)
RETURNS VARCHAR AS
' BEGIN
INSERT INTO caretakers VALUES(email); INSERT INTO pt_caretakers VALUES(email, password, name, 0); RETURN email; END; '
LANGUAGE plpgsql;

CREATE OR REPLACE FUNCTION add_pt_user(name VARCHAR, email VARCHAR, password VARCHAR)
RETURNS VARCHAR AS
' BEGIN
INSERT INTO caretakers VALUES(email); INSERT INTO pt_caretakers VALUES(email, password, name); INSERT INTO pet_owners VALUES(email, password, name, 0); RETURN email; END; '
LANGUAGE plpgsql;

CREATE OR REPLACE FUNCTION add_ft_user(name VARCHAR, email VARCHAR, password VARCHAR)
RETURNS VARCHAR AS 
' BEGIN
INSERT INTO caretakers VALUES(email); INSERT INTO ft_caretakers VALUES(email, password, name, 0); INSERT INTO pet_owners VALUES(email, password, name, 0); RETURN email; END; '
LANGUAGE plpgsql;

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
  -- if (OLD.is_successful = FALSE or OLD.rating_given <> 0) THEN 
  --     RAISE EXCEPTION 'Invalid action. Please wait for the transaction to be completed and do not submit duplicate query.';
  --     RETURN NULL;
  --     END IF;
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
/* (NEW.rating_given = NULL and OLD.is_successful = FALSE) */