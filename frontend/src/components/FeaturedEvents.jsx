"use client"

import React, { useEffect, useState } from 'react'
import { MapPin } from 'lucide-react'
import { Button } from './ui/button'
import EventCard from './EventCard'
import Link from 'next/link'
import api from '@/lib/axios'

const FeaturedEvents = () => {
    const [eventList, setEventList] = useState([]);

    const fetchEvents = async () => {
        const response = await api.get("/events")
        setEventList(response.data.events)
    }

    useEffect(() => {
        fetchEvents()
    }, [])

    return (
        <div className='pt-12'>
            <div className='max-w-7xl mx-auto pb-14'>
                {/* Header */}
                <div className='flex justify-between items-center mb-4'>
                    <h2 className='text-2xl font-semibold text-slate-800'>Recommended Events</h2>
                    <Button variant={'secondary'} className="text-sm text-slate-500 hover:text-slate-800 cursor-pointer">See all</Button>
                </div>

                {/* Events Grid */}
                <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6'>
                    {eventList.slice(0, 4).map((item) => (
                        <Link href={`/events/${item._id}`} key={item._id}>
                            <EventCard item={item} />
                        </Link>
                    ))}

                </div>
            </div>
        </div>
    )
}

export default FeaturedEvents