module.exports = (app) => {
    const express = require('express');
    const router = express.Router();
    const ticketController = require('../controllers/ticket.controller');
    const authenticate = require('../middleware/authMiddleware');
    const checkPermission = require('../middleware/RBAC.Middleware');


    // only admin and organizer can create ,update and delete tickets 
    router.get("/tickets", ticketController.getAllTickets); 
    router.get("/tickets/:id", ticketController.getTicketById);
    router.get("/tickets/event/:event_id", ticketController.getTicketsByEvent);
    router.post('/tickets', authenticate, checkPermission('create-ticket'), ticketController.createTickets);
    router.put('/tickets/:id', authenticate, checkPermission('update-ticket'), ticketController.updateTicketById);
    router.delete('/tickets/:id', authenticate, checkPermission('delete-ticket'), ticketController.deleteTicketById);
  
    app.use('/api', router);
  };
  