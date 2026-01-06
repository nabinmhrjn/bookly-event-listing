"use client";

import { Button } from "@/components/ui/button";
import EventCard from "@/components/EventCard";
import Link from "next/link";
import { Badge } from "@/components/ui/badge";
import { useAuth } from "@/context/AuthContext";
import { useEffect, useState } from "react";
import api from "@/lib/axios";
import {
    Dialog,
    DialogClose,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { Pen, Trash2 } from "lucide-react";

const LitingPage = () => {
    const router = useRouter()
    const { user } = useAuth();
    const [userEvents, setUserEvents] = useState([]);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        const fetchUserEvents = async () => {
            setLoading(true);
            try {
                const response = await api.get(`events/user/${user._id}`);
                setUserEvents(response?.data?.events);
            } catch (error) {
                console.error("Error in fetching user events", error);
            } finally {
                setLoading(false);
            }
        };
        fetchUserEvents();
    }, [user._id]);

    const handleDelete = async (eventId) => {
        try {
            const response = await api.delete(`events/${eventId}`);
            setUserEvents((prevEvents) => prevEvents.filter((event) => event._id !== eventId));
            toast.success(response.data?.message);
        } catch (error) {
            const errorMessage =
                error.response?.data?.message ||
                "Failed to delete event. Please try again.";
            toast.error(errorMessage);
        }
    };

    const handleListingDetail = (eventId) => {
        router.push(`/listings/${eventId}`)
    }

    // Helper function to determine event status
    const getEventStatus = (endDate) => {
        const today = new Date();
        today.setHours(0, 0, 0, 0);
        const eventEndDate = new Date(endDate);
        eventEndDate.setHours(0, 0, 0, 0);

        return eventEndDate >= today ? 'upcoming' : 'completed';
    }

    return (
        <div className="bg-secondary pt-14 pb-16">
            {userEvents && userEvents.length > 0 ? (
                <div className="max-w-7xl mx-auto px-4 md:px-6">
                    <div className="p-4 md:p-6 bg-white shadow">
                        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-2">
                            <div>
                                <h3 className="text-2xl md:text-3xl font-bold">My Listings</h3>
                                <p className="text-slate-600 mt-1 text-sm">Manage and track all your event listings in one place</p>
                            </div>
                            <Link href="/create">
                                <Button size="lg" className="w-full sm:w-auto">Create New Event</Button>
                            </Link>
                        </div>
                    </div>

                    {/* Events Grid */}
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mt-6">
                        {userEvents.map((item) => {
                            const status = getEventStatus(item.endDate);

                            return (
                                <div key={item._id} className="relative group">
                                    {/* Event Card */}
                                    <EventCard item={item} />

                                    {/* Status Badge */}
                                    <div className="absolute top-2 left-2 z-10">
                                        <Badge
                                            variant={status === 'upcoming' ? 'default' : 'secondary'}
                                            className={status === 'upcoming'
                                                ? 'bg-green-600 hover:bg-green-700 text-white'
                                                : 'bg-gray-600 hover:bg-gray-700 text-white'
                                            }
                                        >
                                            {status === 'upcoming' ? 'Upcoming' : 'Completed'}
                                        </Badge>
                                    </div>

                                    {/* Action Buttons Overlay */}
                                    <div className="absolute top-2 right-2 flex gap-2">
                                        <Button
                                            size="sm"
                                            variant="secondary"
                                            className="shadow-lg"
                                            onClick={() => handleListingDetail(item._id)}
                                        >
                                            <Pen size={16} className="mr-1 text-primary" />
                                            Edit
                                        </Button>

                                        <Dialog>
                                            <DialogTrigger asChild>
                                                <Button
                                                    size="sm"
                                                    variant="secondary"
                                                    className="shadow-lg"
                                                >
                                                    <Trash2 size={16} className="mr-1 text-primary" />
                                                    Delete
                                                </Button>
                                            </DialogTrigger>
                                            <DialogContent>
                                                <DialogHeader>
                                                    <DialogTitle>
                                                        Are you sure you want to delete this event?
                                                    </DialogTitle>
                                                    <DialogDescription className="text-xs">
                                                        This action cannot be undone. This will
                                                        permanently delete your event and remove your data
                                                        from our servers.
                                                    </DialogDescription>
                                                </DialogHeader>
                                                <DialogFooter className="sm:justify-start">
                                                    <DialogClose asChild>
                                                        <Button type="button" variant="secondary">
                                                            Cancel
                                                        </Button>
                                                    </DialogClose>
                                                    <DialogClose asChild>
                                                        <Button
                                                            type="button"
                                                            variant="destructive"
                                                            onClick={() => handleDelete(item._id)}
                                                        >
                                                            Confirm
                                                        </Button>
                                                    </DialogClose>
                                                </DialogFooter>
                                            </DialogContent>
                                        </Dialog>
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                </div>
            ) : (
                <div className="p-16 mt-4 flex flex-col items-center justify-center px-4">
                    <div className="text-center">
                        <h3 className="text-xl md:text-2xl font-semibold text-slate-600 mb-2">
                            No Events Yet
                        </h3>
                        <p className="text-slate-600 mb-6">
                            You haven't created any events. Start by creating your first
                            event!
                        </p>
                        <Link href="/create">
                            <Button>Create Your First Event</Button>
                        </Link>
                    </div>
                </div>
            )}
        </div>
    );
};

export default LitingPage;
