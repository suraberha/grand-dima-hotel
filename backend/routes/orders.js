// routes/orders.js
// -----------------------------------------------------------------
// Handles food orders placed from the Menu page.
// POST here = guest, GET here = admin dashboard only.
// -----------------------------------------------------------------

const express = require("express");
const router = express.Router();
const { readData, addRecord, updateRecord, deleteRecord } = require("../utils/db");
const { requireAdminLogin } = require("../middleware/auth");

// POST /api/orders  -> a guest places a new food order
router.post("/", (req, res) => {
  const { name, email, itemId, itemName, price, quantity, notes } = req.body;

  if (!name || !email || !itemId || !quantity) {
    return res.status(400).json({ error: "Missing required order details." });
  }

  const order = addRecord("orders.json", {
    name,
    email,
    itemId,
    itemName,
    price,
    quantity,
    notes: notes || "",
  });

  res.status(201).json({
    message: "Order received! We're preparing it now.",
    orderId: order.id,
    order,
  });
});

// GET /api/orders  -> admin dashboard fetches all orders
router.get("/", requireAdminLogin, (req, res) => {
  const orders = readData("orders.json");
  res.json(orders.reverse()); // newest first
});

// PATCH /api/orders/:id  -> admin updates an order's status
router.patch("/:id", requireAdminLogin, (req, res) => {
  const { status } = req.body;
  const updated = updateRecord("orders.json", req.params.id, { status });
  if (!updated) return res.status(404).json({ error: "Order not found." });
  res.json(updated);
});

// DELETE /api/orders/:id  -> admin removes an order
router.delete("/:id", requireAdminLogin, (req, res) => {
  const deleted = deleteRecord("orders.json", req.params.id);
  if (!deleted) return res.status(404).json({ error: "Order not found." });
  res.json({ message: "Order deleted." });
});

module.exports = router;
