module.exports = (app) => {
    const express = require('express');
    const router = express.Router();
    const blogController = require('../controllers/blog.controller');
    const authenticate = require('../middleware/authMiddleware');
    const upload = require("../middleware/uploadMiddleware");


    router.get('/blogs', authenticate, blogController.getAllBlogs);
    router.get('/blogs/:id', authenticate, blogController.getBlogById);
    router.post('/blogs', upload.array("files", 10), authenticate, blogController.createBlog);
    router.post('/blogs/comment/:id',  authenticate, blogController.addCommentToBlogPost);
    router.post('/blogs/view/:id',  authenticate, blogController.addViewToBlogPost);
    router.post('/blogs/like/:id',  authenticate, blogController.likeBlogPost);
    router.put('/blogs/:id', upload.array("files", 10), authenticate, blogController.updateBlog);
    router.delete('/blogs/:id', authenticate, blogController.deleteBlog);
  
    app.use('/api', router);
  };
  