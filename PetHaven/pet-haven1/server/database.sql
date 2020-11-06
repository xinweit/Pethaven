CREATE DATABASE pethaven;
CREATE TABLE pet_owners(
  email VARCHAR(255) PRIMARY KEY,
  password VARCHAR (255),
  name VARCHAR(255),
  credit_card VARCHAR(255)
);
CREATE TABLE caretakers(email VARCHAR(255) PRIMARY KEY);
CREATE TABLE pt_caretakers(
  email VARCHAR(255) PRIMARY KEY,
  password VARCHAR (255),
  name VARCHAR(255),
  rating float8 DEFAULT 0,
  FOREIGN KEY(email) REFERENCES caretakers(email) ON DELETE CASCADE
);
CREATE TABLE ft_caretakers(
  email VARCHAR(255) PRIMARY KEY,
  password VARCHAR (255),
  name VARCHAR(255),
  rating float8 DEFAULT 0,
  pet_day integer,
  FOREIGN KEY(email) REFERENCES caretakers(email) ON DELETE CASCADE
);
CREATE TABLE pcs_admins(
  email VARCHAR(255) PRIMARY KEY,
  password VARCHAR (255),
  name VARCHAR(255)
);
CREATE TABLE owns_pets(
  email VARCHAR(255) REFERENCES pet_owners(email) ON DELETE CASCADE,
  pet_name VARCHAR(50),
  special_requirements VARCHAR(255),
  pet_category VARCHAR(255),
  pet_age integer,
  PRIMARY KEY(email, pet_name)
);
CREATE TABLE advertisements(
  pet_category VARCHAR(255),
  start_date date,
  end_date date,
  daily_price NUMERIC,
  email VARCHAR(255) REFERENCES caretakers(email) ON DELETE CASCADE,
  PRIMARY KEY(email, pet_category, start_date, end_date),
  CONSTRAINT "start date needs to be less than end date" CHECK (start_date <= end_date)
);
CREATE TABLE specifies_available_days(
  start_date date,
  end_date date,
  email VARCHAR(255) REFERENCES pt_caretakers(email) ON DELETE CASCADE,
  PRIMARY KEY(start_date, end_date, email),
  CONSTRAINT "start date needsto be before end date" CHECK (start_date <= end_date)
);
CREATE TABLE salaries(
  payment_date date,
  payment_amount integer,
  email VARCHAR(255) REFERENCES caretakers(email) ON DELETE CASCADE,
  PRIMARY KEY(payment_date, email)
);
CREATE TABLE takes_leaves(
  start_date date,
  end_date date,
  email VARCHAR(255) REFERENCES ft_caretakers(email) ON DELETE CASCADE,
  PRIMARY KEY(start_date, end_date, email),
  CONSTRAINT "start date needs to be before end date" CHECK (start_date <= end_date)
);
CREATE TABLE specifies(
  pet_category VARCHAR(255),
  base_daily_price NUMERIC,
  pcs_email VARCHAR(255) REFERENCES pcs_admins(email) ON DELETE CASCADE,
  PRIMARY KEY(pet_category)
);
CREATE TABLE bids_for(
  bid_start_date date,
  bid_end_date date,
  transfer_method VARCHAR(255),
  bid_price NUMERIC,
  timestamp time,
  payment_method VARCHAR(255),
  rating_given NUMERIC DEFAULT 0,
  is_successful BOOLEAN DEFAULT FALSE,
  feedback VARCHAR(255),
  start_date DATE,
  end_date DATE,
  pet_category VARCHAR(255),
  advertisement_email VARCHAR(255),
  owner_email VARCHAR(255),
  pet_name VARCHAR(255),
  FOREIGN KEY (
    start_date,
    end_date,
    pet_category,
    advertisement_email
  ) REFERENCES advertisements(start_date, end_date, pet_category, email) ON DELETE CASCADE,
  FOREIGN KEY(owner_email, pet_name) REFERENCES owns_pets(email, pet_name) ON DELETE CASCADE ON UPDATE CASCADE,
  PRIMARY KEY(
    advertisement_email,
    pet_category,
    start_date,
    end_date,
    owner_email,
    pet_name
  ),
  CONSTRAINT "bid date needs to be more than end date" CHECK (bid_start_date < bid_end_date),
  CONSTRAINT "invalid range for rating" CHECK (
    (
      rating_given >= 0
      AND rating_given <= 10
    )
  )
);

