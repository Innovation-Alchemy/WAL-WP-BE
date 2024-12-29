module.exports = (app) => {
    const express = require('express');
    const router = express.Router();
    const blogController = require('../controllers/blog.controller');
    const authenticate = require('../middleware/authMiddleware');
    const upload = require("../middleware/uploadMiddleware");
    const checkPermission = require('../middleware/RBAC.Middleware');


    // evryone can see blogs so no need for permissions
    router.get('/blogs', authenticate, blogController.getAllBlogs);
    // evryone can see blogs so no need for permissions
    router.get('/blogs/:id', authenticate, blogController.getBlogById);
    // only organizer and admin can create a blog and organizer needs an approval after creating the blog
    router.post('/blogs', upload.array("files", 10), authenticate,checkPermission('create-blog'), blogController.createBlog);
    // only admin and organizer can update a blog
    router.put('/blogs/:id', upload.array("files", 10), authenticate,checkPermission('update-blogs'), blogController.updateBlog);
    // only admin and organizer can delete a blog
    router.delete('/blogs/:id', authenticate,checkPermission('delete-blogs'), blogController.deleteBlog);
  
    app.use('/api', router);
  };
  