(() => {
  const cardMarkup = (item) => `
    <a class="preview-card" href="dish.html?id=${encodeURIComponent(item.id)}">
      <div class="preview-img">
        ${item.special ? '<span class="card-flag">Chef Special</span>' : ""}
        <img src="${item.image}" alt="${item.title}">
      </div>
      <div class="preview-body">
        <span class="menu-category">${item.category}</span>
        <div class="preview-row">
          <h3>${item.title}</h3>
          <span class="menu-price">${item.price}</span>
        </div>
        <p class="menu-desc">${item.description}</p>
        <span class="card-link">View dish &rarr;</span>
      </div>
    </a>`;

  const stars = (n) => "★".repeat(n) + "☆".repeat(5 - n);
  const reviewMarkup = (t) => `
    <figure class="review-card">
      <div class="review-stars">${stars(t.rating)}</div>
      <blockquote>“${t.quote}”</blockquote>
      <figcaption>
        <img src="${t.image}" alt="${t.name}" loading="lazy">
        <div>
          <strong>${t.name}</strong>
          <span>${t.role}</span>
        </div>
      </figcaption>
    </figure>`;

  // Apply editable site copy from settings onto any [data-setting] element.
  // Missing keys keep the built-in design default already in the HTML.
  const applySettings = (settings) => {
    if (!settings) return;
    document.querySelectorAll("[data-setting]").forEach((elm) => {
      const value = settings[elm.dataset.setting];
      if (value != null && String(value).trim() !== "") {
        elm.textContent = value;
      }
    });
  };

  const render = () => {
    const menuItems = window.NAGOMI_MENU || [];
    const testimonials = window.NAGOMI_TESTIMONIALS || [];

    applySettings(window.NAGOMI_SETTINGS || {});

    // ----- Chef specials -----
    const specialsGrid = document.getElementById("specialsGrid");
    if (specialsGrid) {
      const specials = menuItems.filter((item) => item.special);
      specialsGrid.innerHTML = specials.map(cardMarkup).join("");
    }

    // ----- Menu preview (first 6) -----
    const previewGrid = document.getElementById("previewGrid");
    if (previewGrid) {
      previewGrid.innerHTML = menuItems.slice(0, 6).map(cardMarkup).join("");
    }

    // ----- Testimonials marquee (duplicated for seamless loop) -----
    const reviewTrack = document.getElementById("reviewTrack");
    if (reviewTrack) {
      const html = testimonials.map(reviewMarkup).join("");
      reviewTrack.innerHTML = html + html; // duplicate for infinite scroll
    }
  };

  // ----- Reservation form (demo, no backend) -----
  const bindReservation = () => {
    const form = document.getElementById("reserveForm");
    const note = document.getElementById("reserveNote");
    if (form && note) {
      form.addEventListener("submit", (e) => {
        e.preventDefault();
        note.hidden = false;
        form.querySelector("button").textContent = "Reservation Requested ✓";
      });
    }
  };

  bindReservation();
  (window.NAGOMI_READY || Promise.resolve()).then(render);
})();
