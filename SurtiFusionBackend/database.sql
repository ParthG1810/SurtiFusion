use surti_fusion;

-- 1) DROP old tables
DROP TABLE IF EXISTS order_items;

DROP TABLE IF EXISTS orders;

DROP TABLE IF EXISTS meal_plans;

DROP TABLE IF EXISTS customers;

DROP TABLE IF EXISTS users;

DROP TABLE IF EXISTS label_templates;

-- 2) CREATE tables
CREATE TABLE
  users (
    id INT AUTO_INCREMENT PRIMARY KEY,
    username VARCHAR(100) NOT NULL UNIQUE,
    userpassword VARCHAR(255) NOT NULL,
    role ENUM ('admin', 'user') NOT NULL DEFAULT 'user',
    createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updatedAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
  );

CREATE TABLE
  customers (
    id INT AUTO_INCREMENT PRIMARY KEY,
    customername VARCHAR(100) NOT NULL,
    phone VARCHAR(20) NOT NULL,
    address TEXT NOT NULL,
    createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updatedAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
  );

CREATE TABLE
  meal_plans (
    id INT AUTO_INCREMENT PRIMARY KEY,
    planname VARCHAR(100) NOT NULL,
    frequency ENUM ('Weekly', 'Monthly', 'Single') NOT NULL,
    days ENUM ('Mon-Fri', 'Mon-Sat') NULL,
    items VARCHAR(255) NOT NULL,
    price DECIMAL(6, 2) NOT NULL,
    createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updatedAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
  );

CREATE TABLE
  orders (
    id INT AUTO_INCREMENT PRIMARY KEY,
    customerId INT NOT NULL,
    startDate DATE NOT NULL,
    endDate DATE NOT NULL,
    createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updatedAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (customerId) REFERENCES customers (id) ON DELETE CASCADE
  );

CREATE TABLE
  order_items (
    id INT AUTO_INCREMENT PRIMARY KEY,
    orderId INT NOT NULL,
    mealPlanId INT NOT NULL,
    quantity INT NOT NULL DEFAULT 1,
    selectedDays TEXT NOT NULL,
    isAbsent BOOLEAN,
    FOREIGN KEY (orderId) REFERENCES orders (id) ON DELETE CASCADE,
    FOREIGN KEY (mealPlanId) REFERENCES meal_plans (id) ON DELETE RESTRICT
  );

CREATE TABLE
  label_templates (
    id INT NOT NULL AUTO_INCREMENT,
    content TEXT NOT NULL,
    createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updatedAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    PRIMARY KEY (id)
  );

-- 3) INSERT dummy system users (password: 'password')
--    bcrypt hash below corresponds to plaintext 'password'
INSERT INTO
  users (username, userpassword)
VALUES
  ('admin', 'a'), -- admin123
  ('user', 'u'), -- user123
  ('a', 'a');

-- user123
UPDATE users
SET
  role = 'admin'
WHERE
  username = 'admin';

UPDATE users
SET
  role = 'admin'
WHERE
  username = 'a';

-- 4) INSERT dummy tiffin customers
INSERT INTO
  customers (
    `id`,
    `customername`,
    `phone`,
    `address`,
    `createdAt`,
    `updatedAt`
  )
VALUES
  (
    3,
    'BHAVIN',
    '',
    '6967 Bayers Rd',
    '2025-06-22 18:48:05',
    '2025-06-22 18:48:05'
  );

INSERT INTO
  customers (
    `id`,
    `customername`,
    `phone`,
    `address`,
    `createdAt`,
    `updatedAt`
  )
VALUES
  (
    4,
    'HARSH',
    '',
    '58 Bedford Hwy',
    '2025-06-22 18:48:18',
    '2025-06-22 18:48:18'
  );

INSERT INTO
  customers (
    `id`,
    `customername`,
    `phone`,
    `address`,
    `createdAt`,
    `updatedAt`
  )
VALUES
  (
    5,
    'SIDDHARAT',
    '',
    '6533 Cork St',
    '2025-06-22 18:48:31',
    '2025-06-22 18:48:31'
  );

