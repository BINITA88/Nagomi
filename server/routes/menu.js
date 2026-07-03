const express = require("express");
const MenuItem = require("../models/MenuItem");
const { requireAuth } = require("../middleware/auth");

const router = express.Router();

function slugify(text) {
  return String(text)
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

// Accepts ingredients as an array OR a comma/newline separated string.
function normalizeIngredients(value) {
  if (Array.isArray(value)) return value.map((v) => String(v).trim()).filter(Boolean);
  if (typeof value === "string") {
    return value
      .split(/[\n,]/)
      .map((v) => v.trim())
      .filter(Boolean);
  }
  return [];
}

async function buildDoc(body, existing) {
  const doc = {
    title: body.title,
    category: body.category,
    price: body.price ?? "",
    special: body.special === true || body.special === "true" || body.special === "on",
    tagline: body.tagline ?? "",
    description: body.description ?? "",
    longDescription: body.longDescription ?? "",
    ingredients: normalizeIngredients(body.ingredients),
    prepTime: body.prepTime ?? "",
    calories: body.calories ?? "",
    chefNote: body.chefNote ?? "",
    image: body.image ?? (existing ? existing.image : ""),
    sortOrder: body.sortOrder != null ? Number(body.sortOrder) : existing ? existing.sortOrder : 0,
  };
  doc.slug = body.slug ? slugify(body.slug) : existing ? existing.slug : slugify(body.title);
  return doc;
}

// ---- PUBLIC: consumed by the website ----
router.get("/", async (req, res, next) => {
  try {
    const items = await MenuItem.find().sort({ sortOrder: 1, createdAt: 1 });
    res.json(items.map((i) => i.toPublic()));
  } catch (e) {
    next(e);
  }
});

// ---- ADMIN: full records (includes _id, sortOrder) ----
router.get("/admin", requireAuth, async (req, res, next) => {
  try {
    const items = await MenuItem.find().sort({ sortOrder: 1, createdAt: 1 });
    res.json(items);
  } catch (e) {
    next(e);
  }
});

router.post("/", requireAuth, async (req, res, next) => {
  try {
    if (!req.body.title) return res.status(400).json({ error: "Title is required" });
    const doc = await buildDoc(req.body, null);
    const created = await MenuItem.create(doc);
    res.status(201).json(created);
  } catch (e) {
    if (e.code === 11000) return res.status(409).json({ error: "A dish with that slug already exists" });
    next(e);
  }
});

router.put("/:id", requireAuth, async (req, res, next) => {
  try {
    const existing = await MenuItem.findById(req.params.id);
    if (!existing) return res.status(404).json({ error: "Dish not found" });
    const doc = await buildDoc(req.body, existing);
    Object.assign(existing, doc);
    await existing.save();
    res.json(existing);
  } catch (e) {
    if (e.code === 11000) return res.status(409).json({ error: "A dish with that slug already exists" });
    next(e);
  }
});

router.delete("/:id", requireAuth, async (req, res, next) => {
  try {
    const deleted = await MenuItem.findByIdAndDelete(req.params.id);
    if (!deleted) return res.status(404).json({ error: "Dish not found" });
    res.json({ ok: true });
  } catch (e) {
    next(e);
  }
});

module.exports = router;
