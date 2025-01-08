const db = require("../models");
const Tags = db.Tags;

exports.createTag = async (req, res) => {
  try {
    const { name } = req.body;

    // Validate input
    if (!name) {
      return res.status(400).json({ message: "Tag name is required" });
    }

    // Create the tag
    const tag = await Tags.create({ name });

    res.status(201).json({ message: "Tag created successfully", data: tag });
  } catch (error) {
    console.error("Error creating tag:", error);
    const status =
      error.name === "SequelizeUniqueConstraintError" ? 409 : 500;
    res.status(status).json({ message: "Error creating tag", error: error.message });
  }
};

exports.getAllTags = async (req, res) => {
  try {
    const tags = await Tags.findAll();
    res.status(200).json({ message: "Tags retrieved successfully", data: tags });
  } catch (error) {
    console.error("Error retrieving tags:", error);
    res.status(500).json({ message: "Error retrieving tags", error: error.message });
  }
};

exports.getTagById = async (req, res) => {
  try {
    const { id } = req.params;

    const tag = await Tags.findByPk(id);
    if (!tag) {
      return res.status(404).json({ message: "Tag not found" });
    }

    res.status(200).json({ message: "Tag retrieved successfully", data: tag });
  } catch (error) {
    console.error("Error retrieving tag:", error);
    res.status(500).json({ message: "Error retrieving tag", error: error.message });
  }
};

exports.deleteTag = async (req, res) => {
  try {
    const { id } = req.params;

    const tag = await Tags.findByPk(id);
    if (!tag) {
      return res.status(404).json({ message: "Tag not found" });
    }

    // Delete tag
    await tag.destroy();
    res.status(200).json({ message: "Tag deleted successfully" });
  } catch (error) {
    console.error("Error deleting tag:", error);
    res.status(500).json({ message: "Error deleting tag", error: error.message });
  }
};
