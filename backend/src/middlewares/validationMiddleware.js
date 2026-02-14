const isValidEmail = (email) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);

exports.validateRegister = (req, res, next) => {
  const { fullName, email, password } = req.body;
  const errors = [];

  if (!fullName || fullName.trim().length < 2)
    errors.push("Full Name must be at least 2 characters.");
  if (!email || !isValidEmail(email))
    errors.push("Please provide a valid email address.");
  if (!password || password.length < 6)
    errors.push("Password must be at least 6 characters.");

  if (errors.length > 0) return res.status(400).json({ error: errors[0] });
  next();
};

exports.validateLogin = (req, res, next) => {
  const { email, password } = req.body;

  if (!email || !isValidEmail(email))
    return res.status(400).json({ error: "Invalid email address." });
  if (!password)
    return res.status(400).json({ error: "Password is required." });

  next();
};

exports.validateUpload = (req, res, next) => {
  const { type, content, expiry } = req.body;

  if (type !== "text" && type !== "file")
    return res.status(400).json({ error: "Invalid upload type." });

  if (type === "text") {
    if (!content || content.trim().length === 0)
      return res.status(400).json({ error: "Text content cannot be empty." });
    if (content.length > 100000)
      return res
        .status(400)
        .json({ error: "Text is too long (Max 100,000 chars)." });
  }

  if (expiry && isNaN(expiry))
    return res.status(400).json({ error: "Expiry must be a valid number." });

  next();
};
