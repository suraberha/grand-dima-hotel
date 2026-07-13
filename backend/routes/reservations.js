// routes/reservations.js
// -----------------------------------------------------------------
// Handles table reservations. Every reservation gets a short
// reference ID (like GD-7F3K9A) that the guest can use to identify
// themselves when they arrive — that ID is generated inside
// utils/db.js's addRecord() function.
// -----------------------------------------------------------------

const express = require("express");
const router = express.Router();
const { readData, addRecord, updateRecord, deleteRecord } = require("../utils/db");
const { requireAdminLogin } = require("../middleware/auth");

// POST /api/reservations -> guest submits a new reservation
router.post("/", (req, res) => {
  const { name, email, date, time, guests, phone, notes } = req.body;

  if (!name || !email || !date || !time) {
    return res.status(400).json({ error: "Name, email, date and time are required." });
  }

  const reservation = addRecord("reservations.json", {
    name,
    email,
    phone: phone || "",
    date,
    time,
    guests: guests || 1,
    notes: notes || "",
  });

  res.status(201).json({
    message: "Reservation confirmed! Please save your reference ID.",
    referenceId: reservation.id,
    reservation,
  });
});

// GET /api/reservations -> admin dashboard fetches all reservations
router.get("/", requireAdminLogin, (req, res) => {
  const reservations = readData("reservations.json");
  res.json(reservations.reverse());
});

// PATCH /api/reservations/:id -> admin confirms/cancels a reservation
router.patch("/:id", requireAdminLogin, (req, res) => {
  const { status } = req.body;
  const updated = updateRecord("reservations.json", req.params.id, { status });
  if (!updated) return res.status(404).json({ error: "Reservation not found." });
  res.json(updated);
});

// DELETE /api/reservations/:id -> admin removes a reservation
router.delete("/:id", requireAdminLogin, (req, res) => {
  const deleted = deleteRecord("reservations.json", req.params.id);
  if (!deleted) return res.status(404).json({ error: "Reservation not found." });
  res.json({ message: "Reservation deleted." });
});

module.exports = router;
