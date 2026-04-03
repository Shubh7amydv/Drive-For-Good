const jwt = require("jsonwebtoken");
const { jwtSecret } = require("../config/env");
const { getDb } = require("../services/dataStore");

function authenticate(req, res, next) {
  const authHeader = req.headers.authorization || "";
  const token = authHeader.startsWith("Bearer ")
    ? authHeader.slice(7)
    : null;

  if (!token) {
    return res.status(401).json({ message: "Authentication required" });
  }

  try {
    const decoded = jwt.verify(token, jwtSecret);
    const db = getDb();
    const user = db.users.find((u) => u.id === decoded.userId);
    if (!user) {
      return res.status(401).json({ message: "User not found" });
    }
    req.user = user;
    next();
  } catch {
    return res.status(401).json({ message: "Invalid token" });
  }
}

function requireAdmin(req, res, next) {
  if (req.user.role !== "admin") {
    return res.status(403).json({ message: "Admin access required" });
  }
  next();
}

function requireActiveSubscription(req, res, next) {
  if (!req.user.subscription || req.user.subscription.status !== "active") {
    return res.status(403).json({ message: "Active subscription required" });
  }
  next();
}

module.exports = {
  authenticate,
  requireAdmin,
  requireActiveSubscription
};
