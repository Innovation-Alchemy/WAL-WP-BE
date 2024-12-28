module.exports = (app) => {
    const express = require("express");
    const router = express.Router();
    const ticketSoldController = require("../controllers/tickets_sold.controller");
    const authenticate = require('../middleware/authMiddleware');
  

    router.get("/tickets-sold",authenticate, ticketSoldController.getAllTicketsSold);
    router.get("/total-tickets-sold-count/:buyer_id",authenticate, ticketSoldController.getTicketsSoldCount);
    router.get("/tickets-sold/:id",authenticate, ticketSoldController.getTicketsSoldById);
    router.post("/tickets-sold/reserve",authenticate, ticketSoldController.reserveTicket);
    router.post("/tickets-sold/confirm",authenticate, ticketSoldController.confirmPurchase);
    router.post("/tickets-sold/cancel", authenticate,ticketSoldController.cancelReservation);
  
    app.use("/api", router);
  };
  