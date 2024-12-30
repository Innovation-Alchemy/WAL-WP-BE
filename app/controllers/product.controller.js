const db = require("../models");
const Product = db.Product;
const { createProductSchema } = require("../utils/validations");

exports.getAllProducts = async (req, res) => {
  try {
    const products = await Product.findAll();
    res.status(200).json({
      message: "Products retrieved successfully",
      data: products,
    });
  } catch (error) {
    console.error("Error retrieving products:", error);
    res.status(500).json({ message: "Error retrieving products", error: error.message });
  }
};

exports.getProductById = async (req, res) => {
  try {
    const product = await Product.findByPk(req.params.id);
    if (!product) return res.status(404).json({ message: "Product not found" });
    res.status(200).json({
      message: "Product retrieved successfully",
      data: product,
    });
  } catch (error) {
    console.error("Error retrieving product:", error);
    res.status(500).json({ message: "Error retrieving product", error: error.message });
  }
};

exports.createProduct = async (req, res) => {
  try {
    // Parse fields if they are strings
    if (typeof req.body.price === "string") {
      try {
        req.body.price = JSON.parse(req.body.price);
      } catch (error) {
        return res.status(400).json({ message: "Price must be a valid JSON array or a single number." });
      }
    }

    if (typeof req.body.size === "string") {
      try {
        req.body.size = JSON.parse(req.body.size);
      } catch (error) {
        return res.status(400).json({ message: "Size must be a valid JSON array." });
      }
    }

    if (typeof req.body.color === "string") {
      try {
        req.body.color = JSON.parse(req.body.color);
      } catch (error) {
        return res.status(400).json({ message: "Color must be a valid JSON array." });
      }
    }

    // Validate price combinations
    const { size, color, price } = req.body;
    const expectedCombinations = size.length * color.length;

    if (price.length !== expectedCombinations) {
      return res.status(400).json({
        message: `Price array length must match the total combinations of size (${size.length}) x color (${color.length}), which is ${expectedCombinations}.`,
      });
    }

    // Handle uploaded images
    let image = [];
    if (req.files && req.files.length > 0) {
      image = req.files.map((file) =>
        process.env.NODE_ENV === "production"
          ? `https://yourdomain.com/${file.path.replace(/\\/g, "/")}`
          : `http://localhost:8080/${file.path.replace(/\\/g, "/")}`
      );
    }

    const { name, description, user_id, commission, is_approved, stock_alert } = req.body;

    // Validate the request body
    const { error } = createProductSchema.validate(req.body);
    if (error) {
      return res.status(400).json({ message: error.details[0].message });
    }

    // Determine is_approved value
    const user = await db.User.findByPk(user_id);
    if (!user) {
      return res.status(404).json({ message: "User not found." });
    }
    const approvalStatus =
      user.role === "Admin"
        ? true // Admin-created products are automatically approved
        : is_approved || false; // Use provided value if available; default to false

    // Create the product
    const newProduct = await Product.create({
      user_id,
      name,
      description,
      price,
      size,
      color,
      commission: commission || 100.0, // Default to 100% commission if not provided
      is_approved: approvalStatus,
      stock_alert,
      image, // Save image URLs in the database
    });

    res.status(201).json({
      message: "Product created successfully",
      data: newProduct,
    });
  } catch (error) {
    console.error("Error creating product:", error);
    res.status(500).json({ message: "Error creating product", error: error.message });
  }
};

exports.updateProduct = async (req, res) => {
  try {
    const product = await Product.findByPk(req.params.id);

    if (!product) {
      return res.status(404).json({ message: "Product not found" });
    }

    // Parse fields if they are strings
    if (typeof req.body.price === "string") {
      try {
        req.body.price = JSON.parse(req.body.price);
      } catch (error) {
        return res.status(400).json({ message: "Price must be a valid JSON array or a single number." });
      }
    }

    if (typeof req.body.size === "string") {
      try {
        req.body.size = JSON.parse(req.body.size);
      } catch (error) {
        return res.status(400).json({ message: "Size must be a valid JSON array." });
      }
    }

    if (typeof req.body.color === "string") {
      try {
        req.body.color = JSON.parse(req.body.color);
      } catch (error) {
        return res.status(400).json({ message: "Color must be a valid JSON array." });
      }
    }

    const { name, description, price, size, color, commission, is_approved,stock_alert } = req.body;

    // Validate price combinations
    if (size && color && price) {
      const expectedCombinations = size.length * color.length;

      if (price.length !== expectedCombinations) {
        return res.status(400).json({
          message: `Price array length must match the total combinations of size (${size.length}) x color (${color.length}), which is ${expectedCombinations}.`,
        });
      }
    }

    // Handle uploaded images
    let image = Array.isArray(product.image) ? product.image : []; // Ensure image is an array
    if (req.files && req.files.length > 0) {
      const newImages = req.files.map((file) =>
        process.env.NODE_ENV === "production"
          ? `https://yourdomain.com/${file.path.replace(/\\/g, "/")}`
          : `http://localhost:8080/${file.path.replace(/\\/g, "/")}`
      );
      // Merge existing and new images
      image = [...image, ...newImages];
    }

    // Determine is_approved value
    const user = await db.User.findByPk(product.user_id);
    if (!user) {
      return res.status(404).json({ message: "User not found." });
    }
    const approvalStatus =
      user.role === "Admin"
        ? true // Admin-updated products are automatically approved
        : is_approved !== undefined
        ? is_approved
        : product.is_approved; // Keep existing value if not explicitly provided

    // Update the product
    await product.update({
      name: name !== undefined ? name : product.name,
      description: description !== undefined ? description : product.description,
      price: price !== undefined ? price : product.price,
      size: size !== undefined ? size : product.size,
      color: color !== undefined ? color : product.color,
      commission: commission !== undefined ? commission : product.commission,
      stock_alert: stock_alert!==undefined?stock_alert:product.stock_alert,
      is_approved: approvalStatus,
      image, // Save updated images
    });

    res.status(200).json({
      message: "Product updated successfully",
      data: product,
    });
  } catch (error) {
    console.error("Error updating product:", error);
    res.status(500).json({ message: "Error updating product", error: error.message });
  }
};

  
exports.deleteProduct = async (req, res) => {
  try {
    const product = await Product.findByPk(req.params.id);
    if (!product) return res.status(404).json({ message: "Product not found" });

    await product.destroy();
    res.status(200).json({ message: "Product deleted successfully" });
  } catch (error) {
    console.error("Error deleting product:", error);
    res.status(500).json({ message: "Error deleting product", error: error.message });
  }
};
