const db = require("../models");
const Event = db.Event;
const Organizer = db.User;
const Notification = db.notification;
const Tags = db.Tags;
const Report= db.Report;
const { createEventSchema } = require("../utils/validations");

// Get all events
exports.getAllEvents = async (req, res) => {
  try {
    const events = await Event.findAll({
      include: [
        { model: Tags,  },
        { model: Report, }, 
      ],
    
    });
    res.status(200).json({ message: "Events retrieved successfully", data: events });
  } catch (error) {
    console.error("Error retrieving events:", error);
    res.status(500).json({ message: "Error retrieving events", error: error.message });
  }
};
// Get event by ID
exports.getEventById = async (req, res) => {
  try {
    const event = await Event.findByPk(req.params.id,{
      include: [
        { model: Tags,  },
        { model: Report, }, 
      ],
    
    });
    if (!event) return res.status(404).json({ message: "Event not found" });
    res.status(200).json({ message: "Event retrieved successfully", data: event });
  } catch (error) {
    console.error("Error retrieving event:", error);
    res.status(500).json({ message: "Error retrieving event", error: error.message });
  }
};
// Get events by User ID (Organizer ID)
exports.getEventsByUserId = async (req, res) => {
  try {
    const { user_id } = req.params;

    if (!user_id) {
      return res.status(400).json({ message: "User ID is required." });
    }

    // Find events by the specified user (organizer ID)
    const events = await Event.findAll({
      where: { organizer_id: user_id },
      include: [{ model: Organizer, attributes: ["id", "name", "email"] }], // Include organizer info
    });

    if (!events || events.length === 0) {
      return res.status(404).json({ message: "No events found for this user." });
    }

    res.status(200).json({ message: "Events retrieved successfully", data: events });
  } catch (error) {
    console.error("Error retrieving events by user ID:", error);
    res.status(500).json({ message: "Error retrieving events by user ID", error: error.message });
  }
};
// Create a new event
const fs = require('fs');
const path = require('path');

exports.createEvent = async (req, res) => {
  try {
    console.log('req.body:', req.body);
    console.log('req.file:', req.file); // Log the uploaded file details

    const {
      organizer_id,
      title,
      active,
      description,
      date_time,
      location,
      commission,
      areas,
      tags,
      ticket_maps,
    } = req.body;

    // Handle the image
    let imagePath = null; // Default to null if no file is uploaded
    if (req.file) {
      imagePath =
        process.env.NODE_ENV === 'production'
          ? `https://wearelebanon.guide/uploads/${req.file.filename}`
          : `http://localhost:8080/uploads/${req.file.filename}`;
    }

    // Save the event in the database
    const event = await Event.create({
      organizer_id,
      title,
      description,
      date_time: JSON.parse(date_time),
      location: JSON.parse(location),
      commission: JSON.parse(commission),
      areas: JSON.parse(areas),
      tags: JSON.parse(tags),
      active: active === 'true',
      ticket_maps,
      image: imagePath, // Save the image path if uploaded, otherwise null
    });

    res.status(201).json({ message: 'Event created successfully', data: event });
  } catch (error) {
    console.error('Error creating event:', error);
    res.status(500).json({
      message: 'Error creating event',
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
    const { title, description, date_time, location, ticket_maps , commission, is_approved,status} = req.body;

    // Update title if provided
    if (title) updates.title = title;

    // Update description if provided
    if (description) updates.description = description;

    //Update commision if provided
    if(commission) updates.commission= commission;

    //Update is_approved if provided
    if(is_approved) updates.is_approved= is_approved;

    //Update status if provided
    if(status) updates.status= status;

   // Validate and update date_time if provided
if (date_time) {
  if (!Array.isArray(date_time) || date_time.length === 0) {
    return res.status(400).json({ message: "Invalid date_time. At least one date is required." });
  }
  updates.date_time = date_time; // Directly store the array
}


    // Validate and update location if provided
    if (location) {
      const currentLocation = event.location || {};
      if (location.lat !== undefined) currentLocation.lat = location.lat;
      if (location.lng !== undefined) currentLocation.lng = location.lng;
      if (location.address!=undefined) currentLocation.address = location.address;
      updates.location = currentLocation;
    }

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
