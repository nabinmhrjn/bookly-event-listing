"use client"

import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm, Controller } from "react-hook-form";
import { Calendar1Icon, MapPin } from "lucide-react";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import { Button } from "@/components/ui/button";
import Image from "next/image";
import { Separator } from "@/components/ui/separator";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group"
import { useAuth } from "@/context/AuthContext";

const formSchema = z.object({
    fullName: z.string().min(1, "Full name is required"),
    email: z.string().min(1, "Email address is required"),
    paymentMethod: z.string().min(1, "Payment method is required"),
})

const Checkout = () => {
    const router = useRouter();
    const [checkoutData, setCheckoutData] = useState(null);
    const [useMyInfo, setUseMyInfo] = useState(false);
    const { user } = useAuth();

    useEffect(() => {
        const data = sessionStorage.getItem('checkoutData');
        if (data) {
            setCheckoutData(JSON.parse(data));
        } else {
            router.push('/events');
        }
    }, [router]);

    const form = useForm({
        resolver: zodResolver(formSchema),
        defaultValues: {
            fullName: "",
            email: "",
            paymentMethod: ""
        }
    })

    // Auto-fill user information when checkbox is checked
    useEffect(() => {
        if (useMyInfo && user) {
            form.setValue('fullName', user.fullName || '');
            form.setValue('email', user.email || '');
        } else if (!useMyInfo) {
            // Clear fields when unchecked
            form.setValue('fullName', '');
            form.setValue('email', '');
        }
    }, [useMyInfo, user, form]);

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

    const handleSubmit = (values) => {
        if (!user) {
            router.push("/login")
        } else {
            const bookingData = {
                ...values,
                ticketType: checkoutData.selectedTicket?.name,
                ticketQuantity: checkoutData.ticketQuantity,
                totalPrice: checkoutData.totalPrice,
                eventId: checkoutData.eventId,
                eventName: checkoutData.eventName,
            };
            console.log("Booking Data:", bookingData);
        }
    }

    return (
        <div className="bg-secondary">
            <form onSubmit={form.handleSubmit(handleSubmit)}>
                <div className="max-w-7xl mx-auto py-8 flex gap-8">
                    <div className="w-[70%] flex flex-col gap-4">
                        <div className="p-5 bg-white space-y-4">
                            <div className="flex justify-between items-center">
                                <span className="text-xl font-semibold">Contact Information</span>
                                {user && (
                                    <div className="flex items-center gap-2">
                                        <Checkbox
                                            id="use-my-info"
                                            checked={useMyInfo}
                                            onCheckedChange={setUseMyInfo}
                                        />
                                        <Label htmlFor="use-my-info" className="text-sm font-normal cursor-pointer">
                                            Use my information
                                        </Label>
                                    </div>
                                )}
                            </div>
                            <div className="flex gap-4">
                                <div className="w-full">
                                    <Label>Full Name</Label>
                                    <Controller
                                        name="fullName"
                                        control={form.control}
                                        render={({ field, fieldState }) => (
                                            <>
                                                <Input {...field} placeholder="John Doe" />
                                                {fieldState.error && (
                                                    <span className="text-xs text-red-500">{fieldState.error.message}</span>
                                                )}
                                            </>
                                        )}
                                    />
                                </div>
                            </div>
                            <div className="flex gap-4">
                                <div className="w-full">
                                    <Label>Email</Label>
                                    <Controller
                                        name="email"
                                        control={form.control}
                                        render={({ field, fieldState }) => (
                                            <>
                                                <Input {...field} type="email" placeholder="john@example.com" />
                                                {fieldState.error && (
                                                    <span className="text-xs text-red-500">{fieldState.error.message}</span>
                                                )}
                                                {!fieldState.error && (
                                                    <span className="text-xs text-slate-500">Your tickets will be sent to this email address</span>
                                                )}
                                            </>
                                        )}
                                    />
                                </div>
                            </div>
                        </div>

                        <div className="p-5 bg-white space-y-4">
                            <div className="flex justify-between items-center">
                                <span className="text-xl font-semibold">Payment Method</span>
                            </div>
                            <Controller
                                name="paymentMethod"
                                control={form.control}
                                render={({ field, fieldState }) => (
                                    <>
                                        <ToggleGroup type="single" value={field.value} onValueChange={field.onChange}>
                                            <ToggleGroupItem value="esewa">Esewa</ToggleGroupItem>
                                            <ToggleGroupItem value="connectIPS">ConnectIPS</ToggleGroupItem>
                                            <ToggleGroupItem value="visa">VISA</ToggleGroupItem>
                                        </ToggleGroup>
                                        {fieldState.error && (
                                            <span className="text-xs text-red-500">{fieldState.error.message}</span>
                                        )}
                                    </>
                                )}
                            />
                        </div>

                        {/* <div className="p-5 bg-white space-y-4">
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
                    </div> */}
                    </div>

                    <div className="w-[30%]">
                        <div className="relative w-full h-60">
                            <Image
                                src={checkoutData.eventImage || "/test.jpeg"}
                                width={2000}
                                height={2000}
                                alt={checkoutData.eventName || "Event"}
                                className="absolute w-full h-full object-cover"
                                loading="eager"
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
                                <Button className="w-full" type="submit">
                                    {user ? "Proceed To Payment" : "Login To Proceed"}
                                </Button>
                            </div>
                        </div>
                    </div>
                </div>
            </form>
        </div>
    )
}

export default Checkout