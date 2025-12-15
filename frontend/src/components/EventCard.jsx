import Image from "next/image"
import { Card, CardAction, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "./ui/card"
import { Button } from "./ui/button"
import { format } from "date-fns"

const EventCard = ({ item }) => {
    const formattedDate = item.startDate ? format(new Date(item.startDate), "MMM d, yyyy") : "";
    return (
        <Card>
            <div className="relative w-full h-[300px] overflow-hidden rounded-[5px]">

                <Image src="/test1.avif" width={500} height={500} alt="Picture of the author" loading="eager" className="absolute w-full h-full object-cover" />
            </div>
            <CardHeader>
                <CardTitle>{item.eventName}</CardTitle>
                {/* <CardDescription className="line-clamp-3">{item.eventDescription}</CardDescription> */}
            </CardHeader>
            <CardContent className="flex flex-col  items-start">
                {/* <p className="text-accent-foreground text-sm">{item.eventVenue}</p> */}
                {/* <p className="text-accent-foreground text-sm">{item.eventAddress}</p> */}
                <p className="text-accent-foreground text-sm">{formattedDate}</p>
            </CardContent>

        </Card>
    )
}

export default EventCard