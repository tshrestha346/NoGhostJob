const mongoose = require("mongoose");

const jobUserSchema = new mongoose.Schema(
  {
    user_id: { type: Number},
    job_id: { type: Number}, 
    isScreening: { type: Boolean, default: true},
    is_shortlisted: { type: Boolean, default: true }, 
    interview_status: { type: Number, default: 0 },
    // 0 = not selected, 1 = selected, 2 = candidate selected for job

    is_offered: { type: Boolean, default: false },
    is_rejected: { type: Boolean, default: false },
    remarsk: { type: Text , default: null }
  },
  { timestamps: true }
);

module.exports = mongoose.model("JobUser", jobUserSchema);