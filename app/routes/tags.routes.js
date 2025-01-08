module.exports = (app) => {
const express = require("express");
const router = express.Router();
const tagsController = require("../controllers/tags.controller");

// Create a new tag
router.post("/tags", tagsController.createTag);

// Get all tags
router.get("/tags", tagsController.getAllTags);

// Get a specific tag by ID
router.get("/tags/:id", tagsController.getTagById);

// Delete a tag by ID
router.delete("/tags/:id", tagsController.deleteTag);

app.use("/api", router);
};
