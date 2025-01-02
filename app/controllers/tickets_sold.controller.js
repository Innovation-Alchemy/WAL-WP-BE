const db = require("../models");
const TicketsSold = db.TicketsSold;
const Tickets = db.Ticket;
const User = db.User;
const Event = db.Event;
const QRCode = require("qrcode");
const crypto = require("crypto");

// Get tickets sold by Buyer ID
exports.getTicketsSoldByBuyerId = async (req, res) => {
  const { buyer_id } = req.params;

  if (!buyer_id) {
    return res.status(400).json({ message: "Buyer ID is required." });
  }

  try {
    // Fetch tickets sold by the specified buyer ID
    const ticketsSold = await TicketsSold.findAll({
      where: { buyer_id },
      include: [
        {
          model: Tickets,
          attributes: ["id", "event_id", "price", "section", "amount_issued"],
          include: {
            model: Event,
            attributes: ["id", "title", "date_time", "location"],
          },
        },
      ],
      order: [["createdAt", "DESC"]],
    });

    if (!ticketsSold || ticketsSold.length === 0) {
      return res.status(404).json({ message: "No tickets sold found for this buyer." });
    }

    res.status(200).json({
      message: "Tickets sold retrieved successfully.",
      data: ticketsSold,
    });
  } catch (error) {
    console.error("Error retrieving tickets sold by buyer ID:", error);
    res.status(500).json({ message: "Error retrieving tickets sold by buyer ID", error: error.message });
  }
};

// Reserve Tickets
exports.reserveTickets = async (req, res) => {
  try {
    const { ticket_id, buyer_id, reservations } = req.body; // Reservations is an array of selected seats
    const ticket = await Tickets.findByPk(ticket_id);

    if (!ticket) {
      return res.status(404).json({ message: "Ticket not found" });
    }

    const user = await User.findByPk(buyer_id);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // Parse `section`, `price`, and `total_seats` fields to ensure they are arrays
    let ticketSections;
    let ticketPrices;
    let totalSeatsConfig;
    try {
      ticketSections = JSON.parse(ticket.section);
      ticketPrices = JSON.parse(ticket.price);
      totalSeatsConfig = JSON.parse(ticket.total_seats);
    } catch (error) {
      return res.status(500).json({
        message: "Error parsing ticket sections, prices, or total seats. Ensure they are stored as valid JSON.",
      });
    }

    // Fetch all tickets sold for this ticket ID
    const existingReservations = await TicketsSold.findAll({
      where: {
        ticket_id,
        status: {
          [db.Sequelize.Op.in]: ["reserved", "sold"], // Exclude `pending` and `canceled` statuses
        },
      },
    });

    const reservedSeats = existingReservations.map((res) => ({
      section: res.section,
      seat: res.seat,
    }));

    let total_price = 0;

    // Validate and calculate price for each reservation
    for (const reservation of reservations) {
      let { section, seat, color } = reservation;

      // Ensure section and color are strings
      if (typeof section !== "string" || typeof color !== "string") {
        return res.status(400).json({
          message: "Section and color must be strings.",
        });
      }

      // Ensure seat is a number
      seat = parseInt(seat, 10);
      if (isNaN(seat)) {
        return res.status(400).json({
          message: `Invalid seat number for section ${section}.`,
        });
      }

      // Validate section exists in ticket
      const sectionData = ticketSections.find((s) => s.color === color && s.section.includes(section));
      if (!sectionData) {
        return res.status(400).json({
          message: `Invalid section or color. Section ${section} with color ${color} does not exist.`,
        });
      }

      // Validate seat number is within range for the section
      const totalSeatsForSection = totalSeatsConfig.find((s) => s.section === section);
      if (!totalSeatsForSection || seat < 1 || seat > totalSeatsForSection.seats) {
        return res.status(400).json({
          message: `Seat number ${seat} is not valid for section ${section}.`,
        });
      }

      // Check if the seat is already reserved or sold
      const seatKey = `${section}:${seat}`;
      const isSeatReserved = reservedSeats.some((s) => s.section === section && s.seat === seat);
      if (isSeatReserved) {
        return res.status(400).json({ message: `Seat ${seatKey} is already reserved or sold.` });
      }

      // Get price for the selected color
      const priceData = ticketPrices.find((p) => p.color === color);
      if (!priceData) {
        return res.status(400).json({ message: `No price available for color ${color}.` });
      }

      // Add price to total
      total_price += priceData.price;
    }

    // Create reservations
    const reservationsData = reservations.map((res) => ({
      ticket_id,
      buyer_id,
      section: String(res.section),
      seat: parseInt(res.seat, 10),
      color: String(res.color),
      price: ticketPrices.find((p) => p.color === res.color).price,
      status: "reserved", // Set the status to reserved
    }));

    const createdReservations = await TicketsSold.bulkCreate(reservationsData);

    res.status(201).json({
      message: "Tickets reserved successfully",
      data: createdReservations,
      total_price,
    });
  } catch (error) {
    console.error("Error reserving tickets:", error);
    res.status(500).json({ message: "Error reserving tickets", error: error.message });
  }
};

