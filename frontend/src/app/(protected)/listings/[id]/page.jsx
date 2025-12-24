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

const EventDetail = () => {
    const { id } = useParams()
    const eventId = id.split('%')[0];
    const [eventDetail, setEventDetail] = useState(null)
    const [startOpen, setStartOpen] = useState(false);
    const [endOpen, setEndOpen] = useState(false);
    const [startDate, setStartDate] = useState(null);

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


    function onSubmit() {
        console.log("YOoo")
    }




    return (
        <div className="bg-secondary">
            <div className="max-w-7xl mx-auto py-12">
                <div className="flex items-center justify-between pb-4">
                    <div className="flex flex-col">
                        <span className="text-3xl font-semibold">Edit Event</span>
                        <span className="text-sm text-slate-700">Update the details for </span>
                    </div>
                    <div className="flex gap-2">
                        {/* <Button>Cancel</Button> */}
                        <Button>Save Changes</Button>
                    </div>
                </div>

                <form onSubmit={form.handleSubmit(onSubmit)}>
                    <div className="flex gap-6">
                        <div className="w-[70%] space-y-6">
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


                                    <div className="flex w-full gap-4">
                                        <div className="w-1/2">
                                            <Controller name="eventCategory" control={form.control} render={({ field, fieldState }) => (
                                                <Field>
                                                    <FieldLabel>Event Category</FieldLabel>
                                                    <Input aria-invalid={fieldState.invalid} placeholder="Live-Concert" {...field} />
                                                    {fieldState.invalid && (
                                                        <FieldError errors={[fieldState.error]} />
                                                    )}
                                                </Field>
                                            )} />
                                        </div>
                                        <div className="w-1/2">
                                            <Controller name="eventCapacity" control={form.control} render={({ field, fieldState }) => (
                                                <Field>
                                                    <FieldLabel>Event Capacity</FieldLabel>
                                                    <Input aria-invalid={fieldState.invalid} placeholder="500" {...field} />
                                                    {fieldState.invalid && (
                                                        <FieldError errors={[fieldState.error]} />
                                                    )}
                                                </Field>
                                            )} />
                                        </div>
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
                            <div className="bg-white p-6 shadow-md">
                                <div className="flex items-center justify-between">
                                    <div className="flex gap-2 items-center mb-4">
                                        <Ticket />
                                        <h3 className="text-2xl font-semibold text-slate-700">Tickets</h3>
                                    </div>
                                    <div>
                                        <Button>+ Add Ticket Type</Button>
                                    </div>
                                </div>


                                <div className="bg-slate-200/30 p-4 grid grid-cols-8 gap-2 border mb-6">
                                    <div className="col-span-5">
                                        <Controller name="ticketName" control={form.control} render={({ field, fieldState }) => (
                                            <Field>
                                                <FieldLabel>Ticket Name</FieldLabel>
                                                <Input aria-invalid={fieldState.invalid} placeholder="General Admission" {...field} />
                                                {fieldState.invalid && (
                                                    <FieldError errors={[fieldState.error]} />
                                                )}
                                            </Field>
                                        )} />
                                    </div>
                                    <div className="">
                                        <Controller name="ticketPrice" control={form.control} render={({ field, fieldState }) => (
                                            <Field>
                                                <FieldLabel>Price</FieldLabel>
                                                <Input aria-invalid={fieldState.invalid} placeholder="2000" {...field} />
                                                {fieldState.invalid && (
                                                    <FieldError errors={[fieldState.error]} />
                                                )}
                                            </Field>
                                        )} />
                                    </div>
                                    <div className="">
                                        <Controller name="ticketQuantity" control={form.control} render={({ field, fieldState }) => (
                                            <Field>
                                                <FieldLabel>Quantity</FieldLabel>
                                                <Input aria-invalid={fieldState.invalid} placeholder="200" {...field} />
                                                {fieldState.invalid && (
                                                    <FieldError errors={[fieldState.error]} />
                                                )}
                                            </Field>
                                        )} />
                                    </div>
                                    <div className="">
                                        <Controller name="ticketQuantity" control={form.control} render={({ field, fieldState }) => (
                                            <Field>
                                                <FieldLabel>Delete</FieldLabel>
                                                <Button variant="outline">
                                                    <Trash className="text-slate-400" />
                                                </Button>
                                            </Field>
                                        )} />
                                    </div>

                                </div>
                            </div>
                        </div>


                        <div className="w-[30%] space-y-6">
                            {/* ------------------ PUBLICATION STATUS --------------- */}
                            <div className="bg-white p-6 shadow-md">
                                <div className="flex justify-between pb-4">
                                    <span className="font-semibold">Publication Status</span>
                                    <Badge variant="outline">Pending</Badge>
                                </div>
                                <Separator />
                                <Button className="w-full mt-4">Delete Event</Button>
                            </div>

                            {/* ------------------ DATE AND TIME --------------- */}
                            <div className="bg-white p-6 shadow-md">
                                <div className="flex gap-2 items-center mb-4">
                                    <Clock />
                                    <h3 className="text-2xl font-semibold text-slate-700">Date & Time</h3>
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
                            <div className="bg-white p-6 shadow-md">
                                <div className="flex gap-2 items-center mb-4">
                                    <Upload />
                                    <h3 className="text-2xl font-semibold text-slate-700">Event Flyer</h3>
                                </div>
                                <div className="relative w-full h-[200px] overflow-hidden rounded-[5px] bg-slate-100">
                                    {eventDetail?.eventImage ? (
                                        <Image
                                            src={eventDetail.eventImage}
                                            width={500}
                                            height={200}
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

                </form>
            </div>

        </div>
    )
}

export default EventDetail