const fs = require("fs");
const path = require("path");
const db = require("../config/db");

// Deletes expired uploads from disk and database
const runCleanup = () => {
  const now = new Date().toISOString();

  db.all("SELECT * FROM uploads WHERE expires_at < ?", [now], (err, rows) => {
    if (err || rows.length === 0) return;

    rows.forEach((file) => {
      if (file.file_path) {
        const diskPath = path.resolve(__dirname, "../../", file.file_path);
        fs.unlink(diskPath, () => {});
      }
      db.run("DELETE FROM uploads WHERE id = ?", [file.id]);
    });
  });
};

const startCleanupJob = () => {
  runCleanup();
  setInterval(runCleanup, 60 * 1000);
};

module.exports = startCleanupJob;
