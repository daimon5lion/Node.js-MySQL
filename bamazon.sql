DROP DATABASE IF EXISTS bamazon_db;

CREATE DATABASE bamazon_db;

USE bamazon_db;

CREATE TABLE products
(
    item_id INTEGER(10)
    AUTO_INCREMENT NOT NULL,
    product_name VARCHAR
    (50) NOT NULL,
    department_name VARCHAR
    (50) NOT NULL,
    price DECIMAL
    (10,2) NOT NULL,
    stock_quantity INTEGER
    (10) NOT NULL,
    PRIMARY KEY
    (item_id)
);

    INSERT INTO products
        ( item_id, product_name, department_name, price, stock_quantity)
    VALUES
        (1, "soccer balls", "soccer", 15, 30);

    INSERT INTO products
        (product_name, department_name, price, stock_quantity)
    VALUES
        ("basketballs", "basketball", 20, 50),
        ("baseball bat", "baseball", 18, 35),
        ("baseballs", "baseball", 5, 10),
        ("fishing rods", "fishing", 80, 20),
        ("casting reel", "fishing", 55, 2),
        ("spinning reel", "fishing", 40, 5),
        ("shin guard", "soccer", 20, 1),
        ("power bait", "fishing", 3, 6),
        ("lure", "fishing", 8, 20);

    SELECT *
    FROM products;

    CREATE TABLE departments
    (
        department_id INTEGER(10)
        AUTO_INCREMENT NOT NULL,
    department_name VARCHAR
        (50) NOT NULL,
    over_head_costs DECIMAL
        (10,2) NOT NULL,
    PRIMARY KEY
        (department_id));

        ALTER TABLE products
  ADD product_sales DECIMAL
        (10,2) NOT NULL;

        INSERT INTO departments
            (department_name, over_head_costs)
        VALUES
            ('soccer', 900.00),
            ('basketball', 1200.00),
            ('baseball', 1000.00),
            ('fishing', 2500.00);

        ALTER TABLE departments
  ADD product_sales DECIMAL
        (10,2) NOT NULL;

        ALTER TABLE products ALTER COLUMN product_sales
        SET
        DEFAULT 0;




