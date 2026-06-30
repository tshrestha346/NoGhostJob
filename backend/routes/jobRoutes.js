const express = require("express");
const {
  getJobs,
  getJobById,
  createJob,
  deleteJob
} = require("../Controller/jobController");

const router = express.Router();

router.get("/", getJobs);
router.get("/:id", getJobById);
router.post("/", createJob);
router.delete("/:id", deleteJob);

module.exports = router;