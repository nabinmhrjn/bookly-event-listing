"use client";

import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { Button } from "@/components/ui/button";
import {
    Form,
    FormControl,
    FormDescription,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from "@/components/ui/popover";
import { ChevronDownIcon } from "lucide-react";
import { useState } from "react";
import { Calendar } from "@/components/ui/calendar";
import api from "@/lib/axios";
import { toast } from "sonner"

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

const CreateEvent = () => {
    const [startOpen, setStartOpen] = useState(false);
    const [endOpen, setEndOpen] = useState(false);
    const [startDate, setStartDate] = useState(null);
    const [endDate, setEndDate] = useState(null);
    const [loading, setLoading] = useState(false)

    const form = useForm({
        resolver: zodResolver(formSchema),
        defaultValues: {
            eventName: "",
            eventDescription: "",
            eventCategory: "",
            eventVenue: "",
            eventAddress: "",
            startDate: "",
            endDate: "",
            startTime: "",
            endTime: ""
        },
    });

    const handleSubmit = async (values) => {
        setLoading(true);
        try {
            const response = await api.post("/events", values);

            console.log("Event created successfully:", response.data);

            // Reset form
            form.reset();
            setStartDate(null);
            setEndDate(null);

            // Optional: Add success notification
            toast.success("Event created successfully!");

            // Optional: Redirect to events list or event detail page
            // router.push(`/events/${response.data.event._id}`);
        } catch (error) {
            console.error("Error creating event:", error);
            // Show user-friendly error message
            const errorMessage = error.response?.data?.message || "Failed to create event. Please try again.";
            toast.error(errorMessage);
        } finally {
            setLoading(false);
        }
    }

    return (
        <div className="bg-primary/5 pt-14 pb-16">
            <div className="max-w-4xl mx-auto">
                <div className="pb-10">
                    <p className="text-2xl font-bold">Create a New Event</p>
                    <p className="text-sm text-primary/40">
                        Fill in the details below to list your event on Bookly
                    </p>
                </div>

                {/* FORM */}
                <Form {...form}>
                    <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-6">
                        {/* EVENT DETAILS */}
                        <div className="w-full mx-auto bg-white p-4">
                            <p className="text-xl font-bold pb-2">Event Details</p>
                            <div className="bg-black/10 h-0.5"></div>
                            <div className="mt-8 space-y-4">
                                <FormField
                                    control={form.control}
                                    name="eventName"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>
                                                Event Name
                                                <span className="text-red-500 font-bold">*</span>
                                            </FormLabel>
                                            <FormControl>
                                                <Input
                                                    placeholder="Enter the name of your event"
                                                    {...field}
                                                />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />

                                <FormField
                                    control={form.control}
                                    name="eventDescription"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>
                                                Event Description
                                                <span className="text-red-500 font-bold">*</span>
                                            </FormLabel>
                                            <FormControl>
                                                <Textarea
                                                    placeholder="Type your message here."
                                                    {...field}
                                                />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />

                                <div className="mt-4 flex justify-between items-center">
                                    {/* <FormField
                                        control={form.control}
                                        name="eventFlyer"
                                        render={({ field }) => (
                                            <FormItem>
                                                <FormLabel>
                                                    Event Flyer
                                                    <span className="text-red-500 font-bold">*</span>
                                                </FormLabel>
                                                <FormControl>
                                                    <Input
                                                        placeholder="Enter the name of your event"
                                                        {...field}
                                                    />
                                                </FormControl>
                                                <FormMessage />
                                            </FormItem>
                                        )}
                                    /> */}
                                    <FormField
                                        control={form.control}
                                        name="eventCategory"
                                        render={({ field }) => (
                                            <FormItem>
                                                <FormLabel>
                                                    Category
                                                    <span className="text-red-500 font-bold">*</span>
                                                </FormLabel>
                                                <FormControl>
                                                    <Select value={field.value} onValueChange={field.onChange}>
                                                        <SelectTrigger className="w-[280px]">
                                                            <SelectValue placeholder="Select Event Category" {...field} />
                                                        </SelectTrigger>
                                                        <SelectContent>
                                                            <SelectItem value="live-concert">Live Concerts</SelectItem>
                                                            <SelectItem value="technology-innovation">Technology & Innovation</SelectItem>
                                                            <SelectItem value="business-marketing">Business & Networking</SelectItem>
                                                        </SelectContent>
                                                    </Select>
                                                </FormControl>
                                                <FormMessage />
                                            </FormItem>
                                        )}
                                    />
                                </div>
                            </div>
                        </div>

                        {/* DATE & TIME */}
                        <div className="w-full mx-auto bg-white p-4">
                            <p className="text-xl font-bold pb-2">Date & Time</p>
                            <div className="bg-black/10 h-0.5"></div>
                            <div className="mt-8 flex items-center gap-4">

                                {/* START DATE */}
                                <div className="w-1/2">
                                    <FormField
                                        control={form.control}
                                        name="startDate"
                                        render={({ field }) => (
                                            <FormItem>
                                                <FormLabel>
                                                    Start Date & Time
                                                    <span className="text-red-500 font-bold">*</span>
                                                </FormLabel>
                                                <FormControl>
                                                    <div className="flex gap-2">
                                                        <div className="flex flex-col gap-3">
                                                            <Popover
                                                                open={startOpen}
                                                                onOpenChange={setStartOpen}
                                                            >
                                                                <PopoverTrigger asChild>
                                                                    <Button
                                                                        variant="outline"
                                                                        id="date-picker"
                                                                        className="w-80 justify-between font-normal"
                                                                    >
                                                                        {field.value
                                                                            ? new Date(field.value + 'T00:00:00').toLocaleDateString()
                                                                            : "Select date"}
                                                                        <ChevronDownIcon />
                                                                    </Button>
                                                                </PopoverTrigger>
                                                                <PopoverContent
                                                                    className="w-auto overflow-hidden p-0"
                                                                    align="start"
                                                                >
                                                                    <Calendar
                                                                        mode="single"
                                                                        selected={field.value ? new Date(field.value + 'T00:00:00') : undefined}
                                                                        captionLayout="dropdown"
                                                                        disabled={(date) => {
                                                                            const today = new Date();
                                                                            today.setHours(0, 0, 0, 0);
                                                                            // Only disable past dates, allow today
                                                                            return date < today;
                                                                        }}
                                                                        onSelect={(date) => {
                                                                            if (date) {
                                                                                setStartDate(date);
                                                                                // Format date as YYYY-MM-DD for form value
                                                                                const formattedDate = date.toISOString().split('T')[0];
                                                                                field.onChange(formattedDate);
                                                                                setStartOpen(false);
                                                                            }
                                                                        }}
                                                                    />
                                                                </PopoverContent>
                                                            </Popover>
                                                        </div>
                                                        <div className="flex flex-col gap-3">
                                                            <FormField
                                                                control={form.control}
                                                                name="startTime"
                                                                render={({ field: timeField }) => (
                                                                    <Input
                                                                        type="time"
                                                                        id="time-picker"
                                                                        step="1"
                                                                        {...timeField}
                                                                        className="bg-background appearance-none [&::-webkit-calendar-picker-indicator]:hidden [&::-webkit-calendar-picker-indicator]:appearance-none"
                                                                    />
                                                                )}
                                                            />
                                                        </div>
                                                    </div>
                                                </FormControl>
                                                <FormMessage />
                                            </FormItem>
                                        )}
                                    />
                                </div>

                                {/* END DATE */}
                                <div className="w-1/2">
                                    <FormField
                                        control={form.control}
                                        name="endDate"
                                        render={({ field }) => (
                                            <FormItem>
                                                <FormLabel>
                                                    End Date & Time
                                                    <span className="text-red-500 font-bold">*</span>
                                                </FormLabel>
                                                <FormControl>
                                                    <div className="flex gap-2">
                                                        <div className="flex flex-col gap-3">
                                                            <Popover
                                                                open={endOpen}
                                                                onOpenChange={setEndOpen}
                                                            >
                                                                <PopoverTrigger asChild>
                                                                    <Button
                                                                        variant="outline"
                                                                        id="date-picker"
                                                                        className="w-80 justify-between font-normal"
                                                                    >
                                                                        {field.value
                                                                            ? new Date(field.value + 'T00:00:00').toLocaleDateString()
                                                                            : "Select date"}
                                                                        <ChevronDownIcon />
                                                                    </Button>
                                                                </PopoverTrigger>
                                                                <PopoverContent
                                                                    className="w-auto overflow-hidden p-0"
                                                                    align="start"
                                                                >
                                                                    <Calendar
                                                                        mode="single"
                                                                        selected={field.value ? new Date(field.value + 'T00:00:00') : undefined}
                                                                        captionLayout="dropdown"
                                                                        onSelect={(date) => {
                                                                            if (date) {
                                                                                setEndDate(date);
                                                                                // Format date as YYYY-MM-DD for form value
                                                                                const formattedDate = date.toISOString().split('T')[0];
                                                                                field.onChange(formattedDate);
                                                                                setEndOpen(false);
                                                                            }
                                                                        }}
                                                                    />
                                                                </PopoverContent>
                                                            </Popover>
                                                        </div>
                                                        <div className="flex flex-col gap-3">
                                                            <FormField
                                                                control={form.control}
                                                                name="endTime"
                                                                render={({ field: timeField }) => (
                                                                    <Input
                                                                        type="time"
                                                                        id="time-picker"
                                                                        step="1"
                                                                        {...timeField}
                                                                        className="bg-background appearance-none [&::-webkit-calendar-picker-indicator]:hidden [&::-webkit-calendar-picker-indicator]:appearance-none"
                                                                    />
                                                                )}
                                                            />
                                                        </div>
                                                    </div>
                                                </FormControl>
                                                <FormMessage />
                                            </FormItem>
                                        )}
                                    />
                                </div>

                            </div>
                        </div>

                        {/* LOCATION */}
                        <div className="w-full mx-auto bg-white p-4">
                            <p className="text-xl font-bold pb-2">Location</p>
                            <div className="bg-black/10 h-0.5"></div>
                            <div className="mt-8 flex items-center w-full gap-4">
                                <div className="w-1/2">
                                    <FormField
                                        control={form.control}
                                        name="eventVenue"
                                        render={({ field }) => (
                                            <FormItem>
                                                <FormLabel>
                                                    Venue Name
                                                    <span className="text-red-500 font-bold">*</span>
                                                </FormLabel>
                                                <FormControl>
                                                    <Input
                                                        placeholder="e.g The Grand Concert Hall"
                                                        {...field}
                                                    />
                                                </FormControl>
                                                <FormMessage />
                                            </FormItem>
                                        )}
                                    />
                                </div>
                                <div className="w-1/2">
                                    <FormField
                                        control={form.control}
                                        name="eventAddress"
                                        render={({ field }) => (
                                            <FormItem>
                                                <FormLabel>
                                                    Address
                                                    <span className="text-red-500 font-bold">*</span>
                                                </FormLabel>
                                                <FormControl>
                                                    <Input
                                                        placeholder="123 Music Lane, Nashville, TN"
                                                        {...field}
                                                    />
                                                </FormControl>
                                                <FormMessage />
                                            </FormItem>
                                        )}
                                    />
                                </div>
                            </div>
                        </div>

                        <Button className="w-full" type="submit">
                            Publish Event
                        </Button>
                    </form>
                </Form>
            </div>
        </div>
    );
};

export default CreateEvent;
