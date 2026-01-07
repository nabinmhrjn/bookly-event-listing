"use client"

import Image from "next/image"
import api from "@/lib/axios"
import { useEffect, useState } from "react"
import { useParams } from "next/navigation"
import { zodResolver } from "@hookform/resolvers/zod";
import { Controller, useForm } from "react-hook-form";
import eventFormSchema from "@/lib/eventFormSchema"
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Calendar } from "@/components/ui/calendar";
import { Separator } from "@/components/ui/separator"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Field, FieldError, FieldGroup, FieldLabel } from "@/components/ui/field";
import { Clock, EditIcon, ChevronDownIcon, MapPin, Ticket, DeleteIcon, RecycleIcon, LucideDelete, Trash, PictureInPicture, Upload } from "lucide-react"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { toast } from "sonner"

const EventDetail = () => {
    const { id } = useParams()
    const eventId = id.split('%')[0];
    const [eventDetail, setEventDetail] = useState(null)
    const [startOpen, setStartOpen] = useState(false);
    const [endOpen, setEndOpen] = useState(false);
    const [startDate, setStartDate] = useState(null);
    const [ticketTypeList, setTicketTypeList] = useState([])
    const [imagePreview, setImagePreview] = useState(null)
    const [ticketTypesChanged, setTicketTypesChanged] = useState(false)
    const [isUpdating, setIsUpdating] = useState(false)

    const form = useForm({
        resolver: zodResolver(eventFormSchema),
        defaultValues: {
            eventName: "",
            eventCategory: "",
            eventDescription: "",
            eventVenue: "",
            eventAddress: "",
            startDate: "",
            startTime: "",
            endDate: "",
            endTime: "",
            eventImage: ""
        }
    })

    // Helper to parse date string
    const parseDate = (dateString) => {
        if (!dateString) return undefined;

        // Handle ISO datetime format (e.g., "2024-12-25T00:00:00.000Z")
        if (dateString.includes('T')) {
            return new Date(dateString);
        }

        // Handle YYYY-MM-DD format
        const [year, month, day] = dateString.split('-').map(Number);
        return new Date(year, month - 1, day);
    };

    const formatDate = (date) => {
        const year = date.getFullYear();
        const month = String(date.getMonth() + 1).padStart(2, '0');
        const day = String(date.getDate()).padStart(2, '0');
        return `${year}-${month}-${day}`;
    };

    useEffect(() => {
        const fetchEvent = async () => {
            try {
                const response = await api.get(`/events/${eventId}`)
                setEventDetail(response.data)

                // Set the start date state for the calendar
                if (response.data?.startDate) {
                    setStartDate(parseDate(response.data.startDate));
                }

                // Set ticket types from API response
                if (response.data?.ticketTypes && Array.isArray(response.data.ticketTypes)) {
                    const formattedTickets = response.data.ticketTypes.map((ticket, index) => ({
                        id: index,
                        name: ticket.name || '',
                        price: ticket.price || '',
                    }));
                    setTicketTypeList(formattedTickets);
                }

                form.reset({
                    eventName: response.data?.eventName || "",
                    eventCategory: response.data?.eventCategory || "",
                    eventDescription: response.data?.eventDescription || "",
                    eventVenue: response.data?.eventVenue || "",
                    eventAddress: response.data?.eventAddress || "",
                    startDate: response.data?.startDate || "",
                    startTime: response.data?.startTime || "",
                    endDate: response.data?.endDate || "",
                    endTime: response.data?.endTime || "",
                    eventImage: response.data?.eventImage || ""
                });
            } catch (error) {
                console.error("Error fetching event", error)
            }
        }

        fetchEvent();
    }, [eventId])

    const onSubmit = async (values) => {
        try {
            setIsUpdating(true);

            const cleanedTicketTypes = ticketTypeList.map(({ name, price }) => ({
                name,
                price
            }));

            // Check if a new image file was selected
            const hasNewImage = values.eventImage instanceof File;

            let response;

            if (hasNewImage) {
                // If new image is selected, send as FormData
                const formData = new FormData();
                formData.append('eventName', values.eventName);
                formData.append('eventCategory', values.eventCategory);
                formData.append('eventDescription', values.eventDescription);
                formData.append('eventVenue', values.eventVenue);
                formData.append('eventAddress', values.eventAddress);
                formData.append('startDate', values.startDate);
                formData.append('startTime', values.startTime);
                formData.append('endDate', values.endDate);
                formData.append('endTime', values.endTime);
                formData.append('eventImage', values.eventImage);
                formData.append('ticketTypes', JSON.stringify(cleanedTicketTypes));

                response = await api.put(`/events/${eventId}`, formData, {
                    headers: {
                        'Content-Type': 'multipart/form-data'
                    }
                });
            } else {
                // If no new image, send as JSON (keep existing image URL)
                const jsonData = {
                    ...values,
                    ticketTypes: cleanedTicketTypes
                };

                response = await api.put(`/events/${eventId}`, jsonData);
            }

            toast.success(response.data.message || "Event update successful");

            setTimeout(() => {
                window.location.reload();
            }, 1000);
        } catch (error) {
            console.error("Error updating event:", error);
            const errorMessage = error.response?.data?.message || "Failed to update event. Please try again.";
            toast.error(errorMessage)
            setIsUpdating(false);
        }
    }

    const handleAddTicketType = () => {
        const newTicket = {
            name: '',
            price: ''
        };
        setTicketTypeList([...ticketTypeList, newTicket]);
        setTicketTypesChanged(true);
    }

    return (
        <div className="bg-secondary">
            <div className="max-w-7xl mx-auto py-6 md:py-12 px-4 md:px-6">
                <div className="flex items-center justify-between pb-4">
                    <div className="flex flex-col">
                        <span className="text-2xl md:text-3xl font-semibold">Edit Event</span>
                        <span className="text-sm text-slate-700">Update the details for {eventDetail?.eventName} </span>
                    </div>

                </div>

                <form onSubmit={form.handleSubmit(onSubmit)}>
                    <div className="flex flex-col lg:flex-row gap-6">
                        <div className="w-full lg:w-[70%] space-y-6">
                            {/* ------------------ EVENT DETAILS --------------- */}
                            <div className="bg-white p-4 md:p-6 shadow-sm">
                                <div className="flex gap-2 items-center mb-4">
                                    <EditIcon />
                                    <h3 className="text-xl md:text-2xl font-semibold text-slate-700">Event Details</h3>
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


                                    <div className="flex w-full flex-col sm:flex-row gap-4">
                                        <div className="w-full sm:w-1/2">
                                            <Controller name="eventCategory" control={form.control} render={({ field, fieldState }) => (
                                                <Field>
                                                    <FieldLabel>Event Category</FieldLabel>
                                                    {/* <Input aria-invalid={fieldState.invalid} placeholder="Live-Concert" {...field} /> */}
                                                    <Select value={field.value} onValueChange={field.onChange} {...field}>
                                                        <SelectTrigger className="w-full">
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
                                        {/* <div className="w-1/2">
                                            <Controller name="eventCapacity" control={form.control} render={({ field, fieldState }) => (
                                                <Field>
                                                    <FieldLabel>Event Capacity</FieldLabel>
                                                    <Input aria-invalid={fieldState.invalid} placeholder="500" {...field} />
                                                    {fieldState.invalid && (
                                                        <FieldError errors={[fieldState.error]} />
                                                    )}
                                                </Field>
                                            )} />
                                        </div> */}
                                    </div>

                                    <Controller name="eventDescription" control={form.control} render={({ field, fieldState }) => (
                                        <Field>
                                            <FieldLabel>Event Description</FieldLabel>
                                            <Input aria-invalid={fieldState.invalid} placeholder="John Doe" {...field} />
                                            {fieldState.invalid && (
                                                <FieldError errors={[fieldState.error]} />
                                            )}

                                        </Field>
                                    )} />

                                </FieldGroup>
                            </div>

                            {/* ------------------  LOCATION --------------- */}
                            <div className="bg-white p-4 md:p-6 shadow-md">
                                <div className="flex gap-2 items-center mb-4">
                                    <MapPin />
                                    <h3 className="text-xl md:text-2xl font-semibold text-slate-700">Location</h3>
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
                            <div className="bg-white p-4 md:p-6 shadow-md">
                                <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                                    <div className="flex gap-2 items-center mb-4">
                                        <Ticket />
                                        <h3 className="text-xl md:text-2xl font-semibold text-slate-700">Tickets</h3>
                                    </div>
                                    <div>
                                        <Button type="button" onClick={handleAddTicketType} className="w-full sm:w-auto">+ Add Ticket Type</Button>
                                    </div>
                                </div>


                                {ticketTypeList.length > 0 ? ticketTypeList.map((ticket, index) => (
                                    <div key={index} className="bg-slate-200/30 p-4 grid grid-cols-1 md:grid-cols-8 gap-2 border mb-6">
                                        <div className="col-span-1 md:col-span-5">
                                            <Field>
                                                <FieldLabel>Ticket Name</FieldLabel>
                                                <Input
                                                    value={ticket.name}
                                                    onChange={(e) => {
                                                        const updated = [...ticketTypeList];
                                                        updated[index].name = e.target.value;
                                                        setTicketTypeList(updated);
                                                        setTicketTypesChanged(true);
                                                    }}
                                                    placeholder="General Admission"
                                                />
                                            </Field>
                                        </div>
                                        <div className="col-span-1 md:col-span-2">
                                            <Field>
                                                <FieldLabel>Price</FieldLabel>
                                                <Input
                                                    type="number"
                                                    value={ticket.price}
                                                    onChange={(e) => {
                                                        const updated = [...ticketTypeList];
                                                        updated[index].price = e.target.value;
                                                        setTicketTypeList(updated);
                                                        setTicketTypesChanged(true);
                                                    }}
                                                    placeholder="2000"
                                                />
                                            </Field>
                                        </div>
                                        <div>
                                            <Field>
                                                <FieldLabel>Delete</FieldLabel>
                                                <Button
                                                    type="button"
                                                    variant="outline"
                                                    onClick={() => {
                                                        const updated = ticketTypeList.filter(t => t.id !== ticket.id);
                                                        setTicketTypeList(updated);
                                                        setTicketTypesChanged(true);
                                                    }}
                                                >
                                                    <Trash className="text-red-400" />
                                                </Button>
                                            </Field>
                                        </div>
                                    </div>
                                )) : (
                                    <div className="text-center py-8 text-slate-500">
                                        <Ticket className="w-12 h-12 mx-auto mb-2 opacity-50" />
                                        <span className="text-sm">No ticket types added yet</span>
                                    </div>
                                )}
                            </div>
                        </div>

                        <div className="w-full lg:w-[30%] space-y-6">
                            {/* ------------------ PUBLICATION STATUS --------------- */}
                            <div className="bg-white p-4 md:p-6 shadow-md">
                                <div className="flex justify-between pb-4">
                                    <span className="font-semibold">Publication Status</span>
                                    <Badge variant="outline">Pending</Badge>
                                </div>
                                <Separator />
                                <Button type="button" className="w-full mt-4">Delete Event</Button>
                            </div>

                            {/* ------------------ DATE AND TIME --------------- */}
                            <div className="bg-white p-4 md:p-6 shadow-md">
                                <div className="flex gap-2 items-center mb-4">
                                    <Clock />
                                    <h3 className="text-xl md:text-2xl font-semibold text-slate-700">Date & Time</h3>
                                </div>
                                <FieldGroup>
                                    <div className="flex gap-2">
                                        <Controller name="startDate" control={form.control} render={({ field }) => (
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

                                    <div className="flex gap-2 mt-4">
                                        <Controller name="endDate" control={form.control} render={({ field }) => (
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
                            <div className="bg-white p-4 md:p-6 shadow-md">
                                <div className="flex gap-2 items-center mb-4">
                                    <Upload />
                                    <h3 className="text-xl md:text-2xl font-semibold text-slate-700">Event Flyer</h3>
                                </div>
                                <div className="relative w-full h-[200px] overflow-hidden rounded-[5px] bg-slate-100">
                                    {imagePreview || eventDetail?.eventImage ? (
                                        <Image
                                            src={imagePreview || eventDetail.eventImage}
                                            width={500}
                                            height={500}
                                            alt={eventDetail.eventName || "Event image"}
                                            loading="eager"
                                            className="absolute w-full h-full object-cover"
                                        />
                                    ) : (
                                        <div className="flex items-center justify-center h-full text-slate-400">
                                            <Upload className="w-12 h-12" />
                                        </div>
                                    )}
                                </div>

                                <Controller name="eventImage" control={form.control} render={({ field: { value, onChange, ...field }, fieldState }) => (
                                    <div className="mt-4">
                                        <Label htmlFor="event-flyer-upload" className="cursor-pointer">
                                            <div className="border border-dashed border-slate-300 rounded-lg p-2 hover:border-slate-400 transition-colors flex items-center justify-center gap-2 text-slate-600 hover:text-slate-700">
                                                <Upload className="w-5 h-5" />
                                                <span className="font-medium">Change Flyer</span>
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
                                                    onChange(file);
                                                    const previewUrl = URL.createObjectURL(file);
                                                    setImagePreview(previewUrl);
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
                        </div>
                    </div>
                    <div className="flex gap-2 mt-4">
                        {/* <Button>Cancel</Button> */}
                        <Button
                            type="submit"
                            disabled={isUpdating || (!form.formState.isDirty && !ticketTypesChanged)}
                        >
                            {isUpdating ? 'Updating...' : 'Save Changes'}
                        </Button>
                    </div>
                </form>
            </div>

        </div>
    )
}

export default EventDetail