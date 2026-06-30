const Application = require("../models/Application");

exports.applyJob = async (req, res) => {
  try {
    const application = await Application.create(req.body);

    res.status(201).json({
      message: "Application submitted successfully",
      application
    });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

exports.getApplications = async (req, res) => {
  const applications = await Application.find()
    .populate("jobId")
    .sort({ createdAt: -1 });

  res.json(applications);
};