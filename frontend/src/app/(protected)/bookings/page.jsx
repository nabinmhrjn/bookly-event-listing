"use client"

import { Input } from '@/components/ui/input'
import { Search, Loader2 } from 'lucide-react'
import { NativeSelect, NativeSelectOption } from "@/components/ui/native-select"
import BookingCard from '@/components/BookingCard'
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

    const handleViewTicket = (booking) => {
        console.log("View ticket:", booking)
        // Add your view ticket logic here
    }

    if (loading) {
        return (
            <div className='bg-primary/5 pt-14 pb-16 flex items-center justify-center'>
                <div className="flex flex-col items-center gap-4">
                    <Loader2 className="h-8 w-8 animate-spin text-primary" />
                    <p className="text-muted-foreground">Loading your bookings...</p>
                </div>
            </div>
        )
    }

    return (
        <div className='bg-secondary pt-14 pb-16'>
            <div className="max-w-7xl mx-auto">
                <div className="p-6 bg-white shadow">
                    <div className="w-full flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-2">
                        <div>
                            <h3 className='text-3xl font-bold'>My Bookings</h3>
                            <p className="text-sm text-slate-600 mt-1">
                                View and manage all your event bookings
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
                    <div className="bg-destructive/10 border border-destructive text-destructive px-4 py-3 rounded-md mb-4 mx-6 mt-6">
                        {error}
                    </div>
                )}

                <div className='mt-6'>
                    {filteredBookings.length === 0 ? (
                        <div className="bg-white rounded-lg p-12 text-center">
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
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                            {filteredBookings.map((booking) => (
                                <BookingCard
                                    key={booking._id}
                                    booking={booking}
                                    onViewTicket={handleViewTicket}
                                />
                            ))}
                        </div>
                    )}
                </div>
            </div>
        </div>
    )
}

export default BookingPage      