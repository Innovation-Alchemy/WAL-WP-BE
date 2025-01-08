const db = require("../models");
const Product = db.Product;
const Stock = db.Stock;
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
    const { name, description, user_id, event_id, blog_id, commission, is_approved, price, stock_alert, size, color, quantities } = req.body;

    // Parse and validate JSON fields
    let parsedSize, parsedColor, parsedQuantities;
    try {
      parsedSize = JSON.parse(size);
      parsedColor = JSON.parse(color);
      parsedQuantities = JSON.parse(quantities);
    } catch (error) {
      return res.status(400).json({ message: "Size, color, and quantities must be valid JSON arrays." });
    }

    // Handle uploaded images
    let imageAssociations = [];
    if (req.files && req.files.length > 0) {
      if (!parsedColor || parsedColor.length === 0) {
        return res.status(400).json({ message: "Colors are required to associate images." });
      }

      if (req.files.length !== parsedColor.length) {
        return res.status(400).json({ message: "Each color must have an associated image." });
      }

      imageAssociations = req.files.map((file, index) => ({
        color: parsedColor[index],
        image:
          process.env.NODE_ENV === "production"
            ? `https://yourdomain.com/${file.path.replace(/\\/g, "/")}`
            : `http://localhost:8080/${file.path.replace(/\\/g, "/")}`,
      }));
    }

    // Add image associations to the request body for validation
    req.body.image = imageAssociations;

    // Validate input using the schema
    const validationData = {
      ...req.body,
      price: Number(price), // Ensure price is a number
      size: parsedSize, // Pass parsed size array
      color: parsedColor, // Pass parsed color array
      quantities: parsedQuantities, // Pass parsed quantities array
    };

    const { error } = createProductSchema.validate(validationData, { abortEarly: false });
    if (error) {
      return res.status(400).json({
        message: "Validation failed",
        errors: error.details.map((err) => err.message),
      });
    }

    // Create the product
    const newProduct = await Product.create({
      name,
      description,
      user_id,
      event_id,
      blog_id,
      commission: commission || 100.0,
      is_approved: is_approved || false,
      price: Number(price),
      size: parsedSize,
      color: parsedColor,
      stock_alert: stock_alert || 10,
      image: imageAssociations,
    });

    // Add stock for each size-color combination from quantities
    for (const { color: productColor, size: productSize, quantity } of parsedQuantities) {
      await Stock.create({
        product_id: newProduct.id,
        color: productColor,
        size: productSize,
        quantity_in_stock: quantity,
        quantity_unit: "pcs",
        stock_alert: stock_alert || 10,
      });
    }

    res.status(201).json({
      message: "Product created successfully with associated stock and images.",
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
      return res.status(404).json({ message: "Product not found." });
    }

    const { name, description, size, color, price, stock_alert, commission, is_approved, quantities } = req.body;

    // Handle uploaded images
    let imageAssociations = product.image || [];
    if (req.files && req.files.length > 0) {
      const colors = JSON.parse(color);
      if (req.files.length !== colors.length) {
        return res.status(400).json({ message: "Each color must have an associated image." });
      }

      const newImages = req.files.map((file, index) => ({
        color: colors[index],
        image:
          process.env.NODE_ENV === "production"
            ? `https://yourdomain.com/${file.path.replace(/\\/g, "/")}`
            : `http://localhost:8080/${file.path.replace(/\\/g, "/")}`,
      }));
      imageAssociations = [...imageAssociations, ...newImages];
    }

    // Add image associations to the request body for validation
    req.body.image = imageAssociations;

    // Validate input
    const { error } = createProductSchema.validate(req.body, { abortEarly: false });
    if (error) {
      return res.status(400).json({
        message: "Validation failed",
        errors: error.details.map((err) => err.message),
      });
    }

    // Update product details
    await product.update({
      name: name || product.name,
      description: description || product.description,
      size: JSON.parse(size) || product.size,
      color: JSON.parse(color) || product.color,
      price: JSON.parse(price) || product.price,
      stock_alert: stock_alert || product.stock_alert,
      commission: commission || product.commission,
      is_approved: is_approved !== undefined ? is_approved : product.is_approved,
      image: imageAssociations, // Update color-image mapping
    });

    // Update stock for new size-color combinations from quantities
    if (quantities) {
      await Stock.destroy({ where: { product_id: product.id } });

      const parsedQuantities = JSON.parse(quantities);
      for (const { color: productColor, size: productSize, quantity } of parsedQuantities) {
        await Stock.create({
          product_id: product.id,
          color: productColor,
          size: productSize,
          quantity_in_stock: quantity,
          quantity_unit: "pcs",
          stock_alert: stock_alert || 10,
        });
      }
    }

    res.status(200).json({
      message: "Product updated successfully with updated stock and images.",
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
