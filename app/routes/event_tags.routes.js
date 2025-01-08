module.exports = (app) => {
const express = require("express");
const router = express.Router();
const eventTagsController = require("../controllers/event_tags.controller");

// Create a new Event-Tag association
router.post("/event-tags", eventTagsController.create);

// Get all Event-Tag associations
router.get("/event-tags", eventTagsController.findAll);

// Delete an Event-Tag association
router.delete("/event-tags/:id", eventTagsController.delete);

app.use("/api", router);
};
