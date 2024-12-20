module.exports = (app) => {
  const express = require('express');
  const router = express.Router();
  const userController = require('../controllers/user.controller');
  const authenticate = require('../middleware/authMiddleware');
  const checkPermission = require('../middleware/RBAC.Middleware');

  router.get('/users', authenticate, userController.getAllUsers);
  router.get('/users/:id', authenticate, userController.getUserById);
  router.post('/users', authenticate, checkPermission('create-user'), userController.createUser);
  router.put('/users/:id', authenticate, checkPermission('update-user'), userController.updateUser);
  router.delete('/users/:id', authenticate, checkPermission('delete-user'), userController.deleteUser);

  app.use('/api', router);
};