// Confirm selling multiple tickets
exports.confirmPurchases = async (req, res) => {
  try {
    const { ticket_sold_ids, buyer_id } = req.body;

    // Find all reserved tickets by IDs
    const ticketsSold = await TicketsSold.findAll({
      where: { id: ticket_sold_ids },
      include: [
        {
          model: Tickets,
          attributes: [
            "id",
            "event_id",
            "amount_issued",
            "tickets_sold_count",
            "tickets_sold_count_sum_price",
          ],
          include: {
            model: db.Event,
            attributes: [
              "id",
              "title",
              "ticket_alert",
              "commission",
              "total_revenue",
            ], // Include event details
          },
        },
        {
          model: User,
          attributes: ["id", "name"], // Include buyer's name
        },
      ],
    });

    if (!ticketsSold || ticketsSold.length === 0) {
      return res.status(404).json({ message: "Reserved tickets not found." });
    }

    // Verify all tickets belong to the buyer
    const unauthorizedTickets = ticketsSold.filter(
      (ticket) => ticket.buyer_id !== buyer_id
    );
    if (unauthorizedTickets.length > 0) {
      return res.status(403).json({
        message: "You are not authorized to confirm these purchases.",
        unauthorizedTickets: unauthorizedTickets.map((t) => t.id),
      });
    }

    // Check for already sold tickets
    const alreadySold = ticketsSold.filter((ticket) => ticket.status === "sold");
    if (alreadySold.length > 0) {
      return res.status(400).json({
        message: "Some tickets have already been sold.",
        alreadySold: alreadySold.map((t) => t.id),
      });
    }

    const ticketUpdates = {}; // Object to store cumulative updates for each ticket_id

    for (const ticketSold of ticketsSold) {
      const { Ticket } = ticketSold;
      const { Event } = Ticket;

      // ------------------------------------------
      // Only the QR code logic below is changed:
      // ------------------------------------------

      // Generate a random token instead of embedding all details
      const randomToken = crypto.randomBytes(16).toString("hex");

      // Create the DataURL-based QR code from the token
      const qrCode = await QRCode.toDataURL(randomToken);

      // Update the ticket sold record
      ticketSold.status = "sold";
      ticketSold.qr_code = qrCode; // You store the DataURL here
      ticketSold.qr_code_token = randomToken; // Store the token as well
      await ticketSold.save();

      // ------------------------------------------
      // Everything else remains unchanged
      // ------------------------------------------

      // Collect updates for tickets table
      if (!ticketUpdates[ticketSold.ticket_id]) {
        ticketUpdates[ticketSold.ticket_id] = {
          soldCount: 0,
          soldSumPrice: 0,
          eventId: Ticket.event_id,
        };
      }

      ticketUpdates[ticketSold.ticket_id].soldCount += 1;
      ticketUpdates[ticketSold.ticket_id].soldSumPrice += parseFloat(
        ticketSold.price
      );

      // Check ticket stock and notify admin if necessary
      const ticketsSoldCount = await TicketsSold.count({
        where: { ticket_id: Ticket.id, status: "sold" },
      });
      const remainingTickets = Ticket.amount_issued - ticketsSoldCount;

      if (remainingTickets <= Event.ticket_alert) {
        const admins = await User.findAll({ where: { role: "Admin" } });
        const notifications = admins.map((admin) => ({
          user_id: admin.id,
          event_id: Event.id,
          alerts: "low-tickets",
          message: `Tickets for event "${Event.title}" are running low. Remaining tickets: ${remainingTickets}`,
          is_read: false,
        }));

        await db.notification.bulkCreate(notifications);
      }
    }

    // Apply updates to tickets table and calculate total revenue
    for (const [ticketId, updates] of Object.entries(ticketUpdates)) {
      const ticket = await Tickets.findByPk(ticketId);
      if (ticket) {
        // Update tickets table with new values
        const updatedTicket = await ticket.update({
          tickets_sold_count: ticket.tickets_sold_count + updates.soldCount,
          tickets_sold_count_sum_price:
            parseFloat(ticket.tickets_sold_count_sum_price || 0) +
            updates.soldSumPrice,
        });

        // Re-fetch the updated ticket to get the latest tickets_sold_count_sum_price
        const updatedTicketDetails = await Tickets.findByPk(ticketId);

        // Update total revenue for the associated event
        const event = await Event.findByPk(updates.eventId);
        if (event) {
          const totalRevenue =
            (parseFloat(event.commission) / 100) *
            parseFloat(
              updatedTicketDetails.tickets_sold_count_sum_price || 0
            );
          await event.update({ total_revenue: totalRevenue });
        }
      }
    }

    res.status(200).json({
      message: "Tickets purchase confirmed successfully.",
      data: Object.keys(ticketUpdates).map((id) => ({
        ticket_id: id,
        soldCount: ticketUpdates[id].soldCount,
        soldSumPrice: ticketUpdates[id].soldSumPrice,
      })),
    });
  } catch (error) {
    console.error("Error confirming ticket purchase:", error);
    res.status(500).json({
      message: "Error confirming ticket purchase",
      error: error.message,
    });
  }
};

