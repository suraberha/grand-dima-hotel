// auth.js
// -----------------------------------------------------------------
// A "middleware" is just a function that runs BEFORE your route
// handler, and can either let the request continue (next()) or
// stop it (res.status(...).send(...)).
//
// We use this to protect admin-only routes: if nobody is logged in,
// we block the request instead of leaking hotel data.
// -----------------------------------------------------------------

function requireAdminLogin(req, res, next) {
  if (req.session && req.session.isAdmin) {
    // Logged in — let the request continue to the actual route.
    return next();
  }
  // Not logged in — reject with 401 Unauthorized.
  return res.status(401).json({ error: "Please log in as admin first." });
}

module.exports = { requireAdminLogin };
