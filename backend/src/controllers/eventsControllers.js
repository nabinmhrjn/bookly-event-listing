import Event from "../models/Event.js";

export async function createEvent(req, res) {
    try {
        const {
            eventName,
            eventDescription,
            eventCategory,
            eventVenue,
            eventAddress,
            startDate,
            endDate,
            startTime,
            endTime,
        } = req.body;
        const event = new Event({
            eventName,
            eventDescription,
            eventCategory,
            eventVenue,
            eventAddress,
            startDate,
            endDate,
            startTime,
            endTime,
        });

        const savedEvent = await event.save();
        res.status(201).json({
            message: "Event created successfully",
            event: savedEvent,
        });
    } catch (error) {
        console.error("Error in createEvent controller", error);
        res.status(500).json({ message: "Internal server error" });
    }
}

export async function getAllEvents(req, res) {
    try {
        const { page = 1, category } = req.query;
        const limit = 6;
        const skip = (parseInt(page) - 1) * limit;

        //build filter object
        const filter = {};

        //add category filter if provided
        if (category && category !== 'all') {
            filter.eventCategory = category
        }

        //get total count
        const totalEvents = await Event.countDocuments();
        const totalPages = Math.ceil(totalEvents / limit);

        //fetch paginated events
        const events = await Event.find(filter).sort({ createdAt: -1 }).skip(skip).limit(limit);
        res.status(200).json({
            events,
            pagination: {
                currentPage: parseInt(page),
                totalPages,
                totalEvents,
                hasNextPage: page < totalPages,
                hasPreviousPage: page > 1
            },
            filters: {
                category: category || 'all',
            }
        });

    } catch (error) {
        console.error("Error in getAllEvents controller", error);
        res.status(500).json({ message: "Internal server error" });
    }
}

export async function getEventById(req, res) {
    try {
        const event = await Event.findById(req.params.id);
        if (!event) return res.status(404).json({ message: "Event not found!" });
        res.json(event);
    } catch (error) {
        console.error("Error in deleteEvent controller", error);
        res.status(500).json({ message: "Internal server error" });
    }
}

export async function updateEvent(req, res) {
    try {
        const {
            eventName,
            eventDescription,
            eventCategory,
            eventVenue,
            eventAddress,
            startDate,
            endDate,
            startTime,
            endTime,
        } = req.body;
        const updatedEvent = await Event.findByIdAndUpdate(
            req.params.id,
            {
                eventName,
                eventDescription,
                eventCategory,
                eventVenue,
                eventAddress,
                startDate,
                endDate,
                startTime,
                endTime,
            },
            { new: true }
        );
        if (!updatedEvent)
            return res.status(404).json({ message: "Event not found" });
        res.status(200).json({
            message: "Event updated successfully",
            event: updatedEvent
        });
    } catch (error) {
        console.error("Error in updateEvent controller", error);
        res.status(500).json({ message: "Internal server error" });
    }
}

export async function deleteEvent(req, res) {
    try {
        const deletedEvent = await Event.findByIdAndDelete(req.params.id);
        if (!deletedEvent) return res.status(404).json({ message: "Event not found" });
        res.status(200).json({ message: "Event deleted successfully!" });
    } catch (error) {
        console.error("Error in deleteEvent controller", error);
        res.status(500).json({ message: "Internal server error" });
    }
}