CREATE OR REPLACE FUNCTION check_email_signup(
  type VARCHAR,
  input_email VARCHAR)
  RETURNS BOOLEAN AS
  $t$ BEGIN
    RETURN CASE
      WHEN type='pet_owner'
      THEN (EXISTS(SELECT *
                  FROM pet_owners p
                  WHERE p.email=input_email) OR EXISTS(SELECT * FROM caretakers c WHERE c.email=input_email) OR check_email_signin('pcs_admin', input_email) = TRUE)
      WHEN type='pt_caretaker' OR type='ft_caretaker'
      THEN (EXISTS(SELECT *
                  FROM caretakers c
                  WHERE c.email=input_email) OR check_email_signin('pet_owner', input_email) = TRUE OR check_email_signin('pcs_admin', input_email) = TRUE)
      WHEN type='pt_user' OR type='ft_user'
      THEN (EXISTS(SELECT email
                    FROM caretakers
                    WHERE email=input_email
                    UNION
                    SELECT email
                    FROM pet_owners
                    WHERE email=input_email) OR check_email_signin('pet_owner', input_email) = TRUE OR EXISTS(SELECT * FROM caretakers c WHERE c.email=input_email))
      WHEN type='pcs_admin'
      THEN (EXISTS(SELECT *
                  FROM pcs_admins p
                  WHERE p.email=input_email) OR EXISTS(SELECT * FROM caretakers c WHERE c.email=input_email) OR check_email_signin('pet_owner', input_email) = TRUE)
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
INSERT INTO caretakers VALUES(email); 
INSERT INTO ft_caretakers VALUES(email, password, name, 0); 
RETURN email;
END; ' LANGUAGE plpgsql;
CREATE OR REPLACE FUNCTION add_pt_caretaker(name VARCHAR, email VARCHAR, password VARCHAR) RETURNS VARCHAR AS ' BEGIN
INSERT INTO caretakers VALUES(email); INSERT INTO pt_caretakers VALUES(email, password, name); 
RETURN email; END; ' LANGUAGE plpgsql;
CREATE OR REPLACE FUNCTION add_pt_user(name VARCHAR, email VARCHAR, password VARCHAR) RETURNS VARCHAR AS ' BEGIN
INSERT INTO caretakers VALUES(email); INSERT INTO pt_caretakers VALUES(email, password, name); 
INSERT INTO pet_owners VALUES(email, password, name, NULL); 
RETURN email; END; ' LANGUAGE plpgsql;
CREATE OR REPLACE FUNCTION add_ft_user(name VARCHAR, email VARCHAR, password VARCHAR) RETURNS VARCHAR AS ' BEGIN
INSERT INTO caretakers VALUES(email); INSERT INTO ft_caretakers VALUES(email, password, name, 0); INSERT INTO pet_owners VALUES(email, password, name, NULL); RETURN email; END; ' LANGUAGE plpgsql;
-- Show top 5 ft_caretaker earners
SELECT *
FROM salaries s
  JOIN ft_caretakers ft ON s.email = ft.email
WHERE date_trunc('month', s.payment_date) = date_trunc('month', (CURRENT_DATE))
ORDER BY payment_amount DESC
LIMIT 5;
-- Show bottom 5 ft_caretaker performance
SELECT *
FROM salaries s
  LEFT JOIN ft_caretakers ft ON s.email = ft.email
WHERE date_trunc('month', s.payment_date) = date_trunc('month', (CURRENT_DATE))
ORDER BY payment_amount ASC
LIMIT 5;
-- Check whether new leave results in no 2x 150 consecutive days
CREATE OR REPLACE FUNCTION check_leave() RETURNS TRIGGER AS $$
DECLARE total_count INTEGER;
BEGIN
SELECT COUNT(*) INTO total_count
FROM (
    SELECT extract(
        day
        from (
            (
              SELECT MIN(start_date)
              FROM takes_leaves
              WHERE email = NEW.email
            ) - date_trunc('year', CURRENT_DATE)
          )
      ) AS difference
    UNION ALL
    SELECT table1.start_date - table1.end_date AS difference
    FROM (
        SELECT leaves.end_date AS end_date,
          MIN(leaves2.start_date) AS start_date
        FROM takes_leaves AS leaves,
          takes_leaves AS leaves2
        WHERE leaves2.start_date >= leaves.end_date
          AND leaves.email = leaves2.email
          AND leaves.email = NEW.email
        GROUP BY leaves.end_date
      ) AS table1
    UNION ALL
    SELECT extract(
        day
        from (
            (
              date_trunc('year', CURRENT_DATE) + interval '1 year' - interval '1 day'
            ) - (
              SELECT MAX(end_date)
              FROM takes_leaves
              WHERE email = NEW.email
            )
          )
      ) AS difference
  ) as bigtable
