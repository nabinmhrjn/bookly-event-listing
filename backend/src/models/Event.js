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
        }
    },
    { timestamps: true }
);

const Event = mongoose.model("Event", eventSchema);

export default Event;