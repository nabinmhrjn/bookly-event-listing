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
    eventImage: z.any().refine((file) => file instanceof File, "Event Flyer is required")

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
    const [loading, setLoading] = useState(false);

    // Time component states
    const [startHour, setStartHour] = useState("");
    const [startMinute, setStartMinute] = useState("");
    const [startPeriod, setStartPeriod] = useState("");
    const [endHour, setEndHour] = useState("");
    const [endMinute, setEndMinute] = useState("");
    const [endPeriod, setEndPeriod] = useState("");

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
            endTime: "",
            eventImage: null
        },
    });

    const handleSubmit = async (values) => {
        setLoading(true);
        try {
            // Create FormData for multipart/form-data submission
            const formData = new FormData();
            formData.append('eventName', values.eventName);
            formData.append('eventDescription', values.eventDescription);
            formData.append('eventCategory', values.eventCategory);
            formData.append('eventVenue', values.eventVenue);
            formData.append('eventAddress', values.eventAddress);
            formData.append('startDate', values.startDate);
            formData.append('endDate', values.endDate);
            formData.append('startTime', values.startTime);
            formData.append('endTime', values.endTime);
            formData.append('eventImage', values.eventImage);

            const response = await api.post("/events", formData, {
                headers: {
                    'Content-Type': 'multipart/form-data'
                }
            });

            console.log("Event created successfully:", response.data);

            form.reset();
            setStartDate(null);
            setEndDate(null);
            setStartHour("");
            setStartMinute("");
            setStartPeriod("");
            setEndHour("");
            setEndMinute("");
            setEndPeriod("");

            toast.success("Event created successfully!");

            // router.push(`/events/${response.data.event._id}`);
        } catch (error) {
            console.error("Error creating event:", error);

            const errorMessage = error.response?.data?.message || "Failed to create event. Please try again.";
            toast.error(errorMessage);
        } finally {
            setLoading(false);
        }
    }

    // Helper to format date
    const formatDate = (date) => {
        const year = date.getFullYear();
        const month = String(date.getMonth() + 1).padStart(2, '0');
        const day = String(date.getDate()).padStart(2, '0');
        return `${year}-${month}-${day}`;
    };

    // Helper to parse date string
    const parseDate = (dateString) => {
        if (!dateString) return undefined;
        const [year, month, day] = dateString.split('-').map(Number);
        return new Date(year, month - 1, day);
    };

    // Convert 12-hour time to 24-hour format
    const convertTo24Hour = (hour, minute, period) => {
        if (!hour || !minute || !period) return "";
        let hour24 = parseInt(hour);
        if (period === "PM" && hour24 !== 12) {
            hour24 += 12;
        } else if (period === "AM" && hour24 === 12) {
            hour24 = 0;
        }
        return `${String(hour24).padStart(2, '0')}:${minute}:00`;
    };

    // Convert 24-hour time to 12-hour format
    const convertTo12Hour = (time24) => {
        if (!time24) return { hour: "", minute: "", period: "" };
        const [hour24, minute] = time24.split(':');
        let hour = parseInt(hour24);
        const period = hour >= 12 ? "PM" : "AM";
        if (hour === 0) {
            hour = 12;
        } else if (hour > 12) {
            hour -= 12;
        }
        return { hour: String(hour), minute, period };
    };

    // Update form when time components change
    const updateStartTime = (hour, minute, period) => {
        const time24 = convertTo24Hour(hour, minute, period);
        if (time24) {
            form.setValue("startTime", time24);
        }
    };

    const updateEndTime = (hour, minute, period) => {
        const time24 = convertTo24Hour(hour, minute, period);
        if (time24) {
            form.setValue("endTime", time24);
        }
    };

    return (
        <div className="pt-14 pb-16 bg-secondary">
            <div className="max-w-4xl mx-auto">
                <div className="bg-white p-8 shadow-md">
                    <p className="text-2xl font-bold">Create a New Event</p>
                    <p className="text-sm text-primary/40">
                        Fill in the details below to list your event on Bookly
                    </p>
                </div>

                {/* FORM */}
                <Form {...form}>
                    <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-6 bg-white p-6">
                        {/* EVENT DETAILS */}
                        <div className="w-full mx-auto p-4">
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
                                                            <SelectItem value="sports-event">Sports Events</SelectItem>
                                                            <SelectItem value="comedy-show">Comedy Shows</SelectItem>
                                                            <SelectItem value="other">Other</SelectItem>
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
                        <div className="w-full mx-auto p-4">
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
                                                                        className="font-normal"
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
                                                                        selected={field.value ? parseDate(field.value) : undefined}
                                                                        captionLayout="dropdown"
                                                                        disabled={(date) => {
                                                                            const today = new Date();
                                                                            today.setHours(0, 0, 0, 0);
                                                                            return date < today;
                                                                        }}
                                                                        onSelect={(date) => {
                                                                            if (date) {
                                                                                setStartDate(date);
                                                                                const formattedDate = formatDate(date);
                                                                                field.onChange(formattedDate);
                                                                                setStartOpen(false);
                                                                            }
                                                                        }}
                                                                    />
                                                                </PopoverContent>
                                                            </Popover>
                                                        </div>
                                                        <div className="flex gap-2">
                                                            {/* Hour Select */}
                                                            <Select
                                                                value={startHour}
                                                                onValueChange={(value) => {
                                                                    setStartHour(value);
                                                                    updateStartTime(value, startMinute, startPeriod);
                                                                }}
                                                            >
                                                                <SelectTrigger className="w-20">
                                                                    <SelectValue placeholder="HH" />
                                                                </SelectTrigger>
                                                                <SelectContent>
                                                                    {Array.from({ length: 12 }, (_, i) => i + 1).map((hour) => (
                                                                        <SelectItem key={hour} value={String(hour)}>
                                                                            {String(hour).padStart(2, '0')}
                                                                        </SelectItem>
                                                                    ))}
                                                                </SelectContent>
                                                            </Select>

                                                            <span className="flex items-center">:</span>

                                                            {/* Minute Select */}
                                                            <Select
                                                                value={startMinute}
                                                                onValueChange={(value) => {
                                                                    setStartMinute(value);
                                                                    updateStartTime(startHour, value, startPeriod);
                                                                }}
                                                            >
                                                                <SelectTrigger className="w-20">
                                                                    <SelectValue placeholder="MM" />
                                                                </SelectTrigger>
                                                                <SelectContent>
                                                                    {Array.from({ length: 60 }, (_, i) => i).map((minute) => (
                                                                        <SelectItem key={minute} value={String(minute).padStart(2, '0')}>
                                                                            {String(minute).padStart(2, '0')}
                                                                        </SelectItem>
                                                                    ))}
                                                                </SelectContent>
                                                            </Select>

                                                            {/* AM/PM Select */}
                                                            <Select
                                                                value={startPeriod}
                                                                onValueChange={(value) => {
                                                                    setStartPeriod(value);
                                                                    updateStartTime(startHour, startMinute, value);
                                                                }}
                                                            >
                                                                <SelectTrigger className="w-20">
                                                                    <SelectValue placeholder="AM" />
                                                                </SelectTrigger>
                                                                <SelectContent>
                                                                    <SelectItem value="AM">AM</SelectItem>
                                                                    <SelectItem value="PM">PM</SelectItem>
                                                                </SelectContent>
                                                            </Select>
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
                                                                        className="font-normal"
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
                                                                        selected={field.value ? parseDate(field.value) : undefined}
                                                                        captionLayout="dropdown"
                                                                        disabled={(date) => {
                                                                            const today = new Date();
                                                                            today.setHours(0, 0, 0, 0);
                                                                            return date < today;
                                                                        }}
                                                                        onSelect={(date) => {
                                                                            if (date) {
                                                                                setEndDate(date);
                                                                                const formattedDate = formatDate(date);
                                                                                field.onChange(formattedDate);
                                                                                setEndOpen(false);
                                                                            }
                                                                        }}
                                                                    />
                                                                </PopoverContent>
                                                            </Popover>
                                                        </div>
                                                        <div className="flex gap-2">
                                                            {/* Hour Select */}
                                                            <Select
                                                                value={endHour}
                                                                onValueChange={(value) => {
                                                                    setEndHour(value);
                                                                    updateEndTime(value, endMinute, endPeriod);
                                                                }}
                                                            >
                                                                <SelectTrigger className="w-20">
                                                                    <SelectValue placeholder="HH" />
                                                                </SelectTrigger>
                                                                <SelectContent>
                                                                    {Array.from({ length: 12 }, (_, i) => i + 1).map((hour) => (
                                                                        <SelectItem key={hour} value={String(hour)}>
                                                                            {String(hour).padStart(2, '0')}
                                                                        </SelectItem>
                                                                    ))}
                                                                </SelectContent>
                                                            </Select>

                                                            <span className="flex items-center">:</span>

                                                            {/* Minute Select */}
                                                            <Select
                                                                value={endMinute}
                                                                onValueChange={(value) => {
                                                                    setEndMinute(value);
                                                                    updateEndTime(endHour, value, endPeriod);
                                                                }}
                                                            >
                                                                <SelectTrigger className="w-20">
                                                                    <SelectValue placeholder="MM" />
                                                                </SelectTrigger>
                                                                <SelectContent>
                                                                    {Array.from({ length: 60 }, (_, i) => i).map((minute) => (
                                                                        <SelectItem key={minute} value={String(minute).padStart(2, '0')}>
                                                                            {String(minute).padStart(2, '0')}
                                                                        </SelectItem>
                                                                    ))}
                                                                </SelectContent>
                                                            </Select>

                                                            {/* AM/PM Select */}
                                                            <Select
                                                                value={endPeriod}
                                                                onValueChange={(value) => {
                                                                    setEndPeriod(value);
                                                                    updateEndTime(endHour, endMinute, value);
                                                                }}
                                                            >
                                                                <SelectTrigger className="w-20">
                                                                    <SelectValue placeholder="AM" />
                                                                </SelectTrigger>
                                                                <SelectContent>
                                                                    <SelectItem value="AM">AM</SelectItem>
                                                                    <SelectItem value="PM">PM</SelectItem>
                                                                </SelectContent>
                                                            </Select>
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
                        <div className="w-full mx-auto p-4">
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

                        {/* image upload */}
                        <div className="w-full mx-auto p-4">
                            <p className="text-xl font-bold pb-2">Upload Flyer</p>
                            <div className="bg-black/10 h-0.5"></div>
                            <div className="mt-8 flex items-center w-full gap-4">
                                <div className="w-full">
                                    <FormField
                                        control={form.control}
                                        name="eventImage"
                                        render={({ field: { value, onChange, ...field } }) => (
                                            <FormItem>
                                                <FormLabel>
                                                    Event Flyer
                                                    <span className="text-red-500 font-bold">*</span>
                                                </FormLabel>
                                                <FormControl>
                                                    <Input
                                                        {...field}
                                                        type="file"
                                                        accept="image/jpeg,image/png"
                                                        onChange={(e) => {
                                                            const file = e.target.files?.[0];
                                                            if (file) {
                                                                onChange(file);
                                                            } else {
                                                                onChange(null);
                                                            }
                                                        }}
                                                        value={undefined}
                                                    />
                                                </FormControl>
                                                {value && (
                                                    <p className="text-sm text-muted-foreground">
                                                        Selected: {value.name}
                                                    </p>
                                                )}
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
