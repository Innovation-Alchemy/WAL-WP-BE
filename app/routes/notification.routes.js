module.exports = (app) => {
const express = require('express');
const router = express.Router();
const notificationController = require('../controllers/notification.controller');
const authenticate = require("../middleware/authMiddleware");

// Get all notifications
router.get("/notifications",authenticate, notificationController.getAllNotifications);

// Get notification by ID
router.get("/notifications/:id",authenticate, notificationController.getNotificationById);

// Get notifications by user_id
router.get("/notifications/user/:user_id", notificationController.getNotificationsByUserId);

// Create a new notification
router.post("/notifications",authenticate, notificationController.createNotification);

// Mark a notification as read
router.patch("/notifications/read/:id",authenticate, notificationController.markAsRead);

// Delete a notification
router.delete("/notifications/:id",authenticate, notificationController.deleteNotification);


  app.use("/api", router);
};
