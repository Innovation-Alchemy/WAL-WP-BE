const db = require("../models");
const EventTags = db.EventTags;

// Create a new Event-Tag association
exports.create = async (req, res) => {
  try {
    const { event_id, tag_id } = req.body;

    const eventTag = await EventTags.create({ event_id, tag_id });

    res.status(201).json({
      message: "Event-Tag association created successfully.",
      data: eventTag,
    });
  } catch (error) {
    console.error("Error creating Event-Tag association:", error);
    res.status(500).json({ message: "Internal server error.", error: error.message });
  }
};

// Get all Event-Tag associations
exports.findAll = async (req, res) => {
  try {
    const eventTags = await EventTags.findAll();

    res.status(200).json({
      message: "Event-Tag associations retrieved successfully.",
      data: eventTags,
    });
  } catch (error) {
    console.error("Error retrieving Event-Tag associations:", error);
    res.status(500).json({ message: "Internal server error.", error: error.message });
  }
};

// Delete an Event-Tag association
exports.delete = async (req, res) => {
  try {
    const { id } = req.params;

    const rowsDeleted = await EventTags.destroy({ where: { id } });

    if (rowsDeleted === 0) {
      return res.status(404).json({ message: "Event-Tag association not found." });
    }

    res.status(200).json({ message: "Event-Tag association deleted successfully." });
  } catch (error) {
    console.error("Error deleting Event-Tag association:", error);
    res.status(500).json({ message: "Internal server error.", error: error.message });
  }
};