INSERT INTO
  customers (
    `id`,
    `customername`,
    `phone`,
    `address`,
    `createdAt`,
    `updatedAt`
  )
VALUES
  (
    6,
    'YUG',
    '',
    '2225 Monastery Lane',
    '2025-06-22 18:48:42',
    '2025-06-22 18:48:42'
  );

INSERT INTO
  customers (
    `id`,
    `customername`,
    `phone`,
    `address`,
    `createdAt`,
    `updatedAt`
  )
VALUES
  (
    7,
    'UTKARSH',
    '',
    '5214 Gerrish St, Apt 206',
    '2025-06-22 18:48:54',
    '2025-06-22 18:48:54'
  );

INSERT INTO
  customers (
    `id`,
    `customername`,
    `phone`,
    `address`,
    `createdAt`,
    `updatedAt`
  )
VALUES
  (
    8,
    'PAKSHAL',
    '',
    '5214 Gerrish St, Apt 206',
    '2025-06-22 18:49:04',
    '2025-06-22 18:49:04'
  );

INSERT INTO
  customers (
    `id`,
    `customername`,
    `phone`,
    `address`,
    `createdAt`,
    `updatedAt`
  )
VALUES
  (
    9,
    'ARTH',
    '',
    '',
    '2025-06-22 18:49:21',
    '2025-06-22 18:49:48'
  );

INSERT INTO
  customers (
    `id`,
    `customername`,
    `phone`,
    `address`,
    `createdAt`,
    `updatedAt`
  )
VALUES
  (
    10,
    'CHITRANG',
    '',
    '',
    '2025-06-22 18:49:36',
    '2025-06-22 18:49:51'
  );

INSERT INTO
  customers (
    `id`,
    `customername`,
    `phone`,
    `address`,
    `createdAt`,
    `updatedAt`
  )
VALUES
  (
    11,
    'AANANDI',
    '',
    '38 Evans St',
    '2025-06-22 18:50:11',
    '2025-06-22 18:50:11'
  );

INSERT INTO
  customers (
    `id`,
    `customername`,
    `phone`,
    `address`,
    `createdAt`,
    `updatedAt`
  )
VALUES
  (
    12,
    'JAY 2',
    '',
    '205 Bedford Hwy',
    '2025-06-22 18:50:31',
    '2025-06-22 18:50:31'
  );

INSERT INTO
  customers (
    `id`,
    `customername`,
    `phone`,
    `address`,
    `createdAt`,
    `updatedAt`
  )
VALUES
  (
    13,
    'HARSH M',
    '',
    '1991 Brunswick St',
    '2025-06-22 18:50:49',
    '2025-06-22 18:50:49'
  );

INSERT INTO
  customers (
    `id`,
    `customername`,
    `phone`,
    `address`,
    `createdAt`,
    `updatedAt`
  )
VALUES
  (
    14,
    'YASH R',
    '',
    '1333 South Park St',
    '2025-06-22 18:51:03',
    '2025-06-22 18:51:03'
  );

INSERT INTO
  customers (
    `id`,
    `customername`,
    `phone`,
    `address`,
    `createdAt`,
    `updatedAt`
  )
VALUES
  (
    15,
    'JS',
    '',
    '1333 South Park St',
    '2025-06-22 18:51:15',
    '2025-06-22 18:51:15'
  );

INSERT INTO
  customers (
    `id`,
    `customername`,
    `phone`,
    `address`,
    `createdAt`,
    `updatedAt`
  )
VALUES
  (
    16,
    'RIA',
    '',
    '1333 South Park St, Apt 1710',
    '2025-06-22 18:51:25',
    '2025-06-22 18:51:25'
  );

INSERT INTO
  customers (
    `id`,
    `customername`,
    `phone`,
    `address`,
    `createdAt`,
    `updatedAt`
  )
VALUES
  (
    17,
    'SAHIL',
    '',
    '5865 Gorsebrook Ave',
    '2025-06-22 18:51:36',
    '2025-06-22 18:51:36'
  );

