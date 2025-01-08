const db = require("../models");
const BlogReports = db.BlogReports;

exports.create = async (req, res) => {
  try {
    const { blog_id, report_id,description } = req.body;

    const blogReport = await BlogReports.create({ blog_id, report_id,description });

    res.status(201).json({
      message: "Blog-Report association created successfully.",
      data: blogReport,
    });
  } catch (error) {
    console.error("Error creating Blog-Report association:", error);
    res.status(500).json({ message: "Internal server error.", error: error.message });
  }
};

exports.findAll = async (req, res) => {
  try {
    const blogReports = await BlogReports.findAll();

    res.status(200).json({
      message: "Blog-Report associations retrieved successfully.",
      data: blogReports,
    });
  } catch (error) {
    console.error("Error retrieving Blog-Report associations:", error);
    res.status(500).json({ message: "Internal server error.", error: error.message });
  }
};

exports.delete = async (req, res) => {
  try {
    const { id } = req.params;

    const rowsDeleted = await BlogReports.destroy({ where: { id } });

    if (rowsDeleted === 0) {
      return res.status(404).json({ message: "Blog-Report association not found." });
    }

    res.status(200).json({ message: "Blog-Report association deleted successfully." });
  } catch (error) {
    console.error("Error deleting Blog-Report association:", error);
    res.status(500).json({ message: "Internal server error.", error: error.message });
  }
};
