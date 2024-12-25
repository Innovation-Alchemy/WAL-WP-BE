module.exports = (app) => {
    const express = require('express');
    const router = express.Router();
    const blogController = require('../controllers/blog.controller');
    const authenticate = require('../middleware/authMiddleware');
    const upload = require("../middleware/uploadMiddleware");


    router.get('/blogs', authenticate, blogController.getAllBlogs);
    router.get('/blogs/:id', authenticate, blogController.getBlogById);
    router.post('/blogs', upload.array("files", 10), authenticate, blogController.createBlog);
    router.put('/blogs/:id', upload.array("files", 10), authenticate, blogController.updateBlog);
    router.delete('/blogs/:id', authenticate, blogController.deleteBlog);
  
    app.use('/api', router);
  };
  