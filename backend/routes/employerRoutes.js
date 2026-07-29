const express = require("express");
const router = express.Router();

const {
  getAllEmployers,
  createEmployer,
  updateEmployer,
  toggleEmployerStatus,
} = require("../Controller/employerController");

router.get("/", getAllEmployers);
router.post("/", createEmployer);
router.put("/:id", updateEmployer);
router.patch("/:id/status", toggleEmployerStatus);

module.exports = router;