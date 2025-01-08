module.exports = (app) => {
const express = require("express");
const router = express.Router();
const cartController = require("../controllers/cart.controller");

router.post("/cart/add", cartController.addToCart); // Add product to cart
router.post("/cart/checkout", cartController.checkoutCart); // Checkout cart
router.delete("/cart/remove", cartController.removeProductFromCart); // Remove product from cart



app.use('/api', router);
};

