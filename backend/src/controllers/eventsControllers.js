import Event from "../models/Event.js";
import User from "../models/User.js";
import cloudinary from "../config/cloudinary.js";
import { getDateRange } from "../utils/dateConfig.js";
import fs from "fs";

export async function createEvent(req, res) {
    try {
        const { eventName, eventDescription, eventCategory, eventVenue, eventAddress, startDate, endDate, startTime, endTime, ticketTypes } = req.body;
        // Check if file was uploaded
        if (!req.file) {
            return res.status(400).json({
                message: "Event image is required. Please upload an image file."
            });
        }

        let imageUrl;

        try {
            // Upload the file to Cloudinary using the file path from multer
            const uploadResponse = await cloudinary.uploader.upload(req.file.path, {
                folder: "bookly-events",
                resource_type: "image",
                allowed_formats: ['jpg', 'jpeg', 'png', 'webp', 'gif'],
                transformation: [
                    { width: 1200, height: 800, crop: 'limit' },
                    { quality: 'auto' }
                ]
            });
            imageUrl = uploadResponse.secure_url;

            // Delete the temporary file after successful upload
            fs.unlinkSync(req.file.path);
        } catch (uploadError) {
            console.error("Cloudinary upload error:", uploadError);

            // Clean up the temporary file even if upload fails
            if (req.file && fs.existsSync(req.file.path)) {
                fs.unlinkSync(req.file.path);
            }

            return res.status(400).json({
                message: "Failed to upload image. Please ensure it's a valid image file."
            });
        }

        // Parse ticketTypes if it's a string (from FormData)
        let parsedTicketTypes = ticketTypes;
        if (typeof ticketTypes === 'string') {
            try {
                parsedTicketTypes = JSON.parse(ticketTypes);
            } catch (e) {
                console.error("Error parsing ticketTypes:", e);
                parsedTicketTypes = [];
            }
        }

        const event = new Event({
            eventOrganizer: req.user._id,
            eventName,
            eventDescription,
            eventCategory,
            eventVenue,
            eventAddress,
            startDate,
            endDate,
            startTime,
            endTime,
            eventImage: imageUrl,
            ticketTypes: parsedTicketTypes || []
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
        const {
            page = 1,
            category,
            day,
            customStartDate,
            customEndDate,
        } = req.query;
        const limit = 6;
        const skip = (parseInt(page) - 1) * limit;

        const filter = {};

        const now = new Date();
        const startOfToday = new Date(
            now.getFullYear(),
            now.getMonth(),
            now.getDate(),
            0,
            0,
            0
        );
        filter.endDate = { $gte: startOfToday };

        if (category && category !== "all") {
            const formattedCategory = category.toLowerCase().replace(/\s+/g, "-");
            filter.eventCategory = formattedCategory;
        }
        if (day) {
            const dayValues = day.split("|").map((d) => d.trim());

            if (dayValues.length > 1) {
                const dateRanges = dayValues
                    .map((d) => getDateRange(d))
                    .filter((range) => range !== null);

                if (dateRanges.length > 0) {
                    filter.$or = dateRanges.map((dateRange) => ({
                        $and: [
                            { startDate: { $lte: dateRange.end } },
                            { endDate: { $gte: dateRange.start } },
                        ],
                    }));
                }
            } else {
                const dateRange = getDateRange(dayValues[0]);
                if (dateRange) {
                    if (!filter.$and) {
                        filter.$and = [];
                    }
                    filter.$and.push(
                        { startDate: { $lte: dateRange.end } },
                        { endDate: { $gte: dateRange.start } }
                    );
                }
            }
        } else if (customStartDate && customEndDate) {
            const rangeStart = new Date(customStartDate);
            const rangeEnd = new Date(customEndDate);
            rangeEnd.setHours(23, 59, 59, 999);

            if (!filter.$and) {
                filter.$and = [];
            }
            filter.$and.push(
                { startDate: { $lte: rangeEnd } },
                { endDate: { $gte: rangeStart } }
            );
        } else if (customStartDate) {
            filter.startDate = { $gte: new Date(customStartDate) };
        } else if (customEndDate) {
            const rangeEnd = new Date(customEndDate);
            rangeEnd.setHours(23, 59, 59, 999);
            filter.endDate = { $gte: now, $lte: rangeEnd };
        }

        const totalEvents = await Event.countDocuments(filter);
        const totalPages = Math.ceil(totalEvents / limit);

        const events = await Event.find(filter).populate("eventOrganizer", "fullName")
            .sort({ createdAt: -1 })
            .skip(skip)
            .limit(limit);

        res.status(200).json({
            events,
            pagination: {
                currentPage: parseInt(page),
                totalPages,
                totalEvents,
                hasNextPage: page < totalPages,
                hasPreviousPage: page > 1,
            },
            filters: {
                category: category || "all",
                day: day || null,
                customStartDate: customStartDate || null,
                customEndDate: customEndDate || null,
            },
        });
    } catch (error) {
        console.error("Error in getAllEvents controller", error);
        res.status(500).json({ message: "Internal server error" });
    }
}

export async function getEventById(req, res) {
    try {
        const event = await Event.findById(req.params.id).populate("eventOrganizer", "fullName email");
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
            eventImage,
            ticketTypes
        } = req.body;

        let imageUrl = eventImage; // Keep existing image URL by default

        // If a new file was uploaded, upload it to Cloudinary
        if (req.file) {
            try {
                const uploadResponse = await cloudinary.uploader.upload(req.file.path, {
                    folder: "bookly-events",
                    resource_type: "image",
                    allowed_formats: ['jpg', 'jpeg', 'png', 'webp', 'gif'],
                    transformation: [
                        { width: 1200, height: 800, crop: 'limit' },
                        { quality: 'auto' }
                    ]
                });
                imageUrl = uploadResponse.secure_url;

                // Delete the temporary file after successful upload
                fs.unlinkSync(req.file.path);
            } catch (uploadError) {
                console.error("Cloudinary upload error:", uploadError);

                // Clean up the temporary file even if upload fails
                if (req.file && fs.existsSync(req.file.path)) {
                    fs.unlinkSync(req.file.path);
                }

                return res.status(400).json({
                    message: "Failed to upload image. Please ensure it's a valid image file."
                });
            }
        }

        // Parse ticketTypes if it's a string (from FormData)
        let parsedTicketTypes = ticketTypes;
        if (typeof ticketTypes === 'string') {
            try {
                parsedTicketTypes = JSON.parse(ticketTypes);
            } catch (e) {
                console.error("Error parsing ticketTypes:", e);
                parsedTicketTypes = ticketTypes; // Keep as is if parsing fails
            }
        }

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
                eventImage: imageUrl,
                ticketTypes: parsedTicketTypes
            },
            { new: true }
        );
        if (!updatedEvent)
            return res.status(404).json({ message: "Event not found" });
        res.status(200).json({
            message: "Event updated successfully",
            event: updatedEvent,
        });
    } catch (error) {
        console.error("Error in updateEvent controller", error);
        res.status(500).json({ message: "Internal server error" });
    }
}

export async function deleteEvent(req, res) {
    try {
        const deletedEvent = await Event.findByIdAndDelete(req.params.id);
        if (!deletedEvent)
            return res.status(404).json({ message: "Event not found" });
        res.status(200).json({ message: "Event deleted successfully!" });
    } catch (error) {
        console.error("Error in deleteEvent controller", error);
        res.status(500).json({ message: "Internal server error" });
    }
}

export async function getEventByUserId(req, res) {
    try {
        const userId = req.params.id;

        if (!userId) {
            return res.status(400).json({ message: "User ID is required" });
        }

        const user = await User.findById(userId);
        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }

        const events = await Event.find({ eventOrganizer: userId })
            .sort({ createdAt: -1 });

        res.status(200).json({
            events,
            totalEvents: events.length,
            eventOrganizer: userId
        });

    } catch (error) {
        console.error("Error in getEventByUserId", error);
        res.status(500).json({ message: "Internal server error" });
    }
}
