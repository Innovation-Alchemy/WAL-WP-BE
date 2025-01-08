const db = require("../models");
const EventReports = db.EventReports;

// Create a new Event-Report association
exports.create = async (req, res) => {
  try {
    const { event_id, report_id,description } = req.body;

    const eventReport = await EventReports.create({ event_id, report_id,description });

    res.status(201).json({
      message: "Event-Report association created successfully.",
      data: eventReport,
    });
  } catch (error) {
    console.error("Error creating Event-Report association:", error);
    res.status(500).json({ message: "Internal server error.", error: error.message });
  }
};

// Get all Event-Report associations
exports.findAll = async (req, res) => {
  try {
    const eventReports = await EventReports.findAll();

    res.status(200).json({
      message: "Event-Report associations retrieved successfully.",
      data: eventReports,
    });
  } catch (error) {
    console.error("Error retrieving Event-Report associations:", error);
    res.status(500).json({ message: "Internal server error.", error: error.message });
  }
};

// Delete an Event-Report association
exports.delete = async (req, res) => {
  try {
    const { id } = req.params;

    const rowsDeleted = await EventReports.destroy({ where: { id } });

    if (rowsDeleted === 0) {
      return res.status(404).json({ message: "Event-Report association not found." });
    }

    res.status(200).json({ message: "Event-Report association deleted successfully." });
  } catch (error) {
    console.error("Error deleting Event-Report association:", error);
    res.status(500).json({ message: "Internal server error.", error: error.message });
  }
};
