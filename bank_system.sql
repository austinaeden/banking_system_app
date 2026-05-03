-- Banking System Database Schema
-- Designed for Spring Boot Backend and React Frontend

-- 1. Users Table (Handles both Regular Users and Admins)
CREATE TABLE users (
    id SERIAL PRIMARY KEY,
    username VARCHAR(100) NOT NULL,
    email VARCHAR(100) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    phone_number VARCHAR(20),
    account_tier VARCHAR(50) DEFAULT 'Standard',
    role VARCHAR(20) DEFAULT 'USER', -- 'USER' or 'ADMIN'
    profile_photo VARCHAR(255),
    registered_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 2. Accounts Table
CREATE TABLE accounts (
    id SERIAL PRIMARY KEY,
    user_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    account_name VARCHAR(100), -- Optional
    account_number VARCHAR(50) UNIQUE NOT NULL,
    account_type VARCHAR(20) NOT NULL CHECK (account_type IN ('Personal', 'Business')),
    balance DECIMAL(15, 2) DEFAULT 0.00,
    is_frozen BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 3. Transactions Table
CREATE TABLE transactions (
    id SERIAL PRIMARY KEY,
    user_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    account_id INTEGER NOT NULL REFERENCES accounts(id) ON DELETE CASCADE,
    recipient_info VARCHAR(255) NOT NULL, -- name or number or email to
    amount DECIMAL(15, 2) NOT NULL,
    category VARCHAR(100) DEFAULT 'None', -- none or what the user has written on note tab
    transaction_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP -- time and date
);

-- 4. Notifications Table
CREATE TABLE notifications (
    id SERIAL PRIMARY KEY,
    user_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    name VARCHAR(100) NOT NULL, -- name of the notification
    message TEXT NOT NULL, -- the notification content
    notification_date DATE DEFAULT CURRENT_DATE,
    notification_time TIME DEFAULT CURRENT_TIME
);

-- 5. Audit Table (For Admin side: to track audits/actions)
CREATE TABLE audit_logs (
    id SERIAL PRIMARY KEY,
    admin_id INTEGER REFERENCES users(id),
    action VARCHAR(255) NOT NULL, -- e.g., 'FROZE_ACCOUNT', 'UNFROZE_ACCOUNT'
    target_account_id INTEGER REFERENCES accounts(id),
    performed_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- ---------------------------------------------------------
-- ADMIN VIEWS
-- ---------------------------------------------------------

-- View: Total amount of money that the bank has
CREATE VIEW view_total_bank_money AS
SELECT SUM(balance) AS total_amount
FROM accounts;

-- View: Normal users view
CREATE VIEW view_normal_users AS
SELECT id, username, email, phone_number, account_tier, profile_photo, registered_at
FROM users
WHERE role = 'USER';

-- View: Accounts (name of the account, account number, owner, audit, freeze/unfreeze status)
CREATE VIEW view_admin_accounts AS
SELECT 
    a.id AS account_id,
    a.account_name, 
    a.account_number, 
    u.username AS owner, 
    a.is_frozen,
    (SELECT COUNT(*) FROM audit_logs al WHERE al.target_account_id = a.id) as audit_count
FROM accounts a
JOIN users u ON a.user_id = u.id;
-- ---------------------------------------------------------
-- SEED DATA (Default Admin and Test User)
-- ---------------------------------------------------------

INSERT INTO users (username, email, password_hash, phone_number, account_tier, role)
VALUES ('System Admin', 'admin@gmail.com', 'password123', '+1 000 000 000', 'Standard', 'ADMIN');

INSERT INTO users (username, email, password_hash, phone_number, account_tier, role)
VALUES ('Austin Aeden', 'austinaeden@gmail.com', 'password123', '+1 234 567 890', 'Standard', 'USER');

-- Add some initial accounts for the test user
INSERT INTO accounts (user_id, account_name, account_number, account_type, balance)
VALUES (2, 'Checking', '**** 4421', 'Personal', 12450.50);

INSERT INTO accounts (user_id, account_number, account_type, balance)
VALUES (2, '**** 8892', 'Personal', 45200.00);
