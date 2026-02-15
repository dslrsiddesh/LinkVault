const express = require("express");
const router = express.Router();
const fileController = require("../controllers/fileController");
const authMiddleware = require("../middlewares/authMiddleware");

// Protected - requires login
router.get("/user/my-files", authMiddleware, fileController.getMyFiles);
router.delete("/:code", authMiddleware, fileController.deleteFile);

// Public - accessible by anyone with the link
router.get("/:code", fileController.getFile);
router.post("/:code", fileController.getFile);
router.get("/:code/download", fileController.downloadFile);

module.exports = router;
