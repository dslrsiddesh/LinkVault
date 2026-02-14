const fs = require("fs");
const path = require("path");
const db = require("../config/db");

// The Cleanup Function
const runCleanup = () => {
  console.log("[CLEANUP] Checking for expired files...");

  const now = new Date().toISOString();

  // Find expired files in DB
  const query = `SELECT * FROM uploads WHERE expires_at < ?`;

  db.all(query, [now], (err, rows) => {
    if (err) {
      console.error("[CLEANUP] DB Error:", err.message);
      return;
    }

    if (rows.length === 0) return;

    console.log(
      `🗑️  [CLEANUP] Found ${rows.length} expired files. Deleting...`,
    );

    rows.forEach((file) => {
      // 1. Delete from Disk
      if (file.file_path) {
        const filePath = path.resolve(__dirname, "../../", file.file_path);

        fs.unlink(filePath, (err) => {
          if (err && err.code !== "ENOENT") {
            console.error(`[CLEANUP] Failed to delete file: ${err.message}`);
          } else {
            console.log(
              `[CLEANUP] Deleted file from disk: ${file.original_name}`,
            );
          }
        });
      }

      // 2. Delete from Database
      db.run(`DELETE FROM uploads WHERE id = ?`, [file.id], (err) => {
        if (err)
          console.error(`[CLEANUP] Failed to delete DB record ${file.id}`);
      });
    });
  });
};

// Start the Interval
const startCleanupJob = () => {
  // Run immediately on server start
  runCleanup();

  // Then run every 60 seconds (1 minute)
  // 60 * 1000 ms = 1 minute
  // For production, change this to 60 * 60 * 1000 (1 hour)
  setInterval(runCleanup, 60 * 1000);

  console.log("[CLEANUP] Background job started (Runs every 1 min).");
};

module.exports = startCleanupJob;
