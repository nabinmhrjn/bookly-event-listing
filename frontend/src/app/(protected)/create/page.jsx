"use client";

import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { ChevronDownIcon, EditIcon, MapPin, Ticket, Clock, Upload, Trash } from "lucide-react";
import { useState } from "react";
import { Calendar } from "@/components/ui/calendar";
import api from "@/lib/axios";
import { toast } from "sonner"
import { Field, FieldError, FieldGroup, FieldLabel } from "@/components/ui/field";
import { Controller } from "react-hook-form";
import { Label } from "@/components/ui/label"

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
    ticketTypes: z.array(z.object({
        id: z.number().optional(),
        name: z.string().min(1, "Ticket name is required"),
        price: z.string().min(1, "Ticket price is required"),
        // quantity: z.string().optional()
    })).min(1, "At least one ticket type is required")

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
    const [imagePreview, setImagePreview] = useState(null);
    const [imageUploading, setImageUploading] = useState(false);

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
            ticketTypes: []
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
            formData.append('ticketTypes', JSON.stringify(ticketType));

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
            setTicketType([]);
            setImagePreview(null);

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
        const newTicket = { id: Date.now(), name: '', price: '', quantity: '' };
        const updated = [...ticketType, newTicket];
        setTicketType(updated);
        form.setValue('ticketTypes', updated);
    }

    return (
        <div className="pt-14 pb-16 bg-secondary">
            <div className="max-w-4xl mx-auto">
                <div className="mb-8">
                    <p className="text-2xl font-bold">Create New Event</p>
                    <p className="text-sm text-slate-600">
                        Fill in the details below to launch your new event listing
                    </p>
                </div>

                {/* FORM */}
                <form onSubmit={form.handleSubmit(handleSubmit)}>
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

                        {/* ------------------ DATE AND TIME --------------- */}
                        <div className="bg-white p-6 shadow-md">
                            <div className="flex gap-2 items-center mb-4">
                                <Clock />
                                <h3 className="text-2xl font-semibold text-slate-700">Date & Time</h3>
                            </div>
                            <FieldGroup>
                                <div className="flex gap-2">
                                    <Controller name="startDate" control={form.control} render={({ field, fieldState }) => (
                                        <Field>
                                            <FieldLabel>Event Date</FieldLabel>
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
                                                            ? parseDate(field.value)?.toLocaleDateString()
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
                                            {fieldState.invalid && (
                                                <FieldError errors={[fieldState.error]} />
                                            )}
                                        </Field>
                                    )} />
                                    <Controller name="startTime" control={form.control} render={({ field, fieldState }) => (
                                        <Field>
                                            <FieldLabel>Event Starts</FieldLabel>
                                            <Input
                                                type="time"
                                                aria-invalid={fieldState.invalid}
                                                {...field}
                                            />
                                            {fieldState.invalid && (
                                                <FieldError errors={[fieldState.error]} />
                                            )}
                                        </Field>
                                    )} />

                                </div>

                                <div className="flex gap-2">
                                    <Controller name="endDate" control={form.control} render={({ field, fieldState }) => (
                                        <Field>
                                            <FieldLabel>Event End Date</FieldLabel>
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
                                                            ? parseDate(field.value)?.toLocaleDateString()
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
                                                                setEndOpen(false);
                                                            }
                                                        }}
                                                    />
                                                </PopoverContent>
                                            </Popover>
                                            {fieldState.invalid && (
                                                <FieldError errors={[fieldState.error]} />
                                            )}
                                        </Field>
                                    )} />
                                    <Controller name="endTime" control={form.control} render={({ field, fieldState }) => (
                                        <Field>
                                            <FieldLabel>Event Ends</FieldLabel>
                                            <Input
                                                type="time"
                                                aria-invalid={fieldState.invalid}
                                                {...field}
                                            />
                                            {fieldState.invalid && (
                                                <FieldError errors={[fieldState.error]} />
                                            )}
                                        </Field>
                                    )} />
                                </div>
                            </FieldGroup>
                        </div>

                        {/* ------------------ EVENT FLYER --------------- */}
                        <div className="bg-white p-6 shadow-md">
                            <div className="flex gap-2 items-center mb-4">
                                <Upload />
                                <h3 className="text-2xl font-semibold text-slate-700">Event Flyer</h3>
                            </div>


                            <Controller name="eventImage" control={form.control} render={({ field: { value, onChange, ...field }, fieldState }) => (
                                <div className="mt-4">
                                    {/* Image Preview */}
                                    {imagePreview && (
                                        <div className="mb-4 relative">
                                            <div className="relative w-full h-[200px] overflow-hidden rounded-lg bg-slate-100">
                                                <img
                                                    src={imagePreview}
                                                    alt="Event flyer preview"
                                                    className="absolute w-full h-full object-cover"
                                                />
                                            </div>
                                            <div className="mt-2 flex items-center justify-between">
                                                <span className="text-sm text-slate-600">
                                                    {value?.name}
                                                </span>
                                                {imageUploading && (
                                                    <span className="text-sm text-blue-600">Uploading...</span>
                                                )}
                                            </div>
                                        </div>
                                    )}

                                    <Label htmlFor="event-flyer-upload" className="cursor-pointer">
                                        <div className="border border-dashed border-slate-300 rounded-lg p-2 hover:border-slate-400 transition-colors flex items-center justify-center gap-2 text-slate-600 hover:text-slate-700 w-full">
                                            <Upload className="w-5 h-5" />
                                            <span className="font-medium">{imagePreview ? 'Change Flyer' : 'Upload Flyer'}</span>
                                        </div>
                                    </Label>
                                    <Input
                                        id="event-flyer-upload"
                                        type="file"
                                        accept="image/jpeg,image/png,image/jpg"
                                        className="hidden"
                                        onChange={(e) => {
                                            const file = e.target.files?.[0];
                                            if (file) {
                                                setImageUploading(true);
                                                onChange(file);

                                                // Create preview
                                                const reader = new FileReader();
                                                reader.onloadend = () => {
                                                    setImagePreview(reader.result);
                                                    setImageUploading(false);
                                                };
                                                reader.readAsDataURL(file);
                                            }
                                        }}
                                        {...field}
                                    />
                                    {fieldState.invalid && (
                                        <FieldError errors={[fieldState.error]} />
                                    )}
                                </div>
                            )} />
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
                            <Controller
                                name="ticketTypes"
                                control={form.control}
                                render={({ field, fieldState }) => (
                                    <div>
                                        {ticketType.length > 0 ? ticketType.map((ticket, index) => {
                                            const nameError = form.formState.errors?.ticketTypes?.[index]?.name;
                                            const priceError = form.formState.errors?.ticketTypes?.[index]?.price;

                                            return (
                                                <FieldGroup key={ticket.id} className="bg-slate-200/30 p-4 grid grid-cols-8 gap-2 border mb-6">
                                                    <div className="col-span-6">
                                                        <Field>
                                                            <FieldLabel>Ticket Name</FieldLabel>
                                                            <Input
                                                                placeholder="General Admission"
                                                                value={ticket.name}
                                                                aria-invalid={!!nameError}
                                                                onChange={(e) => {
                                                                    const updated = [...ticketType];
                                                                    updated[index].name = e.target.value;
                                                                    setTicketType(updated);
                                                                    field.onChange(updated);
                                                                }}
                                                            />
                                                            {nameError && (
                                                                <p className="text-xs text-red-600 mt-1">
                                                                    {nameError.message}
                                                                </p>
                                                            )}
                                                        </Field>
                                                    </div>
                                                    <div>
                                                        <Field>
                                                            <FieldLabel>Price</FieldLabel>
                                                            <Input
                                                                type="number"
                                                                placeholder="2000"
                                                                value={ticket.price}
                                                                aria-invalid={!!priceError}
                                                                onChange={(e) => {
                                                                    const updated = [...ticketType];
                                                                    updated[index].price = e.target.value;
                                                                    setTicketType(updated);
                                                                    field.onChange(updated);
                                                                }}
                                                            />
                                                            {priceError && (
                                                                <p className="text-xs text-red-600 mt-1">
                                                                    {priceError.message}
                                                                </p>
                                                            )}
                                                        </Field>
                                                    </div>

                                                    <div>
                                                        <Field>
                                                            <FieldLabel>Delete</FieldLabel>
                                                            <Button
                                                                variant="outline"
                                                                type="button"
                                                                onClick={() => {
                                                                    const updated = ticketType.filter(item => item.id !== ticket.id);
                                                                    setTicketType(updated);
                                                                    field.onChange(updated);
                                                                }}
                                                            >
                                                                <Trash className="text-red-400" size={20} />
                                                            </Button>
                                                        </Field>
                                                    </div>
                                                </FieldGroup>
                                            )
                                        }) : (
                                            <div className="text-center py-8">
                                                <Ticket className="w-12 h-12 mx-auto mb-2 opacity-50 text-slate-400" />
                                                <span className="text-sm text-slate-500">Add ticket type to get started</span>
                                            </div>
                                        )}
                                        {fieldState.invalid && (
                                            <FieldError errors={[fieldState.error]} />
                                        )}
                                    </div>
                                )}
                            />
                        </div>

                        <div>
                            <Button type="submit" className="w-full" disabled={loading}>
                                {loading ? "Creating Event..." : "Create Event"}
                            </Button>
                        </div>
                    </div>


                </form>

            </div>
        </div>
    );
};

export default CreateEvent;
