module.exports = (app) => {
const express = require("express");
const router = express.Router();
const ratingController = require("../controllers/ratings.controller");

// Rate a product or update an existing rating
router.post("/ratings", ratingController.create);

// Get all ratings by id
router.get("/ratings/:id", ratingController.findOne);

// Get all ratings
router.get("/ratings", ratingController.findAll);

// Update a rating
router.put("/ratings/:id", ratingController.update);

// Delete a rating
router.delete("/ratings/:id", ratingController.delete);

app.use('/api', router);
};

