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
import { ChevronDownIcon, EditIcon, MapPin, Ticket, Clock, Upload, Trash } from "lucide-react";
import { useState } from "react";
import { Calendar } from "@/components/ui/calendar";
import api from "@/lib/axios";
import { toast } from "sonner"
import { Field, FieldError, FieldGroup, FieldLabel } from "@/components/ui/field";
import { Controller } from "react-hook-form";
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { Label } from "@/components/ui/label"
import Tiptap from "@/components/TipTap";



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

const CreateEvent = () => {
    const [startOpen, setStartOpen] = useState(false);
    const [endOpen, setEndOpen] = useState(false);
    const [startDate, setStartDate] = useState(null);
    const [endDate, setEndDate] = useState(null);
    const [loading, setLoading] = useState(false);
    const [ticketType, setTicketType] = useState([])

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
            eventImage: null,
            generalTicket: "",
            vipTicket: ""
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
            formData.append('generalTicket', values.generalTicket);
            formData.append('vipTicket', values.vipTicket);

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


    const handleAddTicketType = () => {
        setTicketType([...ticketType, { id: Date.now(), name: '', price: '', quantity: '' }])
    }

    const handleRemoveTicketType = (id) => {
        setTicketType(ticketType.filter(ticket => ticket.id !== id))
    }

    return (
        <div className="pt-14 pb-16 bg-secondary">
            <div className="max-w-4xl mx-auto">
                <div className="mb-8">
                    <p className="text-2xl font-bold">Create New Event</p>
                    <p className="text-sm text-primary/40">
                        Fill in the details below to launch your new event listing
                    </p>
                </div>

                {/* FORM */}
                <form onSubmit={form.handleSubmit()}>

                    <div className="space-y-6">
                        {/* ------------------ EVENT DETAILS --------------- */}
                        <div className="bg-white p-6 shadow-sm">
                            <div className="flex gap-2 items-center mb-4">
                                <EditIcon />
                                <h3 className="text-2xl font-semibold text-slate-700">Event Details</h3>
                            </div>
                            <FieldGroup>
                                <Controller name="eventName" control={form.control} render={({ field, fieldState }) => (
                                    <Field>

                                        <FieldLabel>Event Name</FieldLabel>
                                        <Input aria-invalid={fieldState.invalid} placeholder="John Doe" {...field} />
                                        {fieldState.invalid && (
                                            <FieldError errors={[fieldState.error]} />
                                        )}
                                    </Field>
                                )} />

                                <Controller name="eventDescription" control={form.control} render={({ field, fieldState }) => (
                                    <Field>
                                        <FieldLabel>Event Description</FieldLabel>
                                        <Input aria-invalid={fieldState.invalid} placeholder="John Doe" {...field} />
                                        {fieldState.invalid && (
                                            <FieldError errors={[fieldState.error]} />
                                        )}
                                    </Field>
                                )} />

                                <div className="flex w-full gap-4">
                                    <div className="w-1/2">
                                        <Controller name="eventCategory" control={form.control} render={({ field, fieldState }) => (
                                            <Field>
                                                <FieldLabel>Event Category</FieldLabel>
                                                <Select value={field.value} onValueChange={field.onChange} {...field}>
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
                                                {fieldState.invalid && (
                                                    <FieldError errors={[fieldState.error]} />
                                                )}
                                            </Field>
                                        )} />
                                    </div>
                                </div>

                            </FieldGroup>
                        </div>

                        {/* ------------------  LOCATION --------------- */}
                        <div className="bg-white p-6 shadow-md">
                            <div className="flex gap-2 items-center mb-4">
                                <MapPin />
                                <h3 className="text-2xl font-semibold text-slate-700">Location</h3>
                            </div>
                            <FieldGroup>
                                <Controller name="eventVenue" control={form.control} render={({ field, fieldState }) => (
                                    <Field>
                                        <FieldLabel>Venue Name</FieldLabel>
                                        <Input aria-invalid={fieldState.invalid} placeholder="John Doe" {...field} />
                                        {fieldState.invalid && (
                                            <FieldError errors={[fieldState.error]} />
                                        )}
                                    </Field>
                                )} />


                                <div className="flex w-full gap-4">
                                    <Controller name="eventAddress" control={form.control} render={({ field, fieldState }) => (
                                        <Field>
                                            <FieldLabel>Address</FieldLabel>
                                            <Input aria-invalid={fieldState.invalid} placeholder="Live-Concert" {...field} />
                                            {fieldState.invalid && (
                                                <FieldError errors={[fieldState.error]} />
                                            )}
                                        </Field>
                                    )} />
                                </div>
                            </FieldGroup>
                        </div>

                        {/* ------------------  TICKETS --------------- */}
                        <div className="bg-white p-6 shadow-md ">
                            <div className="flex items-center justify-between">
                                <div className="flex gap-2 items-center mb-4">
                                    <Ticket />
                                    <h3 className="text-2xl font-semibold text-slate-700">Tickets</h3>
                                </div>
                                <div>
                                    <Button onClick={handleAddTicketType} type="button">+ Add Ticket Type</Button>
                                </div>
                            </div>

                            {/* Ticket Type Components */}
                            {
                                ticketType.length > 0 ? ticketType.map((ticket, index) => (
                                    <div key={ticket.id} className="bg-slate-200/30 p-4 grid grid-cols-8 gap-2 border mb-6">
                                        <div className="col-span-6">
                                            <Field>
                                                <FieldLabel>Ticket Name</FieldLabel>
                                                <Input
                                                    placeholder="General Admission"
                                                    value={ticket.name}
                                                    onChange={(e) => {
                                                        const updated = [...ticketType];
                                                        updated[index].name = e.target.value;
                                                        setTicketType(updated);
                                                    }}
                                                />
                                            </Field>
                                        </div>
                                        <div>
                                            <Field>
                                                <FieldLabel>Price</FieldLabel>
                                                <Input
                                                    placeholder="2000"
                                                    value={ticket.price}
                                                    onChange={(e) => {
                                                        const updated = [...ticketType];
                                                        updated[index].price = e.target.value;
                                                        setTicketType(updated);
                                                    }}
                                                />
                                            </Field>
                                        </div>

                                        {/* WILL PUT QUANTITY LATER ON */}
                                        {/* <div>
                                            <Field>
                                                <FieldLabel>Quantity</FieldLabel>
                                                <Input
                                                    placeholder="200"
                                                    value={ticket.quantity}
                                                    onChange={(e) => {
                                                        const updated = [...ticketType];
                                                        updated[index].quantity = e.target.value;
                                                        setTicketType(updated);
                                                    }}
                                                />
                                            </Field>
                                        </div> */}

                                        <div>
                                            <Field>
                                                <FieldLabel>Delete</FieldLabel>
                                                <Button
                                                    variant="outline"
                                                    type="button"
                                                    onClick={() => handleRemoveTicketType(ticket.id)}
                                                >
                                                    <Trash className="text-red-400" size={20} />
                                                </Button>
                                            </Field>
                                        </div>
                                    </div>
                                )) :
                                    <div className="text-center">
                                        <span className="text-sm text-slate-500">You should have at least one ticket type</span>
                                    </div>
                            }
                        </div>
                    </div>


                </form>

            </div>
        </div>
    );
};

export default CreateEvent;
