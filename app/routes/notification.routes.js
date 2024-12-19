module.exports = (app) => {
    const express = require('express');
    const router = express.Router();
    const notificationController = require('../controllers/notificationController');
    const authenticate = require('../middleware/authMiddleware');
  
    router.get('/notifications', authenticate, notificationController.getAllNotifications);
    router.get('/notifications/:id', authenticate, notificationController.getNotificationById);
    router.post('/notifications', authenticate, notificationController.createNotification);
    router.put('/notifications/:id', authenticate, notificationController.updateNotification);
    router.delete('/notifications/:id', authenticate, notificationController.deleteNotification);
  
    app.use('/api', router);
  };
  