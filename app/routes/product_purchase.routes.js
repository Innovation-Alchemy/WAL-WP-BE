module.exports = (app) => {
    const express = require("express");
    const router = express.Router();
    const purchaseController = require("../controllers/product_purchase.controller");
    const authenticate = require("../middleware/authMiddleware");
    const checkPermission = require("../middleware/RBAC.Middleware");
  
    // Get all product-purchases
    router.get("/product-purchases", authenticate, checkPermission("read-product-purchase"), purchaseController.getAllPurchases);
  
    // Get aproduct-purchases by ID
    router.get("/product-purchases/:id", authenticate, checkPermission("read-product-purchase"), purchaseController.getPurchaseById);
  
    // Create a new product-purchases
    router.post("/product-purchases", authenticate, checkPermission("create-product-purchase"), purchaseController.createPurchase);

    // Complete a product-purchases and deduct stock
    router.post("/product-purchases/complete/:purchase_id", authenticate, purchaseController.completePurchase);

    // Update a product-purchases
    router.put("/product-purchases/:id", authenticate, checkPermission("update-product-purchase"), purchaseController.updatePurchase);
  
    // Delete a product-purchases
    router.delete("/product-purchases/:id", authenticate, checkPermission("delete-product-purchase"), purchaseController.deletePurchase);
  
    app.use("/api", router);
  };
  