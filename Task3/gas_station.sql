CREATE DATABASE GasStationDB;

USE GasStationDB;

CREATE TABLE GasStation (
    id INT PRIMARY KEY AUTO_INCREMENT,
    name VARCHAR(30) NOT NULL,
    address VARCHAR(255) NOT NULL,
    manager_name VARCHAR(30) NOT NULL,
    open_time TIME NOT NULL,
    close_time TIME NOT NULL
);

CREATE UNIQUE INDEX unique_gas_stationname ON GasStation(name);

CREATE TABLE Category (
    id INT PRIMARY KEY AUTO_INCREMENT,
    name VARCHAR(30) NOT NULL,
    price DECIMAL(6, 0) NOT NULL CHECK (price > 0),
    stock_quantity FLOAT(6,5) NOT NULL CHECK (stock_quantity >= 0)
);

CREATE UNIQUE INDEX unique_category_name ON Category(name);

CREATE TABLE Pump (
    id INT PRIMARY KEY AUTO_INCREMENT,
    station_id INT NOT NULL,
    category_id INT NOT NULL,
    pump_number VARCHAR(5) NOT NULL,
    status BOOLEAN NOT NULL,
    FOREIGN KEY (station_id) REFERENCES GasStation(id),
    FOREIGN KEY (category_id) REFERENCES Category(id)
);

CREATE UNIQUE INDEX pump_index ON Pump(station_id, pump_number);

CREATE TABLE Transaction (
    id INT PRIMARY KEY AUTO_INCREMENT,
    station_id INT NOT NULL,
    customer_id INT,
    transaction_time DATETIME NOT NULL,
    total_price DECIMAL(11, 0) NOT NULL CHECK (total_price > 0),
    FOREIGN KEY (station_id) REFERENCES GasStation(id),
    FOREIGN KEY (customer_id) REFERENCES CUSTOMER(id)
);

CREATE TABLE Transaction_Pump (
    transaction_id INT NOT NULL,
    pump_id INT NOT NULL,
    quantity FLOAT(6,5) NOT NULL CHECK (quantity > 0),
    current_category_price DECIMAL(10, 0) NOT NULL CHECK (current_category_price > 0),  
    PRIMARY KEY (transaction_id, pump_id, product_id),
    FOREIGN KEY (transaction_id) REFERENCES Transaction(id),
    FOREIGN KEY (pump_id) REFERENCES Pump(id),
);

CREATE TABLE CUSTOMER (
    id INT PRIMARY KEY AUTO_INCREMENT,
    name VARCHAR(30) NOT NULL,
);



