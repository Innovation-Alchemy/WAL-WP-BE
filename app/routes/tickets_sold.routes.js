module.exports = (app) => {
    const express = require("express");
    const router = express.Router();
    const ticketSoldController = require("../controllers/tickets_sold.controller");
    const authenticate = require('../middleware/authMiddleware');
  

    router.get("/tickets-sold",authenticate, ticketSoldController.getAllTicketsSold);
    router.get("/tickets-sold/:id",authenticate, ticketSoldController.getTicketsSoldById);
    router.post("/tickets-sold/reserve",authenticate, ticketSoldController.reserveTickets);
    router.post("/tickets-sold/confirm-purchasing-tickets",authenticate, ticketSoldController.confirmPurchases);
   // router.post("/tickets-sold/scan-qr-code",authenticate, ticketSoldController.scanQRCode);
 
    
  
    app.use("/api", router);
  };
  