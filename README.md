# 🎓 College Resource Management System (CRMS)

[![MERN Stack](https://img.shields.io/badge/Stack-MERN-blue)](https://www.mongodb.com/mern-stack)
[![License](https://img.shields.io/badge/License-MIT-green.svg)](LICENSE)
[![Node.js](https://img.shields.io/badge/Node.js-v14+-green)](https://nodejs.org)
[![React](https://img.shields.io/badge/React-v17+-blue)](https://reactjs.org)


A comprehensive MERN Stack–based College Resource Management System designed to efficiently manage college resources, student information, and academic activities. The system provides a centralized platform for administrators, mentors, and students to manage academic data, mentorship activities, and training & placement processes within the institution.

🚀 Feature

👩‍🎓 Student Management – Manage student profiles and academic records
🧑‍💼 Admin Dashboard – Centralized administrative control
👨‍🏫 Mentor Management – Mentors can monitor and guide assigned students
💼 Training & Placement (TNP) Module – Manage placement activities and student eligibility
🔍 Student Finder – Search and access student information quickly
📚 Resource Management – Efficiently manage institutional resources
🔐 Authentication System – Secure login for administrators and users

🧩 System Modules

The system is divided into several functional modules:

Admin Module

Manage students and mentors

Monitor academic and resource data

Student Module

View personal and academic information

Access resource details

Mentor Module

Track student progress

Provide mentorship and academic guidance

Training & Placement (TNP) Module

Manage placement opportunities

Track student eligibility and placement records

Resource Management Module

Manage college resources and related data
## Tech Stack

- Frontend: React.js
- Backend: Node.js, Express.js
- Database: MongoDB
- Authentication: JWT

## Prerequisites

- Node.js
- MongoDB
- npm

1. Clone the repository:

```bash
git clone <repository-url>
cd College-Management-System
```

2. Install dependencies:

```bash
# Install backend dependencies
cd backend
npm install

# Install frontend dependencies
cd ../frontend
npm install
```

3. Create a `.env` file in the backend directory with the following variables:

```
MONGODB_URI =mongodb://127.0.0.1:27017/College-Management-System
PORT = 4000
FRONTEND_API_LINK = http://localhost:3000
JWT_SECRET = THISISSECRET

NODEMAILER_EMAIL =
NODEMAILER_PASS =
```

4. Create a `.env` file in the frontend directory:

```env
REACT_APP_APILINK = http://localhost:4000/api

REACT_APP_MEDIA_LINK = http://localhost:4000/media

```

5. Start the development servers:

```bash
# Start backend server (from backend directory)
npm run dev

# Start frontend server (from frontend directory)
npm start
```

## Initial Setup

1. Create an admin account using the seeder:

```bash
cd backend
npm run seed
```

This will create a default admin account with the following credentials:

- Employee ID: 123456
- Password: admin123
- Email: admin@gmail.com

## Project Structure

```
college-management-system/
├── backend/
│   ├── controllers/
│   │   ├── models/
│   │   ├── routes/
│   │   ├── middlewares/
│   │   ├── utils/
│   │   └── media/
│   └── README.md
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   ├── pages/
│   │   ├── context/
│   │   └── utils/
│   └── public/
└── README.md
```
