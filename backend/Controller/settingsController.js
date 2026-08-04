const Settings = require("../models/Settings");

exports.getSettings = async (req, res) => {
  try {
    const settings = await Settings.findOne();
    res.status(200).json({ settings: settings || null });
  } catch (err) {
    console.error("getSettings error:", err);
    res.status(500).json({ message: "Failed to fetch settings", error: err.message });
  }
};

exports.updateSettings = async (req, res) => {
  try {
    const {
      name,
      title,
      description,
      mobile_no,
      country,
      state,
      city,
      street,
      house_no,
    } = req.body;

    if (!name || !mobile_no || !country || !state || !city || !street || !house_no) {
      return res.status(400).json({
        message: "name, mobile_no, country, state, city, street, and house_no are required.",
      });
    }

    const existing = await Settings.findOne();

    const payload = {
      name,
      title,
      description,
      mobile_no,
      country,
      state,
      city,
      street,
      house_no,
    };

    let settings;
    if (existing) {
      settings = await Settings.findByIdAndUpdate(existing._id, payload, {
        new: true,
        runValidators: true,
      });
    } else {
      settings = await Settings.create(payload);
    }

    res.status(200).json({ settings });
  } catch (err) {
    console.error("updateSettings error:", err);
    res.status(500).json({ message: "Failed to update settings", error: err.message });
  }
};