"use client";

import EventCard from "@/components/EventCard";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import api from "@/lib/axios";
import { ChevronDownIcon, LoaderIcon } from "lucide-react";
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
    const categoryFromUrl = searchParams.get('category') || '';
    const [open, setOpen] = useState(false);
    const [date, setDate] = useState(null);
    const [loading, setLoading] = useState(false);
    const [eventList, setEventList] = useState([]);
    const [selectedCategory, setSelectedCategory] = useState(categoryFromUrl)
    const [pagination, setPagination] = useState({
        currentPage: 1,
        totalPages: 1,
        totalEvents: 0,
        hasNextPage: false,
        hasPreviousPage: false
    });

    const fetchEvents = async (pageNum, category = '') => {
        setLoading(true);
        try {
            //build query params
            let queryParams = `page=${pageNum}`;
            if (category) {
                queryParams += `&category=${encodeURIComponent(category)}`
            }

            const response = await api.get(`/events?${queryParams}`);
            setEventList(response?.data?.events);
            setPagination(response?.data?.pagination);
        } catch (error) {
            console.error("Error fetching events:", error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchEvents(currentPage, categoryFromUrl);
    }, [currentPage, categoryFromUrl]);

    const handleCategoryChange = (category) => {
        setSelectedCategory(category)

        //update url with category and reset to page 1
        const params = new URLSearchParams();
        params.set('page', '1');
        if (category) {
            params.set('category', category);
        }

        router.push(`/events?${params.toString()}`);
        window.scrollTo({ top: 0, behavior: 'smooth' })
    }

    const handlePageChange = (newPage) => {
        const params = new URLSearchParams();
        params.set('page', newPage.toString());

        if (selectedCategory) {
            params.set('category', selectedCategory)
        }

        router.push(`/events?${params.toString()}`);
        window.scrollTo({ top: 0, behavior: 'smooth' });
    };

    const handleClearFilters = () => {
        setSelectedCategory('');
        router.push('/events')
        window.scrollTo({ top: 0, behavior: 'smooth' })
    }

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
        <div className="bg-primary/5 py-5">
            <div className="max-w-7xl mx-auto">
                <div className="pb-2">
                    <p className=" text-lg font-bold">Filters</p>
                </div>
                <div className="flex gap-4">
                    {/* LEFT SECTION */}
                    <div className="w-[20%] p-4 bg-white h-[430px]">
                        <p className="font-bold">Category</p>

                        {/* RADIO GROUP */}
                        <div className="pt-4">
                            <RadioGroup value={selectedCategory} onValueChange={handleCategoryChange}>
                                <div className="flex items-center space-x-2">
                                    <RadioGroupItem value="live-concert" id="Live Concert" />
                                    <Label htmlFor="Live Concert">Live Concert</Label>
                                </div>
                                <div className="flex items-center space-x-2">
                                    <RadioGroupItem value="comedy-show" id="Comedy Show" />
                                    <Label htmlFor="sports">Comedy Show</Label>
                                </div>
                                <div className="flex items-center space-x-2">
                                    <RadioGroupItem value="sports-event" id="Sports Event" />
                                    <Label htmlFor="Sports Event">Sports Event</Label>
                                </div>
                                <div className="flex items-center space-x-2">
                                    <RadioGroupItem value="technology-innovation" id="Technology & Innovation" />
                                    <Label htmlFor="Technology & Innovation">Technology & Innovation</Label>
                                </div>
                                <div className="flex items-center space-x-2">
                                    <RadioGroupItem value="business-marketing" id="Business & Marketing" />
                                    <Label htmlFor="Business & Marketing">Business & Marketing</Label>
                                </div>
                                <div className="flex items-center space-x-2">
                                    <RadioGroupItem value="other" id="Other" />
                                    <Label htmlFor="Other">Other</Label>
                                </div>
                            </RadioGroup>
                        </div>

                        {/* DATE PICKER | CALENDAR */}
                        <div className="mt-8 space-y-2">
                            <Label htmlFor="date" className="px-1 font-bold">
                                Date Range
                            </Label>
                            <div className="flex gap-2 flex-wrap">
                                <Button variant="outline" className="text-xs">Today</Button>
                                <Button variant="outline" className="text-xs">Tomorrow</Button>
                                <Button variant="outline" className="text-xs">This Weekend</Button>
                            </div>

                            {/* <Popover open={open} onOpenChange={setOpen}> 
                                <PopoverTrigger asChild>
                                    <Button
                                        variant="outline"
                                        id="date"
                                        className="w-full justify-between font-normal"
                                    >
                                        {date ? date.toLocaleDateString() : "Select date"}
                                        <ChevronDownIcon />
                                    </Button>
                                </PopoverTrigger>
                                <PopoverContent
                                    className="w-full overflow-hidden p-0"
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
                            </Popover> */}
                        </div>

                        {/* LOCATION */}
                        {/* <div className="mt-8 space-y-2">
                            <Label htmlFor="date" className="px-1 font-bold">
                                Location
                            </Label>
                            <div className="flex border items-center">
                                <Input placeholder="Enter a city" className="border-none" />
                            </div>
                        </div> */}

                        <div className="mt-8">
                            <Button className="w-full" onClick={handleClearFilters}>Clear Filters</Button>
                        </div>
                    </div>

                    {/* RIGHT SECTION */}
                    <div className="w-[80%]">
                        {loading ? (
                            <div className="min-h-screen bg-base-200 flex items-center justify-center">
                                <LoaderIcon className="animate-spin size-10" />
                            </div>
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
            </div>
        </div>
    );
};

export default EventPage;