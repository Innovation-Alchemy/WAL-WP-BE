const db = require("../models");
const Venue = db.Venue;

exports.getAllVenues = async (req, res) => {
  try {
    const venues = await Venue.findAll();
    res.status(200).json({ message: "Venues retrieved successfully", data: venues });
  } catch (error) {
    console.error("Error retrieving venues:", error);
    res.status(500).json({ message: "Error retrieving venues", error: error.message });
  }
};

exports.getVenueById = async (req, res) => {
  try {
    const venue = await Venue.findByPk(req.params.id);
    if (!venue) return res.status(404).json({ message: "Venue not found" });
    res.status(200).json({ message: "Venue retrieved successfully", data: venue });
  } catch (error) {
    console.error("Error retrieving venue:", error);
    res.status(500).json({ message: "Error retrieving venue", error: error.message });
  }
};

exports.createVenue = async (req, res) => {
  try {
    const venue = await Venue.create(req.body);
    res.status(201).json({ message: "Venue created successfully", data: venue });
  } catch (error) {
    console.error("Error creating venue:", error);
    res.status(500).json({ message: "Error creating venue", error: error.message });
  }
};

exports.updateVenue = async (req, res) => {
  try {
    const venue = await Venue.findByPk(req.params.id);
    if (!venue) return res.status(404).json({ message: "Venue not found" });

    await venue.update(req.body);
    res.status(200).json({ message: "Venue updated successfully", data: venue });
  } catch (error) {
    console.error("Error updating venue:", error);
    res.status(500).json({ message: "Error updating venue", error: error.message });
  }
};

exports.deleteVenue = async (req, res) => {
  try {
    const venue = await Venue.findByPk(req.params.id);
    if (!venue) return res.status(404).json({ message: "Venue not found" });

    await venue.destroy();
    res.status(200).json({ message: "Venue deleted successfully" });
  } catch (error) {
    console.error("Error deleting venue:", error);
    res.status(500).json({ message: "Error deleting venue", error: error.message });
  }
};
