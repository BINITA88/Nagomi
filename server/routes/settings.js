const express = require("express");
const Setting = require("../models/Setting");
const { requireAuth } = require("../middleware/auth");

const router = express.Router();

// ---- PUBLIC: returns { key: value, ... } ----
router.get("/", async (req, res, next) => {
  try {
    const all = await Setting.find();
    const out = {};
    all.forEach((s) => {
      out[s.key] = s.value;
    });
    res.json(out);
  } catch (e) {
    next(e);
  }
});

// ---- ADMIN: bulk upsert a map of settings ----
router.put("/", requireAuth, async (req, res, next) => {
  try {
    const body = req.body || {};
    const entries = Object.entries(body);
    await Promise.all(
      entries.map(([key, value]) =>
        Setting.findOneAndUpdate({ key }, { key, value }, { upsert: true, new: true })
      )
    );
    const all = await Setting.find();
    const out = {};
    all.forEach((s) => (out[s.key] = s.value));
    res.json(out);
  } catch (e) {
    next(e);
  }
});

module.exports = router;
