// reservation.js
// -----------------------------------------------------------------
// Runs only on reservation.html.
// Sends the form to POST /api/reservations, then shows the guest
// their reference ID so they can identify themselves at the door.
// -----------------------------------------------------------------

const form = document.getElementById("reservationForm");
const feedback = document.getElementById("resFeedback");

// Don't let guests pick a date in the past
document.getElementById("resDate").min = new Date().toISOString().split("T")[0];

form.addEventListener("submit", async (e) => {
  e.preventDefault();

  const payload = {
    name: document.getElementById("resName").value.trim(),
    email: document.getElementById("resEmail").value.trim(),
    phone: document.getElementById("resPhone").value.trim(),
    guests: document.getElementById("resGuests").value,
    date: document.getElementById("resDate").value,
    time: document.getElementById("resTime").value,
    notes: document.getElementById("resNotes").value.trim(),
  };

  const submitBtn = form.querySelector("button[type=submit]");
  submitBtn.disabled = true;
  submitBtn.textContent = "Confirming...";

  try {
    const res = await fetch("/api/reservations", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });
    const data = await res.json();

    if (!res.ok) throw new Error(data.error || "Something went wrong.");

    feedback.className = "res-feedback success";
    feedback.innerHTML = `
      <h4>Reservation confirmed!</h4>
      <div class="ref-id">${data.referenceId}</div>
      <p>Save this ID — show it to our host when you arrive. We've noted it under ${payload.name} for ${payload.date} at ${payload.time}.</p>
    `;
    form.reset();
  } catch (err) {
    feedback.className = "res-feedback error";
    feedback.textContent = err.message;
  } finally {
    submitBtn.disabled = false;
    submitBtn.textContent = "Confirm Reservation";
  }
});
