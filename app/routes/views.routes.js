// app/routes/viewed.routes.js
module.exports = (app) => {
    const express = require('express');
    const router = express.Router();
    const viewsController = require("../controllers/views.controller");
    const authenticate = require('../middleware/authMiddleware');
    
    // Get all view records
    router.get('/views',authenticate, viewsController.getAllViews);
    
    // Add a new view
    router.post('/views',authenticate, viewsController.addView);
    
    // Get a view record by ID
    router.get('/views/:id',authenticate, viewsController.getViewById);
    
    // Get views by Post ID
    router.get('/views/by-blog/:blog_id',authenticate, viewsController.getViewsByBlogId);
    
    // Get views by User ID
    router.get('/views/by-user/:user_id',authenticate, viewsController.getViewsByUserId);
    
    // Delete a view record by ID
    router.delete('/views/:id',authenticate,viewsController.deleteView);
    
    // Get Likes Count By Post ID
    router.get('/views/views-count/:blog_id',authenticate, viewsController.getViewsCountByBlogId);
    
    
      app.use("/api", router);
    };
    