const ContactMessage = require("../models/ContactMessage");
const sendContactEmail = require("../services/emailService");

exports.createContactMessage = async (req, res) => {
  try {
    const { name, email, company, subject, message } = req.body;

    // Save to DB
    const newMessage = await ContactMessage.create({
      name,
      email,
      company,
      subject,
      message,
    });

    // Send email (optional)
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