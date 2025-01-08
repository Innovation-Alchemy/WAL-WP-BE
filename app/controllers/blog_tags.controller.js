const db = require("../models");
const BlogTags = db.BlogTags;

// Create a new Blog-Tag association
exports.create = async (req, res) => {
  try {
    const { blog_id, tag_id } = req.body;

    const blogTag = await BlogTags.create({ blog_id, tag_id });

    res.status(201).json({
      message: "Blog-Tag association created successfully.",
      data: blogTag,
    });
  } catch (error) {
    console.error("Error creating Blog-Tag association:", error);
    res.status(500).json({ message: "Internal server error.", error: error.message });
  }
};

// Get all Blog-Tag associations
exports.findAll = async (req, res) => {
  try {
    const blogTags = await BlogTags.findAll();

    res.status(200).json({
      message: "Blog-Tag associations retrieved successfully.",
      data: blogTags,
    });
  } catch (error) {
    console.error("Error retrieving Blog-Tag associations:", error);
    res.status(500).json({ message: "Internal server error.", error: error.message });
  }
};

// Delete a Blog-Tag association
exports.delete = async (req, res) => {
  try {
    const { id } = req.params;

    const rowsDeleted = await BlogTags.destroy({ where: { id } });

    if (rowsDeleted === 0) {
      return res.status(404).json({ message: "Blog-Tag association not found." });
    }

    res.status(200).json({ message: "Blog-Tag association deleted successfully." });
  } catch (error) {
    console.error("Error deleting Blog-Tag association:", error);
    res.status(500).json({ message: "Internal server error.", error: error.message });
  }
};
