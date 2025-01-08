const db = require("../models");
const { Op } = db.Sequelize;
const TicketsSold = db.TicketsSold;
const Tickets = db.Ticket;
const User = db.User;
const Event = db.Event;
const QRCode = require("qrcode");
const crypto = require("crypto");
const {generateTicketsPDF} = require("../utils/generate-pdf");
const transporter = require("../config/email.config");
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
    const { ticket_id, buyer_id, reservations } = req.body;

    // 1. Fetch the ticket record (and include the associated event to see if it's seated)
    const ticket = await Tickets.findByPk(ticket_id, {
      include: [
        {
          model: Event,
          attributes: ["id", "seated", "title"], // or any fields you need
        },
      ],
    });

    if (!ticket) {
      return res.status(404).json({ message: "Ticket not found" });
    }

    // 2. Validate the user (buyer)
    const user = await User.findByPk(buyer_id);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // 3. Validate the event
    const event = ticket.Event;
    if (!event) {
      return res.status(404).json({ message: "Event not found" });
    }

    // 4. Parse the ticket prices (JSON)
    let ticketPrices;
    try {
      ticketPrices = JSON.parse(ticket.price);
    } catch (error) {
      return res
        .status(500)
        .json({ message: "Error parsing ticket prices. Ensure they're valid JSON." });
    }

    // 5. Check if it's seated or non-seated
    if (event.seated) {
      // -------------------------------------------------------------------
      // SEATED EVENT LOGIC
      // -------------------------------------------------------------------

      // We expect reservations: [ { section, seat, color }, ... ]
      // e.g. { section: "A", seat: 10, color: "blue" }

      // Validate the fields needed for a seated event
      let ticketSections;
      let totalSeatsConfig;
      try {
        ticketSections = JSON.parse(ticket.section);      // e.g. [ { color, section: ["A","B"] }, ... ]
        totalSeatsConfig = JSON.parse(ticket.total_seats); // e.g. [ { section:"A", seats:50 }, ... ]
      } catch (err) {
        return res.status(500).json({
          message:
            "Error parsing ticket.section or ticket.total_seats. Ensure they're valid JSON for a seated event.",
        });
      }

      // Fetch existing (reserved/sold) seats
      const existingReservations = await TicketsSold.findAll({
        where: {
          ticket_id,
          status: { [Op.in]: ["reserved", "sold"] },
        },
      });

      const reservedSeats = existingReservations.map((r) => ({
        section: r.section,
        seat: r.seat,
      }));

      let total_price = 0;

      // Validate each seat reservation
      for (const reservation of reservations) {
        let { section, seat, color } = reservation;

        // Ensure section & color are strings
        if (typeof section !== "string" || typeof color !== "string") {
          return res.status(400).json({
            message: "Section and color must be strings for a seated event.",
          });
        }

        // Ensure seat is numeric
        seat = parseInt(seat, 10);
        if (isNaN(seat)) {
          return res.status(400).json({
            message: `Invalid seat number for section ${section}.`,
          });
        }

        // Validate (section + color) in ticketSections
        const sectionData = ticketSections.find(
          (s) => s.color === color && s.section.includes(section)
        );
        if (!sectionData) {
          return res.status(400).json({
            message: `Invalid section or color. Section "${section}" with color "${color}" does not exist in this ticket.`,
          });
        }

        // Validate seat range
        const totalSeatsForSection = totalSeatsConfig.find(
          (s) => s.section === section
        );
        if (!totalSeatsForSection || seat < 1 || seat > totalSeatsForSection.seats) {
          return res.status(400).json({
            message: `Seat number ${seat} is not valid for section ${section}. Valid range is 1 - ${totalSeatsForSection?.seats}.`,
          });
        }

        // Check if seat is already reserved
        const isSeatReserved = reservedSeats.some(
          (r) => r.section === section && r.seat === seat
        );
        if (isSeatReserved) {
          return res.status(400).json({
            message: `Seat ${section}:${seat} (color: ${color}) is already reserved or sold.`,
          });
        }

        // Find price for the color
        const priceData = ticketPrices.find((p) => p.color === color);
        if (!priceData) {
          return res
            .status(400)
            .json({ message: `No price available for color "${color}".` });
        }

        total_price += parseFloat(priceData.price);
      }

      // Create seated reservations
      const createdReservations = await Promise.all(
        reservations.map(async (res) => {
          const { section, seat, color } = res;
          const priceItem = ticketPrices.find((p) => p.color === color);
          return TicketsSold.create({
            ticket_id,
            buyer_id,
            section: String(section),
            seat: parseInt(seat, 10),
            color: String(color),
            price: parseFloat(priceItem.price),
            status: "reserved",
          });
        })
      );

      return res.status(201).json({
        message: "Tickets reserved successfully (seated event)",
        data: createdReservations,
        total_price,
      });

    } else {
      // -------------------------------------------------------------------
      // NON-SEATED EVENT LOGIC
      // -------------------------------------------------------------------
      // reservations: [{ color:"VIP", quantity:3, section?:"Zone-A" }, ...]

      if (!Array.isArray(reservations) || reservations.length === 0) {
        return res.status(400).json({
          message: "Reservations must be a non-empty array (non-seated).",
        });
      }

      // 1) Parse the "section" array from the Ticket to check quantity limits
      //    e.g. ticket.section = [
      //      { color:"VIP", section:["Zone-A"], quantity:100 },
      //      { color:"GA",  section:["Zone-B"], quantity:200 }
      //    ]
      let nonSeatedSections;
      try {
        nonSeatedSections = JSON.parse(ticket.section); // array of { color, section[], quantity }
      } catch (err) {
        return res.status(500).json({
          message: "Error parsing ticket.section for non-seated event.",
        });
      }
      if (!Array.isArray(nonSeatedSections)) {
        return res.status(500).json({
          message: "Non-seated ticket.section must be an array with quantity fields.",
        });
      }

      // 2) Count how many are already reserved/sold in each color
      // We'll build a map from color -> how many are already used
      // If user used "section" in the ticket, we can do color+section logic,
      // but typically we just track total quantity per color, not per sub-section.
      // If you want to track sub-sections individually, you'd store them all individually.
      //
      // For simplicity: We'll track total used per {color} if your design lumps them together
      // or you could do color+zone if each item has a different zone-based limit.
      
      // First, get all existing tickets sold for this ticket_id
      const existingNonSeated = await TicketsSold.findAll({
        where: {
          ticket_id,
          status: { [Op.in]: ["reserved", "sold"] },
        },
      });

      // Build a color-based usage map
      // If you want per-(color+section) usage, adjust to incorporate section name too
      const usedMap = {}; // e.g. { "VIP": 30, "GA":50 }
      for (const sold of existingNonSeated) {
        const c = sold.color;
        usedMap[c] = (usedMap[c] || 0) + 1;
      }

      // Now let's create a quick map from color -> maxQuantity
      const colorLimitMap = {}; // e.g. { "VIP": 100, "GA": 200 }
      for (const secObj of nonSeatedSections) {
        const c = secObj.color;
        // If you want color+zone, you'd do something else
        if (secObj.quantity === undefined || secObj.quantity <= 0) {
          return res.status(500).json({
            message: `Non-seated ticket data invalid. 'quantity' must be positive for color='${c}'.`,
          });
        }
        // If multiple objects share the same color, you'd sum them or handle them individually
        // Adjust logic if you want color+zone-based limits
        if (colorLimitMap[c] === undefined) {
          colorLimitMap[c] = secObj.quantity;
        } else {
          // Potentially sum them if you have multiple zone definitions with same color
          colorLimitMap[c] += secObj.quantity;
        }
      }

      let total_price = 0;
      const createdReservations = [];

      // 3) Validate each requested color's availability
      for (const item of reservations) {
        const { color, quantity, section } = item;
        if (!color || !quantity) {
          return res.status(400).json({
            message: "Each reservation must have a color and quantity (non-seated).",
          });
        }

        // Find the price
        const priceObj = ticketPrices.find((p) => p.color === color);
        if (!priceObj) {
          return res
            .status(400)
            .json({ message: `No price found for color '${color}'.` });
        }

        // Check if colorLimitMap has a limit for this color
        const limit = colorLimitMap[color];
        if (!limit) {
          return res.status(400).json({
            message: `No limit found for color '${color}' in ticket.section data.`,
          });
        }

        // Calculate how many are already used
        const usedCount = usedMap[color] || 0;
        const available = limit - usedCount;

        if (quantity > available) {
          return res.status(400).json({
            message: `Not enough tickets for color='${color}'. Requested=${quantity}, Available=${available}.`,
          });
        }

        // If pass, proceed to create that many reservations
        for (let i = 0; i < quantity; i++) {
          const newRes = await TicketsSold.create({
            ticket_id,
            buyer_id,
            // optional 'section' if user wants zone
            section: section ? String(section) : null,
            seat: null,
            color,
            price: parseFloat(priceObj.price),
            status: "reserved",
          });
          createdReservations.push(newRes);
        }

        // Update usedMap after successful creation
        usedMap[color] = usedCount + quantity;

        // Add to total price
        total_price += parseFloat(priceObj.price) * quantity;
      }

      return res.status(201).json({
        message: "Tickets reserved successfully (non-seated event)",
        data: createdReservations,
        total_price,
      });
    }
  } catch (error) {
    console.error("Error reserving tickets:", error);
    return res.status(500).json({
      message: "Error reserving tickets",
      error: error.message,
    });
  }
};
// Confirm selling multiple tickets
// Confirm selling multiple tickets
exports.confirmPurchases = async (req, res) => {
  try {
    const { ticket_sold_ids, buyer_id } = req.body;

    // 1. Find all reserved tickets by IDs
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
            "price",
            "ticket_alert", // <-- now from Tickets table
          ],
          include: {
            model: db.Event,
            attributes: [
              "id",
              "title",
              "commission",
              "total_revenue",
              "seated",
            ],
          },
        },
        {
          model: User,
          attributes: ["id", "name", "email"], // buyer's email
        },
      ],
    });

    if (!ticketsSold || ticketsSold.length === 0) {
      return res.status(404).json({ message: "Reserved tickets not found." });
    }

    // 2. Ensure all tickets belong to the same buyer
    const unauthorizedTickets = ticketsSold.filter((ts) => ts.buyer_id !== buyer_id);
    if (unauthorizedTickets.length > 0) {
      return res.status(403).json({
        message: "You are not authorized to confirm these purchases.",
        unauthorizedTickets: unauthorizedTickets.map((t) => t.id),
      });
    }

    // 3. Check if any are already sold
    const alreadySold = ticketsSold.filter((ts) => ts.status === "sold");
    if (alreadySold.length > 0) {
      return res.status(400).json({
        message: "Some tickets have already been sold.",
        alreadySold: alreadySold.map((t) => t.id),
      });
    }

    // We'll keep track of how many tickets to update in each Tickets record
    const ticketUpdates = {};

    // 4. Process each ticketSold -> Mark as sold, generate QR, send separate email
    for (const ticketSold of ticketsSold) {
      const { Ticket } = ticketSold;
      const { Event } = Ticket;

      // (A) Generate a random token
      const randomToken = crypto.randomBytes(16).toString("hex");

      // (B) Generate the QR code in dataURL format
      const qrCode = await QRCode.toDataURL(randomToken);

      // (C) Mark ticket as sold
      ticketSold.status = "sold";
      ticketSold.qr_code = qrCode;
      ticketSold.qr_code_token = randomToken;
      await ticketSold.save();

      // (D) Collect updates for the Tickets table
      if (!ticketUpdates[ticketSold.ticket_id]) {
        ticketUpdates[ticketSold.ticket_id] = {
          soldCount: 0,
          soldSumPrice: 0,
          eventId: Ticket.event_id,
        };
      }
      ticketUpdates[ticketSold.ticket_id].soldCount += 1;
      ticketUpdates[ticketSold.ticket_id].soldSumPrice += parseFloat(ticketSold.price);

      // (E) Check stock alert from ticket.ticket_alert (not from event)
      const ticketsSoldCount = await TicketsSold.count({
        where: { ticket_id: Ticket.id, status: "sold" },
      });
      const remainingTickets = Ticket.amount_issued - ticketsSoldCount;

      if (remainingTickets <= Ticket.ticket_alert) {
        // Notify Admins
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

      // (F) Send a **separate email** for this one ticket
      try {
        // Optionally create a single-ticket PDF — or even embed the QR code directly in the email.
        // For demonstration, let's create a minimal PDF that includes only this single ticket.
        const singleTicketPDF = await generateTicketsPDF([ticketSold]); 
        // generateTicketsPDF can accept an array; we pass an array of length 1

        await transporter.sendMail({
          from: process.env.EMAIL_USER,
          to: ticketSold.User.email, // buyer email
          subject: `Your Ticket #${ticketSold.id} - ${Event.title}`,
          text: `Hello ${ticketSold.User.name}, here is your QR code for ticket #${ticketSold.id}.`,
          attachments: [
            {
              filename: `ticket-${ticketSold.id}.pdf`,
              content: singleTicketPDF,
            },
          ],
        });
      } catch (emailErr) {
        console.error("Error sending separate ticket email:", emailErr);
      }
    }

    // 5. Update the Tickets table (aggregate data: soldCount, soldSumPrice)
    for (const [ticketId, updates] of Object.entries(ticketUpdates)) {
      const ticket = await Tickets.findByPk(ticketId);
      if (ticket) {
        // Update ticket sold counts
        await ticket.update({
          tickets_sold_count: ticket.tickets_sold_count + updates.soldCount,
          tickets_sold_count_sum_price:
            parseFloat(ticket.tickets_sold_count_sum_price || 0) + updates.soldSumPrice,
        });

        // Re-fetch updated ticket
        const updatedTicket = await Tickets.findByPk(ticketId);

        // Update event total revenue
        const event = await Event.findByPk(updates.eventId);
        if (event) {
          const totalRevenue =
            (parseFloat(event.commission) / 100) *
            parseFloat(updatedTicket.tickets_sold_count_sum_price || 0);
          await event.update({ total_revenue: totalRevenue });
        }
      }
    }

    // 6. Respond
    return res.status(200).json({
      message: "Tickets purchase confirmed successfully. Individual emails sent.",
      data: Object.keys(ticketUpdates).map((id) => ({
        ticket_id: id,
        soldCount: ticketUpdates[id].soldCount,
        soldSumPrice: ticketUpdates[id].soldSumPrice,
      })),
    });
  } catch (error) {
    console.error("Error confirming ticket purchase:", error);
    return res.status(500).json({
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
}
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



