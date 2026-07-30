const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
const Company = require("../models/Company");
const Job = require("../models/Job");
const User = require("../models/user");

/**
 * GET /api/admin/employers
 * List all employers with their owner's basic info and a computed jobsCount.
 */
exports.getAllEmployers = async (req, res) => {
  try {
    const employers = await Company.find()
      .populate("owner", "fullName email")
      .sort({ createdAt: -1 })
      .lean();

    const withJobCounts = await Promise.all(
      employers.map(async (emp) => {
        const jobsCount = await Job.countDocuments({ company: emp._id });
        return {
          _id: emp._id,
          name: emp.name,
          initials: emp.initials,
          industry: emp.industry,
          location: emp.location,
          size: emp.size,
          website: emp.website,
          description: emp.description,
          founded: emp.founded,
          logo: emp.logo,
          isActive: emp.isActive,
          ownerId: emp.owner?._id,
          ownerName: emp.owner?.fullName,
          email: emp.owner?.email,
          jobsCount,
          createdAt: emp.createdAt,
        };
      })
    );

    res.status(200).json({ employers: withJobCounts });
  } catch (err) {
    console.error("getAllEmployers error:", err);
    res.status(500).json({ message: "Failed to fetch employers", error: err.message });
  }
};

/**
 * POST /api/admin/employers
 * Create a new employer/company AND the User account that owns it, in one go.
 *
 * Body:
 *   name, industry, location, size            (required, Company)
 *   website, description, founded, logo       (optional, Company)
 *   ownerFullName, ownerEmail, ownerPassword   (required, User)
 *
 * The created User gets accountType: "employer" and termsAndCondition: true
 * automatically (admin is creating the account on the employer's behalf).
 */
exports.createEmployer = async (req, res) => {
  try {
    const {
      name,
      initials,
      industry,
      location,
      size,
      website,
      description,
      founded,
      logo,
      isActive,
      ownerFullName,
      ownerEmail,
      ownerPassword,
    } = req.body;

    if (!name || !industry || !location || !size) {
      return res.status(400).json({
        message: "name, industry, location, and size are required.",
      });
    }

    if (!ownerFullName || !ownerEmail || !ownerPassword) {
      return res.status(400).json({
        message: "ownerFullName, ownerEmail, and ownerPassword are required.",
      });
    }

    const normalisedEmail = ownerEmail.toLowerCase().trim();

    const existingUser = await User.findOne({ email: normalisedEmail });
    if (existingUser) {
      return res.status(409).json({ message: "A user with this email already exists." });
    }

    const hashedPassword = await bcrypt.hash(ownerPassword, 10);

    // Create the user first (without a company), then the company, then link them.
    // If company creation fails, roll back the user so we don't leave an orphan.
    const user = await User.create({
      fullName: ownerFullName,
      email: normalisedEmail,
      password: hashedPassword,
      accountType: "employer",
      termsAndCondition: true,
    });

    try {
      const company = await Company.create({
        name,
        initials,
        industry,
        location,
        size,
        website,
        description,
        founded: founded || null,
        logo,
        owner: user._id,
        isActive: isActive ?? true,
      });

      user.company = company._id;
      await user.save();

      res.status(201).json({ employer: company, owner: { _id: user._id, fullName: user.fullName, email: user.email } });
    } catch (companyErr) {
      await User.findByIdAndDelete(user._id);
      throw companyErr;
    }
  } catch (err) {
    console.error("createEmployer error:", err);
    res.status(500).json({ message: "Failed to create employer", error: err.message });
  }
};

/**
 * PUT /api/admin/employers/:id
 * Update an existing employer/company's details.
 */
exports.updateEmployer = async (req, res) => {
  try {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ message: "Invalid employer id." });
    }

    const {
      name,
      initials,
      industry,
      location,
      size,
      website,
      description,
      founded,
      logo,
    } = req.body;

    const updated = await Company.findByIdAndUpdate(
      id,
      {
        ...(name !== undefined && { name }),
        ...(initials !== undefined && { initials }),
        ...(industry !== undefined && { industry }),
        ...(location !== undefined && { location }),
        ...(size !== undefined && { size }),
        ...(website !== undefined && { website }),
        ...(description !== undefined && { description }),
        ...(founded !== undefined && { founded }),
        ...(logo !== undefined && { logo }),
      },
      { new: true, runValidators: true }
    );

    if (!updated) {
      return res.status(404).json({ message: "Employer not found." });
    }

    res.status(200).json({ employer: updated });
  } catch (err) {
    console.error("updateEmployer error:", err);
    res.status(500).json({ message: "Failed to update employer", error: err.message });
  }
};

/**
 * PATCH /api/admin/employers/:id/status
 * Toggle (or explicitly set) an employer's active/inactive status.
 * Body: { isActive?: boolean } — if omitted, the current status is flipped.
 */
exports.toggleEmployerStatus = async (req, res) => {
  try {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ message: "Invalid employer id." });
    }

    const company = await Company.findById(id);
    if (!company) {
      return res.status(404).json({ message: "Employer not found." });
    }

    const nextStatus =
      typeof req.body.isActive === "boolean" ? req.body.isActive : !company.isActive;

    company.isActive = nextStatus;
    await company.save();

    res.status(200).json({ employer: company });
  } catch (err) {
    console.error("toggleEmployerStatus error:", err);
    res.status(500).json({ message: "Failed to update employer status", error: err.message });
  }
};