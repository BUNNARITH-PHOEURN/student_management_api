# Student Management API

A Node.js + Express web application for managing students, courses and enrollments, built with MySQL as the database and EJS for server-side rendered views. The project also exposes a JSON API alongside the HTML pages, and includes a Postman collection for endpoint testing.

## Features

- **Student management** — create, view, edit, delete student records (name, gender, email, address, phone number, date of birth, status)
- **Course management** — create, view, edit, delete course records (name, code, credits, instructor, department, semester, status)
- **Enrollment** — links students to courses
- **Authentication** — login system with protected views (`authController`, `authRoutes`, `authViewRoutes`)
- **Dual response format** — each list/detail route returns an HTML page by default, or JSON when requested by an API client
- **Shared, reusable views** — a single `index.ejs` renders both the Students and Courses tables using a generic column configuration
- **Postman collection** included for manually testing every endpoint

## Tech Stack

| Layer | Technology |
|---|---|
| Runtime | Node.js |
| Web framework | Express |
| Templating | EJS |
| Database | MySQL |
| Password hashing | bcryptjs |
| Authentication tokens | jsonwebtoken (JWT) |
| Input validation | express-validator |
| API testing | Postman |

## Project Structure

```
STUDENT_MANAGEMENT_API/
├── bin/                        # Server startup script
├── config/
│   └── db.js                   # MySQL connection setup
├── controllers/
│   ├── authController.js       # Login / authentication logic
│   ├── courseController.js     # Course CRUD logic
│   ├── studentController.js    # Student CRUD logic
│   ├── userController.js       # User CRUD logic
├── models/
│   ├── course.entity.js        # Course class/entity definition
│   ├── course.js               # Course SQL queries
│   ├── enrollment.js           # Student–course enrollment logic
│   ├── student.entity.js       # Student class/entity definition
│   └── student.js               # Student SQL queries
│   └── user.js               # Student SQL queries
├── public/
│   ├── javascripts/
│   │   ├── auth.js
│   │   ├── header.js
│   │   └── script.js
│   └── stylesheets/
│       ├── auth.css
│       └── style.css
├── routes/
│   ├── authRoutes.js
│   ├── authViewRoutes.js
│   ├── course.js
│   ├── index.js
│   ├── student.js
│   └── users.js
├── views/
│   ├── partials/                # Shared header/footer includes
│   ├── addCourse.ejs
│   ├── addStudent.ejs
│   ├── editCourse.ejs
│   ├── editStudent.ejs
│   ├── error.ejs
│   ├── index.ejs                # Shared list view for both students and courses
│   ├── login.ejs
│   └── showStudent.ejs
├── .gitignore
├── app.js                       # Express app entry point
├── package.json
└── package-lock.json
```

## Prerequisites

