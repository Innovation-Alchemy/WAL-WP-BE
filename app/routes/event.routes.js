module.exports = (app) => {
    const express = require('express');
    const router = express.Router();
    const eventController = require('../controllers/event.controller');
    const authenticate = require('../middleware/authMiddleware');
    const checkPermission = require('../middleware/RBAC.Middleware');
    const upload = require("../middleware/uploadMiddleware");


    router.get('/events', authenticate, eventController.getAllEvents);
    router.get('/events/:id', authenticate, eventController.getEventById);
    router.post('/events', authenticate,upload.single("ticket_maps"), checkPermission('create-event'), eventController.createEvent);
    router.put('/events/:id', authenticate,upload.single("ticket_maps"), checkPermission('update-event'), eventController.updateEvent);
    router.delete('/events/:id', authenticate, checkPermission('delete-event'), eventController.deleteEvent);
  
    app.use('/api', router);
  };
  