const mongoose = require("mongoose");
const Members = require("../models/Members");

exports.getAllMembers = async (req, res) => {
  try {
    const members = await Members.find();
    res.status(200).json({ members });
  } catch (err) {
    console.error("getAllMembers error:", err);
    res.status(500).json({ message: "Failed to fetch members", error: err.message });
  }
};

exports.createMember = async (req, res) => {
  try {
    const { title, full_name, designation, description, image } = req.body;

    if (!full_name) {
      return res.status(400).json({ message: "full_name is required." });
    }

    const member = await Members.create({
      title,
      full_name,
      designation,
      description,
      image: image || null,
    });

    res.status(201).json({ member });
  } catch (err) {
    console.error("createMember error:", err);
    res.status(500).json({ message: "Failed to create member", error: err.message });
  }
};

exports.updateMember = async (req, res) => {
  try {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ message: "Invalid member id." });
    }

    const { title, full_name, designation, description, image } = req.body;

    const updated = await Members.findByIdAndUpdate(
      id,
      {
        ...(title !== undefined && { title }),
        ...(full_name !== undefined && { full_name }),
        ...(designation !== undefined && { designation }),
        ...(description !== undefined && { description }),
        ...(image !== undefined && { image }),
      },
      { new: true, runValidators: true }
    );

    if (!updated) {
      return res.status(404).json({ message: "Member not found." });
    }

    res.status(200).json({ member: updated });
  } catch (err) {
    console.error("updateMember error:", err);
    res.status(500).json({ message: "Failed to update member", error: err.message });
  }
};

exports.deleteMember = async (req, res) => {
  try {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ message: "Invalid member id." });
    }

    const deleted = await Members.findByIdAndDelete(id);

    if (!deleted) {
      return res.status(404).json({ message: "Member not found." });
    }

    res.status(200).json({ message: "Member deleted." });
  } catch (err) {
    console.error("deleteMember error:", err);
    res.status(500).json({ message: "Failed to delete member", error: err.message });
  }
};