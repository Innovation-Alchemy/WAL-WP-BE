module.exports = (app) => {
    const express = require("express");
    const router = express.Router();
    const ticketSoldController = require("../controllers/tickets_sold.controller");
    const authenticate = require('../middleware/authMiddleware');
  

    router.get("/tickets-sold",authenticate, ticketSoldController.getAllTicketsSold);
    router.get("/tickets-sold/:id",authenticate, ticketSoldController.getTicketsSoldById);
    router.get('/tickets-sold/for-buyer/:buyer_id', authenticate, ticketSoldController.getTicketsSoldByBuyerId);
    router.post("/tickets-sold/reserve",authenticate, ticketSoldController.reserveTickets);
    router.post("/tickets-sold/confirm-purchasing-tickets",authenticate, ticketSoldController.confirmPurchases);
    router.post("/tickets-sold/check-in",authenticate, ticketSoldController.checkInTicket);
    router.delete("/tickets-sold/cancel-reservation/:id",authenticate, ticketSoldController.cancelReservation);
 
    
  
    app.use("/api", router);
  };
  