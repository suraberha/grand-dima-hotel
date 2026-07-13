// routes/admin.js
// -----------------------------------------------------------------
// Handles the owner's login/logout, and a quick summary endpoint
// the dashboard uses to show counts at the top of the page.
// -----------------------------------------------------------------

const express = require("express");
const router = express.Router();
const { readData } = require("../utils/db");

// POST /api/admin/login -> owner logs in
router.post("/login", (req, res) => {
  const { username, password } = req.body;

  const validUsername = process.env.ADMIN_USERNAME;
  const validPassword = process.env.ADMIN_PASSWORD;

  if (username === validUsername && password === validPassword) {
    req.session.isAdmin = true;
    return res.json({ message: "Welcome back!" });
  }

  return res.status(401).json({ error: "Incorrect username or password." });
});

// POST /api/admin/logout -> owner logs out
router.post("/logout", (req, res) => {
  req.session.destroy(() => {
    res.json({ message: "Logged out." });
  });
});

// GET /api/admin/session -> check if still logged in (used on dashboard load)
router.get("/session", (req, res) => {
  res.json({ isAdmin: Boolean(req.session && req.session.isAdmin) });
});

// GET /api/admin/summary -> counts for the dashboard's top cards
router.get("/summary", (req, res) => {
  if (!req.session || !req.session.isAdmin) {
    return res.status(401).json({ error: "Please log in as admin first." });
  }

  const reservations = readData("reservations.json");
  const orders = readData("orders.json");
  const contacts = readData("contacts.json");

  res.json({
    totalReservations: reservations.length,
    pendingReservations: reservations.filter((r) => r.status === "pending").length,
    totalOrders: orders.length,
    pendingOrders: orders.filter((o) => o.status === "pending").length,
    totalMessages: contacts.length,
  });
});

module.exports = router;
