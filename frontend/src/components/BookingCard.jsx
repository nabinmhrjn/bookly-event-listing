import Image from "next/image"
import { Card, CardHeader, CardTitle, CardContent } from "./ui/card"
import { Button } from "./ui/button"
import { format } from "date-fns"
import { Calendar, MapPin, Ticket } from "lucide-react"
import { Badge } from "./ui/badge"

const BookingCard = ({ booking, onViewTicket }) => {
    const formattedDate = booking.eventId?.startDate
        ? format(new Date(booking.eventId.startDate), "MMM d, yyyy")
        : "Date TBA";

    const getStatusBadge = () => {
        if (booking.bookingStatus === "cancelled") {
            return <Badge variant="secondary" className="bg-gray-600 hover:bg-gray-700 text-white">Cancelled</Badge>
        }

        if (!booking.eventId?.startDate) return null

        const eventDate = new Date(booking.eventId.startDate)
        const now = new Date()

        if (eventDate >= now) {
            return <Badge variant="default" className="bg-green-600 hover:bg-green-700 text-white">Confirmed</Badge>
        } else {
            return <Badge variant="secondary" className="bg-gray-600 hover:bg-gray-700 text-white">Completed</Badge>
        }
    }

    return (
        <Card className="relative border shadow">
            <div className="relative w-full h-[200px] overflow-hidden rounded-t-[5px]">
                <Image
                    src={booking.eventId?.eventImage || "/test.jpeg"}
                    width={500}
                    height={500}
                    alt={booking.eventId?.eventName || "Event image"}
                    loading="eager"
                    className="absolute w-full h-full object-cover"
                />
            </div>

            {/* Status Badge */}
            <div className="absolute top-2 left-2 z-10">
                {getStatusBadge()}
            </div>

            <CardHeader className="p-4">
                <CardTitle className="text-lg font-semibold line-clamp-1">
                    {booking.eventId?.eventName || booking.eventName}
                </CardTitle>

                <div className="flex gap-2 items-center">
                    <Calendar size={18} className="text-primary" />
                    <span className="text-slate-600 text-sm font-semibold">{formattedDate}</span>
                </div>

                <div className="flex gap-2 items-center">
                    <MapPin size={18} className="text-primary" />
                    <span className="text-slate-600 text-sm font-semibold line-clamp-1">
                        {booking.eventId?.eventVenue || "Venue TBA"}
                    </span>
                </div>

                <div className="flex gap-2 items-center">
                    <Ticket size={18} className="text-primary" />
                    <span className="text-slate-600 text-sm font-semibold">
                        {booking.ticketQuantity} x {booking.ticketType}
                    </span>
                </div>

                <div className="pt-2 border-t">
                    <p className="text-lg font-bold text-primary">
                        NPR {booking.totalPrice?.toLocaleString() || '0'}
                    </p>
                </div>
            </CardHeader>

            <CardContent className="p-4 pt-0">
                <Button
                    size="sm"
                    className="w-full"
                    onClick={() => onViewTicket && onViewTicket(booking)}
                >
                    View Ticket
                </Button>
            </CardContent>
        </Card>
    )
}

export default BookingCard
