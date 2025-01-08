const db = require("../models");
const ProductReports = db.ProductReports;

// Create a new Product-Report association
exports.create = async (req, res) => {
  try {
    const { product_id, report_id,description } = req.body;

    const productReport = await ProductReports.create({ product_id, report_id,description });

    res.status(201).json({
      message: "Product-Report association created successfully.",
      data: productReport,
    });
  } catch (error) {
    console.error("Error creating Product-Report association:", error);
    res.status(500).json({ message: "Internal server error.", error: error.message });
  }
};

// Get all Product-Report associations
exports.findAll = async (req, res) => {
  try {
    const productReports = await ProductReports.findAll();

    res.status(200).json({
      message: "Product-Report associations retrieved successfully.",
      data: productReports,
    });
  } catch (error) {
    console.error("Error retrieving Product-Report associations:", error);
    res.status(500).json({ message: "Internal server error.", error: error.message });
  }
};

// Delete a Product-Report association
exports.delete = async (req, res) => {
  try {
    const { id } = req.params;

    const rowsDeleted = await ProductReports.destroy({ where: { id } });

    if (rowsDeleted === 0) {
      return res.status(404).json({ message: "Product-Report association not found." });
    }

    res.status(200).json({ message: "Product-Report association deleted successfully." });
  } catch (error) {
    console.error("Error deleting Product-Report association:", error);
    res.status(500).json({ message: "Internal server error.", error: error.message });
  }
};
