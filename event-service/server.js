const express = require("express");
const mongoose = require("mongoose");

const app = express();
app.use(express.json());

const cors = require("cors");
app.use(cors());

mongoose.connect("mongodb://localhost:27017/eventservicedb", {
  useNewUrlParser: true,
  useUnifiedTopology: true
});

const EventSchema = new mongoose.Schema({
  event_id: Number,
  name: String,
  location: String,
  price: Number,
  available_tickets: Number,
  description: String,
  date: String,
  time: String
});

const Event = mongoose.model("events", EventSchema);

// ✅ Get all events
app.get("/events", async (req, res) => {
  try {
    const events = await Event.find();
    res.json(events);
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch events" });
  }
});

// ✅ Add a new event (Requires name, location, price, description, tickets available, date, time)
app.post("/events", async (req, res) => {
  try {
    const { event_id, name, location, price, available_tickets, description, date, time } = req.body;

    if (!event_id || !name || !location || !price || !available_tickets || !description || !date || !time) {
      return res.status(400).json({ error: "All fields are required" });
    }

    const newEvent = new Event({ event_id, name, location, price, available_tickets, description, date, time });
    await newEvent.save();
    
    res.status(201).json({ message: "Event added successfully!", event: newEvent });
  } catch (error) {
    res.status(500).json({ error: "Failed to add event" });
  }
});

// ✅ Delete an event (Requires name and location)
app.delete("/events", async (req, res) => {
  try {
    const { name, location } = req.body;

    if (!name || !location) {
      return res.status(400).json({ error: "Name and location are required" });
    }

    const result = await Event.deleteOne({ name, location });

    if (result.deletedCount === 0) {
      return res.status(404).json({ error: "Event not found" });
    }

    res.json({ message: "Event deleted successfully!" });
  } catch (error) {
    res.status(500).json({ error: "Failed to delete event" });
  }
});

// ✅ Decrease available tickets after booking
app.patch("/events/:event_id/book", async (req, res) => {
  try {
    const event = await Event.findOne({ event_id: parseInt(req.params.event_id) });
    if (!event) return res.status(404).json({ error: "Event not found" });

    if (event.available_tickets > 0) {
      event.available_tickets -= 1;
      await event.save();
      res.json({ message: "Ticket booked successfully", available_tickets: event.available_tickets });
    } else {
      res.status(400).json({ error: "No tickets available" });
    }
  } catch (error) {
    res.status(500).json({ error: "Failed to book ticket" });
  }
});

// ✅ Get a specific event by event_id
app.get("/events/:event_id", async (req, res) => {
  console.log("Received event_id:", req.params.event_id);
  const event = await Event.findOne({ event_id: parseInt(req.params.event_id) });
  if (!event) {
    return res.status(404).json({ error: "Event not found" });
  }
  res.json(event);
});


app.listen(3002, () => console.log("Event Service running on port 3002"));
