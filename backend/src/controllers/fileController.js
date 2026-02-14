const db = require("../config/db");
const path = require("path");
const fs = require("fs");
const bcrypt = require("bcrypt");

// Removes a file from disk and its record from the database
const deleteFilePermanently = (file) => {
  if (file.file_path) {
    const diskPath = path.resolve(__dirname, "../../", file.file_path);
    fs.unlink(diskPath, (err) => {
      if (err && err.code !== "ENOENT")
        console.error("Failed to delete file from disk:", err.message);
    });
  }

  db.run("DELETE FROM uploads WHERE id = ?", [file.id]);
};

// Check if the file should be destroyed after this view
const shouldBurn = (file, viewCount) => {
  if (file.max_views && viewCount >= file.max_views) return true;
  if (file.is_one_time && viewCount >= 1) return true;
  return false;
};

exports.getFile = (req, res) => {
  const { code } = req.params;
  const password = req.body?.password || null;

  db.get("SELECT * FROM uploads WHERE code = ?", [code], async (err, file) => {
    if (err || !file)
      return res.status(404).json({ error: "File not found or expired" });

    if (new Date(file.expires_at) < new Date())
      return res.status(410).json({ error: "This link has expired" });

    // Password gate
    if (file.password_hash) {
      if (!password)
        return res.status(403).json({ error: "Password required" });
      const match = await bcrypt.compare(password, file.password_hash);
      if (!match) return res.status(403).json({ error: "Incorrect password" });
    }

    if (file.type === "text") {
      const newViews = (file.view_count || 0) + 1;
      db.run("UPDATE uploads SET view_count = ? WHERE id = ?", [
        newViews,
        file.id,
      ]);

      res.json({
        id: file.id,
        type: "text",
        content: file.text_content,
        original_name: "Secure Text",
        created_at: file.created_at,
        view_count: newViews,
        max_views: file.max_views,
      });

      if (shouldBurn(file, newViews)) deleteFilePermanently(file);
    } else {
      // For files, return metadata only (download happens via separate endpoint)
      res.json({
        id: file.id,
        type: "file",
        original_name: file.original_name,
        size_bytes: file.size_bytes,
        mime_type: file.mime_type,
        isPasswordProtected: !!file.password_hash,
        view_count: file.view_count,
        max_views: file.max_views,
      });
    }
  });
};

exports.downloadFile = (req, res) => {
  const { code } = req.params;

  db.get("SELECT * FROM uploads WHERE code = ?", [code], (err, file) => {
    if (err || !file) return res.status(404).json({ error: "File not found" });

    if (new Date(file.expires_at) < new Date())
      return res.status(410).json({ error: "Link expired" });

    const diskPath = path.resolve(__dirname, "../../", file.file_path);
    if (!fs.existsSync(diskPath))
      return res.status(404).json({ error: "File missing from server" });

    const newViews = (file.view_count || 0) + 1;
    db.run("UPDATE uploads SET view_count = ? WHERE id = ?", [
      newViews,
      file.id,
    ]);

    res.setHeader(
      "Content-Disposition",
      `attachment; filename="${file.original_name}"`,
    );
    res.setHeader("Content-Type", file.mime_type || "application/octet-stream");

    const stream = fs.createReadStream(diskPath);
    stream.pipe(res);

    stream.on("end", () => {
      if (shouldBurn(file, newViews)) {
        setTimeout(() => deleteFilePermanently(file), 1000);
      }
    });

    stream.on("error", () => res.end());
  });
};

exports.getMyFiles = (req, res) => {
  db.all(
    "SELECT * FROM uploads WHERE user_id = ? ORDER BY created_at DESC",
    [req.user.id],
    (err, rows) => {
      if (err) return res.status(500).json({ error: "Database error" });
      res.json(rows);
    },
  );
};

exports.deleteFile = (req, res) => {
  const { code } = req.params;

  db.get(
    "SELECT * FROM uploads WHERE code = ? AND user_id = ?",
    [code, req.user.id],
    (err, file) => {
      if (err || !file)
        return res
          .status(404)
          .json({ error: "File not found or unauthorized" });

      deleteFilePermanently(file);
      res.json({ message: "File deleted successfully" });
    },
  );
};