WHERE bigtable.difference >= 150;
IF total_count < 2 THEN RAISE EXCEPTION 'invalid leaves';
DELETE FROM takes_leaves
WHERE email = NEW.email
  AND start_date = NEW.start_date
  AND end_date = NEW.end_date;
END IF;
RETURN NEW;
END;
$$ LANGUAGE plpgsql;
CREATE TRIGGER is_valid_leave
AFTER
INSERT ON takes_leaves FOR EACH ROW EXECUTE PROCEDURE check_leave();
INSERT INTO caretakers
VALUES(email);
INSERT INTO ft_caretakers
VALUES(email, password, name, 0);
INSERT INTO pet_owners
VALUES(email, password, name, NULL);
RETURN email;
END;

LANGUAGE plpgsql;


-- calculate pt_caretaker salary for the month
CREATE OR REPLACE FUNCTION check_pt_salary(
    type VARCHAR,
    input_email VARCHAR)
    RETURNS INTEGER AS
    $$ BEGIN
    RETURN CASE
      WHEN type='pt_caretaker' OR type='pt_user'
      THEN (SELECT SUM(transactionRevenue)*0.75 AS revenue
FROM (SELECT bid_price*(end_date-start_date) AS transactionRevenue FROM bids_for WHERE is_successful = true
AND advertisement_email=input_email
AND (extract(month from start_date) = extract(month from CURRENT_DATE)
    AND extract(month from end_date) = extract(month from CURRENT_DATE))
UNION ALL
SELECT bid_price*(extract(day from end_date)) AS transactionRevenue FROM bids_for WHERE is_successful = true
AND advertisement_email=input_email
AND (extract(month from start_date) < extract(month from CURRENT_DATE)
    AND extract(month from end_date) = extract(month from CURRENT_DATE))
UNION ALL
SELECT bid_price*(DATE_PART('days', 
        DATE_TRUNC('month', CURRENT_DATE) 
        + '1 MONTH'::INTERVAL 
        - '1 DAY'::INTERVAL
    )-extract(day from start_date)) AS transactionRevenue FROM bids_for WHERE is_successful = true
AND advertisement_email=input_email
AND (extract(month from end_date) > extract(month from CURRENT_DATE)
    AND extract(month from start_date) = extract(month from CURRENT_DATE))) AS table1)

    ELSE 
    
    (SELECT SUM(transactionRevenue)*0.25 AS revenue
FROM (SELECT bid_price*(end_date-start_date) AS transactionRevenue FROM bids_for WHERE is_successful = true
AND advertisement_email=input_email
AND (extract(month from start_date) = extract(month from CURRENT_DATE)
    AND extract(month from end_date) = extract(month from CURRENT_DATE))
UNION ALL
SELECT bid_price*(extract(day from end_date)) AS transactionRevenue FROM bids_for WHERE is_successful = true
AND advertisement_email=input_email
AND (extract(month from start_date) < extract(month from CURRENT_DATE)
    AND extract(month from end_date) = extract(month from CURRENT_DATE))
UNION ALL
SELECT bid_price*(DATE_PART('days', 
        DATE_TRUNC('month', CURRENT_DATE) 
        + '1 MONTH'::INTERVAL 
        - '1 DAY'::INTERVAL
    )-extract(day from start_date)) AS transactionRevenue FROM bids_for WHERE is_successful = true
AND advertisement_email=input_email
AND (extract(month from end_date) > extract(month from CURRENT_DATE)
    AND extract(month from start_date) = extract(month from CURRENT_DATE))) AS table1) END;
    END; $$
    LANGUAGE plpgsql;


