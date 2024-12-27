module.exports = (app) => {
    const express = require("express");
    const router = express.Router();
    const ticketSoldController = require("../controllers/tickets_sold.controller");
  

    router.get("/tickets-sold", ticketSoldController.getAllTicketsSold);
    router.get("/total-tickets-sold-count/:buyer_id", ticketSoldController.getTicketsSoldCount);
    router.get("/tickets-sold/:id", ticketSoldController.getTicketsSoldById);
    router.post("/tickets-sold/reserve", ticketSoldController.reserveTicket);
    router.post("/tickets-sold/confirm", ticketSoldController.confirmPurchase);
    router.post("/tickets-sold/cancel", ticketSoldController.cancelReservation);
  
    app.use("/api", router);
  };
  