"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Eye, Pen, Search } from "lucide-react";
import Link from "next/link";
import {
    Table,
    TableBody,
    TableCaption,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { useAuth } from "@/context/AuthContext";
import { useEffect, useState } from "react";
import api from "@/lib/axios";

const LitingPage = () => {
    const { user } = useAuth();
    const [userEvents, setUserEvents] = useState([]);

    useEffect(() => {
        const fetchUserEvents = async () => {
            const response = await api.get(`events/user/${user._id}`);
            setUserEvents(response?.data?.events);
        };
        fetchUserEvents();
    }, [user._id]);

    return (
        <div className="bg-primary/5 pt-14 pb-16">
            {userEvents && userEvents.length > 0 ? (
                <div className="max-w-7xl mx-auto">
                    <div className="p-4">
                        <div className="flex justify-between items-center">
                            <h3 className="text-2xl font-bold">My Listing</h3>
                            <Link href="/create">
                                <Button>Create New Event</Button>
                            </Link>
                        </div>
                    </div>

                    <div className="bg-white p-4">
                        <div className="flex justify-between items-center">
                            <div className="w-1/2 flex items-center border pl-2">
                                <Search size={20} className="text-primary/30" />
                                <Input
                                    placeholder="Search your event listings"
                                    className="w-full border-none"
                                />
                            </div>

                            {/* SORTING FUNCTIONALITY */}
                            <div className=""></div>
                        </div>
                    </div>

                    <div className="bg-white p-4 mt-4">
                        <Table>
                            <TableHeader>
                                <TableRow>
                                    <TableHead className="w-[450px]">Event</TableHead>
                                    <TableHead className="w-[150px]">Date</TableHead>
                                    <TableHead className="w-[100px]">Approval</TableHead>
                                    <TableHead className="w-[100px]">Status</TableHead>
                                    <TableHead className="w-[80px]">Phase 1</TableHead>
                                    <TableHead className="w-[80px]">Phase 2</TableHead>
                                    <TableHead className="w-[80px]">Phase 3</TableHead>
                                    <TableHead className="text-right">Actions</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {userEvents.map((item) => (
                                    <TableRow key={item._id}>
                                        <TableCell className="font-medium">
                                            {item.eventName}
                                        </TableCell>
                                        <TableCell>
                                            {item?.startDate
                                                ? new Date(item.startDate).toLocaleDateString("en-US", {
                                                    month: "short",
                                                    day: "2-digit",
                                                    year: "numeric",
                                                })
                                                : ""}
                                        </TableCell>
                                        <TableCell className="">
                                            <Badge variant="destructive">Pending</Badge>
                                        </TableCell>
                                        <TableCell className="">
                                            <Badge variant="destructive">Pending</Badge>
                                        </TableCell>
                                        <TableCell className="text-right">2000</TableCell>
                                        <TableCell className="text-right">2000</TableCell>
                                        <TableCell className="text-right">2000</TableCell>
                                        <TableCell className="flex justify-end gap-10">
                                            <Button variant="outline">View Detail</Button>
                                        </TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                    </div>
                </div>
            ) : (
                <div className="bg-white p-16 mt-4 flex flex-col items-center justify-center">
                    <div className="text-center">
                        <h3 className="text-2xl font-semibold text-primary/80 mb-2">
                            No Events Yet
                        </h3>
                        <p className="text-primary/60 mb-6">
                            You haven't created any events. Start by creating your first event!
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
