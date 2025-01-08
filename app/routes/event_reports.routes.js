module.exports = (app) => {
const express = require("express");
const router = express.Router();
const eventReportsController = require("../controllers/event_reports.controller");

// Create a new Event-Report association
router.post("/event-reports", eventReportsController.create);

// Get all Event-Report associations
router.get("/event-reports", eventReportsController.findAll);

// Delete an Event-Report association
router.delete("/event-reports/:id", eventReportsController.delete);

app.use("/api", router);
};

