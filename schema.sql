CREATE DATABASE MLION;
USE MLION;

CREATE TABLE locations (
    id INT PRIMARY KEY AUTO_INCREMENT,
    title VARCHAR(255) NOT NULL,
    x_cor INT NOT NULL,
    y_cor INT NOT NULL,

    UNIQUE(x_cor, y_cor)
);

CREATE TABLE items (
    id INT PRIMARY KEY AUTO_INCREMENT,
    title VARCHAR(255) NOT NULL,
    location_id INT NOT NULL,

    FOREIGN KEY (location_id) REFERENCES locations(id) ON DELETE CASCADE
);

INSERT INTO locations (title, x_cor, y_cor)
VALUES
('Workshop A', 2, 5),
('Workshop B', 3, 9);

INSERT INTO items (title, location_id)
VALUES
('Box', 1),
('Broom', 2);