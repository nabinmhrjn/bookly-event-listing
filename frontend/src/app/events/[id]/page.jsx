"use client";

import api from "@/lib/axios";
import { LoaderIcon } from "lucide-react";
import Image from "next/image";
import { useParams } from "next/navigation";
import { useEffect, useState } from "react";

const EventDetailPage = () => {
    const [eventDetail, setEventDetail] = useState(null);
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

    if (loading) {
        return (
            <div className="min-h-screen bg-base-200 flex items-center justify-center">
                <LoaderIcon className="animate-spin size-10" />
            </div>
        )
    }


    return (
        <div className="max-w-7xl mx-auto">
            <div className="flex gap-4">
                <div className="w-[75%]">
                    <div className="relative w-full h-[600px]">
                        <Image
                            src={eventDetail?.eventImage || "/test.jpeg"}
                            width={2000}
                            height={2000}
                            alt={eventDetail?.eventName || "Event image"}
                            className="absolute w-full h-full object-cover"
                        />
                    </div>
                    <div className="mt-8 space-y-2">
                        <h3 className="text-xl font-semibold">{eventDetail?.eventName}</h3>
                        <p className="text-sm">{eventDetail?.eventDescription}</p>
                    </div>
                </div>

                <div className="w-[25%]">
                    <div className="border-2 p-4 space-y-4">
                        <span className="text-lg font-bold">Select Your Tickets</span>

                        <div className="flex justify-between items-center">
                            <div className="flex flex-col items-start">
                                <span className="font-bold text-primary/50">
                                    General Admission
                                </span>
                                <span className="font-semibold text-orange-400">1500</span>
                                <span className="text-xs text-primary/40">
                                    Sale ends on Oct,2024
                                </span>
                            </div>

                        </div>

                        <div className="flex justify-between items-center">
                            <div className="flex flex-col items-start">
                                <span className="font-bold text-primary/50">VIP Access</span>
                                <span className="font-semibold text-orange-400">2500</span>
                                <span className="text-xs text-primary/40">Selling fast!!</span>
                            </div>

                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default EventDetailPage;
