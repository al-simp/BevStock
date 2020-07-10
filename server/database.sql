CREATE DATABASE bevstock;

CREATE TABLE product(
    product_id SERIAL PRIMARY KEY,
    product_name VARCHAR(255), 
    quantity REAL
);

--create users table
CREATE TABLE app_user(
    user_id uuid PRIMARY KEY DEFAULT
    uuid_generate_v4(),
    user_name VARCHAR(255) NOT NULL, 
    user_email VARCHAR(255) NOT NULL,
    user_password VARCHAR(255) NOT NULL
);

--create some users
INSERT INTO app_user (user_name, user_email, user_password) 
VALUES ('Alan', 'asimpson21@qub.ac.uk', '2256');