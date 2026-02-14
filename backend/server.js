require("dotenv").config();
const express = require("express");
const cors = require("cors");

const uploadRoutes = require("./src/routes/uploadRoutes");
const fileRoutes = require("./src/routes/fileRoutes");
const authRoutes = require("./src/routes/authRoutes");
const startCleanupJob = require("./src/utils/cleanupJob");
require("./src/config/db");

const app = express();

app.use(cors());
app.use(express.json());

app.use("/api/auth", authRoutes);
app.use("/api/upload", uploadRoutes);
app.use("/api/files", fileRoutes);

startCleanupJob();

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
