// login.js
// -----------------------------------------------------------------
// Sends the owner's username/password to POST /api/admin/login.
// If it's correct, the backend remembers them via a session cookie,
// and we redirect to the dashboard.
// -----------------------------------------------------------------

const loginForm = document.getElementById("loginForm");
const loginError = document.getElementById("loginError");

loginForm.addEventListener("submit", async (e) => {
  e.preventDefault();
  loginError.textContent = "";

  const username = document.getElementById("username").value.trim();
  const password = document.getElementById("password").value;

  try {
    const res = await fetch("/api/admin/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ username, password }),
    });
    const data = await res.json();

    if (!res.ok) throw new Error(data.error || "Login failed.");

    window.location.href = "dashboard.html";
  } catch (err) {
    loginError.textContent = err.message;
  }
});

// If already logged in, skip straight to the dashboard.
(async () => {
  try {
    const res = await fetch("/api/admin/session");
    const data = await res.json();
    if (data.isAdmin) window.location.href = "dashboard.html";
  } catch (err) {
    // backend not reachable yet — do nothing, let them try to log in
  }
})();
