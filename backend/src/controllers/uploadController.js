const db = require("../config/db");
const bcrypt = require("bcrypt");
const crypto = require("crypto");
const jwt = require("jsonwebtoken");

const SECRET_KEY = process.env.JWT_SECRET || "super-secret-key-change-this";

// 1. Helper: Generate 6-char random code (THIS WAS MISSING)
const generateCode = () => {
  return crypto.randomBytes(3).toString("hex"); // e.g., 'a1b2c3'
};

// 2. Helper: Get User ID from Token
const getUserIdFromToken = (req) => {
  const authHeader = req.headers.authorization;
  if (authHeader && authHeader.startsWith("Bearer ")) {
    const token = authHeader.split(" ")[1];
    try {
      const decoded = jwt.verify(token, SECRET_KEY);
      return decoded.id;
    } catch (e) {
      return null;
    }
  }
  return null;
};

// 3. Upload Logic
exports.uploadContent = async (req, res) => {
  try {
    const { type, content, password, expiry, maxViews, isOneTime } = req.body;
    const file = req.file;

    // Validation
    if (type === "text" && !content)
      return res.status(400).json({ error: "Text content missing" });
    if (type === "file" && !file)
      return res.status(400).json({ error: "File missing" });

    // Generate Data
    const code = generateCode(); // <--- Now this will work

    let passwordHash = null;
    if (password) {
      passwordHash = await bcrypt.hash(password, 10);
    }

    const minutes = expiry ? parseInt(expiry) : 10;
    const expiresAt = new Date(Date.now() + minutes * 60000).toISOString();

    const filePath = file ? file.path : null;
    const originalName = file ? file.originalname : null;
    const mimeType = file ? file.mimetype : null;
    const sizeBytes = file ? file.size : null;

    // Get User ID (Nullable)
    const userId = getUserIdFromToken(req);

    // Insert into DB
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
      filePath,
      originalName,
      mimeType,
      sizeBytes,
      passwordHash,
      expiresAt,
      maxViews ? parseInt(maxViews) : null,
      isOneTime === "true" ? 1 : 0,
    ];

    db.run(query, values, function (err) {
      if (err) {
        console.error("Database Error:", err.message);
        return res.status(500).json({ error: "Database error" });
      }

      res.status(201).json({
        success: true,
        uniqueCode: code,
        expiresAt: expiresAt,
        message: "Secure link generated successfully",
      });
    });
  } catch (error) {
    console.error("Server Error:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};
