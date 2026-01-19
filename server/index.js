const express = require("express");
const cors = require("cors");

const app = express();
const PORT = 4000;

app.use(cors());
app.use(express.json());

// Temporary "database" (in-memory)
const users = [];
const sessions = {}; // ✅ FIX: define sessions

// Temporary "database" for expenses
const expenses = [];

app.get("/api/health", (req, res) => {
  res.json({ status: "ok" });
});

// Register
app.post("/api/auth/register", (req, res) => {
  const { email, password } = req.body || {};

  if (!email || !password) {
    return res.status(400).json({ message: "Email and password are required" });
  }

  const existingUser = users.find((user) => user.email === email);
  if (existingUser) {
    return res.status(409).json({ message: "User already exists" });
  }

  const newUser = {
    id: Date.now(),
    email,
    password,
  };

  users.push(newUser);
  return res.status(201).json({ message: "User registered successfully" });
});

// Login
app.post("/api/auth/login", (req, res) => {
  const { email, password } = req.body || {};

  if (!email || !password) {
    return res.status(400).json({ message: "Email and password are required" });
  }

  const user = users.find((u) => u.email === email);
  if (!user || user.password !== password) {
    return res.status(401).json({ message: "Invalid email or password" });
  }

  const token = `fake-token-${Date.now()}`;

  // ✅ FIX: save the session properly
  sessions[token] = { userId: user.id };

  return res.json({ token });
});

function requireAuth(req, res, next) {
  const authHeader = req.headers.authorization || "";

  if (!authHeader.startsWith("Bearer ")) {
    return res.status(401).json({ message: "Missing or invalid token" });
  }

  const token = authHeader.slice(7); // remove "Bearer "

  const session = sessions[token];
  if (!session) {
    return res
      .status(401)
      .json({ message: "Session expired - please log in again" });
  }

  req.userId = session.userId; // ✅ attach the logged-in user
  next();
}

// GET expenses (for the logged in user)
app.get("/api/expenses", requireAuth, (req, res) => {
  const userExpenses = expenses.filter((e) => e.userId === req.userId);
  return res.json({ expenses: userExpenses });
});

// CREATE expense
app.post("/api/expenses", requireAuth, (req, res) => {
  const { title, amount, date } = req.body || {};

  if (!title || amount === undefined || amount === null || !date) {
    return res.status(400).json({ message: "Title, amount, and date are required" });
  }

  const newExpense = {
    id: Date.now(),
    userId: req.userId,
    title,
    amount: Number(amount),
    date,
  };

  expenses.push(newExpense);
  return res.status(201).json({ expense: newExpense });
});

// UPDATE expense (by id)
app.put("/api/expenses/:id", requireAuth, (req, res) => {
  const id = Number(req.params.id);
  const { title, amount, date } = req.body || {};

  if (!title || amount === undefined || amount === null || !date) {
    return res.status(400).json({ message: "Title, amount, and date are required" });
  }

  // ✅ FIX: ensure user can only edit their own expense
  const expense = expenses.find((e) => e.id === id && e.userId === req.userId);

  if (!expense) {
    return res.status(404).json({ message: "Expense not found" });
  }

  expense.title = title;
  expense.amount = Number(amount);
  expense.date = date;

  return res.json({ expense });
});

// DELETE expense (by id)
app.delete("/api/expenses/:id", requireAuth, (req, res) => {
  const id = Number(req.params.id);

  const index = expenses.findIndex((e) => e.id === id && e.userId === req.userId);
  if (index === -1) {
    return res.status(404).json({ message: "Expense not found" });
  }

  expenses.splice(index, 1);
  return res.json({ message: "Expense deleted" });
});

// Error handler (keep LAST, before listen)
app.use((err, req, res, next) => {
  console.error(err);
  res.status(500).json({ message: "Server error" });
});

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
