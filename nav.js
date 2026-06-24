// Shared header behaviour for every page (consistent navbar).
(() => {
  // Mobile right-side drawer toggle (with backdrop overlay)
  const navToggle = document.getElementById("navToggle");
  const nav = document.getElementById("primaryNav");
  if (navToggle && nav) {
    const overlay = document.createElement("div");
    overlay.className = "nav-overlay";
    document.body.appendChild(overlay);

    // Close (✕) button inside the drawer
    const closeBtn = document.createElement("button");
    closeBtn.type = "button";
    closeBtn.className = "nav-close";
    closeBtn.setAttribute("aria-label", "Close menu");
    closeBtn.innerHTML = "&times;";
    nav.insertBefore(closeBtn, nav.firstChild);

    const close = () => {
      nav.classList.remove("open");
      overlay.classList.remove("show");
      document.body.classList.remove("nav-open");
      navToggle.setAttribute("aria-expanded", "false");
    };

    navToggle.addEventListener("click", () => {
      const open = nav.classList.toggle("open");
      overlay.classList.toggle("show", open);
      document.body.classList.toggle("nav-open", open);
      navToggle.setAttribute("aria-expanded", String(open));
    });

    closeBtn.addEventListener("click", close);
    overlay.addEventListener("click", close);
    nav.querySelectorAll("a").forEach((link) => link.addEventListener("click", close));
  }

  // Header shadow on scroll
  const header = document.getElementById("siteHeader");
  if (header) {
    const onScroll = () => header.classList.toggle("scrolled", window.scrollY > 20);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
  }

  // Scroll reveal for any static .reveal elements
  const revealEls = document.querySelectorAll(".reveal");
  if ("IntersectionObserver" in window && revealEls.length) {
    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("in");
            io.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.15 }
    );
    revealEls.forEach((el) => io.observe(el));
  } else {
    revealEls.forEach((el) => el.classList.add("in"));
  }
})();
