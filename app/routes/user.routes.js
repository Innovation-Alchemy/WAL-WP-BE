module.exports = (app) => {
  const express = require('express');
  const router = express.Router();
  const userController = require('../controllers/user.controller');
  const authenticate = require('../middleware/authMiddleware');
  const checkPermission = require('../middleware/RBAC.Middleware');
  const upload = require("../middleware/uploadMiddleware"); // Import multer middleware

// only admin can create and delete a user , a user can update his data but nit all to be set later
  router.get('/users', authenticate, userController.getAllUsers);
  router.get('/users/:id', authenticate, userController.getUserById);
  router.post('/users', authenticate,upload.single("profile_picture"), checkPermission('create-user'), userController.createUser);
  router.put('/users/:id', authenticate,upload.single("profile_picture"), checkPermission('update-user'), userController.updateUser);
  router.delete('/users/:id', authenticate, checkPermission('delete-user'), userController.deleteUser);

  app.use('/api', router);
};
