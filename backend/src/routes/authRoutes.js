const express = require("express");
const router = express.Router();
const authController = require("../controllers/authController");
const {
  validateRegister,
  validateLogin,
} = require("../middlewares/validationMiddleware"); // <--- Import

// Add middleware before the controller
router.post("/register", validateRegister, authController.register);
router.post("/login", validateLogin, authController.login);
// ... getMe route remains same

const authMiddleware = require("../middlewares/authMiddleware");
router.get("/me", authMiddleware, authController.getMe);

module.exports = router;
