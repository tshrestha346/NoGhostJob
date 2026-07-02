const express = require("express");
const {
  getCompanies,
  createCompany
} = require("../Controller/companyController");

const router = express.Router();

router.get("/", getCompanies);
router.post("/", createCompany);

module.exports = router;