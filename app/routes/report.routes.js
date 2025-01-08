module.exports = (app) => {
const express = require("express");
const router = express.Router();
const reportController = require("../controllers/report.controller");

// Create a new report
router.post("/report", reportController.createReport);

// Get all reports
router.get("/report", reportController.getAllReports);

// Get a specific report by ID
router.get("/report/:id", reportController.getReportById);

// Delete a report by ID
router.delete("/report/:id", reportController.deleteReport);

app.use('/api', router);
};
