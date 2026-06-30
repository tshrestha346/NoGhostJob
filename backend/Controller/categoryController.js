const Category = require("../models/Category");

exports.getCategories = async (req, res) => {
  const categories = await Category.find().sort({ jobs: -1 });
  res.json(categories);
};

exports.createCategory = async (req, res) => {
  const category = await Category.create(req.body);
  res.status(201).json(category);
};