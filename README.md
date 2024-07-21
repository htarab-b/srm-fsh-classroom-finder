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
2. Enter your college employee ID.
3. View your lecture schedule for the classes you handle.

### Editor

The Editor has additional privileges to manage the lecture schedules:
1. Log in to the web application with editor credentials.
2. Add new lectures for different classes.
3. Modify existing lecture schedules.
4. Delete lectures as needed.

## Developer Guide

### Technologies Used

- **Backend and Database**: Supabase
- **Frontend**: React

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
    cd classroom_finder
    ```

2. **Install dependencies**:
    ```bash
    npm install
    ```

3. **Run the development server**:
    ```bash
    npm run dev
    ```

4. **Access the application**:
    Open your browser and navigate to React localhost.

## Contributing

We welcome contributions to enhance the Classroom Finder Application. To contribute, please follow these steps:

1. Fork the repository.
2. Create a new branch (`git checkout -b feature-branch`).
3. Commit your changes (`git commit -m 'Add some feature'`).
4. Push to the branch (`git push origin feature-branch`).
5. Create a new Pull Request.

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.