INSERT INTO
  customers (
    `id`,
    `customername`,
    `phone`,
    `address`,
    `createdAt`,
    `updatedAt`
  )
VALUES
  (
    18,
    'SMIT',
    '',
    '1333 SOUTH PARK, APT 1709',
    '2025-06-22 18:51:47',
    '2025-06-22 18:51:47'
  );

INSERT INTO
  customers (
    `id`,
    `customername`,
    `phone`,
    `address`,
    `createdAt`,
    `updatedAt`
  )
VALUES
  (
    19,
    'FALGUN',
    '',
    '2060 Quinpool St, A 317\"',
    '2025-06-22 18:51:57',
    '2025-06-22 18:51:57'
  );

INSERT INTO
  customers (
    `id`,
    `customername`,
    `phone`,
    `address`,
    `createdAt`,
    `updatedAt`
  )
VALUES
  (
    20,
    'RITU',
    '',
    '2060 Quinpool St',
    '2025-06-22 18:52:07',
    '2025-06-22 18:52:07'
  );

INSERT INTO
  customers (
    `id`,
    `customername`,
    `phone`,
    `address`,
    `createdAt`,
    `updatedAt`
  )
VALUES
  (
    21,
    'HITEN',
    '',
    '2225 Monastery St',
    '2025-06-22 18:52:18',
    '2025-06-22 18:52:18'
  );

INSERT INTO
  customers (
    `id`,
    `customername`,
    `phone`,
    `address`,
    `createdAt`,
    `updatedAt`
  )
VALUES
  (
    22,
    'DHRUMIL',
    '',
    '1333 South Park St',
    '2025-06-22 18:52:28',
    '2025-06-22 18:52:28'
  );

INSERT INTO
  customers (
    `id`,
    `customername`,
    `phone`,
    `address`,
    `createdAt`,
    `updatedAt`
  )
VALUES
  (
    23,
    'DHARMIK',
    '',
    '10 Harlington St',
    '2025-06-22 18:52:50',
    '2025-06-22 18:52:50'
  );

INSERT INTO
  customers (
    `id`,
    `customername`,
    `phone`,
    `address`,
    `createdAt`,
    `updatedAt`
  )
VALUES
  (
    24,
    'DIVY',
    '',
    '6967 Bayers Rd, Apt 904',
    '2025-06-22 18:53:01',
    '2025-06-22 18:53:01'
  );

INSERT INTO
  customers (
    `id`,
    `customername`,
    `phone`,
    `address`,
    `createdAt`,
    `updatedAt`
  )
VALUES
  (
    25,
    'DIVY 2327',
    '',
    '2327 Brunswick St A 1504',
    '2025-06-22 18:53:13',
    '2025-06-22 18:53:13'
  );

INSERT INTO
  customers (
    `id`,
    `customername`,
    `phone`,
    `address`,
    `createdAt`,
    `updatedAt`
  )
VALUES
  (
    26,
    'MAULIK',
    '',
    '2327 Brunswick St',
    '2025-06-22 18:53:22',
    '2025-06-22 18:53:22'
  );

INSERT INTO
  customers (
    `id`,
    `customername`,
    `phone`,
    `address`,
    `createdAt`,
    `updatedAt`
  )
VALUES
  (
    27,
    'YOG',
    '',
    '2327 Brunswick St',
    '2025-06-22 18:53:33',
    '2025-06-22 18:53:33'
  );

INSERT INTO
  customers (
    `id`,
    `customername`,
    `phone`,
    `address`,
    `createdAt`,
    `updatedAt`
  )
VALUES
  (
    28,
    'RUSIN',
    '',
    '2908 Connolly St',
    '2025-06-22 18:53:43',
    '2025-06-22 18:53:43'
  );

INSERT INTO
  customers (
    `id`,
    `customername`,
    `phone`,
    `address`,
    `createdAt`,
    `updatedAt`
  )
VALUES
  (
    29,
    'PRATHAM 2',
    '',
    '6 Langbrae Dr',
    '2025-06-22 18:53:57',
    '2025-06-22 18:53:57'
  );

