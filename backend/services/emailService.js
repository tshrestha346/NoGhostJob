const nodemailer = require("nodemailer");

const transporter = nodemailer.createTransport({
  host: process.env.MAILTRAP_HOST,
  port: process.env.MAILTRAP_PORT,
  auth: {
    user: process.env.MAILTRAP_USER,
    pass: process.env.MAILTRAP_PASS,
  },
});

const sendContactEmail = async (data) => {
  await transporter.sendMail({
    from: `"Contact Form" <no-reply@yourapp.com>`,
    to: process.env.RECEIVER_EMAIL,
    subject: data.subject || "New Contact Message",
    html: `
      <h2>New Contact Request</h2>
      <p><b>Name:</b> ${data.name}</p>
      <p><b>Email:</b> ${data.email}</p>
      <p><b>Company:</b> ${data.company || "-"}</p>
      <p><b>Message:</b> ${data.message}</p>
    `,
  });
};

module.exports = sendContactEmail;