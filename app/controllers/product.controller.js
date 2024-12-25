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
const { error } = createProductSchema.validate(req.body);

  if (error) {
    return res.status(400).json({ message: error.details[0].message });
  }
    try {
      const { name, description,user_id } = req.body;
  
      // Check if the product name already exists
      const existingProduct = await Product.findOne({ where: { name } });
      if (existingProduct) {
        return res.status(400).json({ message: "Product name already exists" });
      }
  
      // Handle file uploads
      let image = null;
  
      if (req.file) {
        image =
          process.env.NODE_ENV === "production"
            ? `https://yourdomain.com/${req.file.path.replace(/\\\\/g, "/")}`
            : `http://localhost:8080/${req.file.path.replace(/\\\\/g, "/")}`;
      }
  
      // Create the product
      const newProduct = await Product.create({
        user_id,
        name,
        description,
        image,
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
  
      const { name, description } = req.body;
  
      // Check if the new name conflicts with another product
      if (name && name !== product.name) {
        const existingProduct = await Product.findOne({ where: { name } });
        if (existingProduct) {
          return res.status(400).json({ message: "Product name already exists" });
        }
      }
  
      // Handle file uploads
      let image = product.image; // Retain existing image if no new file is uploaded
  
      if (req.file) {
        image =
          process.env.NODE_ENV === "production"
            ? `https://yourdomain.com/${req.file.path.replace(/\\\\/g, "/")}`
            : `http://localhost:8080/${req.file.path.replace(/\\\\/g, "/")}`;
      }
  
      // Update the product
      await product.update({
        name: name !== undefined ? name : product.name,
        description: description !== undefined ? description : product.description,
        image: image,
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
