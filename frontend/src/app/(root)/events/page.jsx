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
import { useRouter, useSearchParams } from "next/navigation";
import {
    Pagination,
    PaginationContent,
    PaginationEllipsis,
    PaginationItem,
    PaginationLink,
    PaginationNext,
    PaginationPrevious,
} from "@/components/ui/pagination"

const EventPage = () => {
    const router = useRouter();
    const searchParams = useSearchParams();
    const currentPage = Number(searchParams.get('page')) || 1;

    const [open, setOpen] = useState(false);
    const [date, setDate] = useState(new Date());
    const [loading, setLoading] = useState(false);
    const [eventList, setEventList] = useState([]);
    const [pagination, setPagination] = useState({
        currentPage: 1,
        totalPages: 1,
        totalEvents: 0,
        hasNextPage: false,
        hasPreviousPage: false
    });

    const fetchEvents = async (pageNum) => {
        setLoading(true);
        try {
            const response = await api.get(`/events?page=${pageNum}`);
            setEventList(response?.data?.events);
            setPagination(response?.data?.pagination);
        } catch (error) {
            console.error("Error fetching events:", error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchEvents(currentPage);
    }, [currentPage]);

    const handlePageChange = (newPage) => {
        router.push(`/events?page=${newPage}`);
        window.scrollTo({ top: 0, behavior: 'smooth' });
    };

    // generate page numbers to display
    const getPageNumbers = () => {
        const pages = [];
        const { currentPage, totalPages } = pagination;

        if (totalPages <= 5) {
            // show all pages if total is 5 or less
            for (let i = 1; i <= totalPages; i++) {
                pages.push(i);
            }
        } else {
            // show first page
            pages.push(1);

            if (currentPage > 3) {
                pages.push('ellipsis-start');
            }

            // show pages around current page
            for (let i = Math.max(2, currentPage - 1); i <= Math.min(totalPages - 1, currentPage + 1); i++) {
                pages.push(i);
            }

            if (currentPage < totalPages - 2) {
                pages.push('ellipsis-end');
            }

            // show last page
            pages.push(totalPages);
        }

        return pages;
    };

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
                            <Label htmlFor="concerts">Concerts</Label>
                        </div>
                        <div className="flex items-center space-x-2">
                            <RadioGroupItem value="sports" id="sports" />
                            <Label htmlFor="sports">Sports</Label>
                        </div>
                        <div className="flex items-center space-x-2">
                            <RadioGroupItem value="theatre" id="theatre" />
                            <Label htmlFor="theatre">Theatre</Label>
                        </div>
                        <div className="flex items-center space-x-2">
                            <RadioGroupItem value="festivals" id="festivals" />
                            <Label htmlFor="festivals">Festivals</Label>
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
                <div className="mt-8 space-y-2">
                    <Label htmlFor="date" className="px-1">
                        Location
                    </Label>
                    <div className="flex border items-center">
                        <Input placeholder="Enter a city" className="border-none" />
                    </div>
                </div>
            </div>

            {/* RIGHT SECTION */}
            <div className="w-[80%]">
                {loading ? (
                    <div className="text-center py-10">Loading events...</div>
                ) : (
                    <>
                        <div className="grid grid-cols-3 gap-4">
                            {eventList.map((item) => (
                                <Link href={`/events/${item._id}`} key={item._id}>
                                    <EventCard item={item} />
                                </Link>
                            ))}
                        </div>

                        {/* Pagination */}
                        {pagination.totalPages > 1 && (
                            <div className="mt-8">
                                <Pagination>
                                    <PaginationContent>
                                        <PaginationItem>
                                            <PaginationPrevious
                                                onClick={() => pagination.hasPreviousPage && handlePageChange(currentPage - 1)}
                                                className={!pagination.hasPreviousPage ? "pointer-events-none opacity-50" : "cursor-pointer"}
                                            />
                                        </PaginationItem>

                                        {getPageNumbers().map((pageNum, index) => (
                                            <PaginationItem key={index}>
                                                {pageNum === 'ellipsis-start' || pageNum === 'ellipsis-end' ? (
                                                    <PaginationEllipsis />
                                                ) : (
                                                    <PaginationLink
                                                        onClick={() => handlePageChange(pageNum)}
                                                        isActive={pageNum === pagination.currentPage}
                                                        className="cursor-pointer"
                                                    >
                                                        {pageNum}
                                                    </PaginationLink>
                                                )}
                                            </PaginationItem>
                                        ))}

                                        <PaginationItem>
                                            <PaginationNext
                                                onClick={() => pagination.hasNextPage && handlePageChange(currentPage + 1)}
                                                className={!pagination.hasNextPage ? "pointer-events-none opacity-50" : "cursor-pointer"}
                                            />
                                        </PaginationItem>
                                    </PaginationContent>
                                </Pagination>
                            </div>
                        )}
                    </>
                )}
            </div>
        </div>
    );
};

export default EventPage;