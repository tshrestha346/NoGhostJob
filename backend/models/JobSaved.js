const mongoose = require("mongoose");

const jobSavedSchema = new mongoose.Schema(
  {
    user_id: { type: Number},
    job_id: { type: Number},
    is_saved: { type: Boolean, default: false }
  },
  { timestamps: true }
);

module.exports = mongoose.model("JobSaved", jobSavedSchema);