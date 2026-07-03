const mongoose = require("mongoose");

// Mirrors the shape used by the frontend (data.js / window.NAGOMI_MENU).
const menuItemSchema = new mongoose.Schema(
  {
    // Human-friendly stable id used in dish.html?id=...
    slug: { type: String, required: true, unique: true, trim: true },
    title: { type: String, required: true, trim: true },
    category: { type: String, required: true, trim: true },
    price: { type: String, default: "" },
    special: { type: Boolean, default: false },
    tagline: { type: String, default: "" },
    description: { type: String, default: "" },
    longDescription: { type: String, default: "" },
    ingredients: { type: [String], default: [] },
    prepTime: { type: String, default: "" },
    calories: { type: String, default: "" },
    chefNote: { type: String, default: "" },
    image: { type: String, default: "" },
    // Lower numbers show first; lets admin control ordering.
    sortOrder: { type: Number, default: 0 },
  },
  { timestamps: true }
);

// Transform to the exact object shape the frontend expects.
menuItemSchema.methods.toPublic = function () {
  return {
    id: this.slug,
    title: this.title,
    category: this.category,
    price: this.price,
    special: this.special,
    tagline: this.tagline,
    description: this.description,
    longDescription: this.longDescription,
    ingredients: this.ingredients,
    prepTime: this.prepTime,
    calories: this.calories,
    chefNote: this.chefNote,
    image: this.image,
  };
};

module.exports = mongoose.model("MenuItem", menuItemSchema);
