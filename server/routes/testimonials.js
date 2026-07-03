const express = require("express");
const Testimonial = require("../models/Testimonial");
const { requireAuth } = require("../middleware/auth");

const router = express.Router();

function buildDoc(body, existing) {
  return {
    name: body.name,
    role: body.role ?? "",
    rating: body.rating != null ? Math.max(1, Math.min(5, Number(body.rating))) : 5,
    quote: body.quote ?? "",
    image: body.image ?? (existing ? existing.image : ""),
    sortOrder: body.sortOrder != null ? Number(body.sortOrder) : existing ? existing.sortOrder : 0,
  };
}

// ---- PUBLIC ----
router.get("/", async (req, res, next) => {
  try {
    const items = await Testimonial.find().sort({ sortOrder: 1, createdAt: 1 });
    res.json(items.map((i) => i.toPublic()));
  } catch (e) {
    next(e);
  }
});

// ---- ADMIN ----
router.get("/admin", requireAuth, async (req, res, next) => {
  try {
    const items = await Testimonial.find().sort({ sortOrder: 1, createdAt: 1 });
    res.json(items);
  } catch (e) {
    next(e);
  }
});

router.post("/", requireAuth, async (req, res, next) => {
  try {
    if (!req.body.name || !req.body.quote)
      return res.status(400).json({ error: "Name and quote are required" });
    const created = await Testimonial.create(buildDoc(req.body, null));
    res.status(201).json(created);
  } catch (e) {
    next(e);
  }
});

router.put("/:id", requireAuth, async (req, res, next) => {
  try {
    const existing = await Testimonial.findById(req.params.id);
    if (!existing) return res.status(404).json({ error: "Testimonial not found" });
    Object.assign(existing, buildDoc(req.body, existing));
    await existing.save();
    res.json(existing);
  } catch (e) {
    next(e);
  }
});

router.delete("/:id", requireAuth, async (req, res, next) => {
  try {
    const deleted = await Testimonial.findByIdAndDelete(req.params.id);
    if (!deleted) return res.status(404).json({ error: "Testimonial not found" });
    res.json({ ok: true });
  } catch (e) {
    next(e);
  }
});

module.exports = router;
