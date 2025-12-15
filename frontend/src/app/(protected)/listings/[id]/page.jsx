"use client"

import api from "@/lib/axios"
import { useParams } from "next/navigation"
import { useEffect, useState } from "react"

const EventDetail = () => {
    const { id } = useParams()
    const eventId = id.split('%')[0];
    const [eventDetail, setEventDetail] = useState(null)

    useEffect(() => {
        const fetchEvent = async () => {
            try {
                const response = await api.get(`/events/${eventId}`)
                setEventDetail(response.data)
            } catch (error) {
                console.error("Error fetching event", error)
            }
        }

        fetchEvent();
    }, [eventId])

    return (
        <div>
            <div>{eventDetail?.eventName}</div>
            <div>{eventDetail?.eventDescription}</div>
            <div>{eventDetail?.eventOrganizer?.fullName}</div>
        </div>
    )
}

export default EventDetail