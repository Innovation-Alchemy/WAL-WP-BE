module.exports = (app) => {
    const express = require("express");
    const router = express.Router();
    const productsTagsController = require("../controllers/product_tags.controller");
    
    // Create a new Product-Tag association
    router.post("/product-tags", productsTagsController.create);
    
    // Get all Product-Tag associations
    router.get("/product-tags", productsTagsController.findAll);
    
    // Delete an Product-Tag association
    router.delete("/product-tags/:id", productsTagsController.delete);
    
    app.use("/api", router);
    };
    