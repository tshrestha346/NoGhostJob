const mongoose = require("mongoose");

const categorySchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    icon: String,
    jobs: { type: Number, default: 0 }
  },
  { timestamps: true }
);

module.exports = mongoose.model("Category", categorySchema);