INSERT INTO
  customers (
    `id`,
    `customername`,
    `phone`,
    `address`,
    `createdAt`,
    `updatedAt`
  )
VALUES
  (
    30,
    'RUPAL',
    '',
    '554 Bedford Hwy',
    '2025-06-22 18:54:07',
    '2025-06-22 18:54:07'
  );

INSERT INTO
  customers (
    `id`,
    `customername`,
    `phone`,
    `address`,
    `createdAt`,
    `updatedAt`
  )
VALUES
  (
    31,
    'KUSHI',
    '',
    '11 Amberwood Ct',
    '2025-06-22 18:54:17',
    '2025-06-22 18:54:17'
  );

INSERT INTO
  customers (
    `id`,
    `customername`,
    `phone`,
    `address`,
    `createdAt`,
    `updatedAt`
  )
VALUES
  (
    32,
    'GAUTAM',
    '',
    '6426 Bayers Rd',
    '2025-06-22 18:54:26',
    '2025-06-22 18:54:26'
  );

INSERT INTO
  customers (
    `id`,
    `customername`,
    `phone`,
    `address`,
    `createdAt`,
    `updatedAt`
  )
VALUES
  (
    33,
    'ABHI',
    '',
    '6967 Bayers Rd',
    '2025-06-22 18:54:37',
    '2025-06-22 18:54:37'
  );

INSERT INTO
  customers (
    `id`,
    `customername`,
    `phone`,
    `address`,
    `createdAt`,
    `updatedAt`
  )
VALUES
  (
    34,
    'SIDDHARTH',
    '',
    '6533 Cork St',
    '2025-06-22 18:54:45',
    '2025-06-22 18:54:45'
  );

INSERT INTO
  customers (
    `id`,
    `customername`,
    `phone`,
    `address`,
    `createdAt`,
    `updatedAt`
  )
VALUES
  (
    35,
    'SRINIDHII',
    '',
    '2327 Brunswick St',
    '2025-06-22 18:54:57',
    '2025-06-22 18:54:57'
  );

INSERT INTO
  customers (
    `id`,
    `customername`,
    `phone`,
    `address`,
    `createdAt`,
    `updatedAt`
  )
VALUES
  (
    36,
    'MENCY',
    '',
    '2060 Quinpool Gt',
    '2025-06-22 18:55:11',
    '2025-06-22 18:55:11'
  );

INSERT INTO
  customers (
    `id`,
    `customername`,
    `phone`,
    `address`,
    `createdAt`,
    `updatedAt`
  )
VALUES
  (
    37,
    'MEET',
    '',
    '3001 Olivet St',
    '2025-06-22 18:55:22',
    '2025-06-22 18:55:22'
  );

INSERT INTO
  customers (
    `id`,
    `customername`,
    `phone`,
    `address`,
    `createdAt`,
    `updatedAt`
  )
VALUES
  (
    38,
    'AATISH',
    '',
    '393 Pleasant St',
    '2025-06-22 18:55:33',
    '2025-06-22 18:55:33'
  );

INSERT INTO
  customers (
    `id`,
    `customername`,
    `phone`,
    `address`,
    `createdAt`,
    `updatedAt`
  )
VALUES
  (
    39,
    'NIDHI',
    '',
    '1333 South Park',
    '2025-06-22 18:55:44',
    '2025-06-22 18:55:44'
  );

INSERT INTO
  customers (
    `id`,
    `customername`,
    `phone`,
    `address`,
    `createdAt`,
    `updatedAt`
  )
VALUES
  (
    40,
    'MAYURA',
    '',
    '1333 South Park',
    '2025-06-22 18:55:56',
    '2025-06-22 18:55:56'
  );

INSERT INTO
  customers (
    `id`,
    `customername`,
    `phone`,
    `address`,
    `createdAt`,
    `updatedAt`
  )
VALUES
  (
    41,
    'SY',
    '',
    '5240 Kent St Unit 2',
    '2025-06-22 18:56:07',
    '2025-06-22 18:56:07'
  );

