import { z } from "zod";

const formSchema = z.object({
    eventName: z.string().min(1, "Event name is required.").min(2, {
        message: "Event name must be at least 2 characters.",
    }),
    eventDescription: z.string().min(1, "Event Description is required."),
    eventCategory: z.string().min(1, "Event Category is required."),
    eventVenue: z.string().min(1, "Event venue is required"),
    eventAddress: z.string().min(1, "Event address is required"),
    startDate: z.string().min(1, "Event start date is required"),
    endDate: z.string().min(1, "Event end date is required"),
    startTime: z.string().min(1, "Event start time is required"),
    endTime: z.string().min(1, "Event end time is required"),
    eventImage: z.any().refine((file) => file instanceof File, "Event Flyer is required"),
    generalTicket: z.string().min(1, "Event general ticket price is required"),
    vipTicket: z.string().min(1, "Event vip ticket section is required")

}).refine((data) => {
    // Only validate if start date/time fields are filled
    if (!data.startDate || !data.startTime) {
        return true; // Skip validation if fields are empty
    }

    const start = new Date(`${data.startDate}T${data.startTime}`);
    const now = new Date();

    // Validate that start date/time is in the future (can be today but with future time)
    return start > now;
}, {
    message: "Start date/time must be in the future. If selecting today, the time must be in the future.",
    path: ["startDate"], // Point error to startDate field
}).refine((data) => {
    // Only validate if all date/time fields are filled
    if (!data.startDate || !data.startTime || !data.endDate || !data.endTime) {
        return true; // Skip validation if fields are empty
    }
    // Add custom validation to ensure end date/time is after start date/time
    const start = new Date(`${data.startDate}T${data.startTime}`);
    const end = new Date(`${data.endDate}T${data.endTime}`);
    return end > start;
}, {
    message: "End date/time must be after start date/time",
    path: ["endDate"], // Point error to endDate field
});

export default formSchema
