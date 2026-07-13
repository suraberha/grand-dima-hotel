// contact.js
// -----------------------------------------------------------------
// Runs only on contact.html. Sends the form to POST /api/contact.
// -----------------------------------------------------------------

const contactForm = document.getElementById("contactForm");
const contactFeedback = document.getElementById("contactFeedback");

contactForm.addEventListener("submit", async (e) => {
  e.preventDefault();

  const payload = {
    name: document.getElementById("cName").value.trim(),
    email: document.getElementById("cEmail").value.trim(),
    phone: document.getElementById("cPhone").value.trim(),
    message: document.getElementById("cMessage").value.trim(),
  };

  const submitBtn = contactForm.querySelector("button[type=submit]");
  submitBtn.disabled = true;
  submitBtn.textContent = "Sending...";

  try {
    const res = await fetch("/api/contact", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });
    const data = await res.json();

    if (!res.ok) throw new Error(data.error || "Something went wrong.");

    contactFeedback.textContent = data.message;
    contactFeedback.className = "contact-feedback success";
    contactForm.reset();
  } catch (err) {
    contactFeedback.textContent = err.message;
    contactFeedback.className = "contact-feedback error";
  } finally {
    submitBtn.disabled = false;
    submitBtn.textContent = "Send Message";
  }
});
