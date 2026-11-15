# 🍽️ Spice Royale – Online Restaurant Management System

Spice Royale is a full-stack restaurant web application developed using React.js, Spring Boot, and MySQL. It provides customers with an easy online food ordering experience and administrators with tools to manage food items and customer orders.

## 🚀 Features

### Customer Features
- Customer registration and login
- Browse food items and categories
- View food details and images
- Add and remove items from cart
- Manage favourites
- Place food orders
- View order history
- Cancel eligible orders

### Admin Features
- Secure admin login
- View and manage customer orders
- Update order status
- Add new food items
- Edit existing food details
- Delete food items

## 🛠️ Tech Stack

| Category | Technologies |
|---|---|
| Frontend | React.js, JavaScript, HTML, CSS |
| Build Tool | Vite |
| State Management | Redux Toolkit |
| Backend | Java, Spring Boot |
| Database | MySQL |
| ORM | Spring Data JPA, Hibernate |
| Authentication | JWT, BCrypt |
| API | REST API |
| Version Control | Git, GitHub |

## 📂 Project Structure

```text
Spice-Royale/
│
├── backend/
│   └── spice-royale-backend/
│       ├── src/
│       ├── pom.xml
│       └── mvnw.cmd
│
├── public/
│   └── images/
│
├── src/
│   ├── api.js
│   ├── components/
│   ├── data/
│   ├── pages/
│   ├── store/
│   └── App.jsx
│
├── index.html
├── package.json
├── vite.config.js
└── README.md
```

## ⚙️ Installation and Setup

### Prerequisites
- Node.js and npm
- Java JDK 21
- MySQL Server
- Git

### 1. Clone the Repository

```bash
git clone https://github.com/Vanishree-0704/Spice-Royale.git
cd Spice-Royale
```

### 2. Database Setup

Open MySQL Workbench and execute:

```sql
CREATE DATABASE spice_royale;
```

Configure the database username and password using environment variables.

### 3. Backend Setup

Open the backend folder:

```bash
cd backend/spice-royale-backend
```

Configure the required environment variables:

- `SPRING_DATASOURCE_URL`
- `SPRING_DATASOURCE_USERNAME`
- `SPRING_DATASOURCE_PASSWORD`
- `JWT_SECRET`
- `CORS_ALLOWED_ORIGINS`

Use a secure JWT secret of at least 32 bytes. Never commit passwords or secret keys to GitHub.

Run the Spring Boot application:

```bash
.\mvnw.cmd spring-boot:run
```

Backend runs on:

```text
http://localhost:8080
```

### 4. Frontend Setup

Open a new terminal in the project root:

```bash
npm install
```

Create a `.env` file in the project root:

```env
VITE_API_BASE_URL=http://localhost:8080
```

Start the frontend:

```bash
npm run dev
```

Frontend runs on:

```text
http://localhost:5173
```

## 🗄️ Database

The application uses MySQL to store:
- Customer information
- Food details
- Customer orders

## 🔐 Security

- JWT-based authentication
- BCrypt password hashing
- Role-based authorization checks
- Configurable CORS settings
- Environment-based secret configuration

## 👩‍💻 Developer

**Vanishree S**

GitHub: [Vanishree-0704](https://github.com/Vanishree-0704)

Project Repository: [Spice Royale](https://github.com/Vanishree-0704/Spice-Royale)

---

*Spice Royale – Bringing delicious food closer to you!*
