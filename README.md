# Open Souce Adda - Online Learning Platform

The **Open Souce Adda** is a comprehensive web application designed to facilitate online learning and course management. It provides a user-friendly interface for both learners and administrators. Learners can explore, enroll in, and track their progress in various courses.

## Overview

This project is an online learning platform built with EJS for templating, Node.js for server-side logic, and MySQL for database management. It provides a web-based interface where users can access educational content, manage their learning progress, and interact with various resources.

## Features

- **Course Catalog**: Browse and enroll in courses.
- **User Management**: Register, log in, and manage user profiles.
- **Progress Tracking**: Track learning progress and completed courses.
- **Interactive Content**: Engage with various types of learning materials.

## Technology Stack

- **Backend**: Node.js, Express.js
- **Frontend**: EJS (Embedded JavaScript)
- **Database**: MySQL
- **Templating**: EJS
- **Version Control**: Git, GitHub

## Getting Started

### Prerequisites

- [Git](https://git-scm.com/)
- [Node.js](https://nodejs.org/en)
- npm or yarn
- [MySQL](https://www.mysql.com/)

### Installation

#### Clone the Repository

```bash
# First, clone the repository to your local machine:
git clone https://github.com/AdarshChoutha/open-source-adda.git
```

#### Navigate into the Repository

```bash
# Change your working directory to the cloned repository:
cd open-source-adda
```

#### Install dependencies:

```bash
# Install the node module dependencies:
npm install
```

#### Set up environment variables:

Create a `.env` file in the root directory and add the necessary environment variables, such as database credentials.

```env
PORT = 8080

ACCESS_TOKEN_SECRET = ''

COOKIE_LABEL = ''

DB_HOST = ''
DB_PORT = 3306
DB_USER = 'root'
DB_PASSWORD = ''
DB_NAME = 'osa_db'
```

#### Run the application:

```bash
# Run the application
node index
```

#### Access the platform:

Open your browser and go to `http://localhost:8080`.

## Database Structure

The application uses a MySQL database with the following structure:

### Database

`osa_db`

### Tables

`user_accounts`

```sql
+---------------+--------------+------+-----+---------+----------------+
| Field         | Type         | Null | Key | Default | Extra          |
+---------------+--------------+------+-----+---------+----------------+
| user_id       | int unsigned | NO   | PRI | NULL    | auto_increment |
| email_id      | varchar(255) | NO   | UNI | NULL    |                |
| user_password | varchar(255) | NO   |     | NULL    |                |
+---------------+--------------+------+-----+---------+----------------+
```

`course_info`

```sql
+--------------------+--------------------+------+-----+---------+----------------+
| Field              | Type               | Null | Key | Default | Extra          |
+--------------------+--------------------+------+-----+---------+----------------+
| course_id          | int unsigned       | NO   | PRI | NULL    | auto_increment |
| course_title       | varchar(127)       | NO   |     | NULL    |                |
| course_description | varchar(255)       | NO   |     | NULL    |                |
| course_price       | mediumint unsigned | NO   |     | 0       |                |
| total_duration     | tinyint unsigned   | NO   |     | 0       |                |
| course_topics      | json               | YES  |     | NULL    |                |
+--------------------+--------------------+------+-----+---------+----------------+
```

`entrollment_data`

```sql
+---------------------+--------------------+------+-----+---------+-------+
| Field               | Type               | Null | Key | Default | Extra |
+---------------------+--------------------+------+-----+---------+-------+
| email_id            | varchar(255)       | NO   |     | NULL    |       |
| course_title        | varchar(127)       | NO   |     | NULL    |       |
| paid                | mediumint unsigned | NO   |     | 0       |       |
| rating_given        | tinyint unsigned   | NO   |     | 0       |       |
| completed_topics_id | json               | YES  |     | NULL    |       |
+---------------------+--------------------+------+-----+---------+-------+
```

## Database Instructions

### Inserting New Course Details

Below example is given for hmtl. As this project comes with hmtl, css, js courses, please insert Course Details for css and js as well.

```sql
-- use this cmd in MySQL command line to insert 'html' course
INSERT INTO course_info (course_title, course_description, course_price, total_duration, course_topics)
    VALUES (
            'html', 'Basics of HTML', 500, 20,
            '[
                { "topic_id": 1, "topic_title": "Introduction to HTML" },
                { "topic_id": 2, "topic_title": "Elements in HTML" },
                { "topic_id": 3, "topic_title": "Tags, Styles & Scripts in HTML" },
                { "topic_id": 4, "topic_title": "Summary" }
            ]'
    );
```

To create new course insert details as shown above and add the course videos in the following path.

```bash
# Replace the [course_name] with actual course name and [topic_id] with actual 
"/public/assets/[course_name]/[course_name topic_id.mp4]"
```

### Updating course details

```sql
-- use this cmd in MySQL command line to update 'html' course topics
UPDATE course_info
SET course_topics = '[
                        { "topic_id": 1, "topic_title": "Introduction to HTML" },
                        { "topic_id": 2, "topic_title": "Elements in HTML" },
                        { "topic_id": 3, "topic_title": "Tags, Styles & Scripts in HTML" },
                        { "topic_id": 4, "topic_title": "Summary" }
                    ]'
WHERE course_title = 'html'; 
```

## Contact

For any questions or feedback, please contact me at **[adarshchoutha@gmail.com](mailto:adarshchoutha@gmail.com)**.