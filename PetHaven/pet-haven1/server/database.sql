-- CREATE DATABASE pethaven;

CREATE TABLE pet_owners(
    email VARCHAR(255) PRIMARY KEY,
    password VARCHAR (50),
    age integer,
    name VARCHAR(255),
    credit_card VARCHAR(255)
);

 CREATE TABLE caretakers(
    email VARCHAR(255) PRIMARY KEY
);

CREATE TABLE pt_caretakers(
    email VARCHAR(255) PRIMARY KEY,
    password VARCHAR (50),
    age integer,
    name VARCHAR(255), 
    FOREIGN KEY(email) REFERENCES caretakers(email)
);

CREATE TABLE ft_caretakers(
    email VARCHAR(255) PRIMARY KEY,
    password VARCHAR (50),
    age integer,
    name VARCHAR(255),
    pet_day integer,
    FOREIGN KEY(email) REFERENCES caretakers(email)
);

CREATE TABLE pcs_admins(
    email VARCHAR(255) PRIMARY KEY,
    password VARCHAR (50),
    age integer,
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
);


