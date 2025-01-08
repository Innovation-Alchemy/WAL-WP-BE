module.exports = (app) => {
const express = require("express");
const router = express.Router();
const blogTagsController = require("../controllers/blog_tags.controller");

// Create a new Blog-Tag association
router.post("/blogs-tags", blogTagsController.create);

// Get all Blog-Tag associations
router.get("/blogs-tags", blogTagsController.findAll);

// Delete a Blog-Tag association
router.delete("/blogs-tags/:id", blogTagsController.delete);

app.use("/api", router);
};
