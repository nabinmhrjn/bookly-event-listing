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
    eventImage: z.any().refine((file) => file instanceof File || typeof file === 'string', "Event Flyer is required")

});

export default formSchema
