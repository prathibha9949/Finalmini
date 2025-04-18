const express = require("express");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const Farmer = require("../components/model"); // Ensure correct model path
const { sendRegistrationEmail } = require("../controllers/authController");

const router = express.Router();

// ✅ User Signup
router.post("/signup", async (req, res) => {
  try {
    const { username, email, password, role } = req.body;
    console.log("🔹 Signup request received:", req.body);

    // Check if user already exists
    const existingUser = await Farmer.findOne({ email });
    if (existingUser) {
      console.log("❌ Email already exists:", email);
      return res.status(200).json({
        success: false,
        message: "User already exists",
        redirect: true,
      });
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create new user
    const newUser = new Farmer({
      username,
      email,
      password: hashedPassword,
      role,
    });

    await newUser.save();
    console.log("✅ User registered:", email);

    // Send welcome email
    try {
      await sendRegistrationEmail(email, username);
      console.log("📩 Registration email sent to:", email);
    } catch (err) {
      console.error("❌ Registration email error:", err);
    }

    return res.status(201).json({
      success: true,
      message: "User registered successfully!",
    });
  } catch (error) {
    console.error("❌ Signup Error:", error);
    return res.status(500).json({ success: false, message: "Server error!" });
  }
});

// ✅ User Login
router.post("/login", async (req, res) => {
  const { email, password } = req.body;
  console.log("🔐 Login attempt for:", email);

  try {
    const user = await Farmer.findOne({ email });

    if (!user) {
      console.log("❌ User not found:", email);
      return res.status(400).json({ success: false, message: "User not found" });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      console.log("❌ Invalid password for:", email);
      return res.status(400).json({ success: false, message: "Incorrect password" });
    }

    const token = jwt.sign(
      { id: user._id, role: user.role },
      process.env.JWT_SECRET || "secret_key",
      { expiresIn: "1h" }
    );

    return res.status(200).json({
      success: true,
      token,
      role: user.role,
      user: {
        id: user._id,
        username: user.username,
        email: user.email,
      },
    });
  } catch (error) {
    console.error("❌ Login Error:", error);
    return res.status(500).json({ success: false, message: "Server error" });
  }
});

module.exports = router;
