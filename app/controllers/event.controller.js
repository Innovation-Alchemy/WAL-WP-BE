const db = require("../models");
const Event = db.Event;
const Organizer = db.User;
const Notification = db.notification;
const { createEventSchema } = require("../utils/validations");

// Get all events
exports.getAllEvents = async (req, res) => {
  try {
    const events = await Event.findAll();
    res.status(200).json({ message: "Events retrieved successfully", data: events });
  } catch (error) {
    console.error("Error retrieving events:", error);
    res.status(500).json({ message: "Error retrieving events", error: error.message });
  }
};

// Get event by ID
exports.getEventById = async (req, res) => {
  try {
    const event = await Event.findByPk(req.params.id);
    if (!event) return res.status(404).json({ message: "Event not found" });
    res.status(200).json({ message: "Event retrieved successfully", data: event });
  } catch (error) {
    console.error("Error retrieving event:", error);
    res.status(500).json({ message: "Error retrieving event", error: error.message });
  }
};

// Create a new event
exports.createEvent = async (req, res) => {
  const { error } = createEventSchema.validate(req.body);

  // Return validation error if any
  if (error) {
    return res.status(400).json({ message: error.details[0].message });
  }

  try {
    const {
      organizer_id,
      title,
      description,
      date_time,
      location,
      seated,
      ticket_maps,
      commission,
      is_approved,
      ticket_alert
    } = req.body;

    // Check if the organizer exists
    const organizerExists = await Organizer.findByPk(organizer_id);
    if (!organizerExists) {
      return res.status(404).json({ message: "Organizer not found" });
    }

    // Validate date_time logic
    if (!Array.isArray(date_time) || date_time.length === 0) {
      return res.status(400).json({
        message: "Invalid date_time. At least a start_date is required.",
      });
    }
    const start_date = date_time[0];
    const end_date = date_time[1] || null;

    // Validate location contains lat and lng
    if (!location || !location.lat || !location.lng) {
      return res.status(400).json({
        message: "Invalid location data. Latitude and longitude are required.",
      });
    }

    // Handle ticket_maps (file or URL)
    let ticketMapPath = ticket_maps;
    if (req.file) {
      ticketMapPath =
        process.env.NODE_ENV === "production"
          ? `https://yourdomain.com/${req.file.path.replace(/\\/g, "/")}`
          : `http://localhost:8080/${req.file.path.replace(/\\/g, "/")}`;
    }

    // Determine is_approved value
    const userRole = organizerExists.role;
    const approvalStatus =
      userRole === "Admin"
        ? true // Admin-created events are automatically approved
        : is_approved || false; // Use provided value if available; default to false

    // Set the commission percentage
    const eventCommission = commission || 3.0; // Default to 3% if not provided

    // Create the event
    const event = await Event.create({
      organizer_id,
      title,
      description,
      date_time: { start_date, end_date },
      location,
      seated,
      ticket_maps: ticketMapPath,
      commission: eventCommission,
      is_approved: approvalStatus,
      ticket_alert
    });

    // If the organizer is not an admin, send a notification to admins
    if (userRole !== "Admin") {
      const adminUsers = await Organizer.findAll({ where: { role: "Admin" } });
      const notifications = adminUsers.map((admin) => ({
        user_id: admin.id,
        notification_type: "event-approval",
        message: `${organizerExists.name} has created an event titled "${title}" and requests approval.`,
        event_id: event.id,
        is_read: false,
      }));

      await Notification.bulkCreate(notifications);
    }

    res.status(201).json({ message: "Event created successfully", data: event });
  } catch (error) {
    console.error("Error creating event:", error);
    res.status(500).json({
      message: "Error creating event",
      error: error.message,
    });
  }
};
// Update an event
exports.updateEvent = async (req, res) => {
  try {
    const event = await Event.findByPk(req.params.id);
    if (!event) return res.status(404).json({ message: "Event not found" });

    const updates = {};
    const { title, description, date_time, location, seated, ticket_maps , commission, is_approved} = req.body;

    // Update title if provided
    if (title) updates.title = title;

    // Update description if provided
    if (description) updates.description = description;

    //Update commision if provided
    if(commission) updates.commission= commission

    //Update is_approved if provided
    if(is_approved) updates.is_approved= is_approved

    // Validate and update date_time if provided
    if (date_time) {
      if (!Array.isArray(date_time) || date_time.length === 0) {
        return res.status(400).json({ message: "Invalid date_time. At least a start_date is required." });
      }
      updates.date_time = {
        start_date: date_time[0],
        end_date: date_time[1] || null,
      };
    }

    // Validate and update location if provided
    if (location) {
      const currentLocation = event.location || {};
      if (location.lat !== undefined) currentLocation.lat = location.lat;
      if (location.lng !== undefined) currentLocation.lng = location.lng;
      if (location.address!=undefined) currentLocation.address = location.address;
      updates.location = currentLocation;
    }

    // Update seated if provided
    if (seated !== undefined) updates.seated = seated;

    // Handle ticket_maps update
    if (req.file) {
      // File upload scenario
      updates.ticket_maps =
        process.env.NODE_ENV === "production"
          ? `https://yourdomain.com/${req.file.path.replace(/\\/g, "/")}`
          : `http://localhost:8080/${req.file.path.replace(/\\/g, "/")}`;
    } else if (ticket_maps) {
      // URL scenario
      if (!/^https?:\/\/.+$/.test(ticket_maps)) {
        return res.status(400).json({ message: "Invalid URL format for ticket_maps." });
      }
      updates.ticket_maps = ticket_maps;
    }

    // Perform the update
    await event.update(updates);

    // Fetch the updated event to return
    const updatedEvent = await Event.findByPk(event.id);

    res.status(200).json({ message: "Event updated successfully", data: updatedEvent });
  } catch (error) {
    console.error("Error updating event:", error);
    res.status(500).json({ message: "Error updating event", error: error.message });
  }
};


// Delete an event
exports.deleteEvent = async (req, res) => {
  try {
    const event = await Event.findByPk(req.params.id);
    if (!event) return res.status(404).json({ message: "Event not found" });

    await event.destroy();
    res.status(200).json({ message: "Event deleted successfully" });
  } catch (error) {
    console.error("Error deleting event:", error);
    res.status(500).json({ message: "Error deleting event", error: error.message });
  }
};
