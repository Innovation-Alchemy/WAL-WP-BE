/*module.exports = (app) => {
const express = require('express');
const router = express.Router();
const notificationController = require('../controllers/notification.controller');
const checkPermission = require("../middleware/RBAC.Middleware");
const authenticate = require("../middleware/auth.Middleware");

router.post('/notification', notificationController.createNotification);

router.post('/notification/mark-read/:id', notificationController.markNotificationAsRead);

router.get('/notification/:id', notificationController.getNotificationById);

router.put('/notification/:id', notificationController.updateNotification);

router.delete('/notification/:id', notificationController.deleteNotification);


  app.use("/api", router);
};*/
