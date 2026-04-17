-- Blood Donation System Database Schema
-- Run this file in MySQL to set up your database
create database blood_donation_db;

USE blood_donation_db;

-- Users table (all roles)
CREATE TABLE  users (
  id INT AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(100) NOT NULL,
  email VARCHAR(150) UNIQUE NOT NULL,
  password VARCHAR(255) NOT NULL,
  role ENUM('admin', 'donor', 'receiver') NOT NULL DEFAULT 'receiver',
  is_verified BOOLEAN NOT NULL DEFAULT FALSE,
  reset_token VARCHAR(255) NULL,
  reset_token_expires_at DATETIME NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  INDEX idx_email (email),
  INDEX idx_role (role)
);

-- Donors profile table
CREATE TABLE  donors (
  id INT AUTO_INCREMENT PRIMARY KEY,
  user_id INT NOT NULL UNIQUE,
  blood_type ENUM('A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-'),
  location VARCHAR(200),
  phone VARCHAR(20),
  availability BOOLEAN NOT NULL DEFAULT TRUE,
  last_donated DATE,
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

-- Receivers profile table
CREATE TABLE receivers (
  id INT AUTO_INCREMENT PRIMARY KEY,
  user_id INT NOT NULL UNIQUE,
  blood_type ENUM('A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-'),
  location VARCHAR(200),
  phone VARCHAR(20),
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

-- Blood stock inventory
CREATE TABLE  blood_stock (
  id INT AUTO_INCREMENT PRIMARY KEY,
  blood_type ENUM('A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-') UNIQUE NOT NULL,
  units INT NOT NULL DEFAULT 0,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- Seed initial blood stock
INSERT IGNORE INTO blood_stock (blood_type, units) VALUES
  ('A+', 0), ('A-', 0), ('B+', 0), ('B-', 0),
  ('AB+', 0), ('AB-', 0), ('O+', 0), ('O-', 0);

-- Donation requests table
CREATE TABLE  donation_requests (
  id INT AUTO_INCREMENT PRIMARY KEY,
  donor_id INT NOT NULL,
  receiver_id INT,
  blood_type ENUM('A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-') NOT NULL,
  units INT NOT NULL DEFAULT 1,
  status ENUM('pending', 'approved', 'rejected', 'completed') NOT NULL DEFAULT 'pending',
  message TEXT,
  requested_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  responded_at DATETIME,
  FOREIGN KEY (donor_id) REFERENCES donors(id) ON DELETE CASCADE,
  FOREIGN KEY (receiver_id) REFERENCES receivers(id) ON DELETE SET NULL,
  INDEX idx_status (status)
);

-- Create default admin user (password: Admin@123)
-- Password hash for 'Admin@123' with bcrypt 12 rounds
-- Change this password after first login!
INSERT IGNORE INTO users (name, email, password, role, is_verified)
VALUES (
  'System Admin',
  'admin@blooddonation.com',
  '$2a$12$LQv3c1yqBWVHxkd0LHAkCOYz6TtxMQJqhN8/LewdBPj4J/HS.iK4O',
  'admin',
  TRUE
);
