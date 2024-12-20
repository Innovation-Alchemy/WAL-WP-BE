module.exports = (app) => {
    const express = require('express');
    const router = express.Router();
    const categoryController = require('../controllers/category.controller');
    const authenticate = require('../middleware/authMiddleware');
  
    router.get('/categories', authenticate, categoryController.getAllCategories);
    router.get('/categories/:id', authenticate, categoryController.getCategoryById);
    router.post('/categories', authenticate, categoryController.createCategory);
    router.put('/categories/:id', authenticate, categoryController.updateCategory);
    router.delete('/categories/:id', authenticate, categoryController.deleteCategory);
  
    app.use('/api', router);
  };
  