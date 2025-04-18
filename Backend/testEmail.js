require("dotenv").config();
const nodemailer = require("nodemailer");

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

const mailOptions = {
  from: process.env.EMAIL_USER,
  to: "your-email@gmail.com", // Change this to your actual email
  subject: "Test Email from Nodemailer",
  text: "Hello! This is a test email from your backend.",
};

transporter.sendMail(mailOptions, (error, info) => {
  if (error) {
    console.error("❌ Email sending failed:", error);
  } else {
    console.log("✅ Email sent successfully:", info.response);
  }
});
