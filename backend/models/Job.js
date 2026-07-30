const mongoose = require("mongoose");

const jobSchema = new mongoose.Schema(
  {
    job_id: {
      type: Number,
      unique: true,
      sparse: true,
    },

    title: {
      type: String,
      required: [true, "Job title is required."],
      trim: true,
    },

    /*
    |--------------------------------------------------------------------------
    | Company reference
    |--------------------------------------------------------------------------
    */

    company: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Company",
      required: [true, "Company is required."],
    },

    /*
    |--------------------------------------------------------------------------
    | Job location
    |--------------------------------------------------------------------------
    */

    loc: {
      type: String,
      required: [true, "Job location is required."],
      trim: true,
    },

    type: {
      type: String,
      enum: ["Full Time", "Remote", "Hybrid", "Part Time", "Internship"],
      default: "Full Time",
    },

    /*
    |--------------------------------------------------------------------------
    | Salary
    |--------------------------------------------------------------------------
    */

    sal: {
      type: String,
      required: [true, "Salary is required."],
      trim: true,
    },

    logo: {
      type: String,
      default: "",
    },

    lc: {
      type: String,
      default: "",
    },

    category: {
      type: String,
      default: "",
      trim: true,
    },

    description: {
      type: String,
      default: "",
      trim: true,
    },

    requirements: {
      type: [String],
      default: [],
    },

    isFeatured: {
      type: Boolean,
      default: true,
    },

    status: {
      type: String,
      enum: ["Active", "Closed", "Draft"],
      default: "Active",
    },

    isActive: {
      type: Boolean,
      default: true,
    },
  },
  {
    timestamps: true,
  },
);

module.exports = mongoose.model("Job", jobSchema);
