require("dotenv").config();

const express = require("express");
const cors = require("cors");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

const db = require("./db");

const app = express();

// Render sets PORT for you in production, local falls back to 4000
const PORT = process.env.PORT || 4000;

app.use(cors());
app.use(express.json());

// quick check route so we know the API is alive
app.get("/api/health", (req, res) => {
  res.json({ status: "ok" });
});

/**
 * AUTH
 * - Register: create a user + store hashed password
 * - Login: check password + return a JWT token
 */

// Register
app.post("/api/auth/register", async (req, res, next) => {
  try {
    const { email, password } = req.body || {};

    // basic input check (keep it simple)
    if (!email || !password) {
      return res.status(400).json({ message: "Email and password are required" });
    }

    // if email already exists, don't create another account
    const existing = await db.query("SELECT id FROM users WHERE email = $1", [email]);
    if (existing.rowCount > 0) {
      return res.status(409).json({ message: "User already exists" });
    }

    // hash the password so we never store plain text passwords
    const passwordHash = await bcrypt.hash(password, 10);

    // create the user in the DB
    const result = await db.query(
      "INSERT INTO users (email, password_hash) VALUES ($1, $2) RETURNING id, email",
      [email, passwordHash]
    );

    return res
      .status(201)
      .json({ message: "User registered successfully", user: result.rows[0] });
  } catch (err) {
    next(err);
  }
});

// Login
app.post("/api/auth/login", async (req, res, next) => {
  try {
    const { email, password } = req.body || {};

    if (!email || !password) {
      return res.status(400).json({ message: "Email and password are required" });
    }

    // find user by email
    const result = await db.query(
      "SELECT id, email, password_hash FROM users WHERE email = $1",
      [email]
    );

    // don’t say which part is wrong (email vs password) — just keep it generic
    if (result.rowCount === 0) {
      return res.status(401).json({ message: "Invalid email or password" });
    }

    const user = result.rows[0];

    // compare input password to the stored hash
    const matches = await bcrypt.compare(password, user.password_hash);
    if (!matches) {
      return res.status(401).json({ message: "Invalid email or password" });
    }

    // JWT = our “proof you’re logged in”
    // we sign it with JWT_SECRET so nobody can fake it
    const token = jwt.sign(
      { userId: user.id },
      process.env.JWT_SECRET,
      { expiresIn: "7d" }
    );

    return res.json({ token });
  } catch (err) {
    next(err);
  }
});

/**
 * AUTH MIDDLEWARE
 * If token is valid, we attach userId to req so routes can use it.
 */
function requireAuth(req, res, next) {
  const authHeader = req.headers.authorization || "";

  // expecting: Authorization: Bearer <token>
  if (!authHeader.startsWith("Bearer ")) {
    return res.status(401).json({ message: "Missing or invalid token" });
  }

  const token = authHeader.slice(7);

  try {
    const payload = jwt.verify(token, process.env.JWT_SECRET);

    // this is how we know who's making the request
    req.userId = payload.userId;

    next();
  } catch (err) {
    return res.status(401).json({ message: "Invalid or expired token" });
  }
}

/**
 * EXPENSES
 * All routes are protected and only return data for the logged-in user.
 */

// READ all expenses
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
      return res.status(400).json({ message: "Title, amount, and date are required" });
    }

    const parsedAmount = Number(amount);
    if (Number.isNaN(parsedAmount)) {
      return res.status(400).json({ message: "Amount must be a number" });
    }

    const result = await db.query(
      'INSERT INTO expenses (user_id, title, amount, date) VALUES ($1, $2, $3, $4) RETURNING id, user_id AS "userId", title, amount, date',
      [req.userId, title, parsedAmount, date]
    );

    return res.status(201).json({ expense: result.rows[0] });
  } catch (err) {
    next(err);
  }
});

// UPDATE expense
app.put("/api/expenses/:id", requireAuth, async (req, res, next) => {
  try {
    const id = Number(req.params.id);
    const { title, amount, date } = req.body || {};

    if (!title || amount === undefined || amount === null || !date) {
      return res.status(400).json({ message: "Title, amount, and date are required" });
    }

    const parsedAmount = Number(amount);
    if (Number.isNaN(parsedAmount)) {
      return res.status(400).json({ message: "Amount must be a number" });
    }

    const result = await db.query(
      'UPDATE expenses SET title = $1, amount = $2, date = $3 WHERE id = $4 AND user_id = $5 RETURNING id, user_id AS "userId", title, amount, date',
      [title, parsedAmount, date, id, req.userId]
    );

    if (result.rowCount === 0) {
      return res.status(404).json({ message: "Expense not found" });
    }

    return res.json({ expense: result.rows[0] });
  } catch (err) {
    next(err);
  }
});

// DELETE expense
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

// basic error handler (keep this last)
app.use((err, req, res, next) => {
  console.error(err);
  res.status(500).json({ message: "Server error" });
});

// only listen when running directly (makes testing easier)
if (require.main === module) {
 const PORT = process.env.PORT || 4000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

}

module.exports = app;


