const express = require("express");
const {
  getTestimonials,
  createTestimonial
} = require("../Controller/testimonialController");

const router = express.Router();

router.get("/", getTestimonials);
router.post("/", createTestimonial);

module.exports = router;