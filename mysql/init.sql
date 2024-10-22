DROP DATABASE IF EXISTS my_test_db;
CREATE DATABASE IF NOT EXISTS my_test_db;
USE my_test_db;


CREATE TABLE users (
    id INT AUTO_INCREMENT PRIMARY KEY,
    username VARCHAR(255) NOT NULL,
    password VARCHAR(255) NOT NULL
);
INSERT INTO users
  (username, password)
VALUES
  ('matt', 'matt123'),



CREATE TABLE documents (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(255) NOT NULL
);

INSERT INTO documents (name)
VALUES
  ('doc1'),
  ('doc2');