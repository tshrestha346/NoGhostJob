const Company = require("../models/Company");

exports.getCompanies = async (req, res) => {
  const companies = await Company.find().sort({ openings: -1 });
  res.json(companies);
};

exports.createCompany = async (req, res) => {
  const company = await Company.create(req.body);
  res.status(201).json(company);
};