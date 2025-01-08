const db = require("../models");
const ProductTags = db.ProductTags;

exports.create = async (req, res) => {
  try {
    const { product_id, tag_id } = req.body;

    const productTag = await ProductTags.create({ product_id, tag_id });

    res.status(201).json({
      message: "Product-Tag association created successfully.",
      data: productTag,
    });
  } catch (error) {
    console.error("Error creating Product-Tag association:", error);
    res.status(500).json({ message: "Internal server error.", error: error.message });
  }
};

exports.findAll = async (req, res) => {
  try {
    const productTags = await ProductTags.findAll();

    res.status(200).json({
      message: "Product-Tag associations retrieved successfully.",
      data: productTags,
    });
  } catch (error) {
    console.error("Error retrieving Product-Tag associations:", error);
    res.status(500).json({ message: "Internal server error.", error: error.message });
  }
};

exports.delete = async (req, res) => {
  try {
    const { id } = req.params;

    const rowsDeleted = await ProductTags.destroy({ where: { id } });

    if (rowsDeleted === 0) {
      return res.status(404).json({ message: "Product-Tag association not found." });
    }

    res.status(200).json({ message: "Product-Tag association deleted successfully." });
  } catch (error) {
    console.error("Error deleting Product-Tag association:", error);
    res.status(500).json({ message: "Internal server error.", error: error.message });
  }
};
