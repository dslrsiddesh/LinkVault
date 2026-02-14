const db = require("../config/db");
const bcrypt = require("bcrypt");
const crypto = require("crypto");
const jwt = require("jsonwebtoken");

const SECRET_KEY = process.env.JWT_SECRET || "super-secret-key-change-this";

const generateCode = () => crypto.randomBytes(3).toString("hex");

// Extract user ID from auth header if present (upload works for both guests and logged-in users)
const getUserIdFromToken = (req) => {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith("Bearer ")) return null;

  try {
    return jwt.verify(authHeader.split(" ")[1], SECRET_KEY).id;
  } catch {
    return null;
  }
};

exports.uploadContent = async (req, res) => {
  try {
    const { type, content, password, expiry, maxViews, isOneTime } = req.body;
    const file = req.file;

    if (type === "text" && !content)
      return res.status(400).json({ error: "Text content missing" });
    if (type === "file" && !file)
      return res.status(400).json({ error: "File missing" });

    const code = generateCode();
    const passwordHash = password ? await bcrypt.hash(password, 10) : null;
    const minutes = expiry ? parseInt(expiry) : 10;
    const expiresAt = new Date(Date.now() + minutes * 60000).toISOString();
    const userId = getUserIdFromToken(req);

    const query = `
      INSERT INTO uploads
      (user_id, code, type, text_content, file_path, original_name, mime_type, size_bytes, password_hash, expires_at, max_views, is_one_time)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `;

    const values = [
      userId,
      code,
      type,
      content || null,
      file ? file.path : null,
      file ? file.originalname : null,
      file ? file.mimetype : null,
      file ? file.size : null,
      passwordHash,
      expiresAt,
      maxViews ? parseInt(maxViews) : null,
      isOneTime === "true" ? 1 : 0,
    ];

    db.run(query, values, function (err) {
      if (err) return res.status(500).json({ error: "Database error" });

      res.status(201).json({
        success: true,
        uniqueCode: code,
        expiresAt,
        message: "Secure link generated successfully",
      });
    });
  } catch (error) {
    res.status(500).json({ error: "Internal Server Error" });
  }
};
