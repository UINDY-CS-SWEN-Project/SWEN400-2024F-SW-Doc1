DROP DATABASE IF EXISTS my_test_db;
CREATE DATABASE IF NOT EXISTS my_test_db;
USE my_test_db;


CREATE TABLE test_data (
  test_name VARCHAR(50),
  tag VARCHAR(50)
);


INSERT INTO test_data
  (test_name, tag)
VALUES
  ('Amit Khanna', 'Manager'),
  ('Anjali Gupta', 'Engineer');