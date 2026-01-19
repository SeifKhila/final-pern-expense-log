require("dotenv").config();

const express = require("express");
const cors = require("cors");

const app = express();
const PORT = 4000;
const db = require("./db");

app.use(cors());
app.use(express.json());

// Temporary "database" (in-memory)
const users = [];
const sessions = {}; // ✅ FIX: define sessions

// Temporary "database" for expenses


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

app.get("/api/expenses", requireAuth, async (req, res, next) => {
  try {
    const result = await db.query(
      'SELECT id, user_id AS "userId", title, amount, date FROM expenses WHERE user_id = $1 ORDER BY date DESC, id DESC',
      [req.userId]
    );

    return res.json({ expenses: result.rows });
  } catch (err) {
    next(err);
  }
});


// CREATE expense
app.post("/api/expenses", requireAuth, async (req, res, next) => {
  try {
    const { title, amount, date } = req.body || {};

    if (!title || amount === undefined || amount === null || !date) {
      return res
        .status(400)
        .json({ message: "Title, amount, and date are required" });
    }

    const result = await db.query(
      'INSERT INTO expenses (user_id, title, amount, date) VALUES ($1, $2, $3, $4) RETURNING id, user_id AS "userId", title, amount, date',
      [req.userId, title, Number(amount), date]
    );

    return res.status(201).json({ expense: result.rows[0] });
  } catch (err) {
    next(err);
  }
});


// UPDATE expense (by id)
app.put("/api/expenses/:id", requireAuth, async (req, res, next) => {
  try {
    const id = Number(req.params.id);
    const { title, amount, date } = req.body || {};

    if (!title || amount === undefined || amount === null || !date) {
      return res
        .status(400)
        .json({ message: "Title, amount, and date are required" });
    }

    const result = await db.query(
      'UPDATE expenses SET title = $1, amount = $2, date = $3 WHERE id = $4 AND user_id = $5 RETURNING id, user_id AS "userId", title, amount, date',
      [title, Number(amount), date, id, req.userId]
    );

    if (result.rowCount === 0) {
      return res.status(404).json({ message: "Expense not found" });
    }

    return res.json({ expense: result.rows[0] });
  } catch (err) {
    next(err);
  }
});

app.delete("/api/expenses/:id", requireAuth, async (req, res, next) => {
  try {
    const id = Number(req.params.id);

    const result = await db.query(
      "DELETE FROM expenses WHERE id = $1 AND user_id = $2 RETURNING id",
      [id, req.userId]
    );

    if (result.rowCount === 0) {
      return res.status(404).json({ message: "Expense not found" });
    }

    return res.json({ message: "Expense deleted" });
  } catch (err) {
    next(err);
  }
});


// Error handler (keep LAST, before listen)
app.use((err, req, res, next) => {
  console.error(err);
  res.status(500).json({ message: "Server error" });
});

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
