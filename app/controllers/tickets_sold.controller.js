const db = require("../models");
const TicketsSold = db.TicketsSold;
const Tickets = db.Ticket;
const User = db.User;
const {reserveTicketSchema,confirmPurchaseSchema,cancelReservationSchema}= require('../utils/validations');
const QRCode = require("qrcode");
const PDFDocument = require("pdfkit");
const fs = require("fs");
const transporter = require("../config/email.config");

// Reserve a ticket
exports.reserveTicket = async (req, res) => {
  const { error } = reserveTicketSchema.validate(req.body);
  if (error) return res.status(400).json({ message: error.details[0].message });

  const { ticket_id, section, color, buyer_id, amount, seat_number } = req.body;

  try {
    // Check if the buyer exists
    const buyer = await db.User.findByPk(buyer_id);
    if (!buyer) return res.status(404).json({ message: "Buyer not found" });

    // Check if the ticket exists
    const ticket = await Tickets.findByPk(ticket_id);
    if (!ticket) return res.status(404).json({ message: "Ticket not found" });

    // Debug: Log raw total_seats data
    console.log("Raw total_seats Data:", ticket.total_seats);

    // Parse total_seats as JSON if necessary
    let totalSeats;
    try {
      totalSeats = typeof ticket.total_seats === "string"
        ? JSON.parse(ticket.total_seats)
        : ticket.total_seats;

      // Handle double-encoded JSON strings
      if (typeof totalSeats === "string") {
        totalSeats = JSON.parse(totalSeats);
      }
    } catch (parseError) {
      console.error("Error parsing total_seats:", parseError);
      return res.status(500).json({ message: "Failed to parse total_seats data" });
    }

    // Validate totalSeats structure
    if (!Array.isArray(totalSeats)) {
      return res.status(500).json({ message: "Invalid total_seats data format" });
    }

    // Validate seat availability in the requested section and color
    const sectionData = totalSeats.find(
      (s) => s.section === section && s.color === color
    );
    if (!sectionData || sectionData.seats < amount) {
      return res.status(400).json({
        message: "Not enough available seats in this section for the specified color",
      });
    }

    // Parse price as JSON if necessary
    const priceData = typeof ticket.price === "string"
      ? JSON.parse(ticket.price)
      : ticket.price;

    // Find the price for the requested color
    const priceForColor = priceData.find((p) => p.color === color);
    if (!priceForColor) {
      return res.status(400).json({
        message: "Price not defined for this section and color",
      });
    }

    // Validate seat numbers provided
    if (seat_number.length !== amount) {
      return res.status(400).json({
        message: "Number of seat numbers provided does not match the amount requested",
      });
    }

    // Reduce the seat count
    sectionData.seats -= amount;
    await ticket.update({
      total_seats: JSON.stringify(
        totalSeats.map((s) =>
          s.section === section && s.color === color ? sectionData : s
        )
      ),
    });

    // Calculate total price
    const totalPrice = priceForColor.price * amount;

    // Create reservation
    const reservation = await TicketsSold.create({
      buyer_id,
      ticket_id,
      section,
      color,
      seat_number,
      amount,
      total_price: totalPrice,
      status: "reserved",
    });

    res.status(201).json({ message: "Tickets reserved successfully", data: reservation });
  } catch (error) {
    console.error("Error reserving tickets:", error);
    res.status(500).json({ message: "Error reserving tickets", error: error.message });
  }
};


