module.exports = (app) => {
const express = require("express");
const router = express.Router();
const productReportsController = require("../controllers/product_reports.controller");

// Create a new Product-Report association
router.post("/product-reports", productReportsController.create);

// Get all Product-Report associations
router.get("/product-reports", productReportsController.findAll);

// Delete a Product-Report association
router.delete("/product-reports/:id", productReportsController.delete);

app.use("/api", router);
};


