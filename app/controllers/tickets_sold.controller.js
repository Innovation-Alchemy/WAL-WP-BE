const db = require("../models");
const TicketsSold = db.TicketsSold;
const Tickets = db.Ticket;
const User = db.User;
const QRCode = require("qrcode");


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

    // Parse `section` and `price` fields to ensure they are arrays
    let ticketSections;
    let ticketPrices;
    try {
      ticketSections = JSON.parse(ticket.section);
      ticketPrices = JSON.parse(ticket.price);
    } catch (error) {
      return res.status(500).json({
        message: "Error parsing ticket sections or prices. Please ensure they are stored as valid JSON.",
      });
    }

    const existingReservations = await TicketsSold.findAll({
      where: { ticket_id, status: "reserved" },
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

      // Check if the seat is already reserved
      const seatKey = `${section}:${seat}`;
      const isSeatReserved = reservedSeats.some((s) => s.section === section && s.seat === seat);
      if (isSeatReserved) {
        return res.status(400).json({ message: `Seat ${seatKey} is already reserved.` });
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
          attributes: ["event_id"],
          include: {
            model: db.Event,
            attributes: ["title"], // Get event title
          },
        },
        {
          model: User,
          attributes: ["name"], // Get buyer's name
        },
      ],
    });

    if (!ticketsSold || ticketsSold.length === 0) {
      return res.status(404).json({ message: "Reserved tickets not found." });
    }

    // Verify all tickets belong to the buyer
    const unauthorizedTickets = ticketsSold.filter((ticket) => ticket.buyer_id !== buyer_id);
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

    // Update statuses and generate QR codes
    const updatedTickets = [];
    for (const ticketSold of ticketsSold) {
      // Prepare QR code data
      const qrCodeData = {
        ticket_id: ticketSold.id,
        event_name: ticketSold.Ticket.Event.title,
        buyer_name: ticketSold.User.name,
        section: ticketSold.section,
        seat: ticketSold.seat,
        color: ticketSold.color,
        status: "sold",
      };

      // Generate QR code
      const qrCode = await QRCode.toDataURL(JSON.stringify(qrCodeData));

      // Update ticket status and QR code
      ticketSold.status = "sold";
      ticketSold.qr_code = qrCode;
      await ticketSold.save();

      updatedTickets.push({
        id: ticketSold.id,
        qr_code: qrCode,
      });
    }

    res.status(200).json({
      message: "Tickets purchase confirmed successfully.",
      data: updatedTickets,
    });
  } catch (error) {
    console.error("Error confirming ticket purchase:", error);
    res.status(500).json({ message: "Error confirming ticket purchase", error: error.message });
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


