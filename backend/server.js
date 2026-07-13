// server.js
// -----------------------------------------------------------------
// This is the starting point of the backend. Running "npm start"
// runs THIS file. It:
//   1. Sets up Express (our web server framework)
//   2. Serves the frontend and admin HTML/CSS/JS as static files
//   3. Wires up the /api/... routes for each feature
//   4. Starts listening for requests
// -----------------------------------------------------------------

require("dotenv").config();
const express = require("express");
const session = require("express-session");
const cors = require("cors");
const path = require("path");

const menuRoutes = require("./routes/menu");
const orderRoutes = require("./routes/orders");
const reservationRoutes = require("./routes/reservations");
const contactRoutes = require("./routes/contact");
const adminRoutes = require("./routes/admin");

const app = express();
const PORT = process.env.PORT || 3000;

// --- Core middleware -------------------------------------------------
app.use(cors());
app.use(express.json()); // lets us read JSON bodies sent by fetch()

app.use(
  session({
    secret: process.env.SESSION_SECRET || "dev-secret-change-me",
    resave: false,
    saveUninitialized: false,
    cookie: {
      httpOnly: true,
      maxAge: 1000 * 60 * 60 * 4, // 4 hours
    },
  })
);

// --- Serve the static websites ---------------------------------------
// Guest-facing site: http://localhost:3000/
app.use("/", express.static(path.join(__dirname, "..", "frontend")));
// Owner dashboard:   http://localhost:3000/admin/
app.use("/admin", express.static(path.join(__dirname, "..", "admin")));

// --- API routes --------------------------------------------------------
app.use("/api/menu", menuRoutes);
app.use("/api/orders", orderRoutes);
app.use("/api/reservations", reservationRoutes);
app.use("/api/contact", contactRoutes);
app.use("/api/admin", adminRoutes);

// --- Start the server ---------------------------------------------------
app.listen(PORT, () => {
  console.log(`\nGrand Dima Hotel server running!`);
  console.log(`Website:  http://localhost:${PORT}`);
  console.log(`Admin:    http://localhost:${PORT}/admin/login.html\n`);
});
