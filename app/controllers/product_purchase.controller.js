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

// Create a new purchase
exports.createPurchase = async (req, res) => {
  try {
    const { product_id, user_id, size, color, quantity } = req.body;

    // Validate product and user existence
    const product = await Product.findByPk(product_id);
    if (!product) {
      return res.status(404).json({ message: "Product not found" });
    }

    const user = await User.findByPk(user_id);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // Check stock availability
    if (product.quantity_in_stock <= 0) {
      return res.status(400).json({
        message: "This product is out of stock and cannot be purchased.",
      });
    }

    if (quantity > product.quantity_in_stock) {
      return res.status(400).json({
        message: `Only ${product.quantity_in_stock} item(s) are available.`,
      });
    }

    // Parse product details
    const productSizes = JSON.parse(product.size);
    const productColors = JSON.parse(product.color);
    const productPrices = JSON.parse(product.price);

    // Validate size and color selection
    const sizeIndex = productSizes.indexOf(size);
    const colorIndex = productColors.indexOf(color);

    if (sizeIndex === -1 || colorIndex === -1) {
      return res.status(400).json({
        message: "Invalid size or color selection.",
      });
    }

    // Calculate price based on selected size and color
    const priceIndex = sizeIndex * productColors.length + colorIndex;
    const unitPrice = productPrices[priceIndex];

    if (!unitPrice) {
      return res.status(400).json({
        message: "Price for the selected size and color is not available.",
      });
    }

    const totalPrice = unitPrice * quantity;

    // Create the purchase with "pending" status
    const newPurchase = await ProductPurchase.create({
      product_id,
      user_id,
      quantity,
      total_price: totalPrice,
      status: "pending", // Initial status
    });

    // Update product stock
    product.quantity_in_stock -= quantity;
    await product.save();

    res.status(201).json({
      message: "Purchase created successfully",
      data: newPurchase,
    });
  } catch (error) {
    console.error("Error creating purchase:", error);
    res.status(500).json({ message: "Error creating purchase", error: error.message });
  }
};

  

  exports.completePurchase = async (req, res) => {
    try {
      const { purchase_id } = req.params;
  
      // Fetch the purchase
      const purchase = await ProductPurchase.findByPk(purchase_id, {
        include: { model: Product },
      });
  
      if (!purchase) {
        return res.status(404).json({ message: "Purchase not found" });
      }
  
      if (purchase.status === "completed") {
        return res.status(400).json({ message: "Purchase is already completed." });
      }
  
      const product = await Product.findByPk(purchase.product_id);
      if (!product) {
        return res.status(404).json({ message: "Product not found" });
      }
  
      if (product.quantity_in_stock < purchase.quantity) {
        return res.status(400).json({ message: "Insufficient stock available." });
      }
  
      // Deduct the purchased quantity from product stock
      product.quantity_in_stock -= purchase.quantity;
      await product.save();
  
      // Update the purchase status to "completed"
      purchase.status = "completed";
      await purchase.save();
  
      // Check if stock level matches stock_alert
      if (product.quantity_in_stock <= product.stock_alert) {
        // Get all admins
        const admins = await User.findAll({ where: { role: "Admin" } });
  
        if (admins.length > 0) {
          // Create notifications for all admins
          const notifications = admins.map((admin) => ({
            user_id: admin.id,
            product_id: product.id,
            alerts: "low-stock",
            message: `Product ${product.name} is running low on stock. Current stock: ${product.quantity_in_stock}`,
            is_read: false,
          }));
  
          try {
            // Bulk insert notifications
            await db.notification.bulkCreate(notifications);
            console.log("Low-stock notifications sent to admins.");
          } catch (notificationError) {
            console.error("Error creating notifications:", notificationError);
          }
        } else {
          console.warn("No admins found to notify.");
        }
      }
  
      res.status(200).json({
        message: "Purchase completed successfully",
        data: {
          purchase,
          product: {
            id: product.id,
            name: product.name,
            quantity_in_stock: product.quantity_in_stock,
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
