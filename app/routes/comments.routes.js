// app/routes/comment.routes.js

module.exports = (app) => {
    const commentController = require("../controllers/comments.controller");
    const router = require("express").Router();
    const authenticate = require("../middleware/authMiddleware");
    //All users should be able do create a comment and update and delete 
  
    // Get all comments
    router.get('/comments',authenticate, commentController.getAllComments);
  
    // Add a new comment
    router.post('/comments',authenticate, commentController.addComment);
  
    // Get a comment by ID
    router.get('/comments/:id',authenticate, commentController.getCommentById);
  
    // Get comments by Post ID
    router.get('/comments/by-blog/:blog_id',authenticate, commentController.getCommentsByBlogId);
  
    // Get comments by User ID
    router.get('/comments/by-user/:user_id',authenticate, commentController.getCommentsByUserId);

    // Get comments Count By Post ID
    router.get('/comments/comment-count/:blog_id',authenticate, commentController.countCommentsForBlog);
  
    // Update a comment by ID
    router.put('/comments/:id',authenticate, commentController.updateComment);
  
    // Delete a comment by ID
    router.delete('/comments/:id',authenticate, commentController.deleteComment);
  
    app.use("/api", router);
  };
  