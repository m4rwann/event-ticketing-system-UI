const Booking = require("../models/bookingModel");
const Event = require("../models/eventModel");

const bookingController = {
    BookATicket: async (req, res) => {
        try {


            const { eventId, ticketsBooked } = req.body;
            const event = await Event.findById(eventId);

            if (!event || event.status !== "approved") {
                return res.status(404).json({ message: "Event not found or not approved" });
            }

            if (ticketsBooked > event.remainingTickets) {
                return res.status(400).json({ message: "Not enough tickets available" });
            }

            const totalPrice = ticketsBooked * event.ticketPrice;

            const booking = new Booking({
                user: req.user.userId,
                event: eventId,
                ticketsBooked,
                totalPrice,
                status: "pending"
            });

            event.remainingTickets -= ticketsBooked;
            const updateEvent = await event.save();
            if (!updateEvent) return res.status(400).json({ message: "Not enough tickets available" });
            booking.status = "confirmed";
            await booking.save();
            return res.status(200).json({ message: "Booking successfull", booking });
        } catch (err) {
            return res.status(500).json({ message: "Server error", error: err.message });
        }
    },
    getBooking: async (req, res) => {
        try {
            const booking = await Booking.findById(req.params.id);
            if (!booking) return res.status(404).json({ message: "Booking not found" });
            if (booking.user.toString() !== req.user.userId)
                return res.status(403).json({ message: "Unauthorized access" });
            return res.status(200).json({ booking });
        } catch (err) {
            return res.status(500).json({ message: "Server error", error: err.message });
        }
    },
    cancelBooking: async (req, res) => {
        try {
            const booking = await Booking.findById(req.params.id);
            if (!booking) return res.status(404).json({ message: "Booking not found" });
            if (booking.user.toString() !== req.user.userId)
                return res.status(403).json({ message: "Unauthorized access" });

            const event = await Event.findById(booking.event);
            if (event) {
                event.remainingTickets += booking.ticketsBooked;
                await event.save();
            }

            booking.status = "canceled";
            await booking.save();

            return res.status(200).json({ message: "Booking canceled" });
        } catch (err) {
            return res.status(500).json({ message: "Server error", error: err.message });
        }
    },
    getUserBookings: async (req, res) => {
        try {
            const bookings = await Booking.find({
                user: req.user.userId,
                status: "confirmed",
            })
                .populate("event")
                .sort({ createdAt: -1 });

            return res.status(200).json({ bookings });
        } catch (err) {
            return res.status(500).json({ message: "Server error", error: err.message });
        }
    },
};

module.exports = bookingController;