"use client";

import EventCard from "@/components/EventCard";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import api from "@/lib/axios";
import { ChevronDownIcon, Filter, LoaderIcon, X } from "lucide-react";
import Link from "next/link";
import { useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Pagination, PaginationContent, PaginationEllipsis, PaginationItem, PaginationLink, PaginationNext, PaginationPrevious } from "@/components/ui/pagination"
import { Toggle } from "@/components/ui/toggle"

const EventPage = () => {
    const router = useRouter();
    const searchParams = useSearchParams();
    const currentPage = Number(searchParams.get('page')) || 1;
    const categoryFromUrl = searchParams.get('category') || '';
    const dayFromUrl = searchParams.get('day') || '';
    const [loading, setLoading] = useState(false);
    const [eventList, setEventList] = useState([]);
    const [selectedCategory, setSelectedCategory] = useState(categoryFromUrl)
    const [selectedDay, setSelectedDay] = useState(dayFromUrl ? dayFromUrl.split('|') : [])
    const [pagination, setPagination] = useState({ currentPage: 1, totalPages: 1, totalEvents: 0, hasNextPage: false, hasPreviousPage: false });
    const [showFilters, setShowFilters] = useState(false);


    const fetchEvents = async (pageNum, category, day) => {
        setLoading(true);
        try {
            //build query params
            let queryParams = `page=${pageNum}`;
            if (category) {
                queryParams += `&category=${encodeURIComponent(category)}`
            }
            if (day) {
                queryParams += `&day=${encodeURIComponent(day)}`
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
        fetchEvents(currentPage, categoryFromUrl, dayFromUrl);
    }, [currentPage, categoryFromUrl, dayFromUrl]);

    const handleCategoryChange = (category) => {
        setSelectedCategory(category)

        //update url with category and reset to page 1
        let queryString = '';
        if (category) {
            queryString = `category=${encodeURIComponent(category)}`;
        }

        router.push(`/events${queryString ? '?' + queryString : ''}`);
        window.scrollTo({ top: 0, behavior: 'smooth' })
    }

    const handlePageChange = (newPage) => {
        const queryParts = [];
        queryParts.push(`page=${newPage}`);

        if (selectedCategory) {
            queryParts.push(`category=${encodeURIComponent(selectedCategory)}`);
        }

        if (selectedDay.length > 0) {
            queryParts.push(`day=${selectedDay.join('|')}`);
        }

        router.push(`/events?${queryParts.join('&')}`);
        window.scrollTo({ top: 0, behavior: 'smooth' });
    };

    const handleDayChange = (day) => {
        const newDays = selectedDay.includes(day)
            ? selectedDay.filter(item => item !== day)
            : [...selectedDay, day];

        // Update state
        setSelectedDay(newDays);

        // Update URL with new day filters
        const queryParts = [];
        if (selectedCategory) {
            queryParts.push(`category=${encodeURIComponent(selectedCategory)}`);
        }
        if (newDays.length > 0) {
            queryParts.push(`day=${newDays.join('|')}`);
        }

        router.push(`/events${queryParts.length > 0 ? '?' + queryParts.join('&') : ''}`);
        window.scrollTo({ top: 0, behavior: 'smooth' });
    };

    const handleClearFilters = () => {
        setSelectedCategory('');
        setSelectedDay([]);
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

    const FilterSection = () => (
        <div className="p-4 bg-white rounded-lg">
            <p className="font-bold mb-4">Category</p>

            {/* RADIO GROUP */}
            <div className="space-y-2">
                <RadioGroup value={selectedCategory} onValueChange={handleCategoryChange}>
                    <div className="flex items-center space-x-2">
                        <RadioGroupItem value="live-concert" id="Live Concert" />
                        <Label htmlFor="Live Concert">Live Concert</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                        <RadioGroupItem value="comedy-show" id="Comedy Show" />
                        <Label htmlFor="Comedy Show">Comedy Show</Label>
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
            <div className="mt-6 space-y-2">
                <Label htmlFor="date" className="px-1 font-bold">
                    Date Range
                </Label>
                <div className="flex gap-2 flex-wrap">
                    <Toggle
                        variant="outline"
                        pressed={selectedDay.includes("today")}
                        onPressedChange={() => handleDayChange('today')}
                    >
                        Today
                    </Toggle>
                    <Toggle
                        variant="outline"
                        pressed={selectedDay.includes("tomorrow")}
                        onPressedChange={() => handleDayChange('tomorrow')}
                    >
                        Tomorrow
                    </Toggle>
                    <Toggle
                        variant="outline"
                        pressed={selectedDay.includes("this-weekend")}
                        onPressedChange={() => handleDayChange('this-weekend')}
                    >
                        This Weekend
                    </Toggle>
                </div>
            </div>

            <div className="mt-6">
                <Button className="w-full" onClick={handleClearFilters}>Clear Filters</Button>
            </div>
        </div>
    );

    return (
        <div className="py-5 sm:py-8 bg-secondary">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                {/* Header with mobile filter toggle */}
                <div className="flex justify-between items-center mb-4 sm:mb-6">
                    <p className="text-lg sm:text-xl font-bold">Filters</p>
                    <Button
                        variant="outline"
                        size="sm"
                        className="lg:hidden"
                        onClick={() => setShowFilters(!showFilters)}
                    >
                        {showFilters ? <X size={20} /> : <Filter size={20} />}
                        <span className="ml-2">{showFilters ? 'Hide' : 'Show'} Filters</span>
                    </Button>
                </div>

                <div className="flex flex-col lg:flex-row gap-4 lg:gap-6">

                    {/* LEFT SECTION - FILTERS */}
                    <div className={`${showFilters ? 'block' : 'hidden'} lg:block lg:w-64 lg:shrink-0`}>
                        <FilterSection />
                    </div>

                    {/* RIGHT SECTION - EVENTS */}
                    <div className="flex-1 min-w-0">
                        {loading ? (
                            <div className="min-h-screen bg-base-200 flex items-center justify-center">
                                <LoaderIcon className="animate-spin size-10" />
                            </div>
                        ) : (
                            <>
                                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
                                    {eventList.length > 0 ? eventList.map((item) => (
                                        <Link href={`/events/${item._id}`} key={item._id}>
                                            <EventCard item={item} />
                                        </Link>
                                    )) : <p className="text-center col-span-full py-8">No events found</p>}
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