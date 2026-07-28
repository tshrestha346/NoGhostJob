const mongoose = require("mongoose");

const adminSchema = new mongoose.Schema(
  {
    name: {type: String, required: true},
    title: {type: String, required: false},
    description: {type: Text, required: false},
    mobile_no: {type: Number, required: true},
    country: {type: String, required:true },
    state: {type: String, required: true},
    city: {type: String, required: true},
    street: {type: String, required: true},
    house_no: {type: String, required: true},

  },
  { timestamps: true }
);

module.exports = mongoose.model("Admin", adminSchema);