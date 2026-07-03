const express = require("express");
const { signToken, requireAuth } = require("../middleware/auth");

const router = express.Router();

// Single-admin login backed by env credentials. Returns a JWT the admin
// panel stores in localStorage and sends on every write request.
router.post("/login", (req, res) => {
  const { username, password } = req.body || {};
  const expectedUser = process.env.ADMIN_USERNAME || "admin";
  const expectedPass = process.env.ADMIN_PASSWORD || "admin";

  if (username === expectedUser && password === expectedPass) {
    const token = signToken({ user: username, role: "admin" });
    return res.json({ token, user: username });
  }
  res.status(401).json({ error: "Invalid username or password" });
});

// Lets the panel check whether a stored token is still valid on load.
router.get("/me", requireAuth, (req, res) => {
  res.json({ user: req.admin.user, role: req.admin.role });
});

module.exports = router;
