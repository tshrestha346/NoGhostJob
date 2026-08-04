const mongoose = require("mongoose");

const featuresSchema = new mongoose.Schema(
  {
    title: String,
    description: String,
  },
  { timestamps: true }
);

module.exports = mongoose.model("Features", featuresSchema);