# 🩸 Blood Life System
A full-stack web application that connects blood donors with receivers, managed by an admin panel. The platform ensures efficient blood donation management with secure authentication and role-based access.

## 🌐 Overview
The **Blood Life System** is designed to streamline the process of blood donation by connecting:
* 🛠️ **Admin** – Manages the system
* 👤 **Users (Donors)** – Donate blood and manage their profiles
* 🩸 **Receivers** – Request blood when needed


## 🚀 Features
### 🛠️ Admin
* Manage users and donors
* View and manage all blood requests
* Approve or reject requests
* Monitor system activity

### 👤 Donor (User)
* Register & login securely
* Add/update donor details
* Set availability status
* View blood requests

### 🩸 Receiver
* Register & login
* Request blood by type and location
* Track request status
* View available donors

## 🔐 Security Features
* JWT-based Authentication
* Password hashing using bcrypt
* Role-based authorization (Admin / User / Receiver)
* API rate limiting
* Secure HTTP headers (Helmet)
* Input validation (express-validator)

## 🛠️ Tech Stack

### Frontend
* React.js
* Axios
* CSS / Tailwind (if used)

### Backend
* Node.js
* Express.js
* MySQL

### Tools & Libraries
* jsonwebtoken (JWT)
* bcryptjs
* nodemailer
* dotenv
* cors
* helmet


## 📁 Project Structure
```bash id="nq5v91"
blood-life-system/
│
├── frontend/          # React Application
│   ├── src/
│   ├── public/
│   └── package.json
│
├── backend/          # Node.js Backend
│   ├── routes/
│   ├── controllers/
│   ├── middleware/
│   ├── config/
│   ├── server.js
│   └── package.json
│
└── README.md
```

## ⚙️ Installation & Setup
### 1️⃣ Clone Repository
```bash id="l7n2pc"
git clone https://github.com/your-username/blood-life-system.git
cd blood-life-system
```

### 2️⃣ Backend Setup
```bash id="n2xk1o"
cd backend
npm install
```
Create `.env` file:

```env id="r5p0sx"
PORT=5000
DB_HOST=localhost
DB_USER=root
DB_PASSWORD=yourpassword
DB_NAME=blood_life
JWT_SECRET=your_secret_key
EMAIL_USER=your_email
EMAIL_PASS=your_email_password
```
Run backend:
```bash id="o2c9tr"
npm run dev
```

### 3️⃣ Frontend Setup
```bash id="0yhtnb"
cd frontend
npm install
npm start
```

## 🔗 API Overview

| Method | Endpoint            | Description            |
| ------ | ------------------- | ---------------------- |
| POST   | /api/auth/register  | Register user/receiver |
| POST   | /api/auth/login     | Login user             |
| GET    | /api/donors         | Get all donors         |
| POST   | /api/request        | Create blood request   |
| GET    | /api/admin/users    | Admin: manage users    |
| GET    | /api/admin/requests | Admin: manage requests |

---

## 🔄 Workflow

1. User registers as **Donor or Receiver**
2. Donor updates availability
3. Receiver sends blood request
4. Admin reviews and manages requests
5. System connects donor and receiver


## 🚀 Future Improvements

* Real-time notifications
* Location-based donor matching
* Admin dashboard analytics
* Mobile application


## 🤝 Contributing

1. Fork the repository
2. Create a new branch
3. Commit changes
4. Push to GitHub
5. Open a Pull Request


## 📄 License
ISC License

## 👨‍💻 Author
Darshana Bhandari


If you like this project, please ⭐ the repository!

---