// Confirm ticket purchase
exports.confirmPurchase = async (req, res) => {
  const { error } = confirmPurchaseSchema.validate(req.body);
  if (error) return res.status(400).json({ message: error.details[0].message });
  const { ticket_sold_id } = req.body;

  try {
    const reservation = await TicketsSold.findByPk(ticket_sold_id);
    if (!reservation) return res.status(404).json({ message: "Reservation not found" });

    const user = await db.User.findByPk(reservation.buyer_id);
    if (!user) return res.status(404).json({ message: "Buyer not found" });

    const ticket = await Tickets.findByPk(reservation.ticket_id);
    if (!ticket) return res.status(404).json({ message: "Ticket not found" });

    // Generate QR Code with ticket information
    const qrData = {
      user_name: user.name,
      ticket_id: reservation.ticket_id,
      section: reservation.section,
      color: reservation.color,
      seat_number: reservation.seat_number,
    };
    const qrCode = await QRCode.toDataURL(JSON.stringify(qrData));

    // Update reservation with QR Code
    reservation.qr_code = qrCode;
    reservation.status = "purchased";

    // Increment tickets_sold_count
    reservation.tickets_sold_count += reservation.amount;

    await reservation.save();

    // Send email logic remains unchanged (omitted for brevity)
    res.status(200).json({ message: "Purchase confirmed successfully", data: reservation });
  } catch (error) {
    console.error("Error confirming purchase:", error);
    res.status(500).json({ message: "Error confirming purchase", error: error.message });
  }
};

// Cancel ticket reservation
exports.cancelReservation = async (req, res) => {
  const { error } = cancelReservationSchema.validate(req.body);
  if (error) return res.status(400).json({ message: error.details[0].message });
  const { ticket_sold_id } = req.body;

  try {
    const reservation = await TicketsSold.findByPk(ticket_sold_id);
    if (!reservation) return res.status(404).json({ message: "Reservation not found" });

    const ticket = await Tickets.findByPk(reservation.ticket_id);
    if (!ticket) return res.status(404).json({ message: "Ticket not found" });

    // Parse total_seats as JSON
    const totalSeats = typeof ticket.total_seats === "string"
      ? JSON.parse(ticket.total_seats)
      : ticket.total_seats;

    const sectionData = totalSeats.find(
      (s) => s.section === reservation.section && s.color === reservation.color
    );
    if (!sectionData) {
      return res.status(400).json({
        message: `Section "${reservation.section}" with color "${reservation.color}" not found`,
      });
    }

    // Restore seat count
    sectionData.seats += reservation.amount;
    await ticket.update({
      total_seats: JSON.stringify(
        totalSeats.map((s) =>
          s.section === reservation.section && s.color === reservation.color
            ? sectionData
            : s
        )
      ),
    });

    // Decrement tickets_sold_count
    reservation.tickets_sold_count -= reservation.amount;

    await reservation.destroy();

    res.status(200).json({ message: "Reservation canceled successfully" });
  } catch (error) {
    console.error("Error canceling reservation:", error);
    res.status(500).json({ message: "Error canceling reservation", error: error.message });
  }
};

// Get all tickets sold
exports.getAllTicketsSold = async (req, res) => {
  try {
    const ticketsSold = await TicketsSold.findAll();
    if (!ticketsSold.length) {
      return res.status(404).json({ message: "No tickets sold found" });
    }

    res.status(200).json({ message: "Tickets sold retrieved successfully", data: ticketsSold });
  } catch (error) {
    console.error("Error retrieving tickets sold:", error);
    res.status(500).json({ message: "Error retrieving tickets sold", error: error.message });
  }
};

// Get tickets sold by ID
exports.getTicketsSoldById = async (req, res) => {
  try {
    const ticketSold = await TicketsSold.findByPk(req.params.id);
    if (!ticketSold) {
      return res.status(404).json({ message: "Ticket sold not found" });
    }

    res.status(200).json({ message: "Ticket sold retrieved successfully", data: ticketSold });
  } catch (error) {
    console.error("Error retrieving ticket sold by ID:", error);
    res.status(500).json({ message: "Error retrieving ticket sold by ID", error: error.message });
  }
};

exports.getTicketsSoldCount = async (req, res) => {
  const { buyer_id } = req.params;

  try {
    const totalTickets = await TicketsSold.sum("tickets_sold_count", {
      where: { buyer_id },
    });

    res.status(200).json({ message: "Total tickets sold retrieved successfully", totalTickets });
  } catch (error) {
    console.error("Error retrieving tickets sold count:", error);
    res.status(500).json({ message: "Error retrieving tickets sold count", error: error.message });
  }
};
