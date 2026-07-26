const mongoose = require("mongoose");

const companySchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true, unique: true, index: true },
    initials: { type: String, trim: true, maxlength: 4 },
    color: { type: String, trim: true, default: "#1565C0" },
    industry: { type: String, required: true, trim: true, index: true },
    size: { type: String, required: true, trim: true, index: true },
    location: { type: String, required: true, trim: true, index: true },
    rating: { type: Number, min: 0, max: 5, default: 0 },
    reviews: { type: Number, min: 0, default: 0 },
    openings: { type: Number, min: 0, default: 0 },
    type: { type: String, enum: ["Public", "Private"], default: "Private", index: true },
    founded: {
      type: Number,
      min: 1800,
      max: new Date().getFullYear(),
    },
    tags: [{ type: String, trim: true }],
    desc: { type: String, trim: true, default: "" },
    perks: [{ type: String, trim: true }],
    website: { type: String, trim: true, default: "" },
    logo: { type: String, trim: true, default: "" },

    street: { type: String, trim: true, default: "" },
    houseNo: { type: String, trim: true, default: "" },
    postalCode: { type: String, trim: true, default: "" },
    country: { type: String, trim: true, default: "" },
    phoneNo: { type: String, trim: true, default: "" },
    isHeadquarter: { type: Boolean, default: false },
    headquarterPhoneNo: { type: String, trim: true, default: "" },
    isSupport: { type: Boolean, default: false },
    supportPhoneNo: { type: String, trim: true, default: "" },
  },
  { timestamps: true }
);

companySchema.index({ name: "text", industry: "text", location: "text", desc: "text" });

module.exports = mongoose.models.Company || mongoose.model("Company", companySchema);
