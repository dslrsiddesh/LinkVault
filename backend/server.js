require("dotenv").config();
const express = require("express");
const cors = require("cors");
const path = require("path");

// Import Routes
const uploadRoutes = require("./src/routes/uploadRoutes");
const fileRoutes = require("./src/routes/fileRoutes");
const authRoutes = require("./src/routes/authRoutes");
const startCleanupJob = require("./src/utils/cleanupJob");
const db = require("./src/config/db");

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Register Routes
// If any of these "require" variables are undefined (due to missing exports), it crashes here.
app.use("/api/auth", authRoutes);
app.use("/api/upload", uploadRoutes);
app.use("/api/files", fileRoutes);

startCleanupJob();
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
