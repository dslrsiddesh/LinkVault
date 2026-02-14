const db = require("../config/db");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

const SECRET_KEY = process.env.JWT_SECRET || "super-secret-key-change-this";

exports.register = async (req, res) => {
  const { fullName, email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ error: "Email and password are required" });
  }

  try {
    const hash = await bcrypt.hash(password, 10);
    const query = `INSERT INTO users (full_name, email, password_hash) VALUES (?, ?, ?)`;

    db.run(query, [fullName, email, hash], function (err) {
      if (err) {
        if (err.message.includes("UNIQUE")) {
          return res.status(400).json({ error: "Email already exists" });
        }
        return res.status(500).json({ error: "Database error" });
      }

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
    res.status(500).json({ error: "Server error" });
  }
};

exports.login = (req, res) => {
  const { email, password } = req.body;

  db.get(`SELECT * FROM users WHERE email = ?`, [email], async (err, user) => {
    if (err) return res.status(500).json({ error: "Database error" });
    if (!user)
      return res.status(401).json({ error: "Invalid email or password" });

    const match = await bcrypt.compare(password, user.password_hash);
    if (!match)
      return res.status(401).json({ error: "Invalid email or password" });

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

exports.getMe = (req, res) => {
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
