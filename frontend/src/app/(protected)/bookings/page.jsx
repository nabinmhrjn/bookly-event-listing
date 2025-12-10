import { Input } from '@/components/ui/input'
import { Calendar, MapPin, MapPinOff, Search, Ticket } from 'lucide-react'
import {
    NativeSelect,
    NativeSelectOptGroup,
    NativeSelectOption,
} from "@/components/ui/native-select"
import { Button } from '@/components/ui/button'
import Image from 'next/image'
import { Badge } from '@/components/ui/badge'

const bookingEvents = [

    {
        "id": 1,
        "eventName": "Indie Music Festival",
        "eventDate": "Oct 26, 2024",
        "eventTime": "7:00 PM",
        "venue": "Green Park Amphitheatre",
        "ticketCount": 2,
        "image": "/test.jpeg",
        "status": "completed"
    },
    {
        "id": 2,
        "eventName": "Jazz Under The Stars",
        "eventDate": "Nov 15, 2024",
        "eventTime": "8:30 PM",
        "venue": "Himalayan Java Concert Hall",
        "ticketCount": 4,
        "image": "/test.jpeg",
        "status": "completed"
    },
    {
        "id": 3,
        "eventName": "Rock Revolution 2024",
        "eventDate": "Dec 8, 2024",
        "eventTime": "6:00 PM",
        "venue": "Tudikhel Open Ground",
        "ticketCount": 1,
        "image": "/test.jpeg",
        "status": "upcoming"
    },
    {
        "id": 4,
        "eventName": "Classical Fusion Night",
        "eventDate": "Jan 20, 2025",
        "eventTime": "7:30 PM",
        "venue": "Nepal Academy Hall",
        "ticketCount": 3,
        "image": "/test.jpeg",
        "status": "upcoming"
    }

]

const BookingPage = () => {
    return (
        <div className='bg-primary/5 pt-14 pb-16'>
            <div className="max-w-7xl mx-auto">
                <div className="p-4">
                    <div className="w-full flex justify-between items-center">
                        <div className="w-1/2">
                            <h3 className='text-2xl font-bold'>My Bookings</h3>
                        </div>
                        <div className="w-1/2 flex gap-2">
                            <div className="w-2/3 flex items-center border pl-2">
                                <Search size={20} className='text-primary/30' />
                                <Input placeholder="Search by event or venue" className="w-full border-none" />
                            </div>

                            {/* need to work on the width  */}
                            <div className="w-1/3 flex justify-end">
                                <NativeSelect className="w-[200px]">
                                    <NativeSelectOption value="all">All Bookings</NativeSelectOption>
                                    <NativeSelectOption value="upcoming">Upcoming</NativeSelectOption>
                                    <NativeSelectOption value="completed">Completed</NativeSelectOption>
                                </NativeSelect>
                            </div>
                        </div>

                    </div>
                </div>
                <div className="mt-8 flex flex-col gap-4">
                    {bookingEvents.map((item) => (
                        <div key={item.id} className=" bg-white p-4 flex gap-4">
                            <div className="w-[400px] h-48 relative overflow-hidden">
                                <Image src="/test.jpeg" width={500} height={500} alt="Picture of the author" className='absolute w-full h-full object-cover' />
                            </div>
                            <div className="flex flex-1 flex-col justify-between">
                                <div className="space-y-1">
                                    <p className='text-2xl font-bold'>{item.eventName}</p>
                                    <div className="flex gap-2 items-center">
                                        <Calendar size={15} />
                                        <p className='text-sm'>{item.eventDate}</p>
                                    </div>
                                    <div className="flex gap-2 items-center">
                                        <MapPin size={15} />
                                        <p className='text-sm'>{item.venue}</p>
                                    </div>
                                    <div className="flex gap-2 items-center">
                                        <Ticket size={15} />
                                        <p className='text-sm'>{item.ticketCount} Ticket</p>
                                    </div>
                                </div>
                                <div className="flex gap-4">
                                    <Button>View Ticket</Button>
                                    <Button variant="outline">Get Direction</Button>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    )
}

export default BookingPage      