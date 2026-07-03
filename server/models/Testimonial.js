const mongoose = require("mongoose");

// Mirrors window.NAGOMI_TESTIMONIALS in the frontend.
const testimonialSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true },
    role: { type: String, default: "" },
    rating: { type: Number, default: 5, min: 1, max: 5 },
    quote: { type: String, required: true },
    image: { type: String, default: "" },
    sortOrder: { type: Number, default: 0 },
  },
  { timestamps: true }
);

testimonialSchema.methods.toPublic = function () {
  return {
    name: this.name,
    role: this.role,
    rating: this.rating,
    quote: this.quote,
    image: this.image,
  };
};

module.exports = mongoose.model("Testimonial", testimonialSchema);
