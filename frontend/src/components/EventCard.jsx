import Image from "next/image"
import { Card, CardAction, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "./ui/card"
import { Button } from "./ui/button"
import { format } from "date-fns"

const EventCard = ({ item }) => {
    const formattedDate = item.startDate ? format(new Date(item.startDate), "MMM d") : "";
    return (
        <Card className="relative">
            <div className="relative w-full h-[350px] overflow-hidden rounded-[5px">
                <Image src={item.eventImage || "/test.jpeg"} width={500} height={500} alt={item.eventName || "Event image"} loading="eager" className="absolute w-full h-full object-cover" />
            </div>
            <CardHeader className="p-2">
                <CardTitle className="text-lg font-semibold">{item.eventName}</CardTitle>
                <div className="p-4 w-14 h-14 bg-black flex items-center justify-center absolute top-0 right-0">
                    <span className="text-slate-200 font-semibold text-center">{formattedDate}</span>
                </div>
                <span className="text-slate-600 text-sm">{item.eventVenue}</span>
            </CardHeader>
            <CardContent>
            </CardContent>

        </Card>
    )
}

export default EventCard