# Classroom Finder Application

Welcome to the Classroom Finder Application for SRMIST Faculty of Science and Humanities. This web application helps students and staff to easily find and manage lecture schedules.

## Table of Contents
- [Introduction](#introduction)
- [User Guide](#user-guide)
  - [Student User](#student-user)
  - [Staff User](#staff-user)
  - [Editor](#editor)
- [Developer Guide](#developer-guide)
  - [Technologies Used](#technologies-used)
  - [Database Models](#database-models)
  - [Setup Instructions](#setup-instructions)
- [Contributing](#contributing)
- [License](#license)

## Introduction

The Classroom Finder Application is a web-based tool designed for the convenience of students and staff at SRMIST Faculty of Science and Humanities. Students can view their daily lecture schedules by providing their course details, and staff can see their lecture schedules for various classes. The application includes an 'Editor' feature, accessible only to the timetable coordinator, allowing them to manage lecture schedules efficiently.

## User Guide

### Student User

To view your timetable, follow these steps:
1. Enter your course, degree, year, and section.
2. View your daily lecture schedule.

### Staff User

To view your timetable, follow these steps:
1. Log in to the web application.
2. Enter your college email ID.
3. View your lecture schedule for the classes you handle.

### Editor

The Editor has additional privileges to manage the lecture schedules:
1. Log in to the web application with editor credentials.
2. Add new lectures for different classes.
3. Modify existing lecture schedules.
4. Delete lectures as needed.

## Developer Guide

### Technologies Used

- **Backend**: Django framework
- **Database**: Postgres from Supabase
- **ORM**: Django ORM

### Database Models

The application uses the following database models:

- **Class**: Holds data regarding the classes from all courses.
- **Staff**: Contains information about all staff members from all departments.
- **Subject**: Stores data about the subjects for each class and course.
- **Period**: Manages the timing of lectures for the classes (invoked as a ForeignKey object).

### Setup Instructions

1. **Clone the repository**:
    ```bash
    git clone https://github.com/htarab-b/srm-fsh-classroom-finder.git
    cd classroomfinder
    ```

2. **Create and activate a virtual environment**:
    ```bash
    python -m venv venv
    source venv/bin/activate  # On Windows use `venv\Scripts\activate`
    ```

3. **Install dependencies**:
    ```bash
    pip install -r requirements.txt
    ```

4. **Configure the database**:
    - Update the database settings in `settings.py` to connect to your Supabase Postgres database.

5. **Apply migrations**:
    ```bash
    python manage.py migrate
    ```

6. **Run the development server**:
    ```bash
    python manage.py runserver
    ```

7. **Access the application**:
    Open your browser and navigate to `http://localhost:8000`.

## Contributing

We welcome contributions to enhance the Classroom Finder Application. To contribute, please follow these steps:

1. Fork the repository.
2. Create a new branch (`git checkout -b feature-branch`).
3. Commit your changes (`git commit -m 'Add some feature'`).
4. Push to the branch (`git push origin feature-branch`).
5. Create a new Pull Request.

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.