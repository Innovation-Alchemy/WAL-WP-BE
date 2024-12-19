module.exports = (app) => {
    const express = require('express');
    const router = express.Router();
    const ticketController = require('../controllers/ticketController');
    const authenticate = require('../middleware/authMiddleware');
    const checkPermission = require('../middleware/RBACMiddleware');
  
    router.get('/tickets', authenticate, ticketController.getAllTickets);
    router.get('/tickets/:id', authenticate, ticketController.getTicketById);
    router.post('/tickets', authenticate, checkPermission('create-ticket'), ticketController.createTicket);
    router.put('/tickets/:id', authenticate, checkPermission('update-ticket'), ticketController.updateTicket);
    router.delete('/tickets/:id', authenticate, checkPermission('delete-ticket'), ticketController.deleteTicket);
  
    app.use('/api', router);
  };
  