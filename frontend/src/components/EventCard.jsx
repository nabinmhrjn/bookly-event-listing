import Image from "next/image"
import { Card, CardAction, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "./ui/card"
import { Button } from "./ui/button"
import { format } from "date-fns"
import { Calendar, MapPin } from "lucide-react"

const EventCard = ({ item }) => {
    const formattedDate = item.startDate ? format(new Date(item.startDate), "MMM d") : "";
    return (
        <Card className="relative border shadow">
            <div className="relative w-full h-[200px] overflow-hidden rounded-[5px">
                <Image src={item.eventImage || "/test.jpeg"} width={500} height={500} alt={item.eventName || "Event image"} loading="eager" className="absolute w-full h-full object-cover" />
            </div>
            <CardHeader className="p-4">
                <CardTitle className="text-lg font-semibold">{item.eventName}</CardTitle>

                <div className="flex gap-2">
                    <Calendar size={18} className="text-primary" />
                    <span className="text-slate-600 text-sm font-semibold">{item.eventVenue}</span>
                </div>

                <div className="flex gap-2">
                    <MapPin size={18} className="text-primary" />
                    <span className="text-slate-600 text-sm font-semibold">{formattedDate}</span>
                </div>
            </CardHeader>
            <CardContent>
            </CardContent>

        </Card>
    )
}

export default EventCard