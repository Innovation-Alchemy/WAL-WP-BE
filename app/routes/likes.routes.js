// app/routes/like.routes.js

module.exports = (app) => {
    const likeController = require("../controllers/likes.controller");
    const router = require("express").Router();
  
    // Get all likes
    router.get('/likes', likeController.getAllLikes);
  
    // Add a new like
    router.post('/likes', likeController.addLike);
  
    // Remove a like
    router.delete('/likes', likeController.removeLike);
  
    // Get likes by post ID
    router.get('/likes/by-blog/:blog_id', likeController.getLikesByBlogId);
  
    // Get likes by user ID
    router.get('/likes/by-user/:user_id', likeController.getLikesByUserId);

    // Get Likes Count By Post ID
    router.get('/likes/likes-count/:blog_id', likeController.getLikesCountByBlogId);
  
    app.use("/api", router);
  };
  