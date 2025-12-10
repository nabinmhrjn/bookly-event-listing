import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Eye, Pen, Search } from 'lucide-react'
import Link from 'next/link'
import {
    Table,
    TableBody,
    TableCaption,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"

const myEventListings = [
    {
        "id": 1,
        "eventName": "Kuma Sagar & The Khwopa Live in Kathmandu",
        "eventDate": "Aug 15, 2025",
        "approvalStatus": "Rejected",
        "ticketStatus": "Sold Out",
        "earlyBird": "200/2000",
        "regular": "200/2000",
        "vip": "85/2000"
    },
    {
        "id": 2,
        "eventName": "Nepathya Live Concert - Pokhara",
        "eventDate": "Sep 22, 2025",
        "approvalStatus": "Approved",
        "ticketStatus": "Available",
        "earlyBird": "450/1500",
        "regular": "890/1500",
        "vip": "120/500"
    },
    {
        "id": 3,
        "eventName": "Bipul Chettri Acoustic Night",
        "eventDate": "Oct 5, 2025",
        "approvalStatus": "Pending",
        "ticketStatus": "Coming Soon",
        "earlyBird": "0/800",
        "regular": "0/800",
        "vip": "0/300"
    },
    {
        "id": 4,
        "eventName": "Bartika Rai - Melancholy Tour",
        "eventDate": "Nov 12, 2025",
        "approvalStatus": "Approved",
        "ticketStatus": "Selling Fast",
        "earlyBird": "650/1000",
        "regular": "780/1200",
        "vip": "185/400"
    },
    {
        "id": 5,
        "eventName": "1974 AD Reunion Concert",
        "eventDate": "Dec 1, 2025",
        "approvalStatus": "Approved",
        "ticketStatus": "Sold Out",
        "earlyBird": "2000/2000",
        "regular": "2500/2500",
        "vip": "800/800"
    },
    {
        "id": 6,
        "eventName": "Sajjan Raj Vaidya - Hataarindai Tour",
        "eventDate": "Jan 18, 2026",
        "approvalStatus": "Approved",
        "ticketStatus": "Available",
        "earlyBird": "320/1800",
        "regular": "560/2000",
        "vip": "95/600"
    },
    {
        "id": 7,
        "eventName": "Electronic Music Festival Kathmandu",
        "eventDate": "Feb 14, 2026",
        "approvalStatus": "Pending",
        "ticketStatus": "Coming Soon",
        "earlyBird": "0/3000",
        "regular": "0/3500",
        "vip": "0/1000"
    },
    {
        "id": 8,
        "eventName": "Tribal Rain & Underside Live",
        "eventDate": "Mar 8, 2026",
        "approvalStatus": "Rejected",
        "ticketStatus": "Cancelled",
        "earlyBird": "0/1200",
        "regular": "0/1200",
        "vip": "0/400"
    },
    {
        "id": 9,
        "eventName": "Nabin K Bhattarai Greatest Hits",
        "eventDate": "Apr 20, 2026",
        "approvalStatus": "Approved",
        "ticketStatus": "Available",
        "earlyBird": "980/2500",
        "regular": "1240/3000",
        "vip": "345/1000"
    },
    {
        "id": 10,
        "eventName": "Rock Yatra 2026 - Multi-Artist Show",
        "eventDate": "May 15, 2026",
        "approvalStatus": "Approved",
        "ticketStatus": "Selling Fast",
        "earlyBird": "1450/2000",
        "regular": "1680/2500",
        "vip": "420/800"
    }
]

const LitingPage = () => {
    return (
        <div className='bg-primary/5 pt-14 pb-16'>
            <div className="max-w-7xl mx-auto">
                <div className="p-4">
                    <div className="flex justify-between items-center">
                        <h3 className='text-2xl font-bold'>My Listing</h3>
                        <Link href="/create">
                            <Button>Create New Event</Button>
                        </Link>
                    </div>
                </div>

                <div className="bg-white p-4">
                    <div className="flex justify-between items-center">
                        <div className="w-1/2 flex items-center border pl-2">
                            <Search size={20} className='text-primary/30' />
                            <Input placeholder="Search your event listings" className="w-full border-none" />
                        </div>

                        {/* SORTING FUNCTIONALITY */}
                        <div className=""></div>
                    </div>
                </div>

                <div className="bg-white p-4 mt-4">
                    <Table>
                        <TableCaption>A list of your recent invoices.</TableCaption>
                        <TableHeader>
                            <TableRow>
                                <TableHead className="w-[450px]">Event</TableHead>
                                <TableHead className="w-[150px]">Date</TableHead>
                                <TableHead className="w-[100px]">Approval</TableHead>
                                <TableHead className="w-[100px]">Status</TableHead>
                                <TableHead className="w-[80px]">Phase 1</TableHead>
                                <TableHead className="w-[80px]">Phase 2</TableHead>
                                <TableHead className="w-[80px]">Phase 3</TableHead>
                                <TableHead className="text-right">Actions</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {myEventListings.map((item) => (
                                <TableRow key={item.id}>
                                    <TableCell className="font-medium">{item.eventName}</TableCell>
                                    <TableCell>{item.eventDate}</TableCell>
                                    <TableCell className="">
                                        <Badge variant="destructive">{item.approvalStatus}</Badge>
                                    </TableCell>
                                    <TableCell className="">
                                        <Badge variant="destructive">{item.ticketStatus}</Badge>
                                    </TableCell>
                                    <TableCell className="text-right">{item.earlyBird}</TableCell>
                                    <TableCell className="text-right">{item.regular}</TableCell>
                                    <TableCell className="text-right">{item.vip}</TableCell>
                                    <TableCell className="flex justify-end gap-10">
                                        <Button variant="outline" >View Detail</Button>
                                    </TableCell>
                                </TableRow>)
                            )}

                        </TableBody>
                    </Table>
                </div>
            </div>
        </div>
    )
}

export default LitingPage      