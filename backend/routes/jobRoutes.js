const express = require("express");

const {
  getJobs,
  getJobById,
  createJob,
  updateJob,
  updateJobStatus,
  deleteJob,
} = require(
  "../Controller/jobController"
);

const router = express.Router();

router.get("/", getJobs);

router.post("/", createJob);

router.patch(
  "/:id/status",
  updateJobStatus
);

router.get("/:id", getJobById);

router.put("/:id", updateJob);

router.delete("/:id", deleteJob);

module.exports = router;