- [Node.js](https://nodejs.org/) (LTS version recommended)
- [MySQL](https://www.mysql.com/) server running locally or remotely
- [Postman](https://www.postman.com/downloads/) (optional, for API testing)

## Setup Instructions

1. **Clone the repository**
   ```bash
   git clone https://github.com/BUNNARITH-PHOEURN/student_management_api.git
   cd student_management_api
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```bash
   npm install mysql2  
   ```bash
   npm install express ejs mysql2
   ```
   This installs Express, EJS, MySQL driver, and the authentication packages used for login:
   - `bcryptjs` — hashes and verifies user passwords
   - `jsonwebtoken` — issues and verifies JWTs for authenticated sessions
   - `express-validator` — validates and sanitizes incoming request data (e.g. required fields, email format)

3. **Configure the database**

   Update `config/db.js` with your MySQL credentials:
   ```javascript
   var mysql = require('mysql2');

   var connection = mysql.createConnection({
       host: 'localhost',
        user: 'root',
        password: '',
        database: 'student_db'
   });

   connection.connect((err) => {
    if (err)
        console.log(err);
    else
        console.log("Database Connected");
    });

   module.exports = connection;
   ```

4. **Create the database and tables**

   Run the following in your MySQL client:
   ```sql
   CREATE DATABASE student_db;
   USE student_db;

   CREATE TABLE students (
       id INT AUTO_INCREMENT PRIMARY KEY,
       firstName VARCHAR(32) NOT NULL,
       lastName VARCHAR(32) NOT NULL,
       gender VARCHAR(10) DEFAULT '',
       email VARCHAR(100) DEFAULT '',
       street VARCHAR(32) DEFAULT '',
       district VARCHAR(32) DEFAULT '',
       city VARCHAR(32) DEFAULT '',
       phoneNumber VARCHAR(32) DEFAULT '',
       dob DATE DEFAULT NULL,
       status VARCHAR(20) DEFAULT 'active',
       created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
       updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
   );

   CREATE TABLE courses (
       id BIGINT NOT NULL PRIMARY KEY AUTO_INCREMENT,
       course_name VARCHAR(255) NOT NULL,
       course_code VARCHAR(255) NOT NULL,
       credits DECIMAL(10,2) DEFAULT 0,
       description TEXT DEFAULT '',
       instructor VARCHAR(255) DEFAULT '',
       department VARCHAR(255) DEFAULT '',
       semester VARCHAR(255) DEFAULT '',
       status ENUM('active','inactive','cancelled') DEFAULT 'active',
       created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
       updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
   );

   CREATE TABLE enrollments (
       id INT AUTO_INCREMENT PRIMARY KEY,
       student_id INT NOT NULL,
       course_id INT NOT NULL,
       created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
       FOREIGN KEY (student_id) REFERENCES students(id) ON DELETE CASCADE,
       FOREIGN KEY (course_id) REFERENCES courses(id) ON DELETE CASCADE,
       UNIQUE KEY unique_enrollment (student_id, course_id)
   );

   CREATE TABLE users (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    email VARCHAR(191) NOT NULL UNIQUE,
    password VARCHAR(255) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
   )

  
   ```

   > **Note:** the `enrollments` table's `student_id` foreign key references `students(id)`, but the `students` table above uses `studentId` (not `id`) as its primary key. Make sure your actual column names match on both sides before running this — either rename the FK reference to `students(studentId)`, or add an `id` column to `students` if you intend to keep them separate from the primary key used elsewhere in the app.

5. **Start the server**
   ```bash
   npm start
   ```
   or
   ```bash
   node app.js
   ```

6. **Open the app**

   Visit `http://localhost:3000` in your browser.

## API Endpoints

### Students

| Method | Endpoint | Description |
|---|---|---|
| GET | `/students` | List all students (HTML or JSON) |
| GET | `/students/new` | Show the "Add Student" form |
| GET | `/students/:id` | Get a single student by ID (JSON) |
| GET | `/students/:id/edit` | Show the "Edit Student" form |
| POST | `/students` | Create a new student |
| PUT | `/students/:id` | Update an existing student |
| DELETE | `/students/:id` | Delete a student |

### Courses

| Method | Endpoint | Description |
|---|---|---|
| GET | `/courses` | List all courses (HTML or JSON) |
| GET | `/courses/new` | Show the "Add Course" form |
| GET | `/courses/:id` | Get a single course by ID (JSON) |
| GET | `/courses/:id/edit` | Show the "Edit Course" form |
| POST | `/courses` | Create a new course |
| PUT | `/courses/:id` | Update an existing course |
| DELETE | `/courses/:id` | Delete a course |

### Auth

| Method | Endpoint | Description |
|---|---|---|
| GET | `/login` | Show the login form |
| POST | `/login` | Authenticate a user |

Authentication uses `bcryptjs` to compare hashed passwords and `jsonwebtoken` to issue a token/session on successful login. Request bodies are validated with `express-validator` before hitting the controller logic.

## Testing the API with Postman

A Postman collection is included (`Student_Management_API.postman_collection.json`) covering the Students and Courses endpoints with sample requests and example responses.

1. Open Postman → **Import** → **Upload Files** → select the collection file
2. Update the `baseUrl` variable if your server runs on a different host/port
3. Make sure the **Desktop Agent** is selected (not the Cloud Agent) so Postman can reach `localhost`
4. Start your server (`node app.js`) before sending requests

## License

This project is for educational/personal use. Add a license here if you plan to distribute it publicly.
