module.exports = (app) => {
  const express = require('express');
  const router = express.Router();
  const permissionController = require('../controllers/permission.controller');
  const checkPermission = require('../middleware/RBAC.Middleware');
  const authenticate = require('../middleware/auth.Middleware');

  // ** Get all permissions **
  router.get('/permissions', authenticate, checkPermission('read-permission'), permissionController.getAllPermissions);

  // ** Add a new permission **
  router.post(
    '/permissions',
    authenticate,
    checkPermission('create-permission'),
    permissionController.addPermission
  );

  // ** Assign permissions to a user (by userType and user ID) **
  router.post(
    '/permissions/assign/:id',
    authenticate,
    checkPermission('assign-permission'),
    permissionController.assignPermissions
  );

  // ** Remove permissions from a user (by userType and user ID) **
  router.post(
    '/permissions/remove/:id',
    authenticate,
    checkPermission('remove-permission'),
    permissionController.removePermissions
  );

  // ** Get permissions for a specific user **
  router.get(
    '/permissions/user/:id',
    authenticate,
    checkPermission('read-permission'),
    permissionController.getPermissions
  );

  // ** Get a specific permission by ID **
  router.get(
    '/permissions/:id',
    authenticate,
    checkPermission('read-permission'),
    permissionController.getPermissionById
  );

  // ** Update a specific permission by ID **
  router.put(
    '/permissions/:id',
    authenticate,
    checkPermission('update-permission'),
    permissionController.updatePermission
  );

  // ** Delete a specific permission by ID **
  router.delete(
    '/permissions/:id',
    authenticate,
    checkPermission('delete-permission'),
    permissionController.deletePermission
  );

  app.use('/api', router);
};
