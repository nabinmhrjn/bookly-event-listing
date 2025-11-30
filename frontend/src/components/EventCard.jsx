import Image from "next/image"
import { Card, CardAction, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "./ui/card"
import { Button } from "./ui/button"
import { format } from "date-fns"

const EventCard = ({ item }) => {
    const formattedDate = item.startDate ? format(new Date(item.startDate), "MMM d, yyyy") : "";
    return (
        <Card>
            <Image src="/test.jpeg" width={500} height={500} alt="Picture of the author" loading="eager" />
            <CardHeader>
                <CardTitle className="min-h-10 leading-5">{item.eventName}</CardTitle>
                <CardDescription className="line-clamp-3">{item.eventDescription}</CardDescription>
            </CardHeader>
            <CardContent className="flex flex-col  items-start">
                <p className="text-accent-foreground text-sm">{item.eventVenue}</p>
                <p className="text-accent-foreground text-sm">{item.eventAddress}</p>
                <p className="text-accent-foreground text-sm">{formattedDate}</p>
            </CardContent>
            <CardFooter className="pb-4">
                <Button variant="outline">Book Now</Button>
            </CardFooter>
        </Card>
    )
}

export default EventCard