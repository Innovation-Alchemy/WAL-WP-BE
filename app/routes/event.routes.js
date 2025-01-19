module.exports = (app) => {
    const express = require('express');
    const router = express.Router();
    const eventController = require('../controllers/event.controller');
    const authenticate = require('../middleware/authMiddleware');
    const checkPermission = require('../middleware/RBAC.Middleware');
    const upload = require("../middleware/uploadMiddleware");

// everyone can see events but only admin can create update and delete it 
// while organizer need approval after creating it and he can update certain feilds so we need a new route for update for organizer
    router.get('/events', authenticate, eventController.getAllEvents);
    router.get('/events/:id', authenticate, eventController.getEventById);
    router.get('/events/for-user/:user_id', authenticate, eventController.getEventsByUserId);
    router.post('/events', authenticate,upload.single("image"), checkPermission('create-event'), eventController.createEvent);
    router.put('/events/:id', authenticate,upload.single("image"), checkPermission('update-event'), eventController.updateEvent);
    router.delete('/events/:id', authenticate, checkPermission('delete-event'), eventController.deleteEvent);
  
    app.use('/api', router);
  };
  