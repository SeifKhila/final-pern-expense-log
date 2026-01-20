# PERN Expense Log App

This is a full-stack expense tracking application built as part of my
Codecademy Full-Stack Engineer course.

Before starting to code, I planned the front-end structure first so I could
clearly understand what pages and components were needed and how data would
flow through the app. This helped avoid confusion later and made the build
much smoother.

The project is focused on building a clean and simple PERN application with
authentication, protected routes, and PostgreSQL persistence.

---

## Tech Stack
- React (frontend)
- Node.js & Express (backend)
- PostgreSQL (Neon)
- JWT authentication
- Fetch API
- Custom CSS

---

## Main Features
- User registration and login
- Authentication with protected routes
- Dashboard for managing expenses
- Expenses scoped per logged-in user
- Data persisted in PostgreSQL
- Clear separation between client and server

---

## Pages (Routes)

The application has three main pages:

**Register Page**  
Allows a new user to create an account.

**Login Page**  
Allows an existing user to log in and receive an authentication token.

**Dashboard Page (/app)**  
The main page of the application where the user can view and manage their
expenses. This page is protected and only accessible when logged in.

---

## Project Structure

decide where state should live

reduce unnecessary refactoring later

make the application easier to explain in interviews

---

## Running the App Locally

### 1. Clone the repository
```bash
git clone https://github.com/SeifKhila/final-pern-expense-log.git
cd final-pern-expense-log

2. Install dependencies

cd client
npm install
cd ../server
npm install

3. Environment variables

Create a .env file inside the server folder with:

DATABASE_URL=your_postgres_url
JWT_SECRET=your_secret

4. Run the application

# start the server
npm run dev

# start the client (new terminal)
npm start

What I Learned

* How to structure a full-stack PERN application

* Handling authentication and protected routes

* Connecting a React frontend to a PostgreSQL backend

* Managing user-specific data securely

* Debugging issues across the full stack

* This project helped solidify my understanding of how a full-stack application
works from frontend to database.



