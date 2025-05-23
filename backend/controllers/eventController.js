const Event = require("../models/eventModel");

const eventController = {
    createEvent: async (req, res) => {
        try {
            const {
                title,
                description,
                date,
                location,
                category,
                image,
                ticketPrice,
                totalTickets
            } = req.body;

            if (req.user.role !== "organizer") {
                return res.status(403).json({ message: "Only organizers can create events" });
            }

            const event = new Event({
                title,
                description,
                date,
                location,
                category,
                image,
                ticketPrice,
                totalTickets,
                remainingTickets: totalTickets,
                status: "pending",
                organizer: req.user.userId,
            });

            const newEvent = await event.save();
            return res.status(200).json({ message: "Event Created", event: newEvent });
        } catch (err) {
            return res.status(500).json({ message: "Server error", error: err.message });
        }
    },
    getAllEvents: async (req, res) => {
        try {
            let events;
            if (req.user.role === 'admin') {
                events = await Event.find();
            } else {
                events = await Event.find({ status: "approved" });
            }

            return res.status(200).json(events);
        } catch (err) {
            return res.status(500).json({ message: "Server error", error: err.message });
        }
    },
    getEventDetails: async (req, res) => {
        try {
            const event = await Event.findById(req.params.id);
            if (!event) return res.status(404).json({ message: "Event not found" });
            return res.status(200).json(event);
        } catch (err) {
            return res.status(500).json({ message: "Server error", error: err.message });
        }
    },
    updateEvent: async (req, res) => {
        try {
            //console.log(req.user);
            const event = await Event.findById(req.params.id);
            //console.log(event);
            if (!event) return res.status(404).json({ message: "Event not found" });
            if (req.user.role === 'organizer') {
                const { date, location, totalTickets } = req.body;
                event.date = date || event.date;
                event.location = location || event.location;

                // check if the new tickets is more than the tickets as i can not reduce number of tickets due to the risk that there
                // would be booked tickets 
                if (totalTickets && totalTickets >= event.totalTickets) {
                    const ticketDifference = totalTickets - event.totalTickets;
                    event.remainingTickets += ticketDifference;
                    event.totalTickets = totalTickets;
                }
            } else if (req.user.role === 'admin') {
                const status = req.body.status;
                console.log(status);
                event.status = status || event.status;
            }

            const updated = await event.save();
            return res.status(200).json({ message: "Event updated", event: updated });
        } catch (err) {
            return res.status(500).json({ message: "Server error", error: err.message });
        }
    },
    deleteEvent: async (req, res) => {
        try {
            const event = await Event.findById(req.params.id);
            if (!event) return res.status(404).json({ message: "Event not found" });

            await event.deleteOne();
            return res.status(200).json({ message: "Event deleted successfully" });
        } catch (e) {
            return res.status(500).json({ message: e.message });
        }
    }
};

module.exports = eventController;