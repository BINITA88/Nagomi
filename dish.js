(() => {
  const main = document.getElementById("dishMain");
  if (!main) return;

  (window.NAGOMI_READY || Promise.resolve()).then(() => {
  const menuItems = window.NAGOMI_MENU || [];
  const params = new URLSearchParams(window.location.search);
  const id = params.get("id");
  const dish = menuItems.find((item) => item.id === id);

  if (!dish) {
    main.innerHTML = `
      <div class="dish-missing">
        <p class="kicker">Not found</p>
        <h1>We couldn't find that dish.</h1>
        <p class="hero-sub">It may have rotated off the seasonal menu.</p>
        <a href="menu.html" class="btn btn-primary">Back to the menu</a>
      </div>`;
    return;
  }

  document.title = `${dish.title} — Nagomi-ya Sushi`;

  const related = menuItems
    .filter((item) => item.id !== dish.id && item.category === dish.category)
    .slice(0, 3);
  const fallbackRelated = menuItems.filter((item) => item.id !== dish.id).slice(0, 3);
  const relatedList = related.length ? related : fallbackRelated;

  main.innerHTML = `
    <a href="menu.html" class="back-link">&larr; Back to menu</a>

    <article class="dish-layout">
      <div class="dish-media reveal">
        ${dish.special ? '<span class="card-flag">Chef Special</span>' : ""}
        <img src="${dish.image}" alt="${dish.title}">
      </div>

      <div class="dish-info reveal">
        <p class="kicker">${dish.category}</p>
        <h1>${dish.title}</h1>
        <p class="dish-tagline">${dish.tagline || ""}</p>
        <p class="dish-long">${dish.longDescription || dish.description}</p>

        <div class="dish-meta">
          <div><span>Price</span><strong>${dish.price}</strong></div>
          <div><span>Prep</span><strong>${dish.prepTime || "—"}</strong></div>
          <div><span>Approx</span><strong>${dish.calories || "—"}</strong></div>
        </div>

        ${
          dish.ingredients && dish.ingredients.length
            ? `<div class="dish-ingredients">
                 <h3>Ingredients</h3>
                 <ul>${dish.ingredients.map((i) => `<li>${i}</li>`).join("")}</ul>
               </div>`
            : ""
        }

        ${
          dish.chefNote
            ? `<div class="chef-note"><span>Chef's note</span><p>${dish.chefNote}</p></div>`
            : ""
        }

        <div class="dish-cta">
          <a href="index.html#reserve" class="btn btn-primary">Reserve a table</a>
          <a href="menu.html" class="btn btn-ghost">See more dishes</a>
        </div>
      </div>
    </article>

    <section class="related">
      <div class="section-head">
        <div>
          <p class="kicker">You may also like</p>
          <h2>More from the kitchen</h2>
        </div>
      </div>
      <div class="preview-grid">
        ${relatedList
          .map(
            (item) => `
          <a class="preview-card" href="dish.html?id=${encodeURIComponent(item.id)}">
            <div class="preview-img"><img src="${item.image}" alt="${item.title}"></div>
            <div class="preview-body">
              <span class="menu-category">${item.category}</span>
              <h3>${item.title}</h3>
              <span class="menu-price">${item.price}</span>
            </div>
          </a>`
          )
          .join("")}
      </div>
    </section>
  `;

  requestAnimationFrame(() => {
    document.querySelectorAll(".reveal").forEach((el) => el.classList.add("in"));
  });
  });
})();
