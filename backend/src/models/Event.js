import mongoose from "mongoose";

const eventSchema = new mongoose.Schema(
    {
        eventName: {
            type: String,
            required: true
        },
        eventDescription: {
            type: String,
            required: true
        },
        eventCategory: {
            type: String,
            required: true,
            enum: [
                "live-concert",
                "comedy-show",
                "sports-event",
                "technology-innovation",
                "business-marketing",
                "other"
            ]
        },
        eventVenue: {
            type: String,
            required: true
        },
        eventAddress: {
            type: String,
            required: true
        },
        startDate: {
            type: Date,
            required: true
        },
        endDate: {
            type: Date,
            required: true
        },
        startTime: {
            type: String, // Keep as String for HH:MM format
            required: true
        },
        endTime: {
            type: String, // Keep as String for HH:MM format
            required: true
        },
        eventOrganizer: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User',
            required: false
        },
    },
    { timestamps: true }
);

const Event = mongoose.model("Event", eventSchema);

export default Event;