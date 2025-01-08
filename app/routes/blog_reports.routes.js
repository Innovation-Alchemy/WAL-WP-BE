module.exports = (app) => {
    const express = require("express");
    const router = express.Router();
    const blogReportsController = require("../controllers/blog_reports.controller");
    
    // Create a new Blog-Report association
    router.post("/blogs-reports", blogReportsController.create);
    
    // Get all Blog-Report associations
    router.get("/blogs-reports", blogReportsController.findAll);
    
    // Delete a Blog-Report association
    router.delete("/blogs-reports/:id", blogReportsController.delete);
    
    app.use("/api", router);
    };
    