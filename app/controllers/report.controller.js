const db = require("../models");
const Report = db.Report;
const { Op } = require("sequelize");

exports.createReport = async (req, res) => {
  try {
    const { title, description, report_type } = req.body;

    // Create the report
    const report = await Report.create({
      title,
      description,
      report_type,
    });

    res.status(201).json({ message: "Report created successfully", data: report });
  } catch (error) {
    console.error("Error creating report:", error);
    res.status(500).json({ message: "Error creating report", error: error.message });
  }
};

exports.getAllReports = async (req, res) => {
  try {
    const reports = await Report.findAll({
      include: [
        { model: db.Blog, attributes: ["id", "title"] },
        { model: db.Event, attributes: ["id", "title"] },
        { model: db.Product, attributes: ["id", "name"] },
      ],
    });

    res.status(200).json({ message: "Reports retrieved successfully", data: reports });
  } catch (error) {
    console.error("Error retrieving reports:", error);
    res.status(500).json({ message: "Error retrieving reports", error: error.message });
  }
};

exports.getReportById = async (req, res) => {
  try {
    const { id } = req.params;

    const report = await Report.findByPk(id, {
      include: [
        { model: db.Blog, attributes: ["id", "title"] },
        { model: db.Event, attributes: ["id", "title"] },
        { model: db.Product, attributes: ["id", "name"] },
      ],
    });

    if (!report) {
      return res.status(404).json({ message: "Report not found" });
    }

    res.status(200).json({ message: "Report retrieved successfully", data: report });
  } catch (error) {
    console.error("Error retrieving report:", error);
    res.status(500).json({ message: "Error retrieving report", error: error.message });
  }
};

exports.deleteReport = async (req, res) => {
  try {
    const { id } = req.params;

    const report = await Report.findByPk(id);
    if (!report) {
      return res.status(404).json({ message: "Report not found" });
    }

    await report.destroy();
    res.status(200).json({ message: "Report deleted successfully" });
  } catch (error) {
    console.error("Error deleting report:", error);
    res.status(500).json({ message: "Error deleting report", error: error.message });
  }
};
