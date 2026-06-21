-- Create Database
CREATE DATABASE IF NOT EXISTS lostfound_db;
USE lostfound_db;

-- Create Items Table
CREATE TABLE IF NOT EXISTS items (
    id INT AUTO_INCREMENT PRIMARY KEY,

    type ENUM('lost', 'found') NOT NULL,

    title VARCHAR(150) NOT NULL,

    description TEXT,

    category VARCHAR(50) NOT NULL,

    location VARCHAR(255) NOT NULL,

    contact_info VARCHAR(150) NOT NULL,

    image_url VARCHAR(255) DEFAULT NULL,

    status ENUM('open', 'claimed') NOT NULL DEFAULT 'open',

    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Sample Data (Optional)
INSERT INTO items (
    type,
    title,
    description,
    category,
    location,
    contact_info,
    image_url,
    status
)
VALUES
(
    'lost',
    'Black Backpack',
    'Contains laptop and notebooks',
    'Bags',
    'Library 2nd Floor',
    'arjun@example.com',
    NULL,
    'open'
),
(
    'found',
    'iPhone 13',
    'Found near cafeteria entrance',
    'Electronics',
    'Cafeteria',
    'priya@example.com',
    NULL,
    'open'
);