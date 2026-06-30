const Newsletter = require("../models/Newsletter");

exports.subscribe = async (req, res) => {
  try {
    const { email } = req.body;

    if (!email) {
      return res.status(400).json({ message: "Email is required" });
    }

    const exists = await Newsletter.findOne({ email });

    if (exists) {
      return res.status(400).json({ message: "Email already subscribed" });
    }

    const subscriber = await Newsletter.create({ email });

    res.status(201).json({
      message: "Subscribed successfully",
      subscriber
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};