INSERT INTO
  customers (
    `id`,
    `customername`,
    `phone`,
    `address`,
    `createdAt`,
    `updatedAt`
  )
VALUES
  (
    42,
    'YASH',
    '',
    '395 Renfrew St',
    '2025-06-22 18:56:17',
    '2025-06-22 18:56:17'
  );

INSERT INTO
  customers (
    `id`,
    `customername`,
    `phone`,
    `address`,
    `createdAt`,
    `updatedAt`
  )
VALUES
  (
    43,
    'MANTHAN',
    '',
    '610 Washmill Lake Dr',
    '2025-06-22 18:56:26',
    '2025-06-22 18:56:26'
  );

INSERT INTO
  customers (
    `id`,
    `customername`,
    `phone`,
    `address`,
    `createdAt`,
    `updatedAt`
  )
VALUES
  (
    44,
    'PRACHI',
    '',
    '38 Evans St',
    '2025-06-22 18:56:35',
    '2025-06-22 18:56:35'
  );

INSERT INTO
  customers (
    `id`,
    `customername`,
    `phone`,
    `address`,
    `createdAt`,
    `updatedAt`
  )
VALUES
  (
    45,
    'DHRUV',
    '',
    '58 Bedford Hwy A-202',
    '2025-06-22 18:56:44',
    '2025-06-22 18:56:44'
  );

INSERT INTO
  customers (
    `id`,
    `customername`,
    `phone`,
    `address`,
    `createdAt`,
    `updatedAt`
  )
VALUES
  (
    46,
    'DARSHAN',
    '',
    '6 Langbra St',
    '2025-06-22 18:56:57',
    '2025-06-22 18:56:57'
  );

INSERT INTO
  customers (
    `id`,
    `customername`,
    `phone`,
    `address`,
    `createdAt`,
    `updatedAt`
  )
VALUES
  (
    47,
    'PRATHAM',
    '',
    '6 Langbra St',
    '2025-06-22 18:57:08',
    '2025-06-22 18:57:08'
  );

INSERT INTO
  customers (
    `id`,
    `customername`,
    `phone`,
    `address`,
    `createdAt`,
    `updatedAt`
  )
VALUES
  (
    48,
    'HIREN C',
    '',
    '58 Bedford Hwy A-202',
    '2025-06-22 18:57:24',
    '2025-06-22 18:57:24'
  );

INSERT INTO
  customers (
    `id`,
    `customername`,
    `phone`,
    `address`,
    `createdAt`,
    `updatedAt`
  )
VALUES
  (
    49,
    'AJAY',
    '',
    '118 Tilbury Ave',
    '2025-06-22 18:57:37',
    '2025-06-22 18:57:37'
  );

INSERT INTO
  customers (
    `id`,
    `customername`,
    `phone`,
    `address`,
    `createdAt`,
    `updatedAt`
  )
VALUES
  (
    50,
    'AARYA',
    '',
    '6 Langbrae st',
    '2025-06-22 18:57:50',
    '2025-06-22 18:57:50'
  );

INSERT INTO
  customers (
    `id`,
    `customername`,
    `phone`,
    `address`,
    `createdAt`,
    `updatedAt`
  )
VALUES
  (
    51,
    'FARHIN',
    '',
    '1333 South Park',
    '2025-06-22 18:57:59',
    '2025-06-22 18:57:59'
  );

INSERT INTO
  customers (
    `id`,
    `customername`,
    `phone`,
    `address`,
    `createdAt`,
    `updatedAt`
  )
VALUES
  (
    52,
    'RAVI',
    '',
    '2327 Brunswick St A 1206',
    '2025-06-22 18:58:09',
    '2025-06-22 18:58:09'
  );

INSERT INTO
  customers (
    `id`,
    `customername`,
    `phone`,
    `address`,
    `createdAt`,
    `updatedAt`
  )
VALUES
  (
    53,
    'YASH 2',
    '',
    '6967 Bayers Rd',
    '2025-06-22 18:58:18',
    '2025-06-22 18:58:18'
  );

