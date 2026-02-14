const sqlite3 = require("sqlite3").verbose();
const path = require("path");

const dbPath = path.resolve(__dirname, "../../database.sqlite");

const db = new sqlite3.Database(dbPath, (err) => {
  if (err) console.error("Failed to connect to database:", err.message);
  else console.log("Connected to SQLite database.");
});

// Create tables on first run
db.exec(
  `
  CREATE TABLE IF NOT EXISTS users (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    email TEXT UNIQUE NOT NULL,
    password_hash TEXT NOT NULL,
    full_name TEXT,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
  );

  CREATE TABLE IF NOT EXISTS uploads (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    user_id INTEGER,
    code TEXT UNIQUE NOT NULL,
    type TEXT CHECK(type IN ('text', 'file')) NOT NULL,
    text_content TEXT,
    file_path TEXT,
    original_name TEXT,
    mime_type TEXT,
    size_bytes INTEGER,
    password_hash TEXT,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    expires_at DATETIME NOT NULL,
    max_views INTEGER,
    view_count INTEGER DEFAULT 0,
    is_one_time INTEGER DEFAULT 0,
    FOREIGN KEY(user_id) REFERENCES users(id)
  );
  `,
  (err) => {
    if (err) console.error("Table init error:", err.message);
  },
);

module.exports = db;
