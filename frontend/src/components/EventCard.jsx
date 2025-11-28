import Image from "next/image"
import { Card, CardAction, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "./ui/card"
import { Button } from "./ui/button"

const EventCard = ({ item }) => {
    return (
        <Card>
            <Image src="/test.jpeg" width={500} height={500} alt="Picture of the author" loading="eager" />
            <CardHeader>
                <CardTitle className="min-h-10 leading-5">{item.eventName}</CardTitle>
                <CardDescription className="line-clamp-3">{item.eventDescription}</CardDescription>
            </CardHeader>
            <CardContent className="flex flex-col  items-start">
                {/* <p className="font-bold">{item.priceStartingFrom}</p> */}
                <p className="text-accent-foreground text-sm">{item.eventVenue}</p>
                <p className="text-accent-foreground text-sm">{item.eventAddress}</p>
            </CardContent>
            <CardFooter className="pb-4">
                <Button variant="outline">Book Now</Button>
            </CardFooter>
        </Card>
    )
}

export default EventCard