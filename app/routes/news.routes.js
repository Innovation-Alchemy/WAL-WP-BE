module.exports = (app) => {
  const express = require('express');
  const router = express.Router();
  const newsController = require('../controllers/news.controller');
  const upload = require('../middleware/uploadMiddleware'); 
  const checkPermission = require("../middleware/RBAC.Middleware");
  const authenticate = require("../middleware/authMiddleware");

  
  router.post('/news', authenticate, checkPermission("create-news"), upload.array('images', 5), newsController.createNews);

  router.get('/news', newsController.getAllNews);

  router.get('/news/search', newsController.searchNews);
  
  router.get('/news/filter/category', newsController.filterNewsByCategory);
  
  router.get('/news/:id', newsController.getNewsById);

  router.put('/news/:id', authenticate, checkPermission("update-news"), upload.array('images', 5), newsController.updateNews);
 
  router.delete('/news/:id', authenticate, checkPermission("delete-news"), newsController.deleteNews);

  app.use("/api", router);
};