-- calculate ft_caretaker salary for the month
CREATE OR REPLACE FUNCTION check_ft_salary(
    type VARCHAR,
    input_email VARCHAR)
    RETURNS float8 AS $$
    DECLARE totalDays float8;
    DECLARE totalRevenue float8;
        BEGIN SELECT (SUM(noOfDays)) INTO totalDays
        FROM (SELECT (end_date-start_date) AS noOfDays, bid_price*(end_date-start_date) AS transactionRevenue FROM bids_for WHERE is_successful = true
        AND advertisement_email=input_email
        AND (extract(month from start_date) = extract(month from CURRENT_DATE)
            AND extract(month from end_date) = extract(month from CURRENT_DATE))
        UNION ALL
        SELECT (extract(day from end_date)) AS noOfDays, bid_price*(extract(day from end_date)) AS transactionRevenue FROM bids_for WHERE is_successful = true
        AND advertisement_email=input_email
        AND (extract(month from start_date) < extract(month from CURRENT_DATE)
            AND extract(month from end_date) = extract(month from CURRENT_DATE))
        UNION ALL
        SELECT (DATE_PART('days', 
                DATE_TRUNC('month', CURRENT_DATE) 
                + '1 MONTH'::INTERVAL 
                - '1 DAY'::INTERVAL
            )-extract(day from start_date)) AS noOfDays, bid_price*(DATE_PART('days', 
                DATE_TRUNC('month', CURRENT_DATE) 
                + '1 MONTH'::INTERVAL 
                - '1 DAY'::INTERVAL
            )-extract(day from start_date)) AS transactionRevenue FROM bids_for WHERE is_successful = true
        AND advertisement_email=input_email
        AND (extract(month from end_date) > extract(month from CURRENT_DATE)
            AND extract(month from start_date) = extract(month from CURRENT_DATE))) AS table1;

        SELECT (SUM(transactionRevenue)) INTO totalRevenue FROM (SELECT (end_date-start_date) AS noOfDays, bid_price*(end_date-start_date) AS transactionRevenue FROM bids_for WHERE is_successful = true
        AND advertisement_email=input_email
        AND (extract(month from start_date) = extract(month from CURRENT_DATE)
            AND extract(month from end_date) = extract(month from CURRENT_DATE))
        UNION ALL
        SELECT (extract(day from end_date)) AS noOfDays, bid_price*(extract(day from end_date)) AS transactionRevenue FROM bids_for WHERE is_successful = true
        AND advertisement_email=input_email
        AND (extract(month from start_date) < extract(month from CURRENT_DATE)
            AND extract(month from end_date) = extract(month from CURRENT_DATE))
        UNION ALL
        SELECT (DATE_PART('days', 
                DATE_TRUNC('month', CURRENT_DATE) 
                + '1 MONTH'::INTERVAL 
                - '1 DAY'::INTERVAL
            )-extract(day from start_date)) AS noOfDays, bid_price*(DATE_PART('days', 
                DATE_TRUNC('month', CURRENT_DATE) 
                + '1 MONTH'::INTERVAL 
                - '1 DAY'::INTERVAL
            )-extract(day from start_date)) AS transactionRevenue FROM bids_for WHERE is_successful = true
        AND advertisement_email=input_email
        AND (extract(month from end_date) > extract(month from CURRENT_DATE)
            AND extract(month from start_date) = extract(month from CURRENT_DATE))) AS table1;

        IF (type = 'ft_caretaker' OR type = 'ft_user') THEN IF totalDays <= 60 THEN RETURN 3000; END IF;
        RETURN 3000 + 0.8*(totalDays-60)*(totalRevenue/totalDays); END IF;

        IF totalDays <= 60 THEN RETURN totalRevenue-3000; END IF;
        RETURN totalRevenue - (3000 + 0.8*(totalDays-60)*(totalRevenue/totalDays));
        END;  $$
        LANGUAGE PLPGSQL;





SELECT SUM(transactionRevenue)*0.75 AS revenue
FROM (SELECT bid_price*(end_date-start_date) AS transactionRevenue FROM bids_for WHERE is_successful = true
AND advertisement_email='xw2@nus.com'
AND (extract(month from start_date) = extract(month from CURRENT_DATE)
    AND extract(month from end_date) = extract(month from CURRENT_DATE))
UNION ALL
SELECT bid_price*(extract(day from end_date)) AS transactionRevenue FROM bids_for WHERE is_successful = true
AND advertisement_email='xw2@nus.com'
AND (extract(month from start_date) < extract(month from CURRENT_DATE)
    AND extract(month from end_date) = extract(month from CURRENT_DATE))
UNION ALL
SELECT bid_price*(DATE_PART('days', 
        DATE_TRUNC('month', CURRENT_DATE) 
        + '1 MONTH'::INTERVAL 
        - '1 DAY'::INTERVAL
    )-extract(day from start_date)) AS transactionRevenue FROM bids_for WHERE is_successful = true
AND advertisement_email='xw2@nus.com'
AND (extract(month from end_date) > extract(month from CURRENT_DATE)
    AND extract(month from start_date) = extract(month from CURRENT_DATE))) AS table1