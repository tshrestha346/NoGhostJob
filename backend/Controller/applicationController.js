const mongoose = require("mongoose");
const Application = require("../models/Application");
const Job = require("../models/Job");
const User = require("../models/User");

exports.applyForJob = async (
  req,
  res
) => {
  try {
    const { jobId } = req.params;

    const userId =
      req.user?._id || req.user?.id;

    if (!userId) {
      return res.status(401).json({
        message:
          "Authenticated user was not found.",
      });
    }

    const job = await Job.findById(jobId);

    if (!job) {
      return res.status(404).json({
        message: "Job not found.",
      });
    }

    const existingApplication =
      await Application.findOne({
        job: jobId,
        applicant: userId,
      });

    if (existingApplication) {
      return res.status(409).json({
        message:
          "You have already applied for this job.",
        application:
          existingApplication,
      });
    }

    const application =
      await Application.create({
        applicant: userId,
        job: jobId,
        status: "Submitted",

        jobSnapshot: {
          title: job.title,
          company: job.company,
          location: job.loc,
          type: job.type,
          salary: job.sal,
        },
      });

    return res.status(201).json({
      message:
        "Application submitted successfully.",
      application,
    });
  } catch (error) {
    console.error(
      "Apply for job error:",
      error
    );

    return res.status(500).json({
      message:
        "Failed to submit application.",
      error: error.message,
    });
  }
};
exports.getApplicationStatus = async (
  req,
  res
) => {
  try {
    const { jobId } = req.params;

    const userId =
      req.user?._id || req.user?.id;

    const application =
      await Application.findOne({
        job: jobId,
        applicant: userId,
      });

    return res.status(200).json({
      applied: Boolean(application),
      application,
    });
  } catch (error) {
    console.error(
      "Get application status error:",
      error
    );

    return res.status(500).json({
      message:
        "Failed to check application status.",
      error: error.message,
    });
  }
};

// GET /api/applications/my-applications
exports.getMyApplications = async (
  req,
  res
) => {
  try {
    const userId =
      req.user?._id || req.user?.id;

    console.log(
      "Authenticated user:",
      req.user
    );

    console.log(
      "Authenticated user ID:",
      userId
    );

    if (!userId) {
      return res.status(401).json({
        message:
          "Authenticated user was not found.",
      });
    }

    const applications =
      await Application.find({
        applicant: userId,
      })
        .populate(
          "job",
          "title company loc type sal logo lc category description"
        )
        .sort({
          createdAt: -1,
        });

    return res.status(200).json(
      applications
    );
  } catch (error) {
    console.error(
      "Get applications error:",
      error
    );

    return res.status(500).json({
      message:
        "Failed to load your applications.",
      error: error.message,
    });
  }
};
// GET /api/applications/job/:jobId
// Employer/admin use
exports.getApplicationsForJob = async (req, res) => {
  try {
    const { jobId } = req.params;

    if (!mongoose.Types.ObjectId.isValid(jobId)) {
      return res.status(400).json({
        message: "Invalid job ID.",
      });
    }

    const applications = await Application.find({
      job: jobId,
    })
      .populate("applicant", "fullName name email phoneNo accountType")
      .sort({ createdAt: -1 });

    return res.status(200).json(applications);
  } catch (error) {
    console.error("Get job applications error:", error);

    return res.status(500).json({
      message: "Failed to load job applications.",
      error: error.message,
    });
  }
};

// PATCH /api/applications/:applicationId/status
// Employer/admin use
exports.updateApplicationStatus = async (req, res) => {
  try {
    const { applicationId } = req.params;
    const { status } = req.body;

    const allowedStatuses = [
      "Submitted",
      "Under Review",
      "Shortlisted",
      "Interview",
      "Rejected",
      "Hired",
    ];

    if (!allowedStatuses.includes(status)) {
      return res.status(400).json({
        message: "Invalid application status.",
      });
    }

    const application = await Application.findByIdAndUpdate(
      applicationId,
      { status },
      {
        new: true,
        runValidators: true,
      }
    );

    if (!application) {
      return res.status(404).json({
        message: "Application not found.",
      });
    }

    return res.status(200).json({
      message: "Application status updated successfully.",
      application,
    });
  } catch (error) {
    console.error("Update status error:", error);

    return res.status(500).json({
      message: "Failed to update application status.",
      error: error.message,
    });
  }
};