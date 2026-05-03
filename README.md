# MiniBank — Full-Stack Digital Banking System

MiniBank is a premium, full-stack banking platform built with **Spring Boot** and **React (Vite)**. It features a stunning, modern user interface with dark mode for admins and a "Veridian" glossy aesthetic for users.

---

## 🚀 Quick Setup

### 1. Database Configuration (MySQL)
The system uses MySQL via XAMPP.
1. Start **Apache** and **MySQL** in XAMPP.
2. Open phpMyAdmin and create a database named `bank_system`.
3. The backend will automatically create tables and seed default data (Admin & User) upon launch.

### 2. Backend Setup (Spring Boot)
Located in `banking_system/banking_system/`.
- **JDK Requirement**: Java 25
- **Port**: `8085` (Configured to avoid conflicts with Oracle).
- **Execution**:
  ```powershell
  cd banking_system/banking_system
  ./mvnw.cmd spring-boot:run
  ```

### 3. Frontend Setup (React + Vite)
Located in `banking_system/banking_system1/`.
- **Node.js Requirement**: v18+
- **Port**: `3001`
- **Execution**:
  ```powershell
  cd banking_system1
  npm install
  npm run dev
  ```

---

## 🔐 Default Credentials
The system comes pre-seeded with the following accounts:

| Role | Email | Password |
| :--- | :--- | :--- |
| **Administrator** | `admin@gmail.com` | `password123` |
| **Standard User** | `austinaeden@gmail.com` | `password123` |

---

## ✨ Features

### 🏦 User Dashboard
- **Real-time Balance**: View checking and savings balances.
- **Transactions**: Full history with categorization and search.
- **Transfers**: Secure fund transfers between accounts.
- **Profile**: Manage contact info and account status.

### 🛡️ Admin Console (MiniBank Admin)
- **System Overview**: High-level liquidity and user metrics.
- **User Management**: View and monitor all registered members.
- **Account Auditing**: Monitor every account and its status.
- **Global Notifications**: Send alerts to all users from the panel.

---

## 🛠️ Tech Stack
- **Frontend**: React 18, Vite, Tailwind CSS, Lucide Icons, Framer Motion.
- **Backend**: Spring Boot 3.4.5, Spring Data JPA, Hibernate.
- **Database**: MySQL 8.0.
- **Icons**: Lucide React.
- **Styling**: Premium Custom CSS & Glassmorphism.

---

## 📂 Project Structure
```text
banking_system/
├── banking_system/          # Spring Boot Backend
│   ├── src/                 # Java Source Code
│   ├── pom.xml              # Maven Config
│   └── mvnw.cmd             # Maven Wrapper
├── banking_system1/         # React Frontend
│   ├── src/                 # React Source Code
│   ├── public/              # Static Assets (Logo)
│   └── vite.config.js       # Vite Configuration
└── bank_system.sql          # Database Schema Reference
```
