const ContactMessage = require("../models/contactMessage");
const sendContactEmail = require("../services/emailService");

exports.createContactMessage = async (req, res) => {
  try {
    const { name, email, company, subject, message } = req.body;

    const newMessage = await ContactMessage.create({
      name,
      email,
      company,
      subject,
      message,
    });

    try {
      await sendContactEmail({ name, email, company, subject, message });
    } catch (emailErr) {
      console.error("Email error:", emailErr.message);
    }

    res.status(201).json({
      success: true,
      message: "Message received successfully",
      data: newMessage,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Server error",
    });
  }
};

exports.getContactMessage = async (req, res) => {
  try {
    const messages = await ContactMessage.find().sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      count: messages.length,
      messages,
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: err.message,
    });
  }
};