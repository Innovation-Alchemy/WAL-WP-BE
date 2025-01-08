module.exports = (app) => {
const express = require("express");
const router = express.Router();
const stockController = require("../controllers/stock.controller");
const authenticate = require('../middleware/authMiddleware');

// Get all stock
router.get("/stock",authenticate, stockController.getAllStock);

app.use('/api', router);
};
