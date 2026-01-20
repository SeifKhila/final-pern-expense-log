# PERN Expense Log (Codecademy Final Project)

This is my final Codecademy PERN project.  
It’s a simple expense tracker where users can register, log in, add expenses, edit them, delete them, and see a total summary.

## What it does
- Register + Login
- Add an expense (title, amount, date)
- Edit / Delete expenses
- Filter by range (all time / last 7 days / this month)
- Simple currency display (£ / €)
- Data is stored in Neon (PostgreSQL)

## Tech stack
- Frontend: React (CRA)
- Backend: Node + Express
- Database: PostgreSQL (Neon)
- Passwords: bcrypt
- Tests: Jest (backend API tests)

## How to run it locally

### 1) Backend
```bash
cd server
npm install
npm start

