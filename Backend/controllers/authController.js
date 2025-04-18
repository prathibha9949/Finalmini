const nodemailer = require("nodemailer");
require("dotenv").config();

// Log environment variables (for debugging only)
console.log("✅ Email service configured with:", process.env.EMAIL_USER);

// Create transporter for Gmail
const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

// Send email after successful signup
const sendRegistrationEmail = async (email, username) => {
  try {
    console.log(`📧 Sending registration email to: ${email}`);

    const mailOptions = {
      from: `"AgroRentHub" <${process.env.EMAIL_USER}>`,
      to: email,
      subject: "Welcome to AgroRentHub! 🌱",
      text: `Welcome, ${username}! Thank you for registering with AgroRentHub.`,
      html: `
        <h2>Welcome, ${username}! 🎉</h2>
        <p>Thank you for registering with <b>AgroRentHub</b>.</p>
        <p>We're excited to have you on board! 🚜</p>
        <br>
        <p>Best regards,<br><b>AgroRentHub Team</b></p>
      `,
    };

    const info = await transporter.sendMail(mailOptions);
    console.log(`✅ Registration email sent to ${email}:`, info.response);
  } catch (error) {
    console.error("❌ Failed to send registration email:", error);
  }
};

// Send email after successful login
// const sendLoginEmail = async (email, username) => {
//   try {
//     console.log(`📧 Sending login email to: ${email}`);

//     const mailOptions = {
//       from: `"AgroRentHub" <${process.env.EMAIL_USER}>`,
//       to: email,
//       subject: "Login Alert - AgroRentHub 🚀",
//       text: `Hi ${username}, you just logged into your AgroRentHub account.`,
//       html: `
//         <h2>Hello, ${username}!</h2>
//         <p>You have successfully logged into your <b>AgroRentHub</b> account.</p>
//         <p>If this wasn't you, please reset your password immediately! 🔐</p>
//         <br>
//         <p>Best regards,<br><b>AgroRentHub Security Team</b></p>
//       `,
//     };

//     const info = await transporter.sendMail(mailOptions);
//     console.log(`✅ Login email sent to ${email}:`, info.response);
//   } catch (error) {
//     console.error("❌ Failed to send login email:", error);
//   }
// };

module.exports = {
  sendRegistrationEmail,
  //sendLoginEmail,
};
