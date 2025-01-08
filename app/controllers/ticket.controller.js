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
    const {
      event_id,
      price,
      section,
      total_seats,
      amount_issued,
      waves,
      issued_at,
      ticket_alert,
    } = req.body;

    // 1. Validate event existence
    const event = await Event.findByPk(event_id);
    if (!event) {
      return res.status(404).json({ message: "Event not found" });
    }

    // 2. Seated Event Logic
    if (event.seated) {
      // Ensure no waves are provided
      if (waves) {
        return res
          .status(400)
          .json({ message: "Seated event cannot have waves." });
      }

      // Check if tickets already exist for this event (only one creation allowed)
      const existingTickets = await Tickets.findOne({
        where: { event_id: event_id },
      });
      if (existingTickets) {
        return res.status(400).json({
          message: "Tickets have already been created for this seated event.",
        });
      }

      // Validate required seat-based fields
      if (!section || !Array.isArray(section) || section.length === 0) {
        return res.status(400).json({
          message: "Section is required for a seated event.",
        });
      }
      if (!total_seats || !Array.isArray(total_seats) || total_seats.length === 0) {
        return res.status(400).json({
          message: "Total seats configuration is required for a seated event.",
        });
      }

      // Normalize price
      const normalizedPrice = price.map((item) => ({
        color: String(item.color),
        price: Number(item.price),
      }));

      // Normalize section
      const normalizedSection = section.map((item) => ({
        color: String(item.color),
        section: item.section.map(String),
      }));

      // Normalize total_seats
      const normalizedTotalSeats = total_seats.map((item) => ({
        section: String(item.section),
        seats: Number(item.seats),
      }));

      // sum(total_seats) must EQUAL (not just <=) amount_issued
      const totalSeatsCount = normalizedTotalSeats.reduce(
        (sum, seat) => sum + seat.seats,
        0
      );
      if (totalSeatsCount !== amount_issued) {
        return res.status(400).json({
          message:
            "For seated events, the sum of all seats must exactly match the amount_issued.",
        });
      }

      // Create the ticket record (seated)
      const tickets = await Tickets.create({
        event_id,
        price: normalizedPrice,
        section: normalizedSection,
        total_seats: normalizedTotalSeats,
        amount_issued,
        issued_at: issued_at || new Date(),
        ticket_alert,
        // waves is intentionally omitted or set to null for seated events
        waves: null,
      });

      return res.status(201).json({
        message: "Tickets created successfully (seated)",
        data: tickets,
      });
    }

    // 3. Non-Seated Event Logic
    else {
      // 'waves' is required for a non-seated event
      if (!waves) {
        return res.status(400).json({
          message:
            "For non-seated events, 'waves' is required (e.g., 'Wave 1', 'Wave 2').",
        });
      }

      // Check if this wave already exists for the same event
      const existingWave = await Tickets.findOne({
        where: { event_id, waves },
      });
      if (existingWave) {
        return res.status(400).json({
          message: `Wave "${waves}" already exists for this event. Choose a different wave name.`,
        });
      }

      // Validate amount_issued
      if (!amount_issued || amount_issued <= 0) {
        return res.status(400).json({
          message: "Invalid amount_issued for non-seated event.",
        });
      }

      // Normalize 'price'
      const normalizedPrice = price.map((item) => ({
        color: String(item.color),
        price: Number(item.price),
      }));

      // Validate 'section' - each must have 'quantity' and sum must match amount_issued
      if (!section || !Array.isArray(section) || section.length === 0) {
        return res.status(400).json({
          message:
            "For non-seated events, 'section' must be a non-empty array (each with a 'quantity').",
        });
      }

      let totalQuantity = 0;
      const normalizedSection = section.map((item) => {
        // If the user didn't provide a numeric 'quantity', throw error
        if (
          item.quantity === undefined ||
          typeof item.quantity !== "number" ||
          item.quantity <= 0
        ) {
          throw new Error(
            `Invalid 'quantity' in one of the sections. Make sure it's a positive number.`
          );
        }
        totalQuantity += item.quantity;

        return {
          color: String(item.color),
          section: item.section ? item.section.map(String) : [],
          // Store the quantity in each section for non-seated
          quantity: item.quantity,
        };
      });

      // Now check that sum of all section[i].quantity == amount_issued
      if (totalQuantity !== amount_issued) {
        return res.status(400).json({
          message:
            "For non-seated events, the sum of 'quantity' fields in all sections must match amount_issued.",
        });
      }

      // Create the ticket record (non-seated wave)
      const tickets = await Tickets.create({
        event_id,
        price: normalizedPrice,
        section: normalizedSection,
        total_seats: null,
        amount_issued,
        issued_at: issued_at || new Date(),
        ticket_alert,
        waves, // e.g. "Wave 2"
      });

      return res.status(201).json({
        message: "Wave tickets created successfully (non-seated)",
        data: tickets,
      });
    }
  } catch (error) {
    console.error("Error creating tickets:", error);
    return res
      .status(500)
      .json({ message: "Error creating tickets", error: error.message });
  }
};

