const db = require("../models");
const Advertisement = db.Advertisement;

exports.getAllAds = async (req, res) => {
  try {
    const ads = await Advertisement.findAll();
    res.status(200).json({ message: "Advertisements retrieved successfully", data: ads });
  } catch (error) {
    console.error("Error retrieving advertisements:", error);
    res.status(500).json({ message: "Error retrieving advertisements", error: error.message });
  }
};

exports.getAdById = async (req, res) => {
  try {
    const ad = await Advertisement.findByPk(req.params.id);
    if (!ad) return res.status(404).json({ message: "Advertisement not found" });
    res.status(200).json({ message: "Advertisement retrieved successfully", data: ad });
  } catch (error) {
    console.error("Error retrieving advertisement:", error);
    res.status(500).json({ message: "Error retrieving advertisement", error: error.message });
  }
};

exports.createAd = async (req, res) => {
  try {
    const ad = await Advertisement.create(req.body);
    res.status(201).json({ message: "Advertisement created successfully", data: ad });
  } catch (error) {
    console.error("Error creating advertisement:", error);
    res.status(500).json({ message: "Error creating advertisement", error: error.message });
  }
};

exports.updateAd = async (req, res) => {
  try {
    const ad = await Advertisement.findByPk(req.params.id);
    if (!ad) return res.status(404).json({ message: "Advertisement not found" });

    await ad.update(req.body);
    res.status(200).json({ message: "Advertisement updated successfully", data: ad });
  } catch (error) {
    console.error("Error updating advertisement:", error);
    res.status(500).json({ message: "Error updating advertisement", error: error.message });
  }
};

exports.deleteAd = async (req, res) => {
  try {
    const ad = await Advertisement.findByPk(req.params.id);
    if (!ad) return res.status(404).json({ message: "Advertisement not found" });

    await ad.destroy();
    res.status(200).json({ message: "Advertisement deleted successfully" });
  } catch (error) {
    console.error("Error deleting advertisement:", error);
    res.status(500).json({ message: "Error deleting advertisement", error: error.message });
  }
};
