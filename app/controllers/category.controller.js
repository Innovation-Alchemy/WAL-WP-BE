const db = require("../models");
const Category = db.Category;
const {createCategorySchema} = require("../utils/validations");

exports.getAllCategories = async (req, res) => {
  try {
    const categories = await Category.findAll();
    res.status(200).json({ message: "Categories retrieved successfully", data: categories });
  } catch (error) {
    console.error("Error retrieving categories:", error);
    res.status(500).json({ message: "Error retrieving categories", error: error.message });
  }
};

exports.getCategoryById = async (req, res) => {
  try {
    const category = await Category.findByPk(req.params.id);
    if (!category) return res.status(404).json({ message: "Category not found" });
    res.status(200).json({ message: "Category retrieved successfully", data: category });
  } catch (error) {
    console.error("Error retrieving category:", error);
    res.status(500).json({ message: "Error retrieving category", error: error.message });
  }
};

exports.createCategory = async (req, res) => {
  const { error } = createCategorySchema.validate(req.body);

  // Return validation error if any
  if (error) {
    return res.status(400).json({ message: error.details[0].message });
  }

  try {
    const category = await Category.create(req.body);
    res.status(201).json({ message: "Category created successfully", data: category });
  } catch (error) {
    const status =
      error.name === "SequelizeUniqueConstraintError" ? 409 : 500;
    res.status(status).json({ message: "Error creating category", error: error.message });
  }
};


exports.updateCategory = async (req, res) => {
  try {
    const category = await Category.findByPk(req.params.id);
    if (!category) return res.status(404).json({ message: "Category not found" });

    await category.update(req.body);
    res.status(200).json({ message: "Category updated successfully", data: category });
  } catch (error) {
    console.error("Error updating category:", error);
    res.status(500).json({ message: "Error updating category", error: error.message });
  }
};

exports.deleteCategory = async (req, res) => {
  try {
    const category = await Category.findByPk(req.params.id);
    if (!category) return res.status(404).json({ message: "Category not found" });

    await category.destroy();
    res.status(200).json({ message: "Category deleted successfully" });
  } catch (error) {
    console.error("Error deleting category:", error);
    res.status(500).json({ message: "Error deleting category", error: error.message });
  }
};
