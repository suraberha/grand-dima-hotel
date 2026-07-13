// routes/menu.js
// -----------------------------------------------------------------
// Everything about GET /api/menu lives here.
// This route only READS data — guests never edit the menu themselves.
// -----------------------------------------------------------------

const express = require("express");
const router = express.Router();
const { readData } = require("../utils/db");

// GET /api/menu  -> returns the full list of food items
router.get("/", (req, res) => {
  const menu = readData("menu.json");
  res.json(menu);
});

module.exports = router;
