"use client";

import EventCard from "@/components/EventCard";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import api from "@/lib/axios";
import { ChevronDownIcon } from "lucide-react";
import Link from "next/link";
import { useEffect, useState } from "react";

const EventPage = () => {
    const [open, setOpen] = useState(false);
    const [date, setDate] = useState(new Date());
    const [loading, setLoading] = useState(false);
    const [eventList, setEventList] = useState([]);

    const fetchEvents = async () => {
        setLoading(true)
        try {
            const { data } = await api.get("/events");
            setEventList(data)
        } catch (error) {
            console.error("Error fetching events:", error)
        } finally {
            setLoading(false)
        }
    }

    useEffect(() => {
        fetchEvents()
    }, [])

    return (
        <div className="max-w-7xl mx-auto flex gap-4">
            {/* LEFT SECTION */}
            <div className="w-[20%] p-4">
                <p className="text-lg">Filters</p>

                {/* RADIO GROUP */}
                <div className="">
                    <RadioGroup defaultValue="option-one">
                        <div className="flex items-center space-x-2">
                            <RadioGroupItem value="concerts" id="concerts" />
                            <Label htmlFor="option-one">Concerts</Label>
                        </div>
                        <div className="flex items-center space-x-2">
                            <RadioGroupItem value="option-two" id="option-two" />
                            <Label htmlFor="option-two">Sports</Label>
                        </div>
                        <div className="flex items-center space-x-2">
                            <RadioGroupItem value="option-two" id="option-two" />
                            <Label htmlFor="option-two">Theatre</Label>
                        </div>
                        <div className="flex items-center space-x-2">
                            <RadioGroupItem value="option-two" id="option-two" />
                            <Label htmlFor="option-two">Festivals</Label>
                        </div>
                    </RadioGroup>
                </div>

                {/* DATE PICKER | CALENDAR */}
                <div className="mt-8 space-y-2">
                    <Label htmlFor="date" className="px-1">
                        Date Range
                    </Label>
                    <Popover open={open} onOpenChange={setOpen}>
                        <PopoverTrigger asChild>
                            <Button
                                variant="outline"
                                id="date"
                                className="w-48 justify-between font-normal"
                            >
                                {date ? date.toLocaleDateString() : "Select date"}
                                <ChevronDownIcon />
                            </Button>
                        </PopoverTrigger>
                        <PopoverContent
                            className="w-auto overflow-hidden p-0"
                            align="start"
                        >
                            <Calendar
                                mode="single"
                                selected={date}
                                captionLayout="dropdown"
                                onSelect={(date) => {
                                    setDate(date);
                                    setOpen(false);
                                }}
                            />
                        </PopoverContent>
                    </Popover>
                </div>

                {/* LOCATION */}
                <div className=" mt-8 space-y-2">
                    <Label htmlFor="date" className="px-1">
                        Location
                    </Label>
                    <div className="flex border items-center">
                        <Input placeholder="Enter a city" className="border-none" />
                        {/* <Search size={25} className="bg-accent-foreground" /> */}
                    </div>
                </div>
            </div>

            {/* RIGHT SECTION */}
            <div className="w-[80%]">
                <div className="grid grid-cols-3 gap-4 pb-20">
                    {eventList.map((item) => (
                        <Link href={`/events/${item._id}`} key={item._id}>
                            <EventCard item={item} />
                        </Link>

                    ))}
                </div>

            </div>
        </div>
    );
};

export default EventPage;
