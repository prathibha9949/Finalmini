const Equipment = require("../components/equipment");

// Add a new product
exports.addProduct = async (req, res) => {
  try {
    const { equipmentName, rent, mobile, place, photo } = req.body;
    const sellerId = req.user.id; // Set by authMiddleware

    if (!equipmentName || !rent || !mobile || !place || !photo) {
      return res.status(400).json({ success: false, message: "All fields are required." });
    }

    const newProduct = new Equipment({
      equipmentName,
      rent,
      mobile,
      place,
      photo,
      sellerId, // Save seller ID
    });

    await newProduct.save();

    res.status(201).json({
      success: true,
      message: "Product added successfully.",
      product: newProduct,
    });
  } catch (error) {
    console.error("Error adding product:", error);
    res.status(500).json({ success: false, message: "Internal server error." });
  }
};

// Get all products
exports.getProducts = async (req, res) => {
  try {
    const products = await Equipment.find();
    res.status(200).json({ success: true, products });
  } catch (error) {
    console.error("Error fetching products:", error);
    res.status(500).json({ success: false, message: "Internal server error." });
  }
};

// Get product by ID
exports.getProductById = async (req, res) => {
  try {
    const product = await Equipment.findById(req.params.id);
    if (!product) {
      return res.status(404).json({ success: false, message: "Product not found." });
    }
    res.status(200).json({ success: true, product });
  } catch (error) {
    console.error("Error fetching product:", error);
    res.status(500).json({ success: false, message: "Internal server error." });
  }
};

// Update a product (Only seller can update)
exports.updateProduct = async (req, res) => {
  try {
    const productId = req.params.id;
    const userId = req.user.id;

    const product = await Equipment.findById(productId);

    if (!product) {
      return res.status(404).json({ success: false, message: "Product not found." });
    }

    if (product.sellerId?.toString() !== userId.toString()) {
      return res.status(403).json({ success: false, message: "You are not authorized to update this product." });
    }

    const { equipmentName, rent, mobile, place } = req.body;

    product.equipmentName = equipmentName || product.equipmentName;
    product.rent = rent || product.rent;
    product.mobile = mobile || product.mobile;
    product.place = place || product.place;

    await product.save();

    res.status(200).json({
      success: true,
      message: "Product updated successfully.",
      updatedProduct: product,
    });
  } catch (error) {
    console.error("Error updating product:", error);
    res.status(500).json({ success: false, message: "Internal server error." });
  }
};

// Delete a product (Only seller can delete)
exports.deleteProduct = async (req, res) => {
  try {
    const product = await Equipment.findById(req.params.id);
    const userId = req.user.id;

    if (!product) {
      return res.status(404).json({ success: false, message: "Product not found." });
    }

    if (product.sellerId?.toString() !== userId.toString()) {
      return res.status(403).json({ success: false, message: "You are not authorized to delete this product." });
    }

    await product.deleteOne();

    res.status(200).json({ success: true, message: "Product deleted successfully." });
  } catch (error) {
    console.error("Error deleting product:", error);
    res.status(500).json({ success: false, message: "Internal server error." });
  }
};
