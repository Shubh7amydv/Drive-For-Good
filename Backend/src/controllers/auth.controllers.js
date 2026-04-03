const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const { registerSchema, loginSchema } = require("../models/validators");
const { getDb, saveDb } = require("../services/dataStore");
const { jwtSecret, jwtExpiresIn } = require("../config/env");

function signToken(user) {
  return jwt.sign({ userId: user.id, role: user.role }, jwtSecret, {
    expiresIn: jwtExpiresIn
  });
}

async function register(req, res) {
  const parsed = registerSchema.safeParse(req.body);
  if (!parsed.success) {
    return res.status(400).json({ message: parsed.error.errors[0]?.message || "Invalid request" });
  }

  const db = getDb();
  const { name, email, password, charityId, charityPercent } = parsed.data;
  const existing = db.users.find((u) => u.email.toLowerCase() === email.toLowerCase());
  if (existing) {
    return res.status(409).json({ message: "Email already registered" });
  }

  const passwordHash = await bcrypt.hash(password, 10);
  const user = {
    id: `user_${Date.now()}`,
    name,
    email,
    passwordHash,
    role: "user",
    charityId: charityId || null,
    charityPercent: charityPercent || 10,
    independentDonation: 0,
    scores: [],
    winningsTotal: 0,
    subscription: {
      plan: null,
      status: "inactive",
      renewalDate: null
    },
    createdAt: new Date().toISOString()
  };

  db.users.push(user);
  saveDb();

  const token = signToken(user);
  return res.status(201).json({ token, user: sanitizeUser(user) });
}

async function login(req, res) {
  const parsed = loginSchema.safeParse(req.body);
  if (!parsed.success) {
    return res.status(400).json({ message: "Invalid credentials" });
  }

  const db = getDb();
  const user = db.users.find((u) => u.email.toLowerCase() === parsed.data.email.toLowerCase());
  if (!user) {
    return res.status(401).json({ message: "Invalid credentials" });
  }

  const valid = await bcrypt.compare(parsed.data.password, user.passwordHash);
  if (!valid) {
    return res.status(401).json({ message: "Invalid credentials" });
  }

  const token = signToken(user);
  return res.json({ token, user: sanitizeUser(user) });
}

function me(req, res) {
  return res.json({ user: sanitizeUser(req.user) });
}

function sanitizeUser(user) {
  const { passwordHash, ...clean } = user;
  return clean;
}

module.exports = {
  register,
  login,
  me
};
