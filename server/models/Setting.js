const mongoose = require("mongoose");

// Simple key/value store for editable page copy (hero, contact, hours, stats...).
// The frontend merges these over its built-in defaults, so any missing key
// simply keeps the current hard-coded design value.
const settingSchema = new mongoose.Schema(
  {
    key: { type: String, required: true, unique: true, trim: true },
    value: { type: mongoose.Schema.Types.Mixed, default: "" },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Setting", settingSchema);
