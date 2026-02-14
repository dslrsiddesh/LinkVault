const express = require("express");
const router = express.Router();
const fileController = require("../controllers/fileController");
const authMiddleware = require("../middlewares/authMiddleware"); // <--- Import Auth

// PUBLIC ROUTES (Anyone can access)
router.get("/:code", fileController.getFile);
router.post("/:code", fileController.getFile); // Password protected view
router.get("/:code/download", fileController.downloadFile);

// PROTECTED ROUTES (Only logged in users)
// Note: '/my-files' must come BEFORE '/:code' to avoid conflict
router.get("/user/my-files", authMiddleware, fileController.getMyFiles);
router.delete("/:code", authMiddleware, fileController.deleteFile);

module.exports = router;
