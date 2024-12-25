// app/routes/viewed.routes.js
module.exports = (app) => {
    const express = require('express');
    const router = express.Router();
    const viewsController = require("../controllers/views.controller");
    
    // Get all view records
    router.get('/views', viewsController.getAllViews);
    
    // Add a new view
    router.post('/views', viewsController.addView);
    
    // Get a view record by ID
    router.get('/views/:id', viewsController.getViewById);
    
    // Get views by Post ID
    router.get('/views/by-blog/:blog_id', viewsController.getViewsByBlogId);
    
    // Get views by User ID
    router.get('/views/by-user/:user_id', viewsController.getViewsByUserId);
    
    // Delete a view record by ID
    router.delete('/views/:id',viewsController.deleteView);
    
    // Get Likes Count By Post ID
    router.get('/views/views-count/:blog_id', viewsController.getViewsCountByBlogId);
    
    
      app.use("/api", router);
    };
    