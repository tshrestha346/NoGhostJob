const express = require("express");
const {
  getCompanies,
  getCompanyById,
  getCompanyJobs,
  createCompany,
  updateCompany,
  deleteCompany,
} = require("../Controller/companyController");
// const { protect, adminOnly } = require("../middleware/authMiddleware");

const router = express.Router();

router.get("/", getCompanies);
router.get("/:id/jobs", getCompanyJobs);
router.get("/:id", getCompanyById);

// Add protect/adminOnly here in production.
router.post("/", createCompany);
router.put("/:id", updateCompany);
router.patch("/:id", updateCompany);
router.delete("/:id", deleteCompany);

module.exports = router;