INSERT INTO
  customers (
    `id`,
    `customername`,
    `phone`,
    `address`,
    `createdAt`,
    `updatedAt`
  )
VALUES
  (
    54,
    'NAISARG',
    '',
    '6967 Bayers Rd',
    '2025-06-22 18:58:28',
    '2025-06-22 18:58:28'
  );

INSERT INTO
  customers (
    `id`,
    `customername`,
    `phone`,
    `address`,
    `createdAt`,
    `updatedAt`
  )
VALUES
  (
    55,
    'ANKIT',
    '',
    '',
    '2025-06-22 18:58:33',
    '2025-06-22 18:58:33'
  );

INSERT INTO
  customers (
    `id`,
    `customername`,
    `phone`,
    `address`,
    `createdAt`,
    `updatedAt`
  )
VALUES
  (
    56,
    'HARSH 2',
    '',
    '6426 Bayers Rd',
    '2025-06-22 18:58:44',
    '2025-06-22 18:58:44'
  );

INSERT INTO
  customers (
    `id`,
    `customername`,
    `phone`,
    `address`,
    `createdAt`,
    `updatedAt`
  )
VALUES
  (
    57,
    'PALASH',
    '',
    '2309 Brunswick St',
    '2025-06-22 18:58:53',
    '2025-06-22 18:58:53'
  );

INSERT INTO
  customers (
    `id`,
    `customername`,
    `phone`,
    `address`,
    `createdAt`,
    `updatedAt`
  )
VALUES
  (
    58,
    'ANIKET',
    '',
    '102 Newcastle St',
    '2025-06-22 18:59:07',
    '2025-06-22 18:59:07'
  );

INSERT INTO
  customers (
    `id`,
    `customername`,
    `phone`,
    `address`,
    `createdAt`,
    `updatedAt`
  )
VALUES
  (
    59,
    'DEV',
    '',
    '7 Walsh Ct',
    '2025-06-22 18:59:17',
    '2025-06-22 18:59:17'
  );

INSERT INTO
  customers (
    `id`,
    `customername`,
    `phone`,
    `address`,
    `createdAt`,
    `updatedAt`
  )
VALUES
  (
    60,
    'VRAJ',
    '',
    '7 Walsh Ct',
    '2025-06-22 18:59:28',
    '2025-06-22 18:59:28'
  );

INSERT INTO
  customers (
    `id`,
    `customername`,
    `phone`,
    `address`,
    `createdAt`,
    `updatedAt`
  )
VALUES
  (
    61,
    'RAJVIR',
    '',
    '7 Walsh Ct',
    '2025-06-22 18:59:36',
    '2025-06-22 18:59:36'
  );

INSERT INTO
  customers (
    `id`,
    `customername`,
    `phone`,
    `address`,
    `createdAt`,
    `updatedAt`
  )
VALUES
  (
    62,
    'DAKSH',
    '',
    '7 Walsh Ct',
    '2025-06-22 18:59:49',
    '2025-06-22 18:59:49'
  );

INSERT INTO
  customers (
    `id`,
    `customername`,
    `phone`,
    `address`,
    `createdAt`,
    `updatedAt`
  )
VALUES
  (
    63,
    'VATSAL',
    '',
    '7 Walsh Ct',
    '2025-06-22 19:00:00',
    '2025-06-22 19:00:00'
  );

INSERT INTO
  customers (
    `id`,
    `customername`,
    `phone`,
    `address`,
    `createdAt`,
    `updatedAt`
  )
VALUES
  (
    64,
    'YASH 3',
    '',
    '7 Walsh Ct',
    '2025-06-22 19:00:10',
    '2025-06-22 19:00:10'
  );

INSERT INTO
  customers (
    `id`,
    `customername`,
    `phone`,
    `address`,
    `createdAt`,
    `updatedAt`
  )
VALUES
  (
    65,
    'PRATHAM 3',
    '',
    '7 Walsh Ct',
    '2025-06-22 19:00:20',
    '2025-06-22 19:00:20'
  );

