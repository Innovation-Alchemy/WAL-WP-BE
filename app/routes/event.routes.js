module.exports = (app) => {
    const express = require('express');
    const router = express.Router();
    const eventController = require('../controllers/eventController');
    const authenticate = require('../middleware/authMiddleware');
    const checkPermission = require('../middleware/RBACMiddleware');
  
    router.get('/events', authenticate, eventController.getAllEvents);
    router.get('/events/:id', authenticate, eventController.getEventById);
    router.post('/events', authenticate, checkPermission('create-event'), eventController.createEvent);
    router.put('/events/:id', authenticate, checkPermission('update-event'), eventController.updateEvent);
    router.delete('/events/:id', authenticate, checkPermission('delete-event'), eventController.deleteEvent);
  
    app.use('/api', router);
  };
  