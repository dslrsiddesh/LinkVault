const jwt = require("jsonwebtoken");
const SECRET_KEY = process.env.JWT_SECRET || "super-secret-key-change-this";

const authMiddleware = (req, res, next) => {
  // Expect header: "Authorization: Bearer <token>"
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return res.status(401).json({ error: "Unauthorized: No token provided" });
  }

  const token = authHeader.split(" ")[1];

  try {
    const decoded = jwt.verify(token, SECRET_KEY);
    req.user = decoded; // Attach user info {id, email} to the request
    next(); // Allowed to proceed
  } catch (error) {
    return res.status(403).json({ error: "Forbidden: Invalid token" });
  }
};

module.exports = authMiddleware;
