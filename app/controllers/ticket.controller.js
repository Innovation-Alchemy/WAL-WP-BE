const db = require("../models");
const Tickets = db.Ticket;
const Event = db.Event;
const {createTicketsSchema}= require('../utils/validations');

// Get all tickets
exports.getAllTickets = async (req, res) => {
  try {
    const tickets = await Tickets.findAll();
    if (tickets.length === 0) return res.status(404).json({ message: "No tickets found" });

    res.status(200).json({ message: "All tickets retrieved successfully", data: tickets });
  } catch (error) {
    console.error("Error retrieving all tickets:", error);
    res.status(500).json({ message: "Error retrieving tickets", error: error.message });
  }
};

// Get ticket by ticket ID
exports.getTicketById = async (req, res) => {
  try {
    const ticket = await Tickets.findByPk(req.params.id);
    if (!ticket) return res.status(404).json({ message: "Ticket not found" });

    res.status(200).json({ message: "Ticket retrieved successfully", data: ticket });
  } catch (error) {
    console.error("Error retrieving ticket by ID:", error);
    res.status(500).json({ message: "Error retrieving ticket", error: error.message });
  }
};

// Create Tickets
exports.createTickets = async (req, res) => {
  const { error } = createTicketsSchema.validate(req.body);
  if (error) return res.status(400).json({ message: error.details[0].message });

  try {
    const { event_id, price, section, total_seats, amount_issued, waves } = req.body;

    // Validate event existence
    const event = await Event.findByPk(event_id);
    if (!event) return res.status(404).json({ message: "Event not found" });

    // Normalize fields
    const normalizedPrice = price.map((item) => ({
      color: String(item.color),
      price: Number(item.price),
    }));

    const normalizedSection = section.map((item) => ({
      color: String(item.color),
      section: item.section.map(String),
    }));

    const normalizedTotalSeats = total_seats.map((item) => ({
      section: String(item.section),
      seats: Number(item.seats),
    }));

    // Calculate the total number of seats from total_seats array
    const totalSeatsCount = normalizedTotalSeats.reduce((sum, seat) => sum + seat.seats, 0);

    // Check if total_seats exceeds amount_issued
    if (totalSeatsCount > amount_issued) {
      return res.status(400).json({
        message: "Total seats cannot exceed the amount issued.",
        data: { totalSeatsCount, amount_issued },
      });
    }

    // Create tickets for the wave
    const tickets = await Tickets.create({
      event_id,
      price: normalizedPrice,
      section: normalizedSection,
      total_seats: normalizedTotalSeats,
      amount_issued,
      waves: waves || `wave-${Date.now()}`, // Default wave identifier if not provided
      issued_at: new Date(),
    });

    res.status(201).json({ message: "Tickets created successfully", data: tickets });
  } catch (error) {
    console.error("Error creating tickets:", error);
    res.status(500).json({ message: "Error creating tickets", error: error.message });
  }
};

// Update Ticket by Ticket ID
exports.updateTicketById = async (req, res) => {
  try {
    const ticket = await Tickets.findByPk(req.params.id);
    if (!ticket) return res.status(404).json({ message: "Ticket not found" });

    const { price, section, total_seats, amount_issued, waves } = req.body;

    // Normalize fields if they are provided
    const normalizedPrice = price
      ? price.map((item) => ({
          color: String(item.color),
          price: Number(item.price),
        }))
      : ticket.price;

    const normalizedSection = section
      ? section.map((item) => ({
          color: String(item.color),
          section: item.section.map(String),
        }))
      : ticket.section;

    const normalizedTotalSeats = total_seats
      ? total_seats.map((item) => ({
          section: String(item.section),
          seats: Number(item.seats),
          
        }))
      : ticket.total_seats;

    // If total_seats or amount_issued is being updated, validate them
    if (total_seats || amount_issued) {
      const newTotalSeatsCount = total_seats
        ? normalizedTotalSeats.reduce((sum, seat) => sum + seat.seats, 0)
        : ticket.total_seats.reduce((sum, seat) => sum + seat.seats, 0);

      const newAmountIssued = amount_issued || ticket.amount_issued;

      if (newTotalSeatsCount > newAmountIssued) {
        return res.status(400).json({
          message: "Total seats cannot exceed the amount issued.",
          data: { totalSeatsCount: newTotalSeatsCount, amountIssued: newAmountIssued },
        });
      }
    }

    // Update ticket
    const updatedTicket = await ticket.update({
      price: normalizedPrice,
      section: normalizedSection,
      total_seats: normalizedTotalSeats,
      amount_issued,
      waves: waves || ticket.waves, // Retain current wave if not updated
    });

    res.status(200).json({ message: "Ticket updated successfully", data: updatedTicket });
  } catch (error) {
    console.error("Error updating ticket:", error);
    res.status(500).json({ message: "Error updating ticket", error: error.message });
  }
};

// Get Tickets for an Event
exports.getTicketsByEvent = async (req, res) => {
  try {
    const tickets = await Tickets.findOne({ where: { event_id: req.params.event_id } });
    if (!tickets) return res.status(404).json({ message: "Tickets not found for this event" });

    res.status(200).json({ message: "Tickets retrieved successfully", data: tickets });
  } catch (error) {
    console.error("Error retrieving tickets:", error);
    res.status(500).json({ message: "Error retrieving tickets", error: error.message });
  }
};

// Delete Ticket by Ticket ID
exports.deleteTicketById = async (req, res) => {
  try {
    // Find the ticket by ID
    const ticket = await Tickets.findByPk(req.params.id);
    if (!ticket) return res.status(404).json({ message: "Ticket not found" });

    // Delete the ticket
    await ticket.destroy();

    res.status(200).json({ message: "Ticket deleted successfully" });
  } catch (error) {
    console.error("Error deleting ticket:", error);
    res.status(500).json({ message: "Error deleting ticket", error: error.message });
  }
};

exports.updateTotalRevenue = async (ticketId) => {
  try {
    // Find the ticket and its associated event
    const ticket = await Tickets.findByPk(ticketId, {
      include: [
        {
          model: Event,
          attributes: ["id", "commission", "total_revenue"],
        },
      ],
    });

    if (!ticket || !ticket.Event) {
      console.error("Ticket or associated Event not found");
      return;
    }

    // Calculate the total revenue
    const { Event: event } = ticket;
    const totalRevenue = parseFloat(event.commission) * parseFloat(ticket.tickets_sold_count_sum_price || 0) / 100;

    // Update the event's total_revenue field
    await event.update({ total_revenue: totalRevenue });
    console.log(`Total revenue for event ID ${event.id} updated successfully.`);
  } catch (error) {
    console.error("Error updating total revenue:", error.message);
  }
};