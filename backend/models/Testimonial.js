const mongoose = require("mongoose");

const testimonialSchema = new mongoose.Schema(
  {
    name: String,
    role: String,
    initials: String,
    color: String,
    rating: { type: Number, default: 5 },
    text: String
  },
  { timestamps: true }
);

module.exports = mongoose.model("Testimonial", testimonialSchema);