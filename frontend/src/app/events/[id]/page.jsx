"use client";

import api from "@/lib/axios";
import { LoaderIcon } from "lucide-react";
import Image from "next/image";
import { useParams } from "next/navigation";
import { useEffect, useState } from "react";
import { Badge } from "@/components/ui/badge"
import { Label } from "@/components/ui/label"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Separator } from "@/components/ui/separator"
import { Button } from "@/components/ui/button";

const EventDetailPage = () => {
    const [eventDetail, setEventDetail] = useState(null);
    const [ticketQty, setTicketQty] = useState(1)
    const [totalPrice, setTotalPrice] = useState(0)
    const [selectedTicket, setSelectedTicket] = useState("generalTicket")
    const [loading, setLoading] = useState(false);
    const { id } = useParams();

    useEffect(() => {
        const fetchEventById = async () => {
            setLoading(true);
            try {
                const { data } = await api.get(`/events/${id}`);
                setEventDetail(data);
            } catch (error) {
                console.error("Error fetching event", error);
            } finally {
                setLoading(false);
            }
        };
        fetchEventById();
    }, [id]);

    useEffect(() => {
        if (eventDetail) {
            const ticketPrice = selectedTicket === "generalTicket"
                ? Number(eventDetail.generalTicket)
                : Number(eventDetail.vipTicket);

            setTotalPrice(ticketPrice * ticketQty);
        }
    }, [selectedTicket, ticketQty, eventDetail]);

    const handleCounter = (action) => {
        if (action === "add") {
            setTicketQty(prev => prev + 1)
        } else if (action === "subtract" && ticketQty > 1) {
            setTicketQty(prev => prev - 1)
        }
    }

    const handleSelectedTicket = (ticketType) => {
        setSelectedTicket(ticketType);
    }

    if (loading) {
        return (
            <div className="min-h-screen bg-base-200 flex items-center justify-center">
                <LoaderIcon className="animate-spin size-10" />
            </div>
        )
    };

    return (
        <div className="bg-secondary">
            <div className="max-w-7xl mx-auto">
                <div className="py-8">

                    <h3 className="text-4xl font-semibold">{eventDetail?.eventName}</h3>
                </div>
                <div className="relative w-full h-[400px]">
                    <Image
                        src={eventDetail?.eventImage || "/test.jpeg"}
                        width={2000}
                        height={2000}
                        alt={eventDetail?.eventName || "Event image"}
                        className="absolute w-full h-full object-cover"
                    />
                    <div className="absolute w-full h-full bg-black/20 z-10"></div>
                </div>
                <div className="flex gap-8 py-8">
                    <div className="w-[75%] bg-white p-8">
                        <div>
                            <span className="text-2xl font-semibold">About the Event</span>
                            <p className="text-slate-600 mt-2">{eventDetail?.eventDescription}</p>
                        </div>
                    </div>

                    <div className="w-[25%]">
                        <div className="p-6 bg-white shadow-md space-y-4">
                            <div>
                                <div className="flex w-full items-center justify-between">
                                    <span className="text-sm font-semibold text-slate-700">Starting from</span>
                                    <Badge className="bg-red-100 text-red-500">Selling fast</Badge>
                                </div>
                                <span className="text-2xl font-bold">Rs.{eventDetail?.generalTicket}</span>
                            </div>

                            <div>
                                <span className="text-sm font-semibold text-slate-700">Ticket Type</span>
                                <RadioGroup defaultValue="general">
                                    <Label onClick={() => handleSelectedTicket("generalTicket")} htmlFor="general" className="flex justify-between items-start space-x-2 bg-slate-100 p-4 border">
                                        <div className="flex gap-2">
                                            <RadioGroupItem value="general" id="general" />
                                            <Label htmlFor="general">General Admission</Label>
                                        </div>
                                        <Label htmlFor="general">Rs.{eventDetail?.generalTicket}</Label>
                                    </Label>

                                    <Label onClick={() => handleSelectedTicket("vipTicket")} htmlFor="vip" className="flex justify-between items-start space-x-2 bg-slate-100 p-4 border">
                                        <div className="flex gap-2">
                                            <RadioGroupItem value="vip" id="vip" />
                                            <Label htmlFor="vip">VIP Pass</Label>
                                        </div>
                                        <Label htmlFor="vip">Rs.{eventDetail?.vipTicket}</Label>
                                    </Label>
                                </RadioGroup>
                            </div>

                            <div className="flex items-center justify-between">
                                <span className="text-sm font-semibold">Quantity</span>
                                <div className="flex items-center">
                                    <Button
                                        variant="secondary"
                                        onClick={() => handleCounter("subtract")}
                                        disabled={ticketQty <= 1}
                                        className="w-8 h-8 rounded-full border flex items-center justify-center font-semibold cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
                                    >
                                        -
                                    </Button>

                                    <span className="w-8 h-8 flex items-center justify-center font-semibold">{ticketQty}</span>

                                    <Button variant="secondary" onClick={() => handleCounter("add")} className="w-8 h-8 rounded-full border flex items-center justify-center font-semibold cursor-pointer">+</Button>
                                </div>
                            </div>

                            <Separator />

                            <div className="flex items-center justify-between">
                                <span className="text-sm font-semibold">Total Price</span>
                                <span className="text-xl font-bold">Rs.{totalPrice}</span>
                            </div>



                            <Button size="lg" className="w-full cursor-pointer">Book Ticket</Button>


                        </div>
                    </div>
                </div>
            </div>
        </div >
    );
};

export default EventDetailPage;
