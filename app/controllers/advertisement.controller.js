const db = require("../models");
const Advertisement = db.Advertisement;
const { advertisementValidationSchema } = require("../utils/validations");

// GET ALL ADS
exports.getAllAds = async (req, res) => {
  try {
    const ads = await Advertisement.findAll();
    res.status(200).json({
      message: "Advertisements retrieved successfully",
      data: ads,
    });
  } catch (error) {
    console.error("Error retrieving advertisements:", error);
    res.status(500).json({
      message: "Error retrieving advertisements",
      error: error.message,
    });
  }
};

// GET SINGLE AD BY ID
exports.getAdById = async (req, res) => {
  try {
    const ad = await Advertisement.findByPk(req.params.id);
    if (!ad) {
      return res.status(404).json({ message: "Advertisement not found" });
    }
    res.status(200).json({
      message: "Advertisement retrieved successfully",
      data: ad,
    });
  } catch (error) {
    console.error("Error retrieving advertisement:", error);
    res.status(500).json({
      message: "Error retrieving advertisement",
      error: error.message,
    });
  }
};

// CREATE AD
exports.createAd = async (req, res) => {
  try {
    // Validate input
    const { error } = advertisementValidationSchema.validate(req.body);
    if (error) {
      return res.status(400).json({ errors: error.details });
    }


    // Process uploaded images if present
    const images = req.files
      ? req.files.map((file) => {
          return process.env.NODE_ENV === "production"
            ? `https://irada/${file.path.replace(/\\/g, "/")}`
            : `http://localhost:8080/${file.path.replace(/\\/g, "/")}`;
        })
      : [];

    // Pull out the rest of the fields from req.body
    const {
      admin_id,
      title,
      description,
      target_audience,
      start_date,
      end_date,
    } = req.body;

    // Create advertisement with images array
    const ad = await Advertisement.create({
      admin_id,
      title,
      description,
      target_audience,
      start_date,
      end_date,
      images,
    });

    res.status(201).json({
      message: "Advertisement created successfully",
      data: ad,
    });
  } catch (error) {
    console.error("Error creating advertisement:", error);
    res.status(500).json({
      message: "Error creating advertisement",
      error: error.message,
    });
  }
};

// UPDATE AD
exports.updateAd = async (req, res) => {
  try {
    const ad = await Advertisement.findByPk(req.params.id);
    if (!ad) {
      return res.status(404).json({ message: "Advertisement not found" });
    }

    // Build an object with fields to update
    const updatedFields = {};

    // If new files are uploaded, handle them
    if (req.files && req.files.length > 0) {
      const images = req.files.map((file) => {
        return process.env.NODE_ENV === "production"
          ? `https://irada/${file.path.replace(/\\/g, "/")}`
          : `http://localhost:8080/${file.path.replace(/\\/g, "/")}`;
      });
      updatedFields.images = images;
    }

    // For other fields passed in req.body
    const {
      admin_id,
      title,
      description,
      target_audience,
      start_date,
      end_date,
    } = req.body;

    if (admin_id !== undefined) updatedFields.admin_id = admin_id;
    if (title !== undefined) updatedFields.title = title;
    if (description !== undefined) updatedFields.description = description;
    if (target_audience !== undefined)
      updatedFields.target_audience = target_audience;
    if (start_date !== undefined) updatedFields.start_date = start_date;
    if (end_date !== undefined) updatedFields.end_date = end_date;

    // Apply the updates
    await ad.update(updatedFields);

    res.status(200).json({
      message: "Advertisement updated successfully",
      data: ad,
    });
  } catch (error) {
    console.error("Error updating advertisement:", error);
    res.status(500).json({
      message: "Error updating advertisement",
      error: error.message,
    });
  }
};

// DELETE AD
exports.deleteAd = async (req, res) => {
  try {
    const ad = await Advertisement.findByPk(req.params.id);
    if (!ad) {
      return res.status(404).json({ message: "Advertisement not found" });
    }

    await ad.destroy();
    res
      .status(200)
      .json({ message: "Advertisement deleted successfully" });
  } catch (error) {
    console.error("Error deleting advertisement:", error);
    res.status(500).json({
      message: "Error deleting advertisement",
      error: error.message,
    });
  }
};
