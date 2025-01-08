const db = require("../models");
const Category = db.Category;
const Event = db.Event;
const Blog = db.Blog;
const {createCategorySchema, assignCategorySchema,removeCategorySchema } = require("../utils/validations");

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

exports.assignCategories = async (req, res) => {
  const { error } = assignCategorySchema.validate(req.body);
  if (error) {
    return res.status(400).json({ message: error.details[0].message });
  }

  const { id, type } = req.params; // `id` is the event or product ID, `type` is "event" or "product"
  const { categoryIds } = req.body;

  try {
    // Validate category IDs
    if (!Array.isArray(categoryIds) || !categoryIds.every((cid) => Number.isInteger(cid))) {
      return res.status(400).json({ message: "Category IDs must be an array of integers" });
    }

    // Validate that categories exist
    const existingCategories = await Category.findAll({
      where: { id: categoryIds },
      attributes: ["id"],
    });
    const validCategoryIds = existingCategories.map((cat) => cat.id);
    const invalidIds = categoryIds.filter((id) => !validCategoryIds.includes(id));

    if (invalidIds.length > 0) {
      return res.status(400).json({ message: "Some category IDs do not exist", invalidIds });
    }

    // Determine target type: Event or Product
    let targetModel;
    if (type === "event") {
      targetModel = Event;
    } else if (type === "product") {
      targetModel = Product;
    } else {
      return res.status(400).json({ message: "Invalid type. Must be 'event' or 'product'." });
    }

    // Find the target record
    const target = await targetModel.findByPk(id);
    if (!target) {
      return res.status(404).json({ message: `${type.charAt(0).toUpperCase() + type.slice(1)} not found` });
    }

    // Parse existing categories
    let currentCategories = [];
    if (Array.isArray(target.categories)) {
      currentCategories = target.categories;
    } else if (typeof target.categories === "string") {
      try {
        const parsed = JSON.parse(target.categories);
        if (Array.isArray(parsed)) {
          currentCategories = parsed;
        }
      } catch (e) {
        currentCategories = [];
      }
    }

    // Combine old and new categories, ensuring uniqueness
    const newCategories = [...new Set([...currentCategories, ...validCategoryIds])];

    // Save updated categories
    target.categories = newCategories;
    await target.save();

    res.status(200).json({
      message: "Categories assigned successfully",
      data: { type, id, categories: newCategories },
    });
  } catch (error) {
    console.error("Error assigning categories:", error);
    res.status(500).json({ message: "Error assigning categories", error: error.message });
  }
};


exports.removeCategories = async (req, res) => {
  const { error } = removeCategorySchema.validate(req.body);
  if (error) {
    return res.status(400).json({ message: error.details[0].message });
  }

  const { id, type } = req.params; // `id` is the event or product ID, `type` is "event" or "product"
  const { categoryIds } = req.body;

  try {
    // Validate category IDs
    if (!Array.isArray(categoryIds) || !categoryIds.every((cid) => Number.isInteger(cid))) {
      return res.status(400).json({ message: "Category IDs must be an array of integers." });
    }

    // Validate that categories exist
    const existingCategories = await Category.findAll({
      where: { id: categoryIds },
      attributes: ["id"],
    });
    const validCategoryIds = existingCategories.map((cat) => cat.id);
    const invalidIds = categoryIds.filter((id) => !validCategoryIds.includes(id));

    if (invalidIds.length > 0) {
      return res.status(400).json({ message: "Some category IDs do not exist", invalidIds });
    }

    // Determine target type: Event or Product
    let targetModel;
    if (type === "event") {
      targetModel = Event;
    } else if (type === "product") {
      targetModel = Product;
    } else {
      return res.status(400).json({ message: "Invalid type. Must be 'event' or 'product'." });
    }

    // Find the target record
    const target = await targetModel.findByPk(id);
    if (!target) {
      return res.status(404).json({ message: `${type.charAt(0).toUpperCase() + type.slice(1)} not found` });
    }

    // Parse existing categories
    let currentCategories = [];
    if (Array.isArray(target.categories)) {
      currentCategories = target.categories;
    } else if (typeof target.categories === "string") {
      try {
        const parsed = JSON.parse(target.categories);
        if (Array.isArray(parsed)) {
          currentCategories = parsed;
        }
      } catch (e) {
        currentCategories = [];
      }
    }

    // Determine which categories can be removed
    const categoriesToRemove = categoryIds.filter((cid) => currentCategories.includes(cid));
    const notFoundCategories = categoryIds.filter((cid) => !currentCategories.includes(cid));

    // Remove categories
    const updatedCategories = currentCategories.filter((cid) => !categoriesToRemove.includes(cid));
    target.categories = updatedCategories;
    await target.save();

    // Response message
    let message;
    if (categoriesToRemove.length > 0 && notFoundCategories.length > 0) {
      message = `${categoriesToRemove.length} category(ies) removed. ${notFoundCategories.length} category(ies) were not assigned to the ${type}.`;
    } else if (categoriesToRemove.length > 0) {
      message = `${categoriesToRemove.length} category(ies) removed.`;
    } else {
      message = `No categories were removed because none of the provided category IDs were assigned to the ${type}.`;
    }

    res.status(200).json({
      success: true,
      message,
      removed: categoriesToRemove,
      notFound: notFoundCategories,
      currentCategories: updatedCategories,
    });
  } catch (error) {
    console.error("Error removing categories:", error);
    res.status(500).json({ message: "Error removing categories", error: error.message });
  }
};
