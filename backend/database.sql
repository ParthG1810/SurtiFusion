use surti_fusion;

-- 1) DROP old tables
DROP TABLE IF EXISTS order_items;
DROP TABLE IF EXISTS orders;
DROP TABLE IF EXISTS meal_plans;
DROP TABLE IF EXISTS customers;
DROP TABLE IF EXISTS users;

-- 2) CREATE tables

CREATE TABLE users (
  id         INT AUTO_INCREMENT PRIMARY KEY,
  username   VARCHAR(100) NOT NULL UNIQUE,
  userpassword   VARCHAR(255) NOT NULL,
  role ENUM('admin','user') NOT NULL DEFAULT 'user',
  createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updatedAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

CREATE TABLE customers (
  id         INT AUTO_INCREMENT PRIMARY KEY,
  customername       VARCHAR(100)   NOT NULL,
  phone      VARCHAR(20)    NOT NULL UNIQUE,
  address    TEXT           NOT NULL,
  createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updatedAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

CREATE TABLE meal_plans (
  id         INT AUTO_INCREMENT PRIMARY KEY,
  planname       VARCHAR(100)   NOT NULL,
  frequency  ENUM('Weekly','Monthly') NOT NULL,
  days       ENUM('Mon-Fri','Mon-Sat') NOT NULL,
  items      VARCHAR(255)   NOT NULL,
  price      DECIMAL(6,2)   NOT NULL,
  createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updatedAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

CREATE TABLE orders (
  id           INT AUTO_INCREMENT PRIMARY KEY,
  customerId  INT            NOT NULL,
  startDate   DATE           NOT NULL,
  endDate     DATE           NOT NULL,
  createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updatedAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (customerId) REFERENCES customers(id) ON DELETE CASCADE
);

CREATE TABLE order_items (
  id            INT AUTO_INCREMENT PRIMARY KEY,
  orderId      INT            NOT NULL,
  mealPlanId  INT            NOT NULL,
  quantity      INT            NOT NULL DEFAULT 1,
  selectedDays TEXT           NOT NULL,
  FOREIGN KEY (orderId)     REFERENCES orders(id)       ON DELETE CASCADE,
  FOREIGN KEY (mealPlanId) REFERENCES meal_plans(id)  ON DELETE RESTRICT
);

-- 3) INSERT dummy system users (password: 'password')
--    bcrypt hash below corresponds to plaintext 'password'
INSERT INTO users (username, userpassword) VALUES
  ('admin', 'admin123'),
  ('user', 'user123');
UPDATE users SET role='admin' WHERE username='admin';

-- 4) INSERT dummy tiffin customers
INSERT INTO customers (customername, phone, address) VALUES
  ('Alice Smith', '555-1234', '123 Main St, Springfield'),
  ('Bob Johnson', '555-5678', '456 Oak Ave, Shelbyville');

-- 5) INSERT sample meal plans
INSERT INTO meal_plans (planname, frequency, days, items, price) VALUES
  ('Roti Only',    'Weekly',  'Mon-Fri', 'Roti',                    12.50),
  ('Roti Only',    'Weekly',  'Mon-Sat', 'Roti',                    15.00),
  ('Roti Only',    'Monthly', 'Mon-Fri', 'Roti',                    50.00),
  ('Dal + Rice',   'Weekly',  'Mon-Fri', 'Dal + Rice',              18.75),
  ('Dal + Rice',   'Monthly', 'Mon-Fri', 'Dal + Rice',              75.00),
  ('Dal+Sabzi+Roti','Weekly',  'Mon-Fri', 'Dal + Rice + Sabzi',      25.00),
  ('Salad Combo',  'Weekly',  'Mon-Fri', 'Dal + Rice + Sabzi + Salad',30.00);

-- 6) INSERT a sample order for Alice (customer_id = 1)
INSERT INTO orders (customerId, startDate, endDate) VALUES
  (1, CURDATE(), DATE_ADD(CURDATE(), INTERVAL 4 DAY));

-- 7) INSERT order items (order_id = 1)
INSERT INTO order_items (orderId, mealPlanId, quantity, selectedDays) VALUES
  (1, 1, 1, JSON_ARRAY('Mon','Tue','Wed','Thu','Fri')),
  (1, 4, 1, JSON_ARRAY('Mon','Tue','Wed','Thu','Fri'));

