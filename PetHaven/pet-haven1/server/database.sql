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
    email VARCHAR(255) REFERENCES caretakers(email) ON DELETE CASCADE,
    PRIMARY KEY(email, pet_category, start_date, end_date),
    CHECK (start_date < end_date)
);

CREATE TABLE specifies_available_days(
    start_date date,
    end_date date,
    email VARCHAR(255) REFERENCES pt_caretakers(email) ON DELETE CASCADE,
    PRIMARY KEY(start_date, end_date, email),
    CHECK (start_date < end_date)
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
    CHECK (start_date <= end_date)
);

CREATE TABLE specifies(
    pet_category VARCHAR(255),
    base_daily_price NUMERIC,
    ft_email VARCHAR(255) REFERENCES ft_caretakers(email) ON DELETE CASCADE,
    pcs_email VARCHAR(255) REFERENCES pcs_admins(email) ON DELETE CASCADE,
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
    is_successful BOOLEAN DEFAULT FALSE,
    feedback VARCHAR(255),
    start_date DATE,
    end_date DATE,
    pet_category VARCHAR(255),
    advertisement_email VARCHAR(255),  
    owner_email VARCHAR(255),
    pet_name VARCHAR(255),
    FOREIGN KEY (start_date, end_date, pet_category, advertisement_email) REFERENCES advertisements(start_date, end_date, pet_category, email) ON DELETE CASCADE,
    FOREIGN KEY(owner_email, pet_name) REFERENCES owns_pets(email, pet_name) ON DELETE CASCADE ON UPDATE CASCADE,
    PRIMARY KEY(advertisement_email, pet_category, start_date, end_date, owner_email, pet_name),
    CHECK (bid_start_date < bid_end_date),
    CHECK ( (is_successful == FALSE AND rating_given NULL AND feedback NULL) 
    OR (is_successful == TRUE AND rating_given NOT NULL AND feedback NOT NULL) ),
    CHECK ( (rating_given >= 0 AND rating_given <= 10) OR (rating_given NULL) )
);

CREATE OR REPLACE FUNCTION login(
  type VARCHAR,
  input_email VARCHAR,
  input_password VARCHAR)
  RETURNS BOOLEAN AS 
  $t$ BEGIN
    RETURN CASE
      WHEN type='pet_owner'
      THEN EXISTS(SELECT *
                  FROM pet_owners p
                  WHERE p.email=input_email
                  AND p.password=input_password)
      WHEN type='caretaker'
      THEN EXISTS(SELECT *
                  FROM caretakers c
                  WHERE c.email=input_email
                  AND (EXISTS(SELECT *
                              FROM pt_caretakers pt
                              WHERE pt.email=c.email
                              AND pt.password=input_password)
                       OR EXISTS(SELECT *
                                 FROM ft_caretakers ft
                                 WHERE ft.email=c.email
                                 AND ft.password=input_password)))
      WHEN type='pcs_admin'
      THEN EXISTS(SELECT *
            FROM pcs_admins p
            WHERE p.email=input_email
            AND p.password=input_password)
      ELSE 0 END; END; $t$
  LANGUAGE plpgsql;

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
INSERT INTO caretakers VALUES(email); INSERT INTO pt_caretakers VALUES(email, password, name); RETURN email; END; '
LANGUAGE plpgsql;

CREATE OR REPLACE FUNCTION add_pt_user(name VARCHAR, email VARCHAR, password VARCHAR)
RETURNS VARCHAR AS
' BEGIN
INSERT INTO caretakers VALUES(email); INSERT INTO pt_caretakers VALUES(email, password, name); INSERT INTO pet_owners VALUES(email, password, name, NULL); RETURN email; END; '
LANGUAGE plpgsql;

CREATE OR REPLACE FUNCTION add_ft_user(name VARCHAR, email VARCHAR, password VARCHAR)
RETURNS VARCHAR AS 
' BEGIN
INSERT INTO caretakers VALUES(email); INSERT INTO ft_caretakers VALUES(email, password, name, 0); INSERT INTO pet_owners VALUES(email, password, name, NULL); RETURN email; END; '
LANGUAGE plpgsql;