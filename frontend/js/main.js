// main.js
// -----------------------------------------------------------------
// Shared behaviour for every guest-facing page:
//   1. Mobile nav (hamburger) open/close
//   2. Header gets a solid background once you scroll down
//   3. Scroll-reveal: any element with class="reveal" fades/slides in
//      the first time it enters the viewport.
//
// This file is loaded on every page, so keep it generic — page-only
// logic (like the menu list, or reservation form) lives in its own
// file (menu.js, reservation.js, contact.js).
// -----------------------------------------------------------------

document.addEventListener("DOMContentLoaded", () => {
  // --- 1 & 2: Mobile nav + header scroll state ---------------------
  const header = document.querySelector(".site-header");
  const navToggle = document.querySelector(".nav-toggle");
  const navLinks = document.querySelector(".nav-links");

  if (navToggle && navLinks) {
    navToggle.addEventListener("click", () => {
      navToggle.classList.toggle("open");
      navLinks.classList.toggle("open");
    });

    // Close the menu automatically when a link is tapped (mobile UX)
    navLinks.querySelectorAll("a").forEach((link) => {
      link.addEventListener("click", () => {
        navToggle.classList.remove("open");
        navLinks.classList.remove("open");
      });
    });
  }

  function updateHeaderOnScroll() {
    if (!header) return;
    if (window.scrollY > 40) {
      header.classList.add("scrolled");
    } else {
      header.classList.remove("scrolled");
    }
  }
  updateHeaderOnScroll();
  window.addEventListener("scroll", updateHeaderOnScroll);

  // --- 3: Scroll-reveal animation using IntersectionObserver -------
  const revealEls = document.querySelectorAll(".reveal");

  if ("IntersectionObserver" in window && revealEls.length) {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("is-visible");
            observer.unobserve(entry.target); // animate once, not every time
          }
        });
      },
      { threshold: 0.15 }
    );

    revealEls.forEach((el) => observer.observe(el));
  } else {
    // Fallback for very old browsers: just show everything immediately
    revealEls.forEach((el) => el.classList.add("is-visible"));
  }
});