// Update Ticket by Ticket ID
exports.updateTicketById = async (req, res) => {
  try {
    // 1. Find the ticket
    const ticket = await Tickets.findByPk(req.params.id, {
      include: [{ model: Event, attributes: ["id", "seated"] }],
    });
    if (!ticket) return res.status(404).json({ message: "Ticket not found" });

    const event = ticket.Event;
    if (!event) {
      return res.status(404).json({ message: "Associated event not found" });
    }

    // 2. Extract body fields
    const {
      price,
      section,
      total_seats,
      amount_issued,
      waves,
      issued_at,
      ticket_alert,
    } = req.body;

    // 3. Normalize price if provided
    let updatedPrice = ticket.price; // keep existing
    if (price) {
      updatedPrice = price.map((item) => ({
        color: String(item.color),
        price: Number(item.price),
      }));
    }

    // 4. Decide logic based on event.seated
    if (event.seated) {
      // -----------------------------
      // SEATED EVENT UPDATE LOGIC
      // -----------------------------
      // * No waves allowed
      if (waves !== undefined) {
        return res.status(400).json({
          message: "Seated event cannot have waves. Remove 'waves' field.",
        });
      }

      // If seat-based fields are being updated:
      let updatedSection = ticket.section; // keep existing
      if (section) {
        if (!Array.isArray(section) || section.length === 0) {
          return res
            .status(400)
            .json({ message: "Section must be a non-empty array for a seated event." });
        }
        updatedSection = section.map((item) => ({
          color: String(item.color),
          section: item.section.map(String),
        }));
      }

      let updatedTotalSeats = ticket.total_seats;
      if (total_seats) {
        if (!Array.isArray(total_seats) || total_seats.length === 0) {
          return res.status(400).json({
            message: "Total seats must be a non-empty array for a seated event.",
          });
        }
        updatedTotalSeats = total_seats.map((item) => ({
          section: String(item.section),
          seats: Number(item.seats),
        }));
      }

      // If amount_issued is updated, or total_seats is updated, check sum
      let finalAmountIssued = amount_issued ?? ticket.amount_issued; // fallback
      let finalTotalSeats = updatedTotalSeats ?? ticket.total_seats; // fallback

      // sum(total_seats) must EQUAL amount_issued
      const totalSeatsCount = finalTotalSeats.reduce(
        (sum, seatObj) => sum + seatObj.seats,
        0
      );

      if (totalSeatsCount !== finalAmountIssued) {
        return res.status(400).json({
          message:
            "For seated events, the sum of all seats must exactly match the amount_issued.",
        });
      }

      // Perform the update
      const updatedTicket = await ticket.update({
        price: updatedPrice,
        section: updatedSection,
        total_seats: finalTotalSeats,
        amount_issued: finalAmountIssued,
        issued_at: issued_at || ticket.issued_at, // keep old if not provided
        waves: null, // make sure it's null for seated
        ticket_alert,
      });

      return res
        .status(200)
        .json({ message: "Seated ticket updated successfully", data: updatedTicket });

    } else {
      // -----------------------------
      // NON-SEATED EVENT UPDATE LOGIC
      // -----------------------------
      // * waves is required
      if (waves === undefined) {
        return res.status(400).json({
          message:
            "For non-seated events, 'waves' is required (cannot remove or nullify it).",
        });
      }

      // Check if wave name is changing and if the new wave name already exists
      if (waves && waves !== ticket.waves) {
        // Are we trying to rename the wave? Then ensure no duplicate for this event
        const existingWave = await Tickets.findOne({
          where: {
            event_id: event.id,
            waves: waves,
            id: { [db.Sequelize.Op.ne]: ticket.id }, // exclude current ticket
          },
        });
        if (existingWave) {
          return res.status(400).json({
            message: `Wave "${waves}" already exists for this event. Choose a different wave name.`,
          });
        }
      }

      // No seat-level logic => total_seats must remain null or empty
      // If user tries to update total_seats, ignore or reject
      if (total_seats) {
        return res.status(400).json({
          message: "Non-seated events cannot update total_seats.",
        });
      }

      // If user updates amount_issued, ensure it’s positive
      let finalAmountIssued = amount_issued ?? ticket.amount_issued;
      if (finalAmountIssued <= 0) {
        return res.status(400).json({
          message: "Invalid amount_issued for non-seated event.",
        });
      }

      // If user updates section, treat it as zone-based but no seats
      let updatedSection = ticket.section;
      if (section) {
        updatedSection = section.map((item) => ({
          color: String(item.color),
          section: item.section ? item.section.map(String) : [],
        }));
      }

      // Perform the update
      const updatedTicket = await ticket.update({
        price: updatedPrice,
        section: updatedSection,
        total_seats: null, // always null
        amount_issued: finalAmountIssued,
        waves,
        ticket_alert,
        issued_at: issued_at || ticket.issued_at,
      });

      return res.status(200).json({
        message: "Non-seated ticket updated successfully",
        data: updatedTicket,
      });
    }
  } catch (error) {
    console.error("Error updating ticket:", error);
    return res
      .status(500)
      .json({ message: "Error updating ticket", error: error.message });
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