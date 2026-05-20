# MERN Job Portal

A full-stack MERN-based Job Portal application designed for recruiters and job seekers. The platform enables recruiters to post and manage jobs while allowing seekers to browse opportunities, apply for jobs, upload resumes, and track applications.

---

# Features

## Authentication & Authorization

* User registration and login
* Role-based authentication (Recruiter / Seeker)
* Protected routes using middleware
* JWT-based authentication system

## Recruiter Features

* Create and manage job postings
* View applicants for posted jobs
* Recruiter dashboard
* Applicant management system
* Recruiter notification system

## Job Seeker Features

* Browse job listings
* View detailed job information
* Apply for jobs
* Track submitted applications
* Profile management
* Resume upload support

## Resume Upload System

* Resume upload using Multer
* Cloudinary integration for cloud storage
* Secure file handling

## Dashboard & Utilities

* Recruiter dashboard
* Seeker dashboard
* Deadline calculations
* Posted-time utilities
* Responsive UI design

---

# Tech Stack

## Frontend

* React.js
* Tailwind CSS
* Vite
* Axios
* React Router DOM
* ShadCN UI Components

## Backend

* Node.js
* Express.js
* MongoDB
* Mongoose
* JWT Authentication
* Multer
* Cloudinary

---

# Project Structure

```bash
Job-Portal/
│
├── client/
│   ├── src/
│   │   ├── components/
│   │   ├── pages/
│   │   ├── utils/
│   │   └── App.jsx
│   │
│   ├── public/
│   └── package.json
│
├── server/
│   ├── controllers/
│   ├── middleware/
│   ├── models/
│   ├── routes/
│   ├── config/
│   └── server.js
│
└── README.md
```

---

# Implemented Modules

## Authentication Module

* Login/Register system
* Protected routes
* JWT verification
* Role-based access control

## Job Management Module

* Job creation
* Job details page
* Job APIs
* Recruiter job management

## Application Management Module

* Job application system
* Applicant tracking
* My Applications page
* Recruiter applicant review

## Profile Management Module

* User profile page
* Resume upload
* Profile updates

## Notification System

* Recruiter notifications
* Application status updates

---

# Key Functionalities

## Recruiters Can

* Post jobs
* View applicants
* Manage applications
* Access recruiter dashboard
* Receive notifications

## Job Seekers Can

* Search jobs
* View job details
* Apply for jobs
* Upload resumes
* Track applications
* Manage profiles

---

# API Features

* RESTful API integration
* Authentication middleware
* CRUD operations for jobs and applications
* File upload APIs
* Protected backend routes

---

# UI Features

* Responsive design
* Tailwind CSS styling
* Dashboard interfaces
* Clean navigation system
* Reusable UI components


---

# Future Enhancements

* AI Resume Analyzer
* AI-based Job Recommendation System
* AI Interview Preparation System
* AI Career Guidance Chatbot
* Resume Builder
* Email notifications
* Admin analytics dashboard

---

# Author

Developed by Ajay Bhandari