INSERT INTO
  customers (
    `id`,
    `customername`,
    `phone`,
    `address`,
    `createdAt`,
    `updatedAt`
  )
VALUES
  (
    66,
    'MEET 7',
    '',
    '7 Walsh Ct',
    '2025-06-22 19:00:31',
    '2025-06-22 19:00:31'
  );

INSERT INTO
  customers (
    `id`,
    `customername`,
    `phone`,
    `address`,
    `createdAt`,
    `updatedAt`
  )
VALUES
  (
    67,
    'SUBHAM',
    '',
    '5649 Fenwick St',
    '2025-06-22 19:01:40',
    '2025-06-22 19:01:40'
  );

INSERT INTO
  customers (
    `id`,
    `customername`,
    `phone`,
    `address`,
    `createdAt`,
    `updatedAt`
  )
VALUES
  (
    68,
    'MANAN',
    '',
    '2327 Brunswick St A 1206',
    '2025-06-22 19:01:49',
    '2025-06-22 19:01:49'
  );

INSERT INTO
  customers (
    `id`,
    `customername`,
    `phone`,
    `address`,
    `createdAt`,
    `updatedAt`
  )
VALUES
  (
    69,
    'KARAN',
    '',
    '3570 Robie St\"',
    '2025-06-22 19:01:58',
    '2025-06-22 19:01:58'
  );

INSERT INTO
  customers (
    `id`,
    `customername`,
    `phone`,
    `address`,
    `createdAt`,
    `updatedAt`
  )
VALUES
  (
    70,
    'PIYUSH',
    '',
    '6189 Young ST',
    '2025-06-22 19:02:12',
    '2025-06-22 19:02:12'
  );

INSERT INTO
  customers (
    `id`,
    `customername`,
    `phone`,
    `address`,
    `createdAt`,
    `updatedAt`
  )
VALUES
  (
    71,
    'ABHI',
    '',
    '6967 Bayers Rd',
    '2025-06-22 19:02:23',
    '2025-06-22 19:02:23'
  );

INSERT INTO
  customers (
    `id`,
    `customername`,
    `phone`,
    `address`,
    `createdAt`,
    `updatedAt`
  )
VALUES
  (
    72,
    'SWARUPA',
    '',
    '2 Rosedale Ave',
    '2025-06-22 19:05:47',
    '2025-06-22 19:05:47'
  );

INSERT INTO
  customers (
    `id`,
    `customername`,
    `phone`,
    `address`,
    `createdAt`,
    `updatedAt`
  )
VALUES
  (
    73,
    'NILESH',
    '',
    '32 Inverary Dr',
    '2025-06-22 19:05:57',
    '2025-06-22 19:05:57'
  );

INSERT INTO
  customers (
    `id`,
    `customername`,
    `phone`,
    `address`,
    `createdAt`,
    `updatedAt`
  )
VALUES
  (
    74,
    'KEVIN',
    '',
    '6 Langbrae Dr',
    '2025-06-22 19:06:06',
    '2025-06-22 19:06:06'
  );

INSERT INTO
  customers (
    `id`,
    `customername`,
    `phone`,
    `address`,
    `createdAt`,
    `updatedAt`
  )
VALUES
  (
    75,
    'BHAVIN 2',
    '',
    '6 Langbrae Dr',
    '2025-06-22 19:06:15',
    '2025-06-22 19:06:15'
  );

INSERT INTO
  customers (
    `id`,
    `customername`,
    `phone`,
    `address`,
    `createdAt`,
    `updatedAt`
  )
VALUES
  (
    76,
    'AAKSH',
    '',
    '1991 Brunswick St',
    '2025-06-22 19:06:24',
    '2025-06-22 19:06:24'
  );

INSERT INTO
  customers (
    `id`,
    `customername`,
    `phone`,
    `address`,
    `createdAt`,
    `updatedAt`
  )
VALUES
  (
    77,
    'SANDEEP',
    '',
    '6070 Almon St',
    '2025-06-22 19:06:33',
    '2025-06-22 19:06:33'
  );

