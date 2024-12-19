const db = require("../models");
const Ticket = db.Ticket;

exports.getAllTickets = async (req, res) => {
  try {
    const tickets = await Ticket.findAll();
    res.status(200).json({ message: "Tickets retrieved successfully", data: tickets });
  } catch (error) {
    console.error("Error retrieving tickets:", error);
    res.status(500).json({ message: "Error retrieving tickets", error: error.message });
  }
};

exports.getTicketById = async (req, res) => {
  try {
    const ticket = await Ticket.findByPk(req.params.id);
    if (!ticket) return res.status(404).json({ message: "Ticket not found" });
    res.status(200).json({ message: "Ticket retrieved successfully", data: ticket });
  } catch (error) {
    console.error("Error retrieving ticket:", error);
    res.status(500).json({ message: "Error retrieving ticket", error: error.message });
  }
};

exports.createTicket = async (req, res) => {
  try {
    const ticket = await Ticket.create(req.body);
    res.status(201).json({ message: "Ticket created successfully", data: ticket });
  } catch (error) {
    console.error("Error creating ticket:", error);
    res.status(500).json({ message: "Error creating ticket", error: error.message });
  }
};

exports.updateTicket = async (req, res) => {
  try {
    const ticket = await Ticket.findByPk(req.params.id);
    if (!ticket) return res.status(404).json({ message: "Ticket not found" });

    await ticket.update(req.body);
    res.status(200).json({ message: "Ticket updated successfully", data: ticket });
  } catch (error) {
    console.error("Error updating ticket:", error);
    res.status(500).json({ message: "Error updating ticket", error: error.message });
  }
};

exports.deleteTicket = async (req, res) => {
  try {
    const ticket = await Ticket.findByPk(req.params.id);
    if (!ticket) return res.status(404).json({ message: "Ticket not found" });

    await ticket.destroy();
    res.status(200).json({ message: "Ticket deleted successfully" });
  } catch (error) {
    console.error("Error deleting ticket:", error);
    res.status(500).json({ message: "Error deleting ticket", error: error.message });
  }
};
