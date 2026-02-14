const db = require("../config/db");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

const SECRET_KEY = process.env.JWT_SECRET || "super-secret-key-change-this";

// 1. REGISTER
exports.register = async (req, res) => {
  console.log("📝 Register Request Received:", req.body); // Log input

  const { fullName, email, password } = req.body;

  if (!email || !password) {
    console.log("❌ Missing fields");
    return res.status(400).json({ error: "Email and password are required" });
  }

  try {
    // Log before hashing
    console.log("🔐 Hashing password...");
    const hash = await bcrypt.hash(password, 10);
    console.log("✅ Password hashed.");

    const query = `INSERT INTO users (full_name, email, password_hash) VALUES (?, ?, ?)`;

    db.run(query, [fullName, email, hash], function (err) {
      if (err) {
        console.error("❌ Database Insert Error:", err.message); // <--- THIS IS KEY
        if (err.message.includes("UNIQUE")) {
          return res.status(400).json({ error: "Email already exists" });
        }
        return res
          .status(500)
          .json({ error: "Database error: " + err.message });
      }

      console.log("✅ User inserted with ID:", this.lastID);

      const token = jwt.sign({ id: this.lastID, email }, SECRET_KEY, {
        expiresIn: "7d",
      });

      res.status(201).json({
        success: true,
        token,
        user: { id: this.lastID, fullName, email },
      });
    });
  } catch (error) {
    console.error("🔥 CRITICAL SERVER ERROR:", error); // <--- THIS WILL SHOW THE REAL BUG
    res.status(500).json({ error: "Server error: " + error.message });
  }
};

// 2. LOGIN
exports.login = (req, res) => {
  const { email, password } = req.body;

  db.get(`SELECT * FROM users WHERE email = ?`, [email], async (err, user) => {
    if (err) return res.status(500).json({ error: "Database error" });
    if (!user)
      return res.status(401).json({ error: "Invalid email or password" });

    const match = await bcrypt.compare(password, user.password_hash);
    if (!match)
      return res.status(401).json({ error: "Invalid email or password" });

    // Success: Generate Token
    const token = jwt.sign({ id: user.id, email: user.email }, SECRET_KEY, {
      expiresIn: "7d",
    });

    res.json({
      success: true,
      token,
      user: { id: user.id, fullName: user.full_name, email: user.email },
    });
  });
};

// 3. GET CURRENT USER (For Frontend to check if logged in)
exports.getMe = (req, res) => {
  // req.user is set by the middleware (we will build this next)
  db.get(
    `SELECT id, full_name, email FROM users WHERE id = ?`,
    [req.user.id],
    (err, user) => {
      if (err || !user)
        return res.status(404).json({ error: "User not found" });
      res.json(user);
    },
  );
};
