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
import api from "@/lib/axios";
import { toast } from "sonner";

const formSchema = z.object({
    fullName: z.string().min(1, "Full name is required"),
    email: z.string().min(1, "Email address is required"),
    paymentMethod: z.string().min(1, "Payment method is required"),
})

const Checkout = () => {
    const router = useRouter();
    const [checkoutData, setCheckoutData] = useState(null);
    const [useMyInfo, setUseMyInfo] = useState(false);
    const [isSubmitting, setIsSubmitting] = useState(false);
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

    const handleSubmit = async (values) => {
        if (!user) {
            router.push("/login")
        } else {
            try {
                setIsSubmitting(true);

                const bookingData = {
                    ...values,
                    ticketType: checkoutData.selectedTicket?.name,
                    ticketQuantity: checkoutData.ticketQuantity,
                    totalPrice: checkoutData.totalPrice,
                    eventId: checkoutData.eventId,
                    eventName: checkoutData.eventName,
                };

                const response = await api.post('/bookings', bookingData);

                toast.success(response.data.message || "Booking created successfully!");

                // Clear checkout data from session storage
                sessionStorage.removeItem('checkoutData');

                // Redirect to bookings page or confirmation page
                setTimeout(() => {
                    router.push('/bookings');
                }, 1500);

            } catch (error) {
                console.error("Error creating booking:", error);
                const errorMessage = error.response?.data?.message || "Failed to create booking. Please try again.";
                toast.error(errorMessage);
                setIsSubmitting(false);
            }
        }
    }

    return (
        <div className="bg-secondary">
            <form onSubmit={form.handleSubmit(handleSubmit)}>
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8 flex flex-col lg:flex-row gap-6 lg:gap-8">
                    <div className="lg:flex-1 flex flex-col gap-4 sm:gap-6">
                        <div className="p-5 sm:p-6 bg-white rounded-lg space-y-4">
                            <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-3 sm:gap-0">
                                <span className="text-lg sm:text-xl font-semibold">Contact Information</span>
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

                        <div className="p-5 sm:p-6 bg-white rounded-lg space-y-4">
                            <div className="flex justify-between items-center">
                                <span className="text-lg sm:text-xl font-semibold">Payment Method</span>
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
                    </div>

                    <div className="lg:w-96 lg:shrink-0">
                        <div className="relative w-full h-48 sm:h-60 rounded-lg overflow-hidden">
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
                                <span className="text-white text-lg sm:text-xl font-semibold">{checkoutData.eventName}</span>
                            </div>
                        </div>
                        <div className="bg-white p-5 sm:p-6 rounded-lg space-y-4 mt-4 lg:mt-0 lg:rounded-t-none">
                            <div className="space-y-2">
                                <div className="flex gap-2">
                                    <Calendar1Icon size={20} className="shrink-0 mt-0.5" />
                                    <span className="text-sm">
                                        {formatDate(checkoutData.startDate)}, {formatTime(checkoutData.startTime)}
                                    </span>
                                </div>
                                <div className="flex gap-2">
                                    <MapPin size={20} className="shrink-0 mt-0.5" />
                                    <span className="text-sm">
                                        {checkoutData.eventVenue}, {checkoutData.eventAddress}
                                    </span>
                                </div>
                            </div>
                            <Separator />
                            <div className="space-y-2">
                                <div className="flex justify-between">
                                    <span className="text-sm">{checkoutData.ticketQuantity} x {checkoutData.selectedTicket?.name}</span>
                                    <span className="text-lg font-semibold">Rs.{checkoutData.totalPrice}</span>
                                </div>
                            </div>
                            <div>
                                <Button
                                    className="w-full"
                                    type="submit"
                                    disabled={isSubmitting}
                                >
                                    {isSubmitting
                                        ? "Creating Booking..."
                                        : user
                                            ? "Proceed To Payment"
                                            : "Login To Proceed"
                                    }
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