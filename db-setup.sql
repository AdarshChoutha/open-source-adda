-- Create the database if it doesn't exist
CREATE DATABASE IF NOT EXISTS osa_db;
-- Switch to the database
USE osa_db;
-- Create tables if they doesn't exist
CREATE TABLE IF NOT EXISTS user_accounts (
    user_id int UNSIGNED NOT NULL AUTO_INCREMENT PRIMARY KEY,
    email_id varchar(255) NOT NULL UNIQUE KEY,
    user_password varchar(255) NOT NULL
);
CREATE TABLE IF NOT EXISTS course_info (
    course_id int UNSIGNED NOT NULL AUTO_INCREMENT PRIMARY KEY,
    course_title varchar(127) NOT NULL,
    course_description varchar(255) NOT NULL,
    course_price MEDIUMINT UNSIGNED NOT NULL DEFAULT 0,
    total_duration TINYINT UNSIGNED NOT NULL DEFAULT 0,
    course_topics JSON
);
CREATE TABLE IF NOT EXISTS enrollment_data (
    email_id varchar(255) NOT NULL,
    course_title varchar(127) NOT NULL,
    paid MEDIUMINT UNSIGNED NOT NULL DEFAULT 0,
    rating_given TINYINT(1) UNSIGNED NOT NULL DEFAULT 0,
    completed_topics JSON
);