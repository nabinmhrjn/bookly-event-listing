import Event from "../models/Event.js";

export async function createEvent(req, res) {
    try {
        const { eventName, eventDescription } = req.body;
        const event = new Event({ eventName, eventDescription })

        const savedEvent = await event.save();
        res.status(201).json(savedEvent)
    } catch (error) {
        console.error("Error in createEvent controller", error);
        res.status(500).json({ message: "Internal server error" })
    }
}

