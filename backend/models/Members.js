const mongoose = require("mongoose");

const membersSchema = new mongoose.Schema(
  {
    title: String,
    full_name: String,
    designation: String,
    description: String,
    image: { type: String, default: null },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Members", membersSchema);