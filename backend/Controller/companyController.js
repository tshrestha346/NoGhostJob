const mongoose = require("mongoose");
const Company = require("../models/Company");
const Job = require("../models/Job");

const asyncHandler = (handler) => async (req, res, next) => {
  try {
    await handler(req, res, next);
  } catch (error) {
    next(error);
  }
};

const buildSort = (sort) => {
  const values = {
    top: { rating: -1, reviews: -1 },
    openings: { openings: -1, rating: -1 },
    reviews: { reviews: -1, rating: -1 },
    newest: { founded: -1, createdAt: -1 },
    oldest: { founded: 1 },
    name: { name: 1 },
  };
  return values[sort] || values.top;
};

const cleanArray = (value) => {
  if (!value) return undefined;
  const source = Array.isArray(value) ? value : String(value).split(",");
  return source.map((item) => String(item).trim()).filter(Boolean);
};

const normaliseBody = (body) => ({
  ...body,
  tags: cleanArray(body.tags),
  perks: cleanArray(body.perks),
});

exports.getCompanies = asyncHandler(async (req, res) => {
  const {
    search = "",
    industry,
    size,
    type,
    tag,
    sort = "top",
    page = 1,
    limit = 12,
  } = req.query;

  const filter = {};
  const trimmedSearch = String(search).trim();

  if (trimmedSearch) {
    filter.$or = [
      { name: { $regex: trimmedSearch, $options: "i" } },
      { industry: { $regex: trimmedSearch, $options: "i" } },
      { location: { $regex: trimmedSearch, $options: "i" } },
      { desc: { $regex: trimmedSearch, $options: "i" } },
    ];
  }

  if (industry && industry !== "All") filter.industry = industry;
  if (size && size !== "All Sizes") filter.size = size;
  if (type && type !== "All Types") filter.type = type;
  if (tag) filter.tags = tag;

  const safePage = Math.max(Number(page) || 1, 1);
  const safeLimit = Math.min(Math.max(Number(limit) || 12, 1), 100);

  const [companies, total] = await Promise.all([
    Company.find(filter)
      .sort(buildSort(sort))
      .skip((safePage - 1) * safeLimit)
      .limit(safeLimit)
      .lean(),
    Company.countDocuments(filter),
  ]);

  res.json({
    companies,
    pagination: {
      page: safePage,
      limit: safeLimit,
      total,
      pages: Math.ceil(total / safeLimit),
      hasMore: safePage * safeLimit < total,
    },
  });
});

exports.getCompanyById = asyncHandler(async (req, res) => {
  if (!mongoose.isValidObjectId(req.params.id)) {
    return res.status(400).json({ message: "Invalid company id" });
  }

  const company = await Company.findById(req.params.id).lean();
  if (!company) return res.status(404).json({ message: "Company not found" });

  const openings = await Job.countDocuments({ company: company._id });
  res.json({ ...company, openings });
});

exports.getCompanyJobs = asyncHandler(async (req, res) => {
  if (!mongoose.isValidObjectId(req.params.id)) {
    return res.status(400).json({ message: "Invalid company id" });
  }

  const company = await Company.findById(req.params.id).lean();
  if (!company) return res.status(404).json({ message: "Company not found" });

  const {
    search = "",
    location,
    jobType,
    experience,
    sort = "newest",
    page = 1,
    limit = 12,
  } = req.query;

  const filter = { company: company._id };
  const q = String(search).trim();

  if (q) {
    filter.$or = [
      { title: { $regex: q, $options: "i" } },
      { description: { $regex: q, $options: "i" } },
      { skills: { $elemMatch: { $regex: q, $options: "i" } } },
    ];
  }
  if (location) filter.location = { $regex: location, $options: "i" };
  if (jobType && jobType !== "All") filter.jobType = jobType;
  if (experience && experience !== "All") filter.experienceLevel = experience;

  const safePage = Math.max(Number(page) || 1, 1);
  const safeLimit = Math.min(Math.max(Number(limit) || 12, 1), 100);
  const jobSort = sort === "oldest" ? { createdAt: 1 } : { createdAt: -1 };

  const [jobs, total] = await Promise.all([
    Job.find(filter)
      .populate("company", "name initials color industry location")
      .sort(jobSort)
      .skip((safePage - 1) * safeLimit)
      .limit(safeLimit)
      .lean(),
    Job.countDocuments(filter),
  ]);

  res.json({
    company: { ...company, openings: total },
    jobs,
    pagination: {
      page: safePage,
      limit: safeLimit,
      total,
      pages: Math.ceil(total / safeLimit),
      hasMore: safePage * safeLimit < total,
    },
  });
});

exports.createCompany = asyncHandler(async (req, res) => {
  const company = await Company.create(normaliseBody(req.body));
  res.status(201).json(company);
});

exports.updateCompany = asyncHandler(async (req, res) => {
  if (!mongoose.isValidObjectId(req.params.id)) {
    return res.status(400).json({ message: "Invalid company id" });
  }

  const company = await Company.findByIdAndUpdate(
    req.params.id,
    normaliseBody(req.body),
    { new: true, runValidators: true }
  );

  if (!company) return res.status(404).json({ message: "Company not found" });
  res.json(company);
});

exports.deleteCompany = asyncHandler(async (req, res) => {
  if (!mongoose.isValidObjectId(req.params.id)) {
    return res.status(400).json({ message: "Invalid company id" });
  }

  const jobsCount = await Job.countDocuments({ company: req.params.id });
  if (jobsCount > 0 && req.query.force !== "true") {
    return res.status(409).json({
      message: `This company has ${jobsCount} job(s). Delete or reassign them first, or use ?force=true.`,
    });
  }

  if (jobsCount > 0) await Job.deleteMany({ company: req.params.id });

  const company = await Company.findByIdAndDelete(req.params.id);
  if (!company) return res.status(404).json({ message: "Company not found" });

  res.json({ message: "Company deleted successfully" });
});
