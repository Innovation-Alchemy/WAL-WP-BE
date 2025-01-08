const db = require("../models");
const Cart = db.Cart;
const Stock = db.Stock;
const Product = db.Product;

exports.addToCart = async (req, res) => {
  try {
    const { user_id, product_id, quantity, color, size } = req.body;

    // Validate inputs
    if (!user_id || !product_id || !quantity || !color || !size) {
      return res.status(400).json({
        message: "User ID, product ID, quantity, color, and size are required.",
      });
    }

    // Fetch stock for the product
    const stock = await Stock.findOne({
      where: { product_id, color, size },
    });
    if (!stock) {
      return res.status(404).json({ message: "Product not available in stock." });
    }

    if (stock.quantity_in_stock < quantity) {
      return res.status(400).json({ message: "Insufficient stock available." });
    }

    // Fetch product details
    const product = await Product.findByPk(product_id);
    if (!product) {
      return res.status(404).json({ message: "Product not found." });
    }

    // Check if the user has an existing pending cart
    let cart = await Cart.findOne({ where: { user_id, status: "pending" } });

    if (!cart) {
      // Create a new cart if none exists
      cart = await Cart.create({ user_id, products: [], total_price: 0 });
    }

    // Fetch existing products array and ensure it is an array
    let products = Array.isArray(cart.products) ? cart.products : [];

    // Check if the product already exists in the cart
    const existingProductIndex = products.findIndex(
      (p) => p.id === product_id && p.color === color && p.size === size
    );

    if (existingProductIndex > -1) {
      // Update the quantity of the existing product
      products[existingProductIndex].quantity += quantity;
    } else {
      // Add the new product to the products array
      products.push({
        id: product_id,
        color,
        size,
        quantity,
        price: product.price,
      });
    }

    // Recalculate the total price
    const total_price = products.reduce((sum, p) => sum + p.price * p.quantity, 0);

    // Update the cart in the database
    await Cart.update(
      { products, total_price }, // Pass products as an array (Sequelize handles JSON conversion)
      { where: { id: cart.id } }
    );

    // Fetch the updated cart to return in the response
    const updatedCart = await Cart.findByPk(cart.id);

    res.status(200).json({
      message: "Product added to cart successfully.",
      data: updatedCart,
    });
  } catch (error) {
    console.error("Error adding to cart:", error);
    res.status(500).json({ message: "Error adding to cart.", error: error.message });
  }
};


exports.checkoutCart = async (req, res) => {
  try {
    const { user_id } = req.body;

    // Find the user's pending cart
    const cart = await Cart.findOne({ where: { user_id, status: "pending" } });
    if (!cart) {
      return res.status(404).json({ message: "Cart not found." });
    }

    const products = cart.products || [];
    if (products.length === 0) {
      return res.status(400).json({ message: "Cart is empty." });
    }

    // Process each product in the cart
    for (const { id: product_id, color, size, quantity } of products) {
      const stock = await Stock.findOne({ where: { product_id, color, size } });

      if (!stock) {
        return res.status(404).json({
          message: `Stock not found for product_id ${product_id}, color ${color}, size ${size}.`,
        });
      }

      if (stock.quantity_in_stock < quantity) {
        return res.status(400).json({
          message: `Insufficient stock for product_id ${product_id}, color ${color}, size ${size}.`,
        });
      }

      // Deduct quantity from stock
      await stock.update({
        quantity_in_stock: stock.quantity_in_stock - quantity,
      });

      // Check for stock alert
      if (stock.quantity_in_stock <= stock.stock_alert) {
        console.warn(
          `Stock alert: Low stock for product_id ${product_id}, color ${color}, size ${size}.`
        );
      }
    }

    // Mark the cart as checked out
    await cart.update({ status: "checked_out" });

    res.status(200).json({ message: "Cart checked out successfully.", data: cart });
  } catch (error) {
    console.error("Error checking out cart:", error);
    res.status(500).json({ message: "Error checking out cart.", error: error.message });
  }
};

exports.removeProductFromCart = async (req, res) => {
  try {
    const { user_id, product_id, color, size } = req.body;

    // Validate inputs
    if (!user_id || !product_id || !color || !size) {
      return res.status(400).json({
        message: "User ID, product ID, color, and size are required to remove a product from the cart.",
      });
    }

    // Find the user's pending cart
    const cart = await Cart.findOne({ where: { user_id, status: "pending" } });
    if (!cart) {
      return res.status(404).json({ message: "No pending cart found for the user." });
    }

    let products = cart.products || [];
    const productIndex = products.findIndex(
      (p) => p.id === product_id && p.color === color && p.size === size
    );

    if (productIndex === -1) {
      return res.status(404).json({
        message: `Product not found in the cart for product_id ${product_id}, color ${color}, size ${size}.`,
      });
    }

    // Remove the product from the cart
    const removedProduct = products.splice(productIndex, 1);

    // Recalculate the total price
    const total_price = products.reduce((sum, p) => sum + p.price * p.quantity, 0);

    // Update the cart
    await cart.update({ products, total_price });

    res.status(200).json({
      message: "Product removed from cart successfully.",
      data: { cart, removedProduct },
    });
  } catch (error) {
    console.error("Error removing product from cart:", error);
    res.status(500).json({ message: "Error removing product from cart.", error: error.message });
  }
};
