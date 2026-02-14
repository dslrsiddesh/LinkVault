// A simple helper to check valid emails using Regex
const isValidEmail = (email) => {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
};

// 1. VALIDATE REGISTRATION
exports.validateRegister = (req, res, next) => {
  const { fullName, email, password } = req.body;
  const errors = [];

  // Name Check
  if (!fullName || fullName.trim().length < 2) {
    errors.push("Full Name must be at least 2 characters.");
  }

  // Email Check
  if (!email || !isValidEmail(email)) {
    errors.push("Please provide a valid email address.");
  }

  // Password Check
  if (!password || password.length < 6) {
    errors.push("Password must be at least 6 characters.");
  }

  if (errors.length > 0) {
    return res.status(400).json({ error: errors[0] }); // Return first error
  }

  next(); // Data is good, proceed to controller
};

// 2. VALIDATE LOGIN
exports.validateLogin = (req, res, next) => {
  const { email, password } = req.body;

  if (!email || !isValidEmail(email)) {
    return res.status(400).json({ error: "Invalid email address." });
  }

  if (!password) {
    return res.status(400).json({ error: "Password is required." });
  }

  next();
};

// 3. VALIDATE UPLOAD (Metadata)
exports.validateUpload = (req, res, next) => {
  const { type, content, expiry } = req.body;

  // Type Check
  if (type !== "text" && type !== "file") {
    return res.status(400).json({ error: "Invalid upload type." });
  }

  // Text Content Check
  if (type === "text") {
    if (!content || content.trim().length === 0) {
      return res.status(400).json({ error: "Text content cannot be empty." });
    }
    if (content.length > 100000) {
      // 100KB limit for text
      return res
        .status(400)
        .json({ error: "Text is too long (Max 100,000 chars)." });
    }
  }

  // Expiry Check (must be a number if provided)
  if (expiry && isNaN(expiry)) {
    return res.status(400).json({ error: "Expiry must be a valid number." });
  }

  next();
};
