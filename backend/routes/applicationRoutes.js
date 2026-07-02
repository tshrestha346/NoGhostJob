const express = require("express");
const {
  applyJob,
  getApplications
} = require("../Controller/applicationController");

const router = express.Router();

router.post("/", applyJob);
router.get("/", getApplications);

module.exports = router;