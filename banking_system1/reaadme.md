1. User Authentication (Auth.jsx)
This handles your users table in MySQL.
Login Form:
Inputs: Email Address, Password.
Button: "Sign In".
DB Action: SELECT query to verify if the user exists and the password matches.
Registration Form:
Inputs: Full Name, Email Address, Password.
Button: "Create Account".
DB Action: INSERT query to add a new user to the users table.
Password Recovery:
Input: Email Address.
Button: "Send Link".
DB Action: SELECT to find the user and potentially UPDATE a reset token.
2. Dashboard & Overview (Dashboard.jsx)
This is mostly for Outputs (reading from the database).
Outputs (Read Only):
Total Balance: Sum of all balances from the accounts table for that user.
Account Cards: List of accounts (Checking, Savings, etc.) with their specific balances.
Recent Transactions: The last 5-10 rows from the transactions table.
Charts: Data points derived from the transactions table (grouped by category or date).
3. Transfer Funds (Transfer.jsx)
This is the most complex part as it affects two tables (accounts and transactions).
Transfer Form:
Inputs:
Source Account (Dropdown selecting from user's accounts).
Destination (Text input for account name or number).
Amount (Numeric input).
Button: "Confirm Transfer".
DB Action (Transaction/Atomic):
UPDATE the source account balance (subtract amount).
INSERT a new record into the transactions table (record the withdrawal).
(Optional) UPDATE destination account balance if it's an internal user.
4. User Profile (Profile.jsx)
Edit Profile Form:
Inputs: Full Name, Email, Phone Number.
Button: "Save Changes".
DB Action: UPDATE query on the users table for that specific User ID.
5. Transaction History (Transactions.jsx)
Outputs:
Full List: Every transaction linked to the user's ID.
Inputs (Filters):
Search Bar: Filters the SELECT query by payee name.
Category/Type Dropdowns: Filters the SELECT query by category (e.g., "Food") or type (e.g., "Deposit").
🛡️ Admin Page Requirements (For your future build)
Since you want an Admin page to "check everything," your Spring Boot backend will need these extra endpoints:
User Management: A table showing all users from the users table.
Global Transaction Log: A list of every transaction happening in the system (across all users).
Account Control: Buttons to "Freeze" or "Deactivate" an account (requires a status column in your accounts table).
System Stats: Total money held by the bank (Sum of all balances in the system).
Recommended MySQL Table Structure:
users: id, name, email, password_hash, phone, role (user/admin).
accounts: id, user_id, account_type, balance, account_number.
transactions: id, user_id, account_id, date, payee, amount, type, category.