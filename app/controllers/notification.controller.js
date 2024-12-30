const db = require("../models");
const { createNotificationSchema } = require("../utils/validations");
const Notification = db.notification;

// Get all notifications
exports.getAllNotifications = async (req, res) => {
  try {
    const notifications = await Notification.findAll();
    res.status(200).json({
      message: "Notifications retrieved successfully",
      data: notifications,
    });
  } catch (error) {
    console.error("Error retrieving notifications:", error);
    res.status(500).json({
      message: "Error retrieving notifications",
      error: error.message,
    });
  }
};

// Get notification by ID
exports.getNotificationById = async (req, res) => {
  try {
    const notification = await Notification.findByPk(req.params.id);
    if (!notification)
      return res.status(404).json({ message: "Notification not found" });
    res.status(200).json({
      message: "Notification retrieved successfully",
      data: notification,
    });
  } catch (error) {
    console.error("Error retrieving notification:", error);
    res.status(500).json({
      message: "Error retrieving notification",
      error: error.message,
    });
  }
};

// Get notifications by user_id
exports.getNotificationsByUserId = async (req, res) => {
    try {
      const { user_id } = req.params;
  
      const notifications = await Notification.findAll({
        where: { user_id },
        order: [["date_time", "DESC"]], // Sort by date_time in descending order
      });
  
      if (notifications.length === 0) {
        return res.status(404).json({ message: "No notifications found for this user." });
      }
  
      res.status(200).json({
        message: "Notifications retrieved successfully",
        data: notifications,
      });
    } catch (error) {
      console.error("Error retrieving notifications:", error);
      res.status(500).json({
        message: "Error retrieving notifications",
        error: error.message,
      });
    }
  };
  
// Create a new notification
exports.createNotification = async (req, res) => {
  const { error } = createNotificationSchema.validate(req.body);
  if (error) {
    return res.status(400).json({ message: error.details[0].message });
  }

  try {
    const { user_id, event_id, blog_id, product_id, notification_type, alerts, message } = req.body;

    const notification = await Notification.create({
      user_id,
      event_id,
      blog_id,
      product_id,
      notification_type,
      alerts,
      message,
    });

    res.status(201).json({
      message: "Notification created successfully",
      data: notification,
    });
  } catch (error) {
    console.error("Error creating notification:", error);
    res.status(500).json({
      message: "Error creating notification",
      error: error.message,
    });
  }
};

// Mark a notification as read
exports.markAsRead = async (req, res) => {
  try {
    const notification = await Notification.findByPk(req.params.id);
    if (!notification) {
      return res.status(404).json({ message: "Notification not found" });
    }

    await notification.update({ is_read: true });

    res.status(200).json({
      message: "Notification marked as read",
      data: notification,
    });
  } catch (error) {
    console.error("Error updating notification:", error);
    res.status(500).json({
      message: "Error updating notification",
      error: error.message,
    });
  }
};

// Delete a notification
exports.deleteNotification = async (req, res) => {
  try {
    const notification = await Notification.findByPk(req.params.id);
    if (!notification) {
      return res.status(404).json({ message: "Notification not found" });
    }

    await notification.destroy();

    res.status(200).json({
      message: "Notification deleted successfully",
    });
  } catch (error) {
    console.error("Error deleting notification:", error);
    res.status(500).json({
      message: "Error deleting notification",
      error: error.message,
    });
  }
};
