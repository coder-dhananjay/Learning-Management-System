# EdWolf LMS (Learning Management System)

Welcome to *EdWolf LMS*, a full-stack Learning Management System designed to offer a seamless experience for educators and learners. This application provides robust course management, secure user authentication, real-time communication, and a fully integrated payment system.

---

## Features

### User Features
- *User Authentication*:
  - Secure login and registration using Google OAuth2.
  - JWT-based session management for secure and seamless access.
- *Course Management*:
  - Browse, view, and enroll in available courses.
- *Cart & Payment*:
  - Add courses to the cart and securely check out using Razorpay integration.
- *Real-Time Chat*:
  - Interactive discussions with peers and educators powered by Socket.io.
- *Progress Tracking*:
  - View enrolled courses and track learning progress.
- *Dark/Light mode*:
  - System theme based and manual dark/light mode.

### Admin Features
- *Dashboard*:
  - Manage users, courses, and notifications efficiently.
- *Course Management*:
  - Add, edit, or delete courses.
- *User Management*:
  - Monitor and manage user activity.

### Instructor Features
- *Dashboard*:
  - Manage courses, enrolled students, and track course-level revenue.
- *Course Management*:
  - Add, edit, or delete courses.
- *User Management*:
  - Monitor and manage user activity.

---

## Technologies Used

### Frontend
- *Core Frameworks*: React.js, Redux Toolkit
- *Styling*: Tailwind CSS, Radix UI, Shadcn, DaisyUI
- *Validation*: React Hook Form, Zod
- *Media & Charts*: React Player, ChartJs
- *State Management*: Redux Persist
- *Real-Time Communication*: Socket.io-client
- *Payment Integration*: Razorpay

### Backend
- *Framework*: Node.js with Express.js
- *Database*: MongoDB with Mongoose
- *Authentication*: Google OAuth2, JWT
- *File Storage*: Cloudinary
- *Security*: Bcrypt for password hashing
- *Email Services*: Nodemailer

### Development Tools
- *Languages*: TypeScript
- *Linters & Formatters*: ESLint, Prettier
- *Runtime Tools*: Nodemon, ts-node-dev

---

## Setup & Installation

1. *Clone the repository:*
   
   bash
   
   git clone https://github.com/coder-dhananjay/Learning-Management-System.git

   cd EdWolf-Project

2. **Install Dependencies:**
   - **For the backend**

     bash
     cd backend
     npm install
     
   - *For the frontend*

     bash
     cd frontend
     npm install

3. **Set up Environment Variables:**
  - Backend: Copy `backend/.example-env` to `backend/.env` and fill in the values.
  - Frontend: Copy `frontend/.example-env` to `frontend/.env` and fill in the values.

4. *Run the application:*
   - *Start the backend server*

     bash
     cd backend
     npm run dev
     
   - **Start the frontend development server**

     bash
     cd frontend
     npm run dev

5. *Access the Application*

   - Open your browser and visit: http://localhost:<frontend_port>

## Contact

For any queries or suggestions, feel free to reach out:
- Author: Dhananjay Singh
- Email: coderdhananjay111@gmail.com
