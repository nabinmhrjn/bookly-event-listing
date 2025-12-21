import Image from "next/image"
import { Card, CardAction, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "./ui/card"
import { Button } from "./ui/button"
import { format } from "date-fns"

const EventCard = ({ item }) => {
    const formattedDate = item.startDate ? format(new Date(item.startDate), "MMM d, yyyy") : "";
    return (
        <Card>
            <div className="relative w-full h-[350px] overflow-hidden rounded-[5px">
                <Image src="/test.jpeg" width={500} height={500} alt="Picture of the author" loading="eager" className="absolute w-full h-full object-cover" />
            </div>
            <CardHeader>
                <CardTitle className="text-lg font-semibold">{item.eventName}</CardTitle>
                <span className="text-slate-600 text-sm">{formattedDate}</span>
            </CardHeader>
            <CardContent>
            </CardContent>

        </Card>
    )
}

export default EventCard