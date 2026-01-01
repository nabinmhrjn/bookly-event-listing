import mongoose from "mongoose";

const bookingSchema = new mongoose.Schema(
    {
        userId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User',
            required: true
        },
        fullName: {
            type: String,
            required: true,
            trim: true
        },
        email: {
            type: String,
            required: true,
            trim: true,
            lowercase: true
        },
        eventId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Event',
            required: true
        },
        eventName: {
            type: String,
            required: true
        },
        ticketType: {
            type: String,
            required: true
        },
        ticketQuantity: {
            type: Number,
            required: true,
            min: 1
        },
        totalPrice: {
            type: Number,
            required: true,
            min: 0
        },
        paymentMethod: {
            type: String,
            required: true,
            enum: ['esewa', 'connectIPS', 'visa']
        },
        paymentStatus: {
            type: String,
            required: true,
            enum: ['pending', 'completed', 'failed', 'refunded'],
            default: 'pending'
        },
        transactionId: {
            type: String,
            default: null
        },
        // booking status
        bookingStatus: {
            type: String,
            required: true,
            enum: ['confirmed', 'cancelled', 'attended'],
            default: 'confirmed'
        },
        // booking reference number (unique identifier for the booking)
        bookingReference: {
            type: String,
            unique: true
        }
    },
    {
        timestamps: true
    }
);

// generate unique booking reference before saving
bookingSchema.pre('save', async function () {
    if (!this.bookingReference) {
        // generate format: BKL-YYYYMMDD-XXXXX (e.g., BKL-20241231-A1B2C)
        const date = new Date();
        const dateStr = date.toISOString().slice(0, 10).replace(/-/g, '');
        const randomStr = Math.random().toString(36).substring(2, 7).toUpperCase();
        this.bookingReference = `BKL-${dateStr}-${randomStr}`;
    }
});

// index for faster queries
bookingSchema.index({ userId: 1, eventId: 1 });
bookingSchema.index({ bookingReference: 1 });
bookingSchema.index({ email: 1 });

const Booking = mongoose.model('Booking', bookingSchema);

export default Booking;