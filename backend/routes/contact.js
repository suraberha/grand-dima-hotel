// routes/contact.js
// -----------------------------------------------------------------
// Handles the simple Contact page: name, email, phone, message.
// -----------------------------------------------------------------

const express = require("express");
const router = express.Router();
const { readData, addRecord, deleteRecord } = require("../utils/db");
const { requireAdminLogin } = require("../middleware/auth");

// POST /api/contact -> guest sends a message
router.post("/", (req, res) => {
  const { name, email, phone, message } = req.body;

  if (!name || !email || !message) {
    return res.status(400).json({ error: "Name, email and message are required." });
  }

  const contact = addRecord("contacts.json", { name, email, phone: phone || "", message });

  res.status(201).json({
    message: "Thanks for reaching out! We'll reply within 24 hours.",
    contact,
  });
});

// GET /api/contact -> admin dashboard fetches all messages
router.get("/", requireAdminLogin, (req, res) => {
  const contacts = readData("contacts.json");
  res.json(contacts.reverse());
});

// DELETE /api/contact/:id -> admin removes a message
router.delete("/:id", requireAdminLogin, (req, res) => {
  const deleted = deleteRecord("contacts.json", req.params.id);
  if (!deleted) return res.status(404).json({ error: "Message not found." });
  res.json({ message: "Message deleted." });
});

module.exports = router;
