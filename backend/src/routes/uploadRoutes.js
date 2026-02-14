const express = require("express");
const router = express.Router();
const uploadMiddleware = require("../middlewares/uploadMiddleware");
const uploadController = require("../controllers/uploadController");
const { validateUpload } = require("../middlewares/validationMiddleware");

// Multer runs first (handles file), then our custom validator checks the body
router.post(
  "/",
  uploadMiddleware.single("file"),
  validateUpload,
  uploadController.uploadContent,
);

module.exports = router;
