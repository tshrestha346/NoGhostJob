const express = require("express");
const router = express.Router();

const {
  getAllEmployers,
  getUsersCount,
  getAllJobsForAdmin,
} = require("../Controller/admincontroller");

router.get("/employers", getAllEmployers);
router.get("/users/count", getUsersCount);
router.get("/jobs", getAllJobsForAdmin);

module.exports = router;