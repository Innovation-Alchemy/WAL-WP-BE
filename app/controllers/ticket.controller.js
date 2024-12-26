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
    const { event_id, price, section, total_seats } = req.body;

    // Validate event existence
    const event = await Event.findByPk(event_id);
    if (!event) return res.status(404).json({ message: "Event not found" });

    // Create tickets
    const tickets = await Tickets.create({
      event_id,
      price,
      section,
      total_seats,
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
    // Find the ticket by ID
    const ticket = await Tickets.findByPk(req.params.id);
    if (!ticket) return res.status(404).json({ message: "Ticket not found" });

    // Update ticket data
    await ticket.update(req.body);

    res.status(200).json({ message: "Ticket updated successfully", data: ticket });
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

// Count Tickets Sold by Section
exports.countTicketsSold = async (req, res) => {
  try {
    const tickets = await Tickets.findOne({ where: { event_id: req.params.event_id } });
    if (!tickets) return res.status(404).json({ message: "Tickets not found for this event" });

    const soldCount = tickets.ticket_sold.reduce((acc, sold) => {
      const section = sold.section;
      acc[section] = (acc[section] || 0) + 1;
      return acc;
    }, {});

    res.status(200).json({ message: "Tickets sold count retrieved successfully", data: soldCount });
  } catch (error) {
    console.error("Error counting tickets sold:", error);
    res.status(500).json({ message: "Error counting tickets sold", error: error.message });
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

