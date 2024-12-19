module.exports = (app) => {
    const express = require('express');
    const router = express.Router();
    const venueController = require('../controllers/venueController');
    const authenticate = require('../middleware/authMiddleware');
    const checkPermission = require('../middleware/RBACMiddleware');
  
    router.get('/venues', authenticate, venueController.getAllVenues);
    router.get('/venues/:id', authenticate, venueController.getVenueById);
    router.post('/venues', authenticate, checkPermission('create-venue'), venueController.createVenue);
    router.put('/venues/:id', authenticate, checkPermission('update-venue'), venueController.updateVenue);
    router.delete('/venues/:id', authenticate, checkPermission('delete-venue'), venueController.deleteVenue);
  
    app.use('/api', router);
  };
  