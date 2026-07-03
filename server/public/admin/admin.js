(() => {
  const API = ""; // same origin as this admin panel
  const tokenKey = "nagomi_admin_token";
  let token = localStorage.getItem(tokenKey);

  // ---------- Field definitions ----------
  const MENU_FIELDS = [
    { name: "title", label: "Title", required: true },
    { name: "slug", label: "Slug (URL id — auto from title if blank)" },
    { name: "category", label: "Category", required: true },
    { name: "price", label: "Price (e.g. $14)" },
    { name: "prepTime", label: "Prep time (e.g. 10 min)" },
    { name: "calories", label: "Calories (e.g. 210 kcal)" },
    { name: "sortOrder", label: "Sort order (0 = first)", type: "number" },
    { name: "special", label: "Chef special", type: "checkbox" },
    { name: "tagline", label: "Tagline", full: true },
    { name: "description", label: "Short description", type: "textarea", full: true },
    { name: "longDescription", label: "Long description", type: "textarea", full: true },
    { name: "ingredients", label: "Ingredients (comma separated)", type: "textarea", full: true },
    { name: "chefNote", label: "Chef's note", type: "textarea", full: true },
    { name: "image", label: "Image", type: "image", full: true },
  ];

  const TESTIMONIAL_FIELDS = [
    { name: "name", label: "Name", required: true },
    { name: "role", label: "Role (e.g. Food Writer)" },
    { name: "rating", label: "Rating (1-5)", type: "number" },
    { name: "sortOrder", label: "Sort order", type: "number" },
    { name: "quote", label: "Quote", type: "textarea", full: true, required: true },
    { name: "image", label: "Photo", type: "image", full: true },
  ];

  // Editable site copy. Grouped by section for readability.
  const SETTING_FIELDS = [
    { key: "heroKicker", label: "Hero — kicker", ph: "Nagomi-ya Sushi" },
    { key: "heroTitle", label: "Hero — headline", ph: "Handcrafted bites, seasonal cuts…", type: "textarea" },
    { key: "heroSubtitle", label: "Hero — subtitle", type: "textarea" },
    { key: "stat1Value", label: "Stat 1 value", ph: "12+" },
    { key: "stat1Label", label: "Stat 1 label", ph: "Years of craft" },
    { key: "stat2Value", label: "Stat 2 value", ph: "4.9★" },
    { key: "stat2Label", label: "Stat 2 label", ph: "Guest rating" },
    { key: "stat3Value", label: "Stat 3 value", ph: "Daily" },
    { key: "stat3Label", label: "Stat 3 label", ph: "Market fish" },
    { key: "contactEmail", label: "Contact email", ph: "hello@nagomi-ya.com" },
    { key: "contactPhone", label: "Contact phone", ph: "+1 (555) 014-2233" },
    { key: "address", label: "Address", type: "textarea", ph: "41 Riverside Walk, Kyoto Quarter" },
    { key: "hours", label: "Opening hours", ph: "Tue–Sun · 5pm – 10:30pm" },
    { key: "footerTagline", label: "Footer tagline", type: "textarea" },
  ];

  // ---------- DOM helpers ----------
  const $ = (sel) => document.querySelector(sel);
  const el = (tag, props = {}, children = []) => {
    const node = document.createElement(tag);
    Object.entries(props).forEach(([k, v]) => {
      if (k === "class") node.className = v;
      else if (k === "html") node.innerHTML = v;
      else if (k === "text") node.textContent = v;
      else node.setAttribute(k, v);
    });
    (Array.isArray(children) ? children : [children]).forEach((c) => c && node.appendChild(c));
    return node;
  };

  const toast = (msg, kind = "ok") => {
    const t = $("#toast");
    t.textContent = msg;
    t.className = `toast ${kind}`;
    t.hidden = false;
    clearTimeout(t._timer);
    t._timer = setTimeout(() => (t.hidden = true), 2600);
  };

  // ---------- API ----------
  async function api(pathname, { method = "GET", body, isForm } = {}) {
    const headers = {};
    if (token) headers.Authorization = `Bearer ${token}`;
    if (body && !isForm) headers["Content-Type"] = "application/json";
    const res = await fetch(API + pathname, {
      method,
      headers,
      body: isForm ? body : body ? JSON.stringify(body) : undefined,
    });
    if (res.status === 401) {
      logout();
      throw new Error("Session expired — please sign in again.");
    }
    const data = await res.json().catch(() => ({}));
    if (!res.ok) throw new Error(data.error || "Request failed");
    return data;
  }

  // ---------- Auth ----------
  async function checkAuth() {
    if (!token) return showLogin();
    try {
      const me = await api("/api/auth/me");
      $("#whoami").textContent = `Signed in as ${me.user}`;
      showApp();
    } catch {
      showLogin();
    }
  }

  function showLogin() {
    $("#loginView").hidden = false;
    $("#appView").hidden = true;
  }
  function showApp() {
    $("#loginView").hidden = true;
    $("#appView").hidden = false;
    loadMenu();
    loadTestimonials();
    loadSettings();
  }
  function logout() {
    token = null;
    localStorage.removeItem(tokenKey);
    showLogin();
  }

  $("#loginForm").addEventListener("submit", async (e) => {
    e.preventDefault();
    const err = $("#loginError");
    err.hidden = true;
    try {
      const data = await api("/api/auth/login", {
        method: "POST",
        body: { username: $("#loginUser").value, password: $("#loginPass").value },
      });
      token = data.token;
      localStorage.setItem(tokenKey, token);
      $("#whoami").textContent = `Signed in as ${data.user}`;
      showApp();
    } catch (ex) {
      err.textContent = ex.message;
      err.hidden = false;
    }
  });
  $("#logoutBtn").addEventListener("click", logout);

  // ---------- Tabs ----------
  document.querySelectorAll(".tab").forEach((tab) => {
    tab.addEventListener("click", () => {
      document.querySelectorAll(".tab").forEach((t) => t.classList.remove("active"));
      document.querySelectorAll(".tab-panel").forEach((p) => p.classList.remove("active"));
      tab.classList.add("active");
      $(`#tab-${tab.dataset.tab}`).classList.add("active");
    });
  });

  // ---------- Menu ----------
  async function loadMenu() {
    try {
      const items = await api("/api/menu/admin");
      const list = $("#menuList");
      list.innerHTML = "";
      if (!items.length) list.appendChild(el("p", { class: "muted", text: "No dishes yet. Add one or run the seed script." }));
      items.forEach((item) => list.appendChild(menuCard(item)));
    } catch (e) {
      toast(e.message, "err");
    }
  }

  function menuCard(item) {
    const thumb = el("div", { class: "thumb", style: item.image ? `background-image:url('${item.image}')` : "" });
    if (item.special) thumb.appendChild(el("span", { class: "flag", text: "Chef Special" }));
    const body = el("div", { class: "body" }, [
      el("span", { class: "cat", text: item.category || "—" }),
      el("div", { class: "row" }, [
        el("h3", { text: item.title }),
        el("span", { class: "muted", text: item.price || "" }),
      ]),
      el("p", { text: item.description || "" }),
    ]);
    const actions = el("div", { class: "actions" }, [
      el("button", { class: "btn ghost", text: "Edit" }),
      el("button", { class: "btn danger", text: "Delete" }),
    ]);
    actions.children[0].onclick = () => openEditor("menu", MENU_FIELDS, item);
    actions.children[1].onclick = () => remove("menu", item, item.title);
    return el("div", { class: "item-card" }, [thumb, body, actions]);
  }

  $("#newMenuBtn").addEventListener("click", () => openEditor("menu", MENU_FIELDS, null));

  // ---------- Testimonials ----------
  async function loadTestimonials() {
    try {
      const items = await api("/api/testimonials/admin");
      const list = $("#testimonialList");
      list.innerHTML = "";
      if (!items.length) list.appendChild(el("p", { class: "muted", text: "No testimonials yet." }));
      items.forEach((item) => list.appendChild(testimonialCard(item)));
    } catch (e) {
      toast(e.message, "err");
    }
  }

  function testimonialCard(item) {
    const stars = "★".repeat(item.rating || 0) + "☆".repeat(5 - (item.rating || 0));
    const thumb = el("div", { class: "thumb", style: item.image ? `background-image:url('${item.image}')` : "" });
    const body = el("div", { class: "body" }, [
      el("span", { class: "stars", text: stars }),
      el("h3", { text: item.name }),
      el("span", { class: "cat", text: item.role || "" }),
      el("p", { text: `“${item.quote}”` }),
    ]);
    const actions = el("div", { class: "actions" }, [
      el("button", { class: "btn ghost", text: "Edit" }),
      el("button", { class: "btn danger", text: "Delete" }),
    ]);
    actions.children[0].onclick = () => openEditor("testimonials", TESTIMONIAL_FIELDS, item);
    actions.children[1].onclick = () => remove("testimonials", item, item.name);
    return el("div", { class: "item-card" }, [thumb, body, actions]);
  }

  $("#newTestimonialBtn").addEventListener("click", () => openEditor("testimonials", TESTIMONIAL_FIELDS, null));

  // ---------- Delete ----------
  async function remove(resource, item, label) {
    if (!confirm(`Delete "${label}"? This cannot be undone.`)) return;
    try {
      await api(`/api/${resource}/${item._id}`, { method: "DELETE" });
      toast("Deleted");
      resource === "menu" ? loadMenu() : loadTestimonials();
    } catch (e) {
      toast(e.message, "err");
    }
  }

  // ---------- Shared editor modal ----------
  let currentResource = null;
  let currentItem = null;

  function openEditor(resource, fields, item) {
    currentResource = resource;
    currentItem = item;
    $("#modalTitle").textContent = item ? "Edit" : "New entry";
    const form = $("#editForm");
    form.innerHTML = "";

    fields.forEach((f) => {
      const wrap = el("label", { class: f.full ? "full" : "" });
      const value = item ? item[f.name] : "";

      if (f.type === "checkbox") {
        wrap.className = "checkbox-row" + (f.full ? " full" : "");
        const cb = el("input", { type: "checkbox", "data-field": f.name });
        if (value) cb.checked = true;
        wrap.appendChild(cb);
        wrap.appendChild(el("span", { text: f.label }));
      } else if (f.type === "image") {
        wrap.appendChild(el("span", { text: f.label }));
        const hidden = el("input", { type: "text", "data-field": f.name, placeholder: "Image URL, or upload →" });
        hidden.value = value || "";
        const preview = el("img", { class: "img-preview", src: value || "", alt: "" });
        const file = el("input", { type: "file", accept: "image/*" });
        file.onchange = async () => {
          if (!file.files[0]) return;
          const fd = new FormData();
          fd.append("image", file.files[0]);
          try {
            toast("Uploading…");
            const out = await api("/api/uploads", { method: "POST", body: fd, isForm: true });
            hidden.value = out.url;
            preview.src = out.url;
            toast("Image uploaded");
          } catch (e) {
            toast(e.message, "err");
          }
        };
        hidden.oninput = () => (preview.src = hidden.value);
        wrap.appendChild(hidden);
        wrap.appendChild(el("div", { class: "upload-row" }, [preview, file]));
      } else {
        wrap.appendChild(el("span", { text: f.label + (f.required ? " *" : "") }));
        const input = el(f.type === "textarea" ? "textarea" : "input", { "data-field": f.name });
        if (f.type !== "textarea") input.type = f.type || "text";
        input.value = Array.isArray(value) ? value.join(", ") : value != null ? value : "";
        wrap.appendChild(input);
      }
      form.appendChild(wrap);
    });

    $("#modal").hidden = false;
  }

  function closeModal() {
    $("#modal").hidden = true;
  }
  document.querySelectorAll("[data-close]").forEach((b) => b.addEventListener("click", closeModal));

  // Close on Escape (works even when a browser extension intercepts clicks).
  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape" && !$("#modal").hidden) closeModal();
  });

  $("#modalSave").addEventListener("click", async () => {
    const form = $("#editForm");
    const payload = {};
    form.querySelectorAll("[data-field]").forEach((input) => {
      const key = input.getAttribute("data-field");
      payload[key] = input.type === "checkbox" ? input.checked : input.value;
    });
    try {
      const isEdit = currentItem && currentItem._id;
      await api(`/api/${currentResource}${isEdit ? "/" + currentItem._id : ""}`, {
        method: isEdit ? "PUT" : "POST",
        body: payload,
      });
      toast("Saved");
      closeModal();
      currentResource === "menu" ? loadMenu() : loadTestimonials();
    } catch (e) {
      toast(e.message, "err");
    }
  });

  // ---------- Settings ----------
  async function loadSettings() {
    try {
      const values = await api("/api/settings");
      const form = $("#settingsForm");
      form.innerHTML = "";
      SETTING_FIELDS.forEach((f) => {
        const wrap = el("label");
        wrap.appendChild(el("span", { text: f.label }));
        const input = el(f.type === "textarea" ? "textarea" : "input", {
          "data-key": f.key,
          placeholder: f.ph ? `Default: ${f.ph}` : "",
        });
        input.value = values[f.key] != null ? values[f.key] : "";
        wrap.appendChild(input);
        form.appendChild(wrap);
      });
    } catch (e) {
      toast(e.message, "err");
    }
  }

  $("#saveSettingsBtn").addEventListener("click", async () => {
    const payload = {};
    $("#settingsForm")
      .querySelectorAll("[data-key]")
      .forEach((input) => {
        const v = input.value.trim();
        if (v !== "") payload[input.getAttribute("data-key")] = v;
      });
    try {
      await api("/api/settings", { method: "PUT", body: payload });
      toast("Settings saved");
    } catch (e) {
      toast(e.message, "err");
    }
  });

  // ---------- Boot ----------
  checkAuth();
})();
