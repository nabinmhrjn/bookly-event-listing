"use client"

import { Calendar1Icon, MapPin } from "lucide-react";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import Image from "next/image";
import { Separator } from "@/components/ui/separator";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

const Checkout = () => {
    const router = useRouter();
    const [checkoutData, setCheckoutData] = useState(null);

    useEffect(() => {
        const data = sessionStorage.getItem('checkoutData');
        if (data) {
            setCheckoutData(JSON.parse(data));
        } else {
            router.push('/events');
        }
    }, [router]);

    const formatDate = (dateString) => {
        if (!dateString) return '';
        const date = new Date(dateString);
        return date.toLocaleDateString('en-US', {
            weekday: 'short',
            year: 'numeric',
            month: 'long',
            day: 'numeric'
        });
    };


    const formatTime = (timeString) => {
        if (!timeString) return '';
        return timeString;
    };

    if (!checkoutData) {
        return (
            <div className="min-h-screen bg-secondary flex items-center justify-center">
                <p>Loading checkout...</p>
            </div>
        );
    }

    return (
        <div className="bg-secondary">
            <div className="max-w-7xl mx-auto py-8 flex gap-8">
                <div className="w-[70%] flex flex-col gap-4">
                    <div className="p-5 bg-white space-y-4">
                        <div className="flex justify-between items-center">
                            <span className="text-xl font-semibold">Contact Information</span>
                        </div>
                        <div className="flex gap-4">
                            <div className="w-1/2">
                                <Label>First Name</Label>
                                <Input />
                            </div>
                            <div className="w-1/2">
                                <Label>Last Name</Label>
                                <Input />
                            </div>
                        </div>
                        <div className="flex gap-4">
                            <div className="w-full">
                                <Label>Email</Label>
                                <Input />
                                <span className="text-xs text-slate-500">Your tickets will be sent to this email address</span>
                            </div>
                        </div>
                    </div>

                    <div className="p-5 bg-white space-y-4">
                        <div className="flex justify-between items-center">
                            <span className="text-xl font-semibold">Payment Method</span>
                        </div>
                        <div className="flex gap-4">
                            <Button variant="outline">Esewa</Button>
                            <Button variant="outline">Khalti</Button>
                            <Button variant="outline">Fonepay</Button>
                        </div>
                    </div>

                    <div className="p-5 bg-white space-y-4">
                        <div className="flex justify-between items-center">
                            <span className="text-xl font-semibold">Billing Address</span>
                        </div>
                        <div className="flex gap-4">
                            <div className="w-full">
                                <Label>Street Address</Label>
                                <Input />
                            </div>
                        </div>
                        <div className="flex gap-4">
                            <div className="w-1/2">
                                <Label>City</Label>
                                <Input />
                            </div>
                            <div className="w-1/2">
                                <Label>Postal Code</Label>
                                <Input />
                            </div>
                        </div>
                    </div>
                </div>

                <div className="w-[30%]">
                    <div className="relative w-full h-60">
                        <Image
                            src={checkoutData.eventImage || "/test.jpeg"}
                            width={2000}
                            height={2000}
                            alt={checkoutData.eventName || "Event"}
                            className="absolute w-full h-full object-cover"
                        />
                        <div className="absolute w-full h-full bg-black/30 z-10"></div>
                        <div className="absolute w-full h-full z-20 p-5 flex items-end justify-start">
                            <span className="text-white text-xl font-semibold">{checkoutData.eventName}</span>
                        </div>
                    </div>
                    <div className="bg-white p-5 space-y-4">
                        <div className="space-y-2">
                            <div className="flex gap-2">
                                <Calendar1Icon size={20} />
                                <span className="text-sm">
                                    {formatDate(checkoutData.startDate)}, {formatTime(checkoutData.startTime)}
                                </span>
                            </div>
                            <div className="flex gap-2">
                                <MapPin size={20} />
                                <span className="text-sm">
                                    {checkoutData.eventVenue}, {checkoutData.eventAddress}
                                </span>
                            </div>
                        </div>
                        <Separator />
                        <div className="space-y-2">
                            <div className="flex justify-between">
                                <span>{checkoutData.ticketQuantity} x {checkoutData.selectedTicket?.name}</span>
                                <span className="text-lg font-semibold">Rs.{checkoutData.totalPrice}</span>
                            </div>
                        </div>
                        <div>
                            <Button className="w-full">Proceed to Payment</Button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default Checkout