const mongoose = require("mongoose");

const companySchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    initials: String,
    color: String,
    rating: { type: Number, default: 0 },
    openings: { type: Number, default: 0 },
    description: String
  },
  { timestamps: true }
);

module.exports = mongoose.model("Company", companySchema);