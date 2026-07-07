

/* This schema is for feature to show in about page near our mission. */

const mongoose = require("mongoose");

const featuresSchema = new mongoose.Schema(
  {
    title: String,
    description: String,
  },
  { timestamps: true }
);

module.exports = mongoose.model("Features", featuresSchema);