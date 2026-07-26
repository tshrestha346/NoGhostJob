const mongoose = require("mongoose");

const ownCompanySchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },
    description: {
      type: String,
      trim: true,
    },

    street: {
      type: String,
      trim: true,
    },

    houseNo: {
      type: String,
      trim: true,
    },

    postalCode: {
      type: String,
      trim: true,
    },

    country: {
      type: String,
      trim: true,
    },

    phoneNo: {
      type: String,
      trim: true,
    },

    isHeadquarter: {
      type: Boolean,
      default: false,
    },

    headquarterPhoneNo: {
      type: String,
      trim: true,
    },

    isSupport: {
      type: Boolean,
      default: false,
    },

    supportPhoneNo: {
      type: String,
      trim: true,
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("OwnCompany", ownCompanySchema);