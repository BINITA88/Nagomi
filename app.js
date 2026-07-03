(() => {
  const menuGrid = document.getElementById("menuGrid");
  const categoryList = document.getElementById("categoryList");
  const activeCategory = document.getElementById("activeCategory");

  if (!menuGrid || !categoryList) {
    return;
  }

  (window.NAGOMI_READY || Promise.resolve()).then(() => {
  const menuItems = window.NAGOMI_MENU || [];

  const categories = ["All", ...new Set(menuItems.map((item) => item.category))];
  let currentCategory = "All";

  const renderCategories = () => {
    categoryList.innerHTML = "";

    categories.forEach((category) => {
      const button = document.createElement("button");
      button.type = "button";
      button.className = "category-button";
      button.textContent = category;
      button.dataset.category = category;

      if (category === currentCategory) {
        button.classList.add("active");
      }

      button.addEventListener("click", () => {
        currentCategory = category;
        renderMenu(currentCategory);
        updateActiveCategory();
        updateActiveButtons();
      });

      categoryList.appendChild(button);
    });
  };

  const updateActiveButtons = () => {
    const buttons = categoryList.querySelectorAll(".category-button");
    buttons.forEach((button) => {
      button.classList.toggle("active", button.dataset.category === currentCategory);
    });
  };

  const updateActiveCategory = () => {
    if (activeCategory) {
      activeCategory.textContent = currentCategory;
    }
  };

  const renderMenu = (category) => {
    menuGrid.innerHTML = "";
    const filtered =
      category === "All"
        ? menuItems
        : menuItems.filter((item) => item.category === category);

    filtered.forEach((item, index) => {
      const card = document.createElement("a");
      card.className = "menu-card";
      card.href = `dish.html?id=${encodeURIComponent(item.id)}`;
      card.style.setProperty("--order", index);

      card.innerHTML = `
        ${item.special ? '<span class="card-flag">Chef Special</span>' : ""}
        <img src="${item.image}" alt="${item.title}">
        <div class="menu-card-content">
          <div class="menu-card-header">
            <h3 class="menu-title">${item.title}</h3>
            <span class="menu-price">${item.price}</span>
          </div>
          <span class="menu-category">${item.category}</span>
          <p class="menu-desc">${item.description}</p>
          <span class="card-link">View dish &rarr;</span>
        </div>
      `;

      menuGrid.appendChild(card);
    });
  };

  renderCategories();
  renderMenu(currentCategory);
  updateActiveCategory();
  });
})();
