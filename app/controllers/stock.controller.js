const db = require("../models");
const Stock = db.Stock;


// Get all stock entries
exports.getAllStock = async (req, res) => {
  try {
    const stockEntries = await Stock.findAll();
    res.status(200).json({ message: "Stock retrieved successfully.", data: stockEntries });
  } catch (error) {
    console.error("Error retrieving stock:", error);
    res.status(500).json({ message: "Internal server error.", error: error.message });
  }
};
