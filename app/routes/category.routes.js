module.exports = (app) => {
    const express = require('express');
    const router = express.Router();
    const categoryController = require('../controllers/category.controller');
    const authenticate = require('../middleware/authMiddleware');
    const checkPermission = require('../middleware/RBAC.Middleware');

    // evryone can see categories so no need for permissions
    router.get('/categories', authenticate, categoryController.getAllCategories);
    // evryone can see categories so no need for permissions
    router.get('/categories/:id', authenticate, categoryController.getCategoryById);
    // only admin can create categories
    router.post('/categories', authenticate,checkPermission('create-categories'), categoryController.createCategory);
    // only admin and organizer can create categories
    router.post("/assign-categories/:type/:id/",checkPermission('assign-categories'),categoryController.assignCategories); // Type: "event" or "prodcut"
    // only admin and organizer can create categories
    router.post("/remove-categories/:type/:id/",checkPermission('remove-categories'),categoryController.removeCategories); // Type: "event" or "product"
    // only admin can update categories
    router.put('/categories/:id', authenticate,checkPermission('update-categories'), categoryController.updateCategory);
    // only admin can delete categories
    router.delete('/categories/:id', authenticate,checkPermission('delete-categories'), categoryController.deleteCategory);
  
    app.use('/api', router);
  };
  