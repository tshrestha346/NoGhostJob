const mongoose = require("mongoose");

const companySchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },

    initials: {
      type: String,
      trim: true,
    },

    color: {
      type: String,
      trim: true,
    },

    rating: {
      type: Number,
      default: 0,
    },

    openings: {
      type: Number,
      default: 0,
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

module.exports =
  mongoose.models.Company || mongoose.model("Company", companySchema);