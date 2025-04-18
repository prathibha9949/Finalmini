const express = require("express");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const Farmer = require("../components/model");
const { sendRegistrationEmail, sendLoginEmail } = require("../controllers/authController");

const router = express.Router();

// ✅ User Signup Route
router.post("/signup", async (req, res) => {
  try {
    console.log("🔹 Signup request received:", req.body);
    
    const { username, email, password, role } = req.body;
    const existingUser = await Farmer.findOne({ email });

    if (existingUser) {
      return res.status(400).json({ message: "Email already exists!" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser = new Farmer({ username, email, password: hashedPassword, role });

    await newUser.save();
    console.log("✅ User registered successfully:", email);

    // 🚀 Send welcome email
    await sendRegistrationEmail(email, username);
    console.log("📩 Email sent successfully to:", email);

    res.status(201).json({ message: "User registered successfully!" });
  } catch (error) {
    console.error("❌ Signup Error:", error);
    res.status(500).json({ message: "Server error!" });
  }
});

// ✅ User Login Route
router.post("/login", async (req, res) => {
  try {
    console.log("🔹 Received login request body:", req.body);

    const { email, password } = req.body;
    if (!email || !password) {
      return res.status(400).json({ message: "Email and password are required!" });
    }

    const user = await Farmer.findOne({ email });
    if (!user) return res.status(404).json({ message: "User not found!" });

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(400).json({ message: "Invalid credentials!" });

    const token = jwt.sign({ _id: user._id, role: user.role }, process.env.JWT_SECRET, { expiresIn: "7d" });

    console.log("✅ Login successful for user:", email);

    // Send login confirmation email
    await sendLoginEmail(email, user.username);

    res.json({ success: true, message: "Login successful!", token, role: user.role });
  } catch (error) {
    console.error("❌ Login Error:", error);
    res.status(500).json({ message: "Server error!" });
  }
});

module.exports = router;
