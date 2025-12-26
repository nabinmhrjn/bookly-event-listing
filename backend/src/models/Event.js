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
            type: String,
            required: true
        },
        endTime: {
            type: String,
            required: true
        },
        eventOrganizer: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User',
            required: false
        },
        eventImage: {
            type: String,
            required: true
        },
        ticketTypes: [{
            name: {
                type: String,
                required: true
            },
            price: {
                type: String,
                required: true
            },
            //we will implement ticket quantity later on
            // quantity: {
            //     type: Number,
            //     required: false,
            //     default: 0
            // },
            _id: false
        }]
    },
    { timestamps: true }
);

const Event = mongoose.model("Event", eventSchema);

export default Event;