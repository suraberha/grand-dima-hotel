// dashboard.js
// -----------------------------------------------------------------
// Powers the owner dashboard:
//   1. Confirms the owner is logged in (redirects to login if not)
//   2. Loads summary counts + reservations + orders + messages
//   3. Lets the owner confirm/cancel/delete each record
// -----------------------------------------------------------------

// ---- 0. Must be logged in to see this page -----------------------------
(async function checkSession() {
  try {
    const res = await fetch("/api/admin/session");
    const data = await res.json();
    if (!data.isAdmin) {
      window.location.href = "login.html";
      return;
    }
    loadEverything();
  } catch (err) {
    window.location.href = "login.html";
  }
})();

document.getElementById("logoutBtn").addEventListener("click", async () => {
  await fetch("/api/admin/logout", { method: "POST" });
  window.location.href = "login.html";
});

// ---- Sidebar smooth-scroll to each section -------------------------------
document.querySelectorAll(".side-link").forEach((link) => {
  link.addEventListener("click", (e) => {
    e.preventDefault();
    document.querySelectorAll(".side-link").forEach((l) => l.classList.remove("active"));
    link.classList.add("active");
    document.getElementById(`${link.dataset.section}Section`)?.scrollIntoView({ behavior: "smooth" });
  });
});

// ---- Load everything ------------------------------------------------------
async function loadEverything() {
  document.getElementById("statToday").textContent = new Date().toLocaleDateString(undefined, {
    weekday: "short", month: "short", day: "numeric",
  });
  await Promise.all([loadSummary(), loadReservations(), loadOrders(), loadMessages()]);
}

async function loadSummary() {
  const res = await fetch("/api/admin/summary");
  const data = await res.json();

  document.getElementById("statTotalReservations").textContent = data.totalReservations;
  document.getElementById("statPendingReservations").textContent = `${data.pendingReservations} pending`;
  document.getElementById("statTotalOrders").textContent = data.totalOrders;
  document.getElementById("statPendingOrders").textContent = `${data.pendingOrders} pending`;
  document.getElementById("statMessages").textContent = data.totalMessages;

  document.getElementById("countReservations").textContent = data.totalReservations;
  document.getElementById("countOrders").textContent = data.totalOrders;
  document.getElementById("countMessages").textContent = data.totalMessages;
}

// ---- Reservations ----------------------------------------------------------
async function loadReservations() {
  const res = await fetch("/api/reservations");
  const reservations = await res.json();
  const body = document.getElementById("reservationsBody");

  if (!reservations.length) {
    body.innerHTML = `<tr class="empty-row"><td colspan="7">No reservations yet.</td></tr>`;
    return;
  }

  body.innerHTML = reservations
    .map(
      (r) => `
      <tr>
        <td><strong>${r.id}</strong></td>
        <td>${r.name}</td>
        <td>${r.email}${r.phone ? `<br><span style="color:var(--muted)">${r.phone}</span>` : ""}</td>
        <td>${r.date} · ${r.time}</td>
        <td>${r.guests}</td>
        <td><span class="pill ${r.status}">${r.status}</span></td>
        <td class="row-actions">
          <button class="row-btn" onclick="updateReservation('${r.id}','confirmed')">Confirm</button>
          <button class="row-btn danger" onclick="updateReservation('${r.id}','cancelled')">Cancel</button>
        </td>
      </tr>`
    )
    .join("");
}

async function updateReservation(id, status) {
  await fetch(`/api/reservations/${id}`, {
    method: "PATCH",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ status }),
  });
  loadReservations();
  loadSummary();
}

// ---- Orders -------------------------------------------------------------
async function loadOrders() {
  const res = await fetch("/api/orders");
  const orders = await res.json();
  const body = document.getElementById("ordersBody");

  if (!orders.length) {
    body.innerHTML = `<tr class="empty-row"><td colspan="7">No orders yet.</td></tr>`;
    return;
  }

  body.innerHTML = orders
    .map(
      (o) => `
      <tr>
        <td><strong>${o.id}</strong></td>
        <td>${o.name}<br><span style="color:var(--muted)">${o.email}</span></td>
        <td>${o.itemName}</td>
        <td>${o.quantity}</td>
        <td>$${(o.price * o.quantity).toFixed(2)}</td>
        <td><span class="pill ${o.status}">${o.status}</span></td>
        <td class="row-actions">
          <button class="row-btn" onclick="updateOrder('${o.id}','confirmed')">Confirm</button>
          <button class="row-btn danger" onclick="deleteOrder('${o.id}')">Delete</button>
        </td>
      </tr>`
    )
    .join("");
}

async function updateOrder(id, status) {
  await fetch(`/api/orders/${id}`, {
    method: "PATCH",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ status }),
  });
  loadOrders();
  loadSummary();
}

async function deleteOrder(id) {
  if (!confirm("Delete this order?")) return;
  await fetch(`/api/orders/${id}`, { method: "DELETE" });
  loadOrders();
  loadSummary();
}

// ---- Messages -------------------------------------------------------------
async function loadMessages() {
  const res = await fetch("/api/contact");
  const messages = await res.json();
  const body = document.getElementById("messagesBody");

  if (!messages.length) {
    body.innerHTML = `<tr class="empty-row"><td colspan="5">No messages yet.</td></tr>`;
    return;
  }

  body.innerHTML = messages
    .map(
      (m) => `
      <tr>
        <td>${m.name}</td>
        <td>${m.email}${m.phone ? `<br><span style="color:var(--muted)">${m.phone}</span>` : ""}</td>
        <td style="max-width:280px;">${m.message}</td>
        <td>${new Date(m.createdAt).toLocaleDateString()}</td>
        <td class="row-actions">
          <button class="row-btn danger" onclick="deleteMessage('${m.id}')">Delete</button>
        </td>
      </tr>`
    )
    .join("");
}

async function deleteMessage(id) {
  if (!confirm("Delete this message?")) return;
  await fetch(`/api/contact/${id}`, { method: "DELETE" });
  loadMessages();
  loadSummary();
}
