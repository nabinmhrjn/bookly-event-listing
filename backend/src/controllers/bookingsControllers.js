import Booking from "../models/Booking.js";
import Event from "../models/Event.js";

// create a new booking
export async function createBooking(req, res) {
    try {
        const {
            fullName,
            email,
            eventId,
            eventName,
            ticketType,
            ticketQuantity,
            totalPrice,
            paymentMethod
        } = req.body;

        // validate that the event exists
        const event = await Event.findById(eventId);
        if (!event) {
            return res.status(404).json({ message: "Event not found" });
        }

        // create the booking
        const booking = new Booking({
            userId: req.user.id,
            fullName,
            email,
            eventId,
            eventName,
            ticketType,
            ticketQuantity,
            totalPrice,
            paymentMethod,
            paymentStatus: 'pending',
            bookingStatus: 'confirmed'
        });

        const savedBooking = await booking.save();

        res.status(201).json({
            message: "Booking created successfully",
            booking: savedBooking
        });
    } catch (error) {
        console.error("Error in createBooking controller", error);
        res.status(500).json({ message: "Internal server error" });
    }
}

// get all bookings for the authenticated user
export async function getUserBookings(req, res) {
    try {
        const bookings = await Booking.find({ userId: req.user.id })
            .populate('eventId', 'eventName eventImage startDate startTime eventVenue')
            .sort({ createdAt: -1 });

        res.status(200).json({
            bookings,
            totalBookings: bookings.length
        });
    } catch (error) {
        console.error("Error in getUserBookings controller", error);
        res.status(500).json({ message: "Internal server error" });
    }
}

// get a specific booking by ID
export async function getBookingById(req, res) {
    try {
        const booking = await Booking.findById(req.params.id)
            .populate('eventId', 'eventName eventImage startDate startTime eventVenue eventAddress')
            .populate('userId', 'fullName email');

        if (!booking) {
            return res.status(404).json({ message: "Booking not found" });
        }

        // ensure the user can only access their own bookings
        if (booking.userId._id.toString() !== req.user.id) {
            return res.status(403).json({ message: "Access denied" });
        }

        res.status(200).json(booking);
    } catch (error) {
        console.error("Error in getBookingById controller", error);
        res.status(500).json({ message: "Internal server error" });
    }
}

// get all bookings (admin only - for now, returns all)
export async function getAllBookings(req, res) {
    try {
        const bookings = await Booking.find()
            .populate('eventId', 'eventName startDate')
            .populate('userId', 'fullName email')
            .sort({ createdAt: -1 });

        res.status(200).json({
            bookings,
            totalBookings: bookings.length
        });
    } catch (error) {
        console.error("Error in getAllBookings controller", error);
        res.status(500).json({ message: "Internal server error" });
    }
}

// cancel a booking
export async function cancelBooking(req, res) {
    try {
        const booking = await Booking.findById(req.params.id);

        if (!booking) {
            return res.status(404).json({ message: "Booking not found" });
        }

        // ensure the user can only cancel their own bookings
        if (booking.userId.toString() !== req.user.id) {
            return res.status(403).json({ message: "Access denied" });
        }

        // check if booking is already cancelled
        if (booking.bookingStatus === 'cancelled') {
            return res.status(400).json({ message: "Booking is already cancelled" });
        }

        // update booking status
        booking.bookingStatus = 'cancelled';
        await booking.save();

        res.status(200).json({
            message: "Booking cancelled successfully",
            booking
        });
    } catch (error) {
        console.error("Error in cancelBooking controller", error);
        res.status(500).json({ message: "Internal server error" });
    }
}
