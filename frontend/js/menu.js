// menu.js
// -----------------------------------------------------------------
// Runs only on menu.html. Does three jobs:
//   1. Fetch the food list from the backend  (GET /api/menu)
//   2. Draw the cards + category filter chips
//   3. Open a modal with details, and submit orders (POST /api/orders)
// -----------------------------------------------------------------

const API_BASE = ""; // same-origin, e.g. "" means "use the current site's URL"

let allItems = [];
let activeFilter = "All";

const grid = document.getElementById("menuGrid");
const emptyMsg = document.getElementById("menuEmpty");
const filtersBar = document.getElementById("menuFilters");

// ---- 1. Load the menu from the backend --------------------------------
async function loadMenu() {
  try {
    const res = await fetch(`${API_BASE}/api/menu`);
    if (!res.ok) throw new Error("Failed to load menu");
    allItems = await res.json();
    buildFilters();
    renderCards();
  } catch (err) {
    grid.innerHTML = `<p style="color:var(--text-muted)">Couldn't load the menu right now. Make sure the backend server is running.</p>`;
    console.error(err);
  }
}

// ---- 2a. Build the "All / Main Course / Dessert / ..." chips ----------
function buildFilters() {
  const categories = ["All", ...new Set(allItems.map((item) => item.category))];
  filtersBar.innerHTML = categories
    .map(
      (cat) =>
        `<button class="filter-chip ${cat === "All" ? "active" : ""}" data-filter="${cat}">${cat}</button>`
    )
    .join("");

  filtersBar.querySelectorAll(".filter-chip").forEach((chip) => {
    chip.addEventListener("click", () => {
      activeFilter = chip.dataset.filter;
      filtersBar.querySelectorAll(".filter-chip").forEach((c) => c.classList.remove("active"));
      chip.classList.add("active");
      renderCards();
    });
  });
}

// ---- 2b. Draw the menu cards -------------------------------------------
function renderCards() {
  const items =
    activeFilter === "All" ? allItems : allItems.filter((item) => item.category === activeFilter);

  emptyMsg.style.display = items.length ? "none" : "block";

  grid.innerHTML = items
    .map(
      (item) => `
      <article class="menu-card glass-panel reveal" data-id="${item.id}">
        <div class="menu-card-image">
          <img src="${item.image}" alt="${item.name}" loading="lazy">
          <span class="menu-card-tag">${item.category}</span>
        </div>
        <div class="menu-card-body">
          <div class="menu-card-row">
            <h3>${item.name}</h3>
            <span class="menu-card-price">$${item.price.toFixed(2)}</span>
          </div>
          <p>${item.description}</p>
        </div>
      </article>`
    )
    .join("");

  // Re-attach click handlers + re-run scroll reveal for the new cards
  grid.querySelectorAll(".menu-card").forEach((card) => {
    card.addEventListener("click", () => openModal(card.dataset.id));
    card.classList.add("is-visible"); // cards render after page-load, so show immediately
  });
}

// ---- 3. Modal: show details, submit order ------------------------------
const overlay = document.getElementById("modalOverlay");
const modalImage = document.getElementById("modalImage");
const modalName = document.getElementById("modalName");
const modalPrice = document.getElementById("modalPrice");
const modalDesc = document.getElementById("modalDesc");
const orderForm = document.getElementById("orderForm");
const orderItemId = document.getElementById("orderItemId");
const orderFeedback = document.getElementById("orderFeedback");

function openModal(itemId) {
  const item = allItems.find((i) => String(i.id) === String(itemId));
  if (!item) return;

  modalImage.src = item.image;
  modalImage.alt = item.name;
  modalName.textContent = item.name;
  modalPrice.textContent = `$${item.price.toFixed(2)}`;
  modalDesc.textContent = item.description;
  orderItemId.value = item.id;
  orderFeedback.textContent = "";
  orderFeedback.className = "order-feedback";
  orderForm.reset();
  document.getElementById("orderQty").value = 1;

  overlay.classList.add("open");
}

function closeModal() {
  overlay.classList.remove("open");
}

document.getElementById("modalClose").addEventListener("click", closeModal);
overlay.addEventListener("click", (e) => {
  if (e.target === overlay) closeModal(); // click outside the box closes it
});

orderForm.addEventListener("submit", async (e) => {
  e.preventDefault();

  const item = allItems.find((i) => String(i.id) === String(orderItemId.value));
  const payload = {
    name: document.getElementById("orderName").value.trim(),
    email: document.getElementById("orderEmail").value.trim(),
    itemId: item.id,
    itemName: item.name,
    price: item.price,
    quantity: Number(document.getElementById("orderQty").value),
    notes: document.getElementById("orderNotes").value.trim(),
  };

  orderFeedback.textContent = "Sending your order...";
  orderFeedback.className = "order-feedback";

  try {
    const res = await fetch(`${API_BASE}/api/orders`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });
    const data = await res.json();

    if (!res.ok) throw new Error(data.error || "Something went wrong.");

    orderFeedback.textContent = `${data.message} Order ID: ${data.orderId}`;
    orderFeedback.className = "order-feedback success";
    orderForm.reset();
  } catch (err) {
    orderFeedback.textContent = err.message;
    orderFeedback.className = "order-feedback error";
  }
});

loadMenu();
