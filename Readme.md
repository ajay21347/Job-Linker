# MERN Job Portal

A modern full-stack MERN-based Job Portal designed for recruiters and job seekers. The platform streamlines the recruitment process by allowing recruiters to post and manage jobs while enabling seekers to discover opportunities, upload resumes, apply for jobs, track applications, and leverage AI-powered career tools.

## Features

### Authentication & Authorization

- User Registration & Login
- JWT-Based Authentication
- Role-Based Access Control (Recruiter / Seeker / Admin)
- Protected Routes & Middleware
- Secure Session Management

## Recruiter Features

### Recruiter Dashboard

- Recruiter-specific dashboard
- Real-time recruitment statistics
- Total Jobs Posted
- Total Applicants
- Shortlisted Candidates Count
- Selected Candidates Count

### Job Management

- Create Job Postings
- Edit Existing Jobs
- Delete Jobs with Confirmation Dialog
- Manage Job Listings
- Application Deadline Support
- Job Type Selection (Full-Time, Part-Time, Internship, Remote)

### Applicant Management

- View Applicants Across All Jobs
- Search Applicants
- Applicant Status Tracking
- View Candidate Resumes
- Job-wise Applicant Management
- Clickable Job Title Navigation to Job Details

### Analytics Dashboard

- Most Applied Job
- Total Applications Received
- Selected Candidates Analytics
- Applications Per Job Statistics

### Recruiter Notifications

- Real-Time Applicant Notifications
- Notification Badge Count
- Read/Unread Notification Tracking
- Dedicated Notification Center

## Job Seeker Features

### Job Discovery

- Browse Available Jobs
- Search Job Opportunities
- Detailed Job Information
- Company Information Display

### Application Management

- Apply for Jobs
- Track Application Status
- Application History
- Real-Time Status Updates
- Application Notifications

### Profile Management

- Profile Editing
- Resume Upload
- Resume Management
- Personal Information Management

## AI-Powered Features

### AI Resume Analysis

- Resume Evaluation
- ATS-Friendly Resume Suggestions
- Resume Improvement Recommendations
- Skills Gap Analysis

### AI Mock Interview System

- Job-Specific Interview Questions
- AI-Generated Interview Sessions
- Interview History Tracking
- Interview Performance Analysis

### AI Assistant

- Integrated AI Career Assistant
- Resume Guidance
- Job Search Support
- Interview Preparation Help

## Resume Management System

- Resume Upload Support
- Cloudinary Storage Integration
- Secure File Handling
- Resume Preview Support
- Recruiter Resume Access

## Notification System

### Recruiter Notifications

- New Applicant Alerts
- Applicant Activity Tracking
- Notification Counter

### Seeker Notifications

- Application Status Updates
- Recruiter Responses
- Status Change Alerts

## Dashboard & Utilities

- Recruiter Dashboard
- Seeker Dashboard
- Responsive Layouts
- Analytics Overview
- Job Statistics
- Posted Time Utilities
- Application Deadline Tracking

## Tech Stack

### Frontend

- React.js
- Vite
- Tailwind CSS
- Axios
- React Router DOM
- ShadCN UI
- Lucide React Icons
- Sonner Toast Notifications

### Backend

- Node.js
- Express.js
- MongoDB
- Mongoose
- JWT Authentication
- Multer
- Cloudinary

### AI Integration

- Google Gemini API
- Resume Analysis Engine
- AI Interview Generation

## Project Structure

```plaintext
Job-Portal/
│
├── client/
│   ├── src/
│   │   ├── components/
│   │   ├── pages/
│   │   ├── layouts/
│   │   ├── context/
│   │   ├── services/
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
│   ├── utils/
│   └── server.js
│
└── README.md
```

## Implemented Modules

### Authentication Module

- Login & Registration
- JWT Verification
- Role-Based Authorization
- Protected Routes

### Job Management Module

- Create Jobs
- Edit Jobs
- Delete Jobs
- Job Details Page
- Recruiter Job Management

### Application Management Module

- Job Application System
- Applicant Tracking
- My Applications Dashboard
- Recruiter Applicant Review

### Profile Management Module

- User Profile
- Resume Upload
- Profile Updates

### Notification Module

- Recruiter Notifications
- Application Status Notifications
- Real-Time Notification Counters

### Analytics Module

- Recruitment Statistics
- Most Applied Job Analysis
- Application Insights

### AI Module

- Resume Analyzer
- Mock Interview Generator
- AI Career Assistant

## REST API Features

- Authentication APIs
- Job CRUD APIs
- Application APIs
- Recruiter Dashboard APIs
- Analytics APIs
- Notification APIs
- Resume Upload APIs
- Protected Middleware Routes

## UI Features

- Modern Responsive Design
- Recruiter Sidebar Navigation
- Interactive Dashboard Cards
- Search & Filter Components
- Animated Notification System
- Glassmorphism UI Elements
- Reusable Component Architecture

## Future Enhancements

- AI Job Recommendation System
- AI Career Guidance Chatbot
- Resume Builder
- Email Notifications
- Video Interview Platform
- Advanced Recruiter Analytics
- Admin Analytics Dashboard
- Company Review System
- Saved Jobs Feature
- Job Recommendation Engine

Author

Ajay Bhandari
