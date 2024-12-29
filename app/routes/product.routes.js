module.exports = (app) => {
    const express = require("express");
    const router = express.Router();
    const productController = require("../controllers/product.controller");
    const authenticate = require("../middleware/authMiddleware");
    const checkPermission = require("../middleware/RBAC.Middleware");
    const upload = require("../middleware/uploadMiddleware"); 

    // only admin and opertaor can create update and delete a product 

    // Get all products
    router.get("/products",authenticate, productController.getAllProducts);
  
    // Get product by ID
    router.get("/products/:id",authenticate, productController.getProductById);
  
    // Create a new product with image upload
    router.post("/products",authenticate,checkPermission('create-product'), upload.array("image", 10), productController.createProduct);

    // Update a product
    router.put("/products/:id",authenticate,checkPermission('update-product'), upload.array("image", 10), productController.updateProduct);
  
    // Delete a product
    router.delete("/products/:id",authenticate,checkPermission('delete-product'), productController.deleteProduct);
  
    app.use("/api", router);
  };
  