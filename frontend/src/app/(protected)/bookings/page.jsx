"use client"

import { Input } from '@/components/ui/input'
import { Calendar, MapPin, Search, Ticket, Loader2 } from 'lucide-react'
import { NativeSelect, NativeSelectOption } from "@/components/ui/native-select"
import { Button } from '@/components/ui/button'
import Image from 'next/image'
import { Badge } from '@/components/ui/badge'
import { useEffect, useState } from 'react'
import api from '@/lib/axios'
import { useAuth } from '@/context/AuthContext'
import { toast } from "sonner"

const BookingPage = () => {
    const { user } = useAuth()
    const [bookingList, setBookingList] = useState([])
    const [filteredBookings, setFilteredBookings] = useState([])
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState(null)
    const [searchQuery, setSearchQuery] = useState("")
    const [filterStatus, setFilterStatus] = useState("all")

    useEffect(() => {
        const fetchBookingList = async () => {
            if (!user?._id) return

            try {
                setLoading(true)
                setError(null)
                const response = await api.get("/bookings/user")
                setBookingList(response.data?.bookings || [])
                setFilteredBookings(response.data?.bookings || [])
            } catch (error) {
                console.error("Error fetching bookings:", error)
                setError("Failed to load bookings. Please try again.")
                toast.error("Failed to load your bookings. Please try again.")
            } finally {
                setLoading(false)
            }
        }
        fetchBookingList()
    }, [user?._id])

    // filter and search bookings
    useEffect(() => {
        let filtered = [...bookingList]

        // apply search filter
        if (searchQuery.trim()) {
            filtered = filtered.filter(booking =>
                booking.eventId?.eventName?.toLowerCase().includes(searchQuery.toLowerCase()) ||
                booking.eventId?.eventVenue?.toLowerCase().includes(searchQuery.toLowerCase())
            )
        }

        // apply status filter
        if (filterStatus !== "all") {
            const now = new Date()
            filtered = filtered.filter(booking => {
                if (!booking.eventId?.startDate) return false
                const eventDate = new Date(booking.eventId.startDate)

                if (filterStatus === "upcoming") {
                    return eventDate >= now && booking.bookingStatus !== "cancelled"
                } else if (filterStatus === "completed") {
                    return eventDate < now || booking.bookingStatus === "cancelled"
                }
                return true
            })
        }

        setFilteredBookings(filtered)
    }, [searchQuery, filterStatus, bookingList])

    const getStatusBadge = (booking) => {
        if (booking.bookingStatus === "cancelled") {
            return <Badge variant="destructive">Cancelled</Badge>
        }

        if (!booking.eventId?.startDate) return null

        const eventDate = new Date(booking.eventId.startDate)
        const now = new Date()

        if (eventDate >= now) {
            return <Badge variant="default" className="bg-green-500">Confirmed</Badge>
        } else {
            return <Badge variant="secondary">Completed</Badge>
        }
    }

    if (loading) {
        return (
            <div className='bg-primary/5 pt-14 pb-16 min-h-screen flex items-center justify-center'>
                <div className="flex flex-col items-center gap-4">
                    <Loader2 className="h-8 w-8 animate-spin text-primary" />
                    <p className="text-muted-foreground">Loading your bookings...</p>
                </div>
            </div>
        )
    }

    return (
        <div className='bg-primary/5 pt-14 pb-16 min-h-screen'>
            <div className="max-w-7xl mx-auto px-4">
                <div className="mb-8">
                    <div className="w-full flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                        <div>
                            <h3 className='text-2xl font-bold'>My Bookings</h3>
                            <p className="text-sm text-muted-foreground mt-1">
                                {bookingList.length} {bookingList.length === 1 ? 'booking' : 'bookings'} total
                            </p>
                        </div>
                        <div className="w-full md:w-auto flex gap-2">
                            <div className="flex-1 md:w-[300px] flex items-center border rounded-md pl-2 bg-white">
                                <Search size={20} className='text-primary/30' />
                                <Input
                                    placeholder="Search by event or venue"
                                    className="w-full border-none"
                                    value={searchQuery}
                                    onChange={(e) => setSearchQuery(e.target.value)}
                                />
                            </div>

                            <NativeSelect
                                className="w-[150px]"
                                value={filterStatus}
                                onChange={(e) => setFilterStatus(e.target.value)}
                            >
                                <NativeSelectOption value="all">All Bookings</NativeSelectOption>
                                <NativeSelectOption value="upcoming">Upcoming</NativeSelectOption>
                                <NativeSelectOption value="completed">Completed</NativeSelectOption>
                            </NativeSelect>
                        </div>
                    </div>
                </div>

                {error && (
                    <div className="bg-destructive/10 border border-destructive text-destructive px-4 py-3 rounded-md mb-4">
                        {error}
                    </div>
                )}

                {filteredBookings.length === 0 ? (
                    <div className="bg-white rounded-lg p-12 text-center">
                        <Ticket className="h-16 w-16 mx-auto text-muted-foreground mb-4" />
                        <h3 className="text-xl font-semibold mb-2">
                            {searchQuery || filterStatus !== "all" ? "No bookings found" : "No bookings yet"}
                        </h3>
                        <p className="text-muted-foreground">
                            {searchQuery || filterStatus !== "all"
                                ? "Try adjusting your search or filter criteria"
                                : "Start exploring events and make your first booking!"}
                        </p>
                    </div>
                ) : (
                    <div className="flex flex-col gap-4">
                        {filteredBookings.map((item) => (
                            <div key={item._id} className="bg-white rounded-lg p-4 flex flex-col md:flex-row gap-4 shadow-sm hover:shadow-md transition-shadow">
                                <div className="w-full md:w-[300px] h-48 relative overflow-hidden rounded-md">
                                    <Image
                                        src={item.eventId?.eventImage || '/placeholder.jpg'}
                                        width={500}
                                        height={500}
                                        loading='lazy'
                                        alt={item.eventId?.eventName || "Event image"}
                                        className='absolute w-full h-full object-cover'
                                    />
                                </div>
                                <div className="flex flex-1 flex-col justify-between">
                                    <div className="space-y-2">
                                        <div className="flex items-start justify-between gap-2">
                                            <h4 className='text-xl md:text-2xl font-bold'>{item.eventId?.eventName || item.eventName}</h4>
                                            {getStatusBadge(item)}
                                        </div>
                                        <div className="flex gap-2 items-center text-muted-foreground">
                                            <Calendar size={16} />
                                            <p className='text-sm'>
                                                {item.eventId?.startDate
                                                    ? new Date(item.eventId.startDate).toLocaleDateString("en-US", {
                                                        month: "short",
                                                        day: "2-digit",
                                                        year: "numeric",
                                                    })
                                                    : "Date TBA"}
                                            </p>
                                        </div>
                                        <div className="flex gap-2 items-center text-muted-foreground">
                                            <MapPin size={16} />
                                            <p className='text-sm'>{item.eventId?.eventVenue || "Venue TBA"}</p>
                                        </div>
                                        <div className="flex gap-2 items-center text-muted-foreground">
                                            <Ticket size={16} />
                                            <p className='text-sm'>
                                                {item.ticketQuantity} x {item.ticketType}
                                            </p>
                                        </div>
                                        <div className="pt-2">
                                            <p className='text-lg font-semibold'>
                                                Total: NPR {item.totalPrice?.toLocaleString() || '0'}
                                            </p>
                                        </div>
                                    </div>
                                    <div className="flex gap-3 mt-4">
                                        <Button>View Ticket</Button>
                                        {item.bookingStatus !== "cancelled" && (
                                            <Button variant="outline">Cancel Booking</Button>
                                        )}
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    )
}

export default BookingPage      