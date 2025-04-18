const express = require("express");
const multer = require("multer");
const path = require("path");
const Equipment = require("../components/equipment");
const verifyToken = require("../middleware/authMiddleware");

const router = express.Router();

// 📦 Multer Setup
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, path.join(__dirname, "../uploads"));
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + path.extname(file.originalname));
  },
});
const upload = multer({ storage });

/* ✅ Add Equipment - Only for sellers */
router.post("/add", verifyToken, upload.single("photo"), async (req, res) => {
  if (req.user.role !== "seller") {
    return res.status(403).json({ message: "Only sellers are allowed to add equipment." });
  }

  try {
    const { equipmentName, rent, mobile, place } = req.body;
    const photo = req.file ? `/uploads/${req.file.filename}` : null;

    console.log("🔍 req.user:", req.user);

    const newEquipment = new Equipment({
      equipmentName,
      rent,
      mobile,
      place,
      photo,
      seller: req.user._id,
    });

    await newEquipment.save();

    res.json({ success: true, message: "Product added successfully!", product: newEquipment });
  } catch (error) {
    console.error("❌ Equipment Upload Error:", error);
    res.status(500).json({ success: false, message: "Server error!" });
  }
});

/* ✅ Get All Equipment - No role restriction */
router.get("/", verifyToken, async (req, res) => {
  try {
    const products = await Equipment.find();
    res.json({ success: true, products });
  } catch (error) {
    console.error("❌ Error fetching products:", error);
    res.status(500).json({ success: false, message: "Server error while fetching equipment." });
  }
});

/* ✅ Update Equipment - Only by the seller who created it */
router.put("/:id", verifyToken, upload.single("photo"), async (req, res) => {
  if (req.user.role !== "seller") {
    return res.status(403).json({ message: "Only sellers can update equipment." });
  }

  try {
    const product = await Equipment.findById(req.params.id);
    if (!product) return res.status(404).json({ message: "Product not found." });

    if (!product.seller || product.seller.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: "Unauthorized: You can only update your own products." });
    }

    const { equipmentName, rent, mobile, place } = req.body;
    const photo = req.file ? `/uploads/${req.file.filename}` : product.photo;

    Object.assign(product, { equipmentName, rent, mobile, place, photo });

    await product.save();
   // res.status(200).json({ message: "Product updated successfully", product });
   res.status(200).json({ success: true, message: "Product updated successfully", updatedProduct: product });

  } catch (error) {
    console.error("❌ Update Error:", error);
    res.status(500).json({ message: "Server error while updating product." });
  }
});

/* ✅ Delete Equipment - Only by the seller who created it */
router.delete("/:id", verifyToken, async (req, res) => {
  try {
    if (req.user.role !== "seller") {
      return res.status(403).json({ message: "Only sellers can delete equipment." });
    }

    const product = await Equipment.findById(req.params.id);
    if (!product) {
      return res.status(404).json({ message: "Product not found" });
    }

    if (!product.seller || product.seller.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: "You can only delete your own product." });
    }

    await product.deleteOne();
    res.status(200).json({ message: "Product deleted successfully" });
  } catch (error) {
    console.error("❌ Delete Error:", error);
    res.status(500).json({ message: "Server error" });
  }
});

module.exports = router;
