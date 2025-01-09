const db = require("../models");
const ProductPurchase = db.ProductPurchase;
const Product = db.Product;
const User = db.User;


// Get all purchases
exports.getAllPurchases = async (req, res) => {
  try {
    const purchases = await ProductPurchase.findAll({
      include: [
        { model: Product, attributes: ["name", "price"] },
        { model: User,  attributes: ["name", "email"] },
      ],
    });
    res.status(200).json({ message: "Purchases retrieved successfully", data: purchases });
  } catch (error) {
    console.error("Error retrieving purchases:", error);
    res.status(500).json({ message: "Error retrieving purchases", error: error.message });
  }
};

// Get a single purchase by ID
exports.getPurchaseById = async (req, res) => {
  try {
    const purchase = await ProductPurchase.findByPk(req.params.id, {
      include: [
        { model: Product, attributes: ["name", "price"] },
        { model: User,  attributes: ["name", "email"] },
      ],
    });
    if (!purchase) return res.status(404).json({ message: "Purchase not found" });
    res.status(200).json({ message: "Purchase retrieved successfully", data: purchase });
  } catch (error) {
    console.error("Error retrieving purchase:", error);
    res.status(500).json({ message: "Error retrieving purchase", error: error.message });
  }
};

// Get purchases by User ID
exports.getPurchasesByUserId = async (req, res) => {
  const { user_id } = req.params;

  if (!user_id) {
    return res.status(400).json({ message: "User ID is required." });
  }

  try {
    // Find purchases by the specified user ID
    const purchases = await ProductPurchase.findAll({
      where: { user_id },
      include: [
        { model: Product, attributes: ["id", "name", "price", "image"] },
        { model: User, attributes: ["id", "name", "email"] },
      ],
      order: [["createdAt", "DESC"]],
    });

    if (!purchases || purchases.length === 0) {
      return res.status(404).json({ message: "No purchases found for this user." });
    }

    res.status(200).json({ message: "Purchases retrieved successfully", data: purchases });
  } catch (error) {
    console.error("Error retrieving purchases by user ID:", error);
    res.status(500).json({ message: "Error retrieving purchases by user ID", error: error.message });
  }
};

// Create a new purchase
exports.createPurchase = async (req, res) => {
  try {
    const { product_id, user_id, color, size, quantity } = req.body;

    // Validate product existence
    const product = await Product.findByPk(product_id);
    if (!product) {
      return res.status(404).json({ message: "Product not found" });
    }

    // Validate user existence
    const user = await User.findByPk(user_id);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // Fetch the Stock for (product_id, color, size)
    const stock = await db.Stock.findOne({
      where: { product_id, color, size },
    });
    if (!stock) {
      return res.status(404).json({
        message: `No stock entry found for product ${product.name} with color='${color}' and size='${size}'.`,
      });
    }

    // Check quantity
    if (stock.quantity_in_stock < quantity) {
      return res.status(400).json({
        message: `Insufficient stock. Available: ${stock.quantity_in_stock}, requested: ${quantity}.`,
      });
    }

    // For the product's "base price," you might store "price" as the base. 
    // If you have different color/size-based prices, you'd do that logic here.
    const unitPrice = product.price;
    const totalPrice = unitPrice * quantity;

    // Create the purchase (pending)
    const newPurchase = await ProductPurchase.create({
      product_id,
      user_id,
      color,
      size,
      price: unitPrice,
      quantity,
      quantity_unit: stock.quantity_unit,
      total_price: totalPrice,
      status: "pending",
    });

    // We do NOT subtract from stock yet if "pending" means not paid.
    // If you want to hold stock, do so here. Otherwise, do it in "completePurchase".

    res.status(201).json({
      message: "Purchase created successfully (pending).",
      data: newPurchase,
    });
  } catch (error) {
    console.error("Error creating purchase:", error);
    res.status(500).json({ message: "Error creating purchase", error: error.message });
  }
};

// complete
exports.completePurchase = async (req, res) => {
  try {
    const { purchase_id } = req.params;

    // Fetch the purchase
    const purchase = await ProductPurchase.findByPk(purchase_id);
    if (!purchase) {
      return res.status(404).json({ message: "Purchase not found" });
    }
    if (purchase.status === "completed") {
      return res.status(400).json({ message: "Purchase is already completed." });
    }

    // Fetch the product to get info, but do stock checks in Stock table
    const product = await Product.findByPk(purchase.product_id);
    if (!product) {
      return res.status(404).json({ message: "Product not found" });
    }

    // Now fetch the Stock record
    const stock = await db.Stock.findOne({
      where: {
        product_id: purchase.product_id,
        color: purchase.color,
        size: purchase.size,
      },
    });
    if (!stock) {
      return res.status(404).json({
        message: `No stock entry found for product_id=${purchase.product_id}, color='${purchase.color}', size='${purchase.size}'.`,
      });
    }

    // Check quantity
    if (stock.quantity_in_stock < purchase.quantity) {
      return res.status(400).json({ message: "Insufficient stock available." });
    }

    // Deduct the purchased quantity from stock
    stock.quantity_in_stock -= purchase.quantity;
    await stock.save();

    // If the stock is below or equal to the alert, notify admins, etc.
    if (stock.quantity_in_stock <= stock.stock_alert) {
      // find Admin users
      const admins = await User.findAll({ where: { role: "Admin" } });
      if (admins.length > 0) {
        // insert notifications or do something similar
        console.log(
          `ALERT: Low stock for product ${product.name}, color='${stock.color}', size='${stock.size}'. Remaining: ${stock.quantity_in_stock}`
        );
      }
    }

    // Mark the purchase as "completed"
    purchase.status = "completed";
    await purchase.save();

    res.status(200).json({
      message: "Purchase completed successfully",
      data: {
        purchase,
        product: {
          id: product.id,
          name: product.name,
        },
        stock: {
          color: stock.color,
          size: stock.size,
          quantity_in_stock: stock.quantity_in_stock,
        },
      },
    });
  } catch (error) {
    console.error("Error completing purchase:", error);
    res.status(500).json({ message: "Error completing purchase", error: error.message });
  }
};
  
// Update a purchase
exports.updatePurchase = async (req, res) => {
  try {
    const purchase = await ProductPurchase.findByPk(req.params.id);
    if (!purchase) {
      return res.status(404).json({ message: "Purchase not found" });
    }

    const { quantity, status } = req.body;

    // Update the purchase
    await purchase.update({
      quantity: quantity !== undefined ? quantity : purchase.quantity,
      status: status || purchase.status,
    });

    res.status(200).json({ message: "Purchase updated successfully", data: purchase });
  } catch (error) {
    console.error("Error updating purchase:", error);
    res.status(500).json({ message: "Error updating purchase", error: error.message });
  }
};

// Delete a purchase
exports.deletePurchase = async (req, res) => {
  try {
    const purchase = await ProductPurchase.findByPk(req.params.id);
    if (!purchase) return res.status(404).json({ message: "Purchase not found" });

    await purchase.destroy();
    res.status(200).json({ message: "Purchase deleted successfully" });
  } catch (error) {
    console.error("Error deleting purchase:", error);
    res.status(500).json({ message: "Error deleting purchase", error: error.message });
  }
};
