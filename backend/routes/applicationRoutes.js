const express = require("express");

const {
  applyForJob,
  getApplicationStatus,
  getMyApplications,
  getApplicationsForJob,
  updateApplicationStatus,
  getAllApplications,
} = require("../Controller/applicationController");

const protect = require(
  "../middleware/authMiddleware"
);

const router = express.Router();

// Current logged-in user's applications
router.get(
  "/my-applications",
  protect,
  getMyApplications
);

// Check whether current user applied to a job
router.get(
  "/:jobId/status",
  protect,
  getApplicationStatus
);

// Apply for a job
router.post(
  "/:jobId/apply",
  protect,
  applyForJob
);

// Employer/admin routes
router.get(
  "/job/:jobId",
  protect,
  getApplicationsForJob
);

router.patch(
  "/:applicationId/status",
  protect,
  updateApplicationStatus
);

router.get(
  "/getAllApplications",
  protect,
  getAllApplications
);

module.exports = router;