INSERT INTO
  customers (
    `id`,
    `customername`,
    `phone`,
    `address`,
    `createdAt`,
    `updatedAt`
  )
VALUES
  (
    78,
    'CHIRAG',
    '',
    '1333 South Park',
    '2025-06-22 19:06:41',
    '2025-06-22 19:06:41'
  );

INSERT INTO
  customers (
    `id`,
    `customername`,
    `phone`,
    `address`,
    `createdAt`,
    `updatedAt`
  )
VALUES
  (
    79,
    'AVADH',
    '',
    '1333 South Park',
    '2025-06-22 19:06:50',
    '2025-06-22 19:06:50'
  );

INSERT INTO
  customers (
    `id`,
    `customername`,
    `phone`,
    `address`,
    `createdAt`,
    `updatedAt`
  )
VALUES
  (
    80,
    'RUTUL',
    '',
    '610 Washmill Lake Dr',
    '2025-06-22 19:06:59',
    '2025-06-22 19:06:59'
  );

INSERT INTO
  customers (
    `id`,
    `customername`,
    `phone`,
    `address`,
    `createdAt`,
    `updatedAt`
  )
VALUES
  (
    81,
    'HARDIK',
    '',
    '1333 South Park',
    '2025-06-22 19:07:07',
    '2025-06-22 19:07:07'
  );

INSERT INTO
  customers (
    `id`,
    `customername`,
    `phone`,
    `address`,
    `createdAt`,
    `updatedAt`
  )
VALUES
  (
    82,
    'AMAN',
    '',
    '2060 Quinpool Gt',
    '2025-06-22 19:07:19',
    '2025-06-22 19:07:19'
  );

INSERT INTO
  customers (
    `id`,
    `customername`,
    `phone`,
    `address`,
    `createdAt`,
    `updatedAt`
  )
VALUES
  (
    83,
    'DEEP',
    '',
    '206 Bedford Hwy',
    '2025-06-22 19:07:29',
    '2025-06-22 19:07:29'
  );

INSERT INTO
  customers (
    `id`,
    `customername`,
    `phone`,
    `address`,
    `createdAt`,
    `updatedAt`
  )
VALUES
  (
    84,
    'DHRUV 2',
    '',
    '6189 Young St',
    '2025-06-22 19:07:40',
    '2025-06-22 19:07:40'
  );

-- 5) INSERT sample meal plans
INSERT INTO
  meal_plans (planname, frequency, days, items, price)
VALUES
  ('Roti Only', 'Weekly', 'Mon-Fri', 'Roti', 12.50),
  ('Roti Only', 'Weekly', 'Mon-Sat', 'Roti', 15.00),
  ('Roti Only', 'Monthly', 'Mon-Fri', 'Roti', 50.00),
  (
    'Dal + Rice',
    'Weekly',
    'Mon-Fri',
    'Dal + Rice',
    18.75
  ),
  (
    'Dal + Rice',
    'Monthly',
    'Mon-Fri',
    'Dal + Rice',
    75.00
  ),
  (
    'Dal+Sabzi+Roti',
    'Weekly',
    'Mon-Fri',
    'Dal + Rice + Sabzi',
    25.00
  ),
  (
    'Salad Combo',
    'Weekly',
    'Mon-Fri',
    'Dal + Rice + Sabzi + Salad',
    30.00
  );

-- 5) INSERT sample template
INSERT INTO
  label_templates (`id`, `content`, `createdAt`, `updatedAt`)
VALUES
  (
    1,
    '<p><img src=\"data:image/png;base64,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\" style=\"\" width=\"373\"></p><h1 class=\"ql-align-center\"><span style=\"font-size: 33px;\">﻿</span><strong style=\"font-size: 36px; color: rgb(209, 105, 105);\">{{customerName}}</strong></h1><h4 class=\"ql-align-center\"><span style=\"color: rgb(209, 105, 105); font-size: 19px;\">{{customerAddress}}</span></h4>',
    '2025-06-22 19:13:01',
    '2025-06-22 19:40:19'
  );