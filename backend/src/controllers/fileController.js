const db = require("../config/db");
const path = require("path");
const fs = require("fs");

// Helper: Delete file from Disk and DB
const deleteFilePermanently = (file) => {
  console.log(`🔥 [BURN] Limit reached for ${file.code}. Deleting...`);

  // 1. Delete from Disk
  if (file.file_path) {
    const filePath = path.resolve(__dirname, "../../", file.file_path);
    fs.unlink(filePath, (err) => {
      if (err && err.code !== "ENOENT")
        console.error("Error deleting file from disk:", err.message);
    });
  }

  // 2. Delete from DB
  db.run("DELETE FROM uploads WHERE id = ?", [file.id], (err) => {
    if (err) console.error("Error deleting from DB:", err.message);
    else console.log(`✅ [BURN] File ${file.code} destroyed.`);
  });
};

// 1. GET METADATA / TEXT CONTENT
exports.getFile = (req, res) => {
  const { code } = req.params;
  const { password } = req.body; // For password protected text

  db.get("SELECT * FROM uploads WHERE code = ?", [code], (err, file) => {
    if (err || !file)
      return res.status(404).json({ error: "File not found or expired" });

    // Check Expiry
    if (new Date(file.expires_at) < new Date()) {
      return res.status(410).json({ error: "This link has expired" });
    }

    // Check Password
    if (file.password && file.password !== password) {
      return res.status(403).json({ error: "Password required" });
    }

    // Logic: If it's a TEXT file, viewing it counts as a "View/Download"
    if (file.type === "text") {
      // Increment View Count
      const newViews = (file.view_count || 0) + 1;
      db.run("UPDATE uploads SET view_count = ? WHERE id = ?", [
        newViews,
        file.id,
      ]);

      // Send Response
      res.json({
        id: file.id,
        type: "text",
        content: file.text_content, // Send content only if password matches
        original_name: "Secure Text",
        created_at: file.created_at,
        view_count: newViews,
        max_views: file.max_views,
      });

      // CHECK BURN LOGIC (Delete if limit reached)
      if (file.max_views && newViews >= file.max_views) {
        deleteFilePermanently(file);
      }
    } else {
      // If it's a FILE, we just return metadata (actual download is separate)
      // We do NOT increment view count here, only on actual download.
      res.json({
        id: file.id,
        type: "file",
        original_name: file.original_name,
        size_bytes: file.size_bytes,
        mime_type: file.mime_type,
        isPasswordProtected: !!file.password,
        view_count: file.view_count,
        max_views: file.max_views,
      });
    }
  });
};

// 2. DOWNLOAD FILE
exports.downloadFile = (req, res) => {
  const { code } = req.params;

  db.get("SELECT * FROM uploads WHERE code = ?", [code], (err, file) => {
    if (err || !file) return res.status(404).json({ error: "File not found" });

    // Check Expiry
    if (new Date(file.expires_at) < new Date()) {
      return res.status(410).json({ error: "Link expired" });
    }

    const filePath = path.resolve(__dirname, "../../", file.file_path);

    if (!fs.existsSync(filePath)) {
      return res.status(404).json({ error: "File missing from server" });
    }

    // Increment View Count
    const newViews = (file.view_count || 0) + 1;
    db.run("UPDATE uploads SET view_count = ? WHERE id = ?", [
      newViews,
      file.id,
    ]);

    // Set Headers
    res.setHeader(
      "Content-Disposition",
      `attachment; filename="${file.original_name}"`,
    );
    res.setHeader("Content-Type", file.mime_type || "application/octet-stream");

    // Create Stream
    const stream = fs.createReadStream(filePath);
    stream.pipe(res);

    // CHECK BURN LOGIC (Delete AFTER download finishes)
    stream.on("end", () => {
      if (file.max_views && newViews >= file.max_views) {
        // Wait a tiny bit to ensure connection closes, then nuke it
        setTimeout(() => deleteFilePermanently(file), 1000);
      }
    });

    stream.on("error", (err) => {
      console.error("Stream error:", err);
      res.end();
    });
  });
};

// 3. GET USER FILES (Dashboard)
exports.getMyFiles = (req, res) => {
  const userId = req.user.id;
  db.all(
    "SELECT * FROM uploads WHERE user_id = ? ORDER BY created_at DESC",
    [userId],
    (err, rows) => {
      if (err) return res.status(500).json({ error: "Database error" });
      res.json(rows);
    },
  );
};

// 4. DELETE FILE (Manual)
exports.deleteFile = (req, res) => {
  const { code } = req.params;
  const userId = req.user.id;

  db.get(
    "SELECT * FROM uploads WHERE code = ? AND user_id = ?",
    [code, userId],
    (err, file) => {
      if (err || !file)
        return res
          .status(404)
          .json({ error: "File not found or unauthorized" });

      deleteFilePermanently(file); // Reuse our helper
      res.json({ message: "File deleted successfully" });
    },
  );
};