// scan method to check in ticket
exports.checkInTicket = async (req, res) => {
  try {
    const { qr_code_token } = req.body;

    if (!qr_code_token) {
      return res.status(400).json({ message: "Token is required." });
    }

    // Include the User model so we can get the user's name
    const ticketSold = await TicketsSold.findOne({
      where: { qr_code_token },
      include: [
        {
          model: User,
          attributes: ["id", "name"], // specify the columns you want
        },
      ],
    });

    if (!ticketSold) {
      return res.status(404).json({ message: "Invalid ticket token." });
    }

    if (ticketSold.status !== "sold") {
      return res.status(400).json({
        message: `Ticket is not valid for entry. Current status: "${ticketSold.status}".`,
      });
    }

    // Mark the ticket as used
    ticketSold.status = "used";
    await ticketSold.save();

    return res.status(200).json({
      message: "Ticket scanned and validated. Entry allowed!",
      data: {
        ticket_sold_id: ticketSold.id,
        ticket_id: ticketSold.ticket_id,
        seat: ticketSold.seat,
        section: ticketSold.section,
        color: ticketSold.color,
        // Now you can include the buyer name
        buyer_name: ticketSold.User.name,
      },
    });
  } catch (error) {
    console.error("Error checking in ticket:", error);
    res.status(500).json({
      message: "Error checking in ticket",
      error: error.message,
    });
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

// Cancel Ticket Reservation by ID
exports.cancelReservation = async (req, res) => {
  try {
    // Find the ticket by ID
    const ticket = await TicketsSold.findByPk(req.params.id);

    if (!ticket) {
      return res.status(404).json({ message: "Ticket not found" });
    }

    // Check if the status is 'reserved'
    if (ticket.status !== "reserved") {
      return res.status(400).json({
        message: `Cannot cancel ticket with status "${ticket.status}". Only tickets with status "reserved" can be canceled.`,
      });
    }

    // Delete the ticket
    await ticket.destroy();

    res.status(200).json({ message: "Ticket reservation canceled successfully" });
  } catch (error) {
    console.error("Error canceling ticket reservation:", error);
    res.status(500).json({ message: "Error canceling ticket reservation", error: error.message });
  }
};



