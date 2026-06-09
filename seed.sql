-- QA Training App — Test Seed Data
-- Run this against your local MySQL instance before executing the test suite.
-- Drops and recreates tables to guarantee a clean, predictable state.

DROP TABLE IF EXISTS inventory;
DROP TABLE IF EXISTS sales;
DROP TABLE IF EXISTS plants;
DROP TABLE IF EXISTS categories;

-- ─── Schema ───────────────────────────────────────────────────────────────────

CREATE TABLE IF NOT EXISTS categories (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(10) NOT NULL,
    parent_id BIGINT,
    FOREIGN KEY (parent_id) REFERENCES categories(id) ON DELETE SET NULL
);

CREATE TABLE IF NOT EXISTS plants (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(25) NOT NULL,
    price DECIMAL(10, 2) NOT NULL,
    quantity INT NOT NULL,
    category_id BIGINT,
    FOREIGN KEY (category_id) REFERENCES categories(id) ON DELETE SET NULL
);

CREATE TABLE IF NOT EXISTS sales (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    plant_id BIGINT NOT NULL,
    quantity INT NOT NULL,
    total_price DECIMAL(10, 2) NOT NULL,
    sold_at DATETIME(6),
    FOREIGN KEY (plant_id) REFERENCES plants(id) ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS inventory (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    plant_id BIGINT NOT NULL,
    quantity INT NOT NULL CHECK (quantity >= 1),
    type ENUM('IN', 'OUT') NOT NULL,
    note VARCHAR(255),
    created_at DATETIME(6),
    FOREIGN KEY (plant_id) REFERENCES plants(id) ON DELETE CASCADE
);

-- ─── Categories ───────────────────────────────────────────────────────────────
-- 2 root categories, 5 sub-categories (mirrors original depth for POM tests)

INSERT INTO categories (name, parent_id) VALUES ('Tropical', NULL);    -- id 1
INSERT INTO categories (name, parent_id) VALUES ('Desert', NULL);      -- id 2
INSERT INTO categories (name, parent_id) VALUES ('Cacti', 2);          -- id 3  (child of Desert)
INSERT INTO categories (name, parent_id) VALUES ('Palms', 1);          -- id 4  (child of Tropical)
INSERT INTO categories (name, parent_id) VALUES ('Orchids', 1);        -- id 5  (child of Tropical)
INSERT INTO categories (name, parent_id) VALUES ('Bromeliad', 1);      -- id 6  (child of Tropical)
INSERT INTO categories (name, parent_id) VALUES ('Succulent', 2);      -- id 7  (child of Desert)

-- ─── Plants ───────────────────────────────────────────────────────────────────

INSERT INTO plants (name, price, quantity, category_id) VALUES ('Peace Lily',     22.00,  50,  5);  -- Orchids
INSERT INTO plants (name, price, quantity, category_id) VALUES ('Barrel Cactus',  18.50,  70,  3);  -- Cacti
INSERT INTO plants (name, price, quantity, category_id) VALUES ('Areca Palm',     40.00,  20,  4);  -- Palms
INSERT INTO plants (name, price, quantity, category_id) VALUES ('Neoregelia',     28.00,  35,  6);  -- Bromeliad
INSERT INTO plants (name, price, quantity, category_id) VALUES ('Haworthia',      14.00,  90,  7);  -- Succulent
INSERT INTO plants (name, price, quantity, category_id) VALUES ('Hibiscus',       25.00,  60,  1);  -- Tropical
INSERT INTO plants (name, price, quantity, category_id) VALUES ('Bougainvillea',  32.00,  45,  1);  -- Tropical
INSERT INTO plants (name, price, quantity, category_id) VALUES ('Prickly Pear',   12.00, 110,  3);  -- Cacti
INSERT INTO plants (name, price, quantity, category_id) VALUES ('Aloe Vera',      17.50,  85,  7);  -- Succulent
INSERT INTO plants (name, price, quantity, category_id) VALUES ('Phalaenopsis',   38.00,  25,  5);  -- Orchids

-- ─── Sales ────────────────────────────────────────────────────────────────────

INSERT INTO sales (plant_id, quantity, total_price, sold_at) VALUES (1,  3,  66.00, '2026-06-01 09:00:00');
INSERT INTO sales (plant_id, quantity, total_price, sold_at) VALUES (2,  2,  37.00, '2026-06-01 09:15:00');
INSERT INTO sales (plant_id, quantity, total_price, sold_at) VALUES (3,  1,  40.00, '2026-06-01 09:30:00');
INSERT INTO sales (plant_id, quantity, total_price, sold_at) VALUES (4,  4, 112.00, '2026-06-01 10:00:00');
INSERT INTO sales (plant_id, quantity, total_price, sold_at) VALUES (5,  5,  70.00, '2026-06-01 10:20:00');
INSERT INTO sales (plant_id, quantity, total_price, sold_at) VALUES (6,  2,  50.00, '2026-06-01 10:45:00');
INSERT INTO sales (plant_id, quantity, total_price, sold_at) VALUES (7,  3,  96.00, '2026-06-01 11:00:00');
INSERT INTO sales (plant_id, quantity, total_price, sold_at) VALUES (8,  6,  72.00, '2026-06-01 11:30:00');
INSERT INTO sales (plant_id, quantity, total_price, sold_at) VALUES (9,  4,  70.00, '2026-06-01 12:00:00');
INSERT INTO sales (plant_id, quantity, total_price, sold_at) VALUES (10, 2,  76.00, '2026-06-01 12:30:00');
INSERT INTO sales (plant_id, quantity, total_price, sold_at) VALUES (1,  1,  22.00, '2026-06-02 08:45:00');
INSERT INTO sales (plant_id, quantity, total_price, sold_at) VALUES (2,  3,  55.50, '2026-06-02 09:10:00');
INSERT INTO sales (plant_id, quantity, total_price, sold_at) VALUES (5,  2,  28.00, '2026-06-02 09:50:00');
INSERT INTO sales (plant_id, quantity, total_price, sold_at) VALUES (9,  1,  17.50, '2026-06-02 10:15:00');
INSERT INTO sales (plant_id, quantity, total_price, sold_at) VALUES (10, 3, 114.00, '2026-06-02 11:00:00');
