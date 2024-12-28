// app/routes/like.routes.js

module.exports = (app) => {
    const likeController = require("../controllers/likes.controller");
    const router = require("express").Router();
    const authenticate = require("../middleware/authMiddleware");
    // Get all likes
    router.get('/likes',authenticate, likeController.getAllLikes);
  
    // Add a new like
    router.post('/likes',authenticate, likeController.addLike);
  
    // Remove a like
    router.delete('/likes',authenticate, likeController.removeLike);
  
    // Get likes by post ID
    router.get('/likes/by-blog/:blog_id',authenticate, likeController.getLikesByBlogId);
  
    // Get likes by user ID
    router.get('/likes/by-user/:user_id',authenticate, likeController.getLikesByUserId);

    // Get Likes Count By Post ID
    router.get('/likes/likes-count/:blog_id',authenticate, likeController.getLikesCountByBlogId);
  
    app.use("/api", router);
  };
  