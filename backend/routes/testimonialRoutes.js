const express = require("express");
const {
  getTestimonials,
  createTestimonial
} = require("../controller/testimonialController");

const router = express.Router();

router.get("/", getTestimonials);
router.post("/", createTestimonial);

module.exports = router;