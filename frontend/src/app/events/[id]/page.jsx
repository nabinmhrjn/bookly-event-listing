"use client";

import api from "@/lib/axios";
import { LoaderIcon } from "lucide-react";
import Image from "next/image";
import { useParams, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { Badge } from "@/components/ui/badge"
import { Label } from "@/components/ui/label"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Separator } from "@/components/ui/separator"
import { Button } from "@/components/ui/button";

const EventDetailPage = () => {
    const router = useRouter();
    const [eventDetail, setEventDetail] = useState(null);
    const [ticketQty, setTicketQty] = useState(1)
    const [totalPrice, setTotalPrice] = useState(0)
    const [selectedTicketIndex, setSelectedTicketIndex] = useState(0);
    const [loading, setLoading] = useState(false);
    const { id } = useParams();

    useEffect(() => {
        const fetchEventById = async () => {
            setLoading(true);
            try {
                const { data } = await api.get(`/events/${id}`);
                setEventDetail(data);
                // set initial price based on first ticket type
                if (data?.ticketTypes?.length > 0) {
                    setTotalPrice(Number(data.ticketTypes[0].price) * ticketQty);
                }
            } catch (error) {
                console.error("Error fetching event", error);
            } finally {
                setLoading(false);
            }
        };
        fetchEventById();
    }, [id]);

    useEffect(() => {
        if (eventDetail?.ticketTypes?.[selectedTicketIndex]) {
            const ticketPrice = Number(eventDetail.ticketTypes[selectedTicketIndex].price);
            setTotalPrice(ticketPrice * ticketQty);
        }
    }, [selectedTicketIndex, ticketQty, eventDetail]);

    const handleCounter = (action) => {
        if (action === "add") {
            setTicketQty(prev => prev + 1)
        } else if (action === "subtract" && ticketQty > 1) {
            setTicketQty(prev => prev - 1)
        }
    }

    const handleSelectedTicket = (index) => {
        setSelectedTicketIndex(index);
    }

    const handleCheckout = () => {
        const checkoutData = {
            eventId: id,
            eventName: eventDetail?.eventName,
            eventImage: eventDetail?.eventImage,
            eventVenue: eventDetail?.eventVenue,
            eventAddress: eventDetail?.eventAddress,
            startDate: eventDetail?.startDate,
            startTime: eventDetail?.startTime,
            selectedTicket: eventDetail?.ticketTypes[selectedTicketIndex],
            ticketQuantity: ticketQty,
            totalPrice: totalPrice
        };
        sessionStorage.setItem('checkoutData', JSON.stringify(checkoutData));
        router.push(`/events/${id}/checkout`);
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
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="py-6 sm:py-8">
                    <h3 className="text-2xl sm:text-3xl lg:text-4xl font-semibold">{eventDetail?.eventName}</h3>
                </div>
                <div className="relative w-full h-[250px] sm:h-[300px] md:h-[350px] lg:h-[400px]">
                    <Image
                        src={eventDetail?.eventImage || "/test.jpeg"}
                        width={2000}
                        height={2000}
                        loading="eager"
                        alt={eventDetail?.eventName || "Event image"}
                        className="absolute w-full h-full object-cover rounded-lg"
                    />
                    <div className="absolute w-full h-full bg-black/20 z-10 rounded-lg"></div>
                </div>
                <div className="flex flex-col lg:flex-row gap-6 lg:gap-8 py-6 sm:py-8">
                    <div className="lg:flex-1 bg-white p-6 sm:p-8 rounded-lg">
                        <div>
                            <span className="text-xl sm:text-2xl font-semibold">About the Event</span>
                            <p className="text-slate-600 mt-3 sm:mt-4 leading-relaxed">{eventDetail?.eventDescription}</p>
                        </div>
                    </div>

                    <div className="lg:w-80 lg:shrink-0">
                        <div className="p-6 bg-white shadow-md rounded-lg space-y-4 sticky top-4">
                            <div>
                                <span className="text-lg sm:text-xl font-semibold text-slate-700">Ticket Type</span>
                                <RadioGroup value={selectedTicketIndex.toString()} onValueChange={(value) => handleSelectedTicket(Number(value))}>
                                    {eventDetail?.ticketTypes?.map((ticket, index) => (
                                        <Label
                                            key={index}
                                            htmlFor={`ticket-${index}`}
                                            className="flex justify-between items-start space-x-2 bg-slate-100 p-3 sm:p-4 border cursor-pointer hover:bg-slate-200 transition-colors rounded-md mt-2"
                                        >
                                            <div className="flex gap-2">
                                                <RadioGroupItem value={index.toString()} id={`ticket-${index}`} />
                                                <Label htmlFor={`ticket-${index}`} className="cursor-pointer">{ticket.name}</Label>
                                            </div>
                                            <Label htmlFor={`ticket-${index}`} className="cursor-pointer font-semibold">Rs.{ticket.price}</Label>
                                        </Label>
                                    ))}
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

                            <Button size="lg" className="w-full cursor-pointer" onClick={handleCheckout}>Book Ticket</Button>


                        </div>
                    </div>
                </div>
            </div>
        </div >
    );
};

export default EventDetailPage;
