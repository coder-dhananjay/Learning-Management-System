# EdWolf Setup Guide

## Quick Fix for Current Issues

### 1. Frontend TypeScript Error (FIXED ✅)

The TypeScript interface syntax error has been fixed by converting the interface to a type alias.

### 2. Backend Payment Error (FIXED ✅)

The payment initialization error has been fixed by adding proper error handling for missing API keys.

---

## Environment Setup

Create a `.env` file in the `backend` directory with the following variables:

```env
# Server Configuration
NODE_ENV=development
PORT=5000

# Database Configuration
MONGO_URI=mongodb://localhost:27017/Edwolf

# JWT Configuration
ACCESS_TOKEN_SECRET=your_access_token_secret_here
REFRESH_TOKEN_SECRET=your_refresh_token_secret_here
ACCESS_TOKEN_EXPIRE=15m
REFRESH_TOKEN_EXPIRE=7d

# Session Configuration
SESSION_SECRET=your_session_secret_here

# Client Configuration
CLIENT_URL=http://localhost:5173

# Google OAuth Configuration (Optional)
GOOGLE_CLIENT_ID=your_google_client_id
GOOGLE_CLIENT_SECRET=your_google_client_secret
GOOGLE_CALLBACK_URL=http://localhost:5000/api/auth/google/callback

# Email Configuration (Optional)
EMAIL_USER=your_email@gmail.com
EMAIL_PASS=your_email_app_password

# Cloudinary Configuration (Optional)
CLOUDINARY_CLOUD_NAME=your_cloudinary_cloud_name
CLOUDINARY_API_KEY=your_cloudinary_api_key
CLOUDINARY_API_SECRET=your_cloudinary_api_secret

# Razorpay Configuration (Optional - for payments)
RAZORPAY_API_KEY=rzp_test_your_razorpay_key_id
RAZORPAY_API_SECRET=your_razorpay_key_secret
```

---

## Required vs Optional Services

### Required for Basic Functionality:

* `MONGO_URI` – MongoDB connection string
* `ACCESS_TOKEN_SECRET` – JWT signing secret
* `REFRESH_TOKEN_SECRET` – JWT refresh secret
* `SESSION_SECRET` – Session encryption secret
* `CLIENT_URL` – Frontend URL

### Optional Services:

* **Google OAuth** – For Google login (email/password works without it)
* **Email Service** – For password reset and notifications
* **Cloudinary** – For image uploads (local storage can be used instead)
* **Razorpay** – For payment processing (payments can be disabled)

---

## Quick Start (Minimal Setup)

For a minimal setup to get the application running:

```env
NODE_ENV=development
PORT=5000
MONGO_URI=mongodb://localhost:27017/learnlab
ACCESS_TOKEN_SECRET=your_secret_key_here
REFRESH_TOKEN_SECRET=your_refresh_secret_here
SESSION_SECRET=your_session_secret_here
CLIENT_URL=http://localhost:5173
```

---

## Installation Steps

### 1. Install Dependencies

```bash
# Backend dependencies
cd backend
npm install

# Frontend dependencies
cd ../frontend
npm install
```

### 2. Start MongoDB

Make sure MongoDB is running on your system:

```bash
# On Windows (if installed as a service)
# MongoDB should start automatically

# On macOS with Homebrew
brew services start mongodb-community

# On Linux
sudo systemctl start mongod
```

### 3. Start the Application

```bash
# Terminal 1 - Start Backend
cd backend
npm run dev

# Terminal 2 - Start Frontend
cd frontend
npm run dev
```

---

## Troubleshooting

### Common Issues:

1. **MongoDB Connection Error**

   * Ensure MongoDB is running
   * Verify the connection string
   * Consider MongoDB Atlas for cloud hosting

2. **Port Already in Use**

   * Change the `PORT` value in `.env`
   * Kill the process using the port:

     ```bash
     npx kill-port 5000
     ```

3. **Module Not Found Errors**

   * Run `npm install` in both `frontend` and `backend`
   * Clear and reinstall dependencies:

     ```bash
     rm -rf node_modules package-lock.json && npm install
     ```

4. **TypeScript Errors**

   * Ensure valid TypeScript syntax
   * Check for missing type definitions

---

## Getting API Keys

### 1. Razorpay Keys (for payments)

* Visit the Razorpay Dashboard
* Navigate to **Settings → API Keys**
* Generate **Test Mode** keys for development
* Add them to `.env` as:

  * `RAZORPAY_API_KEY`
  * `RAZORPAY_API_SECRET`
* Configure webhook and add:

  * `RAZORPAY_WEBHOOK_SECRET`

### 2. Google OAuth (for Google login)

* Visit Google Cloud Console
* Create OAuth 2.0 credentials
* Add credentials to `.env`:

  * `GOOGLE_CLIENT_ID`
  * `GOOGLE_CLIENT_SECRET`

### 3. Cloudinary (for image uploads)

* Visit Cloudinary Dashboard
* Get Cloud Name, API Key, and Secret
* Add to `.env`:

  * `CLOUDINARY_CLOUD_NAME`
  * `CLOUDINARY_API_KEY`
  * `CLOUDINARY_API_SECRET`

---

## Features Status

### ✅ Working (No API Keys Required):

* User authentication (email/password)
* Course management
* User profiles
* Basic chat functionality
* Course enrollment (without payments)
* Progress tracking
* Quiz system

### 🔧 Working (With API Keys):

* **Payment processing** (Razorpay)
* **Google OAuth login**
* **Image uploads** (Cloudinary)
* **Email notifications**

### 🚀 Ready to Use:

* Full LMS core functionality
* Enhanced About and Contact pages
* Modern UI/UX
* Responsive design
* Dark mode support

---

## Next Steps

1. Start with the **minimal setup** to verify everything runs
2. Add **Razorpay and other services** as needed
3. Customize the platform for your use case

The application works perfectly with the minimal configuration, and advanced features can be enabled incrementally.
