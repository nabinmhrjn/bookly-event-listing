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
        <div className='py-8 sm:py-12 lg:py-16'>
            <div className='max-w-7xl mx-auto px-4 sm:px-6 lg:px-8'>
                {/* Header */}
                <div className='flex flex-col sm:flex-row sm:justify-between sm:items-center gap-3 sm:gap-0 mb-6 sm:mb-8'>
                    <h2 className='text-xl sm:text-2xl lg:text-3xl font-semibold text-slate-800'>Recommended Events</h2>
                    <Button variant={'secondary'} className="text-sm text-slate-500 hover:text-slate-800 cursor-pointer w-fit">See all</Button>
                </div>

                {/* Events Grid */}
                <div className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6'>
                    {eventList.slice(0, 3).map((item) => (
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