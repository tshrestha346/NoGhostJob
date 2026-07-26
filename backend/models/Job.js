const mongoose = require("mongoose");

const jobSchema = new mongoose.Schema(
  {
    job_id: {type: Number, unique: true},
    title: { type: String, required: true },
    company: { type: String, required: true },
    loc: { type: String, required: true },
    type: {
      type: String,
      enum: ["Full Time", "Remote", "Hybrid", "Part Time", "Internship"],
      default: "Full Time"
    },
    sal: { type: String, required: true },
    logo: String,
    lc: String,
    category: String,
    description: String,
    requirements: [String],
    isFeatured: { type: Boolean, default: true },
    is_active: { type: Boolean, default: true },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Job", jobSchema);