module.exports = (app) => {
    const express = require("express");
    const router = express.Router();
    const cartController = require("../controllers/cart.controller");
  
    // Add product to cart
    router.post("/cart/add", cartController.addToCart);
  
    // Get cart by ID
    router.get("/cart/:cart_id", cartController.getCartById);
  
    // Update item quantity using cart_id
    router.post("/cart/update-quantity", cartController.updateCartQuantity);
  
    // Checkout cart by user_id
    router.post("/cart/checkout", cartController.checkoutCart);
  
    // Remove product from cart by cart_id
    router.post("/cart/remove", cartController.removeProductFromCart);
  
    app.use("/api", router);
  };
  