
const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");
const jwt = require("jsonwebtoken");
const dotenv = require("dotenv");
const bcrypt = require("bcrypt");
const multer = require("multer");
const path = require("path");
const fs = require("fs");
//const { initializeSocket } = require("./socket"); 
const laborerRoutes = require("./routes/laborerRoutes");


// Import verifyToken middleware
console.log("Before importing authmiddleware");
//const verifyToken = require("./middleware/authMiddleware"); 
//const verifyToken = require("../middleware/authMiddleware"); // Ensure the path is correct
//const { verifyToken } = require("./middleware/authMiddleware");
//const verifyToken = require("./middleware/authMiddleware"); // ✅ Correct

const verifyToken = require('./middleware/authMiddleware');

//const verifyToken = require("../middleware/authMiddleware"); // ✅ Correct
const Farmer = require("./components/model"); // Farmer Schema
const Equipment = require("./components/equipment"); // Equipment Schema
const authRoutes = require("./routes/authRoutes");
const productRoutes = require("./routes/productRoutes");
//const { initializeSocket } = require("./socket"); 
dotenv.config();
const app = express();
//const { initializeSocket } = require("./socket"); 
app.use(express.json());


app.use(cors());
app.use(express.json()); // ✅ Allows backend to read JSON body requests
app.use(express.urlencoded({ extended: true })); //
//app.use("/uploads", express.static(path.join(__dirname, "uploads"))); // Serve images statically
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));
//app.use(authMiddleware);
// Use Routes
app.use("/api/auth", authRoutes);
app.use("/api/products", verifyToken, productRoutes); // Protect product routes with verifyToken
app.use("/api/laborers", laborerRoutes);
// Ensure uploads folder exists
const uploadDir = path.join(__dirname, "uploads");
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir);
}

// MongoDB Connection
mongoose
  .connect(process.env.MONGO_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => console.log("✅ MongoDB Connected"))
  .catch((err) => console.error("❌ MongoDB Connection Error:", err));

// Middleware: Token Verification


// Configure Multer for Image Uploads
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, uploadDir);
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + path.extname(file.originalname));
  },
});

const upload = multer({ storage });

// User Signup
app.post("/api/auth/signup", async (req, res) => {
  try {
    const { username, email, password, confirmPassword, role } = req.body;

    // Validate input fields
    if (!username || !email || !password || !confirmPassword || !role) {
      return res.status(400).json({ success: false, message: "All fields are required!" });
    }

    if (password !== confirmPassword) {
      return res.status(400).json({ success: false, message: "Passwords do not match!" });
    }

    // Check if the user already exists
    let existingUser = await Farmer.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ success: false, message: "User already exists!" });
    }

    // Hash Password
    const hashedPassword = await bcrypt.hash(password, 10);
    let newUser = new Farmer({ username, email, password: hashedPassword, role });
    await newUser.save(); // Save the user to the database

    // Generate JWT Token
    const token = jwt.sign({ _id: newUser._id, role: newUser.role }, process.env.JWT_SECRET, { expiresIn: "7d" });

    res.status(201).json({ success: true, message: "User registered successfully!", token });
  } catch (error) {
    console.error("❌ Signup Error:", error);
    res.status(500).json({ success: false, message: "Server error!" });
  }
});

// Fetch User Profile
app.get("/api/auth/profile", verifyToken, async (req, res) => {
  try {
    const user = await Farmer.findById(req.user._id).select("-password");
    if (!user) {
      return res.status(404).json({ success: false, message: "User not found!" });
    }
    res.json(user);
  } catch (error) {
    console.error("Profile error:", error);
    res.status(500).json({ success: false, message: "Server error!" });
  }
});

// Add Equipment (Seller Only)
app.post("/api/products/add", verifyToken, upload.single("photo"), async (req, res) => {
  try {
    const { equipmentName, rent, mobile, place } = req.body;
    const photo = req.file ? `/uploads/${req.file.filename}` : null; // Construct the URL

    console.log("Product Data Received:", { equipmentName, rent, mobile, place, photo }); // Log the received data

    if (!equipmentName || !rent || !mobile || !place) {
      return res.status(400).json({ success: false, message: "All fields except photo are required!" });
    }

    const newEquipment = new Equipment({
      equipmentName,
      rent,
      mobile,
      place,
      photo, // Save the constructed URL
      sellerId: req.user._id,
    });

    await newEquipment.save(); // Save the equipment to the database
    res.json({ success: true, message: "Product added successfully!", product: newEquipment });
  } catch (error) {
    console.error("Equipment Upload Error:", error);
    res.status(500).json({ success: false, message: "Server error!" });
  }
});

// Fetch All Products
app.get("/api/products", async (req, res) => {
  try {
    const products = await Equipment.find().populate("sellerId", "username email");
    res.json({ success: true, products });
  } catch (error) {
    console.error("Fetch Products Error:", error);
    res.status(500).json({ success: false, message: "Server error!" });
  }
});

// Delete Equipment by ID
app.delete("/api/products/:id", verifyToken, async (req, res) => {
  try {
    const { id } = req.params; // Get the product ID from the request parameters
    const deletedProduct = await Equipment.findByIdAndDelete(id); // Delete the product by ID

    if (!deletedProduct) {
      return res.status(404).json({ success: false, message: "Product not found." });
    }

    res.json({ success: true, message: "Product deleted successfully!" });
  } catch (error) {
    console.error("Delete Product Error:", error);
    res.status(500).json({ success: false, message: "Server error!" });
  }
});

// Update Equipment by ID
app.put("/api/products/:id", verifyToken, upload.single("photo"), async (req, res) => {
  try {
    const { id } = req.params;
    const { equipmentName, rent, mobile, place } = req.body;
    const photo = req.file ? `/uploads/${req.file.filename}` : undefined; // Construct the URL if a new photo is uploaded

    const updatedEquipment = await Equipment.findByIdAndUpdate(id, {
      equipmentName,
      rent,
      mobile,
      place,
      photo, // Update photo only if it is provided
    }, { new: true }); // Return the updated document

    if (!updatedEquipment) {
      return res.status(404).json({ success: false, message: "Product not found." });
    }

    res.json({ success: true, message: "Product updated successfully!", product: updatedEquipment });
  } catch (error) {
    console.error("Update Product Error:", error);
    res.status(500).json({ success: false, message: "Server error!" });
  }
});

// Start Server
const PORT = process.env.PORT || 5004;
app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));
