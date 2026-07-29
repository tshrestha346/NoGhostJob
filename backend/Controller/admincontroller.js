const mongoose = require("mongoose");

const Employer = require("../models/Company");
const Job = require("../models/Job");
const User = require("../models/user");

// exports.getAllEmployers = async (req, res) => {
//   try {
//     const employers = await Employer.aggregate([
//       {
//         $lookup: {
//           from: Job.collection.name,
//           localField: "_id",
//           foreignField: "company",
//           as: "jobs",
//         },
//       },
//       {
//         $project: {
//           companyName: 1,
//           name: 1,
//           email: 1,
//           contactEmail: 1,
//           industry: 1,
//           isActive: 1,
//           status: 1,
//           createdAt: 1,
//           jobsCount: { $size: "$jobs" },
//         },
//       },
//       { $sort: { createdAt: -1 } },
//     ]);

//     res.status(200).json({ employers });
//   } catch (err) {
//     console.error("getAllEmployers error:", err);
//     res.status(500).json({ message: "Failed to fetch employers", error: err.message });
//   }
// };

exports.getAllEmployers = async (req, res) => {
  try {
    const employers = await Employer.find()
      .populate("owner", "fullName email")
      .sort({ createdAt: -1 })
      .lean();

    const result = await Promise.all(
      employers.map(async (emp) => {
        const jobsCount = await Job.countDocuments({ company: emp._id });
        return {
          _id: emp._id,
          name: emp.name,
          industry: emp.industry,
          location: emp.location,
          size: emp.size,
          isActive: emp.isActive,
          createdAt: emp.createdAt,
          email: emp.owner?.email,
          ownerName: emp.owner?.fullName,
          jobsCount,
          website: emp.website,
          description: emp.description,
          founded: emp.founded,
          initials: emp.initials,
          logo: emp.logo
        };
      })
    );

    res.status(200).json({ employers: result });
  } catch (err) {
    console.error("getAllEmployers error:", err);
    res.status(500).json({ message: "Failed to fetch employers", error: err.message });
  }
};

exports.getUsersCount = async (req, res) => {
  try {
    const count = await User.countDocuments();
    res.status(200).json({ count });
  } catch (err) {
    console.error("getUsersCount error:", err);
    res.status(500).json({ message: "Failed to count users", error: err.message });
  }
};

exports.getAllJobsForAdmin = async (req, res) => {
  try {
    const jobs = await Job.find()
      .populate("company", "name")
      .sort({ createdAt: -1 })
      .lean();

    const mapped = jobs.map((job) => ({
      _id: job._id,
      title: job.title,
      companyName: job.company?.name,
      location: job.location,
      jobType: job.jobType,
      createdAt: job.createdAt,
    }));

    res.status(200).json({ jobs: mapped });
  } catch (err) {
    console.error("getAllJobsForAdmin error:", err);
    res.status(500).json({ message: "Failed to fetch jobs", error: err.message });
  }
};