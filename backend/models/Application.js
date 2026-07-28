const mongoose = require("mongoose");

const applicationSchema = new mongoose.Schema(
  {
    job: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Job",
      required: true,
    },

    applicant: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    // User information saved when applying
applicantSnapshot: {
  fullName: {
    type: String,
    default: "",
  },

  email: {
    type: String,
    default: "",
  },

  phoneNo: {
    type: String,
    default: "",
  },

  cv: {
    type: mongoose.Schema.Types.Mixed,
    default: {},
  },

  cvPdfUrl: {
    type: String,
    default: "",
  },

  cvPdfFilename: {
    type: String,
    default: "",
  },
},

    // Job information saved when applying
    jobSnapshot: {
      title: {
        type: String,
        required: true,
      },
      company: {
        type: String,
        required: true,
      },
      location: {
        type: String,
        default: "",
      },
      type: {
        type: String,
        default: "",
      },
    },
rejectionReason: {
  type: String,
  default: "",
  trim: true,
},
    status: {
      type: String,
      enum: [
        "Submitted",
        "Under Review",
        "Shortlisted",
        "Interview",
        "Rejected",
        "Hired",
      ],
      default: "Submitted",
    },

    coverLetter: {
      type: String,
      default: "",
    },

    appliedAt: {
      type: Date,
      default: Date.now,
    },
  },
  {
    timestamps: true,
  }
);

// A user cannot apply for the same job twice
applicationSchema.index(
  {
    job: 1,
    applicant: 1,
  },
  {
    unique: true,
  }
);

module.exports = mongoose.model("Application", applicationSchema);