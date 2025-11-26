"use client"

import Image from 'next/image'
import { useParams } from 'next/navigation'
import { useState } from 'react'

const eventData = [

    {
        "id": "evt_001",
        "name": "Kathmandu Music Festival 2025",
        "description": "A grand open-air music festival featuring top Nepali bands, DJs, food stalls, and cultural performances. Lorem ipsum dolor sit amet consectetur adipisicing elit. Quisquam vitae vero tenetur. In fuga beatae nobis itaque quis doloribus blanditiis perspiciatis, odit incidunt dolorum consequuntur animi ex laudantium cum nostrum quasi quibusdam quidem laboriosam dolores voluptate. Inventore a debitis, ea earum voluptates reiciendis esse perferendis vero illum, voluptatibus fugiat alias et, consequatur doloremque dolore amet sit! Accusamus, vitae? Quis voluptatibus maiores odit perferendis molestias deserunt cupiditate, temporibus aliquid architecto debitis ducimus iusto id et accusamus ea recusandae sed nesciunt mollitia sit, eaque voluptas expedita obcaecati facere?",
        "category": "Music",
        "eventDate": "2025-12-15T18:00:00",
        "endDate": "2025-12-15T23:55:00",
        "priceStartingFrom": 1500,
        "venue": {
            "name": "Bhrikutimandap Exhibition Ground",
            "address": "Kathmandu, Nepal",
            "latitude": 27.699,
            "longitude": 85.3201
        },
        "organizer": {
            "name": "Nepal Events Hub",
            "contactEmail": "info@nepaleventshub.com",
            "contactPhone": "+977-9812345678"
        },
        "tickets": [
            { "type": "General", "price": 1500, "available": 300, "currency": "NPR" },
            { "type": "VIP", "price": 3500, "available": 100, "currency": "NPR" }
        ],
        "images": ["/images/music-festival-cover.jpg", "/images/music-festival-stage.jpg"],
        "rating": 4.8,
        "status": "Upcoming"
    },

    {
        "id": "evt_002",
        "name": "Tech Expo Nepal 2025",
        "description": "The largest technology exhibition in Nepal showcasing startups, AI tools, robotics, and gadgets. Lorem ipsum dolor sit amet consectetur adipisicing elit. Saepe, ratione? Natus facere quidem nobis nesciunt repellat pariatur eveniet ipsam similique, laborum iusto architecto dolore molestias maiores asperiores voluptatum, eos tempora obcaecati suscipit. Officia iste exercitationem accusantium a, ducimus id perspiciatis numquam eveniet dolores, excepturi aliquid recusandae eaque voluptates dolore quam nam ipsum maiores velit sint!",
        "category": "Tech",
        "eventDate": "2025-11-20T10:00:00",
        "endDate": "2025-11-22T18:00:00",
        "priceStartingFrom": 500,
        "venue": {
            "name": "Chitwan Expo Center",
            "address": "Bharatpur, Chitwan",
            "latitude": 27.6749,
            "longitude": 84.4365
        },
        "organizer": {
            "name": "TechNepal Innovations",
            "contactEmail": "support@technepal.com",
            "contactPhone": "+977-9801234567"
        },
        "tickets": [
            { "type": "One Day Pass", "price": 500, "available": 500, "currency": "NPR" },
            { "type": "Three Day Pass", "price": 1200, "available": 150, "currency": "NPR" }
        ],
        "images": ["/images/tech-expo-main.jpg", "/images/tech-expo-booths.jpg"],
        "rating": 4.6,
        "status": "Upcoming"
    },

    {
        "id": "evt_003",
        "name": "Himalayan Trail Marathon",
        "description": "A breathtaking marathon event through the Himalayan foothills featuring 5K, 10K, and 21K races. Lorem ipsum dolor sit amet consectetur adipisicing elit. Amet aperiam tenetur ratione inventore voluptas a aspernatur culpa, necessitatibus neque quasi? Ipsa laborum iste dolorum beatae repellendus deserunt eius omnis minus culpa soluta dolore distinctio facere esse itaque sint totam, voluptates velit labore mollitia perspiciatis quasi optio.",
        "category": "Sports",
        "eventDate": "2025-10-05T06:00:00",
        "endDate": "2025-10-05T13:00:00",
        "priceStartingFrom": 1000,
        "venue": {
            "name": "Nagarkot Hills",
            "address": "Nagarkot, Bhaktapur",
            "latitude": 27.715,
            "longitude": 85.5202
        },
        "organizer": {
            "name": "Himalayan Sports Club",
            "contactEmail": "events@hscnepal.org",
            "contactPhone": "+977-9841239876"
        },
        "tickets": [
            { "type": "5K Race", "price": 1000, "available": 200, "currency": "NPR" },
            { "type": "10K Race", "price": 1500, "available": 150, "currency": "NPR" },
            { "type": "21K Half Marathon", "price": 2500, "available": 100, "currency": "NPR" }
        ],
        "images": ["/images/marathon-trail.jpg", "/images/marathon-views.jpg"],
        "rating": 4.9,
        "status": "Upcoming"
    },

    {
        "id": "evt_004",
        "name": "Food Carnival Kathmandu 2025",
        "description": "A celebration of Nepali and international cuisine with live music, BBQ stalls, dessert corners, and cultural food exhibitions. Lorem ipsum dolor sit amet consectetur, adipisicing elit. Dolorem laborum dolore iure veniam rem velit magni, amet quae, eum possimus iste repellendus maxime repudiandae recusandae reprehenderit! Alias quis libero iusto aliquam fugiat qui delectus molestias perspiciatis rerum suscipit voluptatibus, natus repellat dignissimos asperiores dolore nesciunt?",
        "category": "Food & Culture",
        "eventDate": "2025-09-12T11:00:00",
        "endDate": "2025-09-12T20:00:00",
        "priceStartingFrom": 300,
        "venue": {
            "name": "Tundikhel Ground",
            "address": "Kathmandu, Nepal",
            "latitude": 27.7027,
            "longitude": 85.3152
        },
        "organizer": {
            "name": "Taste Nepal Events",
            "contactEmail": "contact@tastenepal.com",
            "contactPhone": "+977-9865123456"
        },
        "tickets": [
            { "type": "General Entry", "price": 300, "available": 400, "currency": "NPR" },
            { "type": "VIP Food Pass", "price": 900, "available": 100, "currency": "NPR" }
        ],
        "images": ["/images/food-carnival.jpg"],
        "rating": 4.4,
        "status": "Upcoming"
    },

    {
        "id": "evt_005",
        "name": "Pokhara International Film Festival",
        "description": "A week-long film festival featuring Nepali, Bollywood, and international cinema, workshops, panel discussions, and meet-and-greet sessions with directors and actors. Lorem ipsum dolor sit amet consectetur adipisicing elit. Nisi numquam corporis, optio odio necessitatibus dolor ad ratione officia veritatis dolore, fuga non. Illo, ipsam atque repellat ducimus impedit nobis tempore.",
        "category": "Film",
        "eventDate": "2025-08-18T10:00:00",
        "endDate": "2025-08-25T18:00:00",
        "priceStartingFrom": 800,
        "venue": {
            "name": "Pokhara City Hall",
            "address": "Pokhara, Nepal",
            "latitude": 28.2096,
            "longitude": 83.9856
        },
        "organizer": {
            "name": "Pokhara Film Society",
            "contactEmail": "info@pfsnepal.org",
            "contactPhone": "+977-9808765432"
        },
        "tickets": [
            { "type": "Single Screening", "price": 800, "available": 300, "currency": "NPR" },
            { "type": "Festival Pass", "price": 2500, "available": 100, "currency": "NPR" }
        ],
        "images": ["/images/film-festival.jpg"],
        "rating": 4.7,
        "status": "Upcoming"
    },

    {
        "id": "evt_006",
        "name": "Yoga & Wellness Retreat 2025",
        "description": "A 3-day immersive retreat focused on yoga, meditation, mindfulness, and stress relief conducted by certified wellness trainers. Lorem ipsum dolor sit amet consectetur adipisicing elit. Dicta sint unde earum non sed rerum exercitationem minima voluptatum voluptatibus perspiciatis, esse maiores commodi quis aliquid aliquam a aut!",
        "category": "Health & Wellness",
        "eventDate": "2025-07-10T07:00:00",
        "endDate": "2025-07-12T17:00:00",
        "priceStartingFrom": 5000,
        "venue": {
            "name": "Namo Buddha Resort",
            "address": "Kavre, Nepal",
            "latitude": 27.59,
            "longitude": 85.598
        },
        "organizer": {
            "name": "Mindfulness Nepal",
            "contactEmail": "hello@mindfulnessnepal.com",
            "contactPhone": "+977-9810098000"
        },
        "tickets": [
            { "type": "Standard Package", "price": 5000, "available": 40, "currency": "NPR" },
            { "type": "Premium Package", "price": 7500, "available": 20, "currency": "NPR" }
        ],
        "images": ["/images/yoga-retreat.jpg"],
        "rating": 4.9,
        "status": "Upcoming"
    },

    {
        "id": "evt_007",
        "name": "Startup Summit Nepal 2025",
        "description": "The largest entrepreneurship summit in Nepal featuring keynote speakers, investors, startup pitches, workshops, and high-level networking opportunities. Lorem ipsum dolor sit amet consectetur adipisicing elit. Aperiam voluptates ipsum pariatur ipsa tenetur, illum labore ex voluptatibus eligendi iure soluta maxime at omnis facere!",
        "category": "Business",
        "eventDate": "2025-11-10T09:00:00",
        "endDate": "2025-11-11T17:00:00",
        "priceStartingFrom": 1200,
        "venue": {
            "name": "Soaltee Kathmandu",
            "address": "Tahachal, Kathmandu",
            "latitude": 27.6944,
            "longitude": 85.2983
        },
        "organizer": {
            "name": "Entrepreneur Nepal",
            "contactEmail": "contact@entrepreneurnp.com",
            "contactPhone": "+977-9851033344"
        },
        "tickets": [
            { "type": "General", "price": 1200, "available": 200, "currency": "NPR" },
            { "type": "VIP Networking", "price": 3000, "available": 80, "currency": "NPR" }
        ],
        "images": ["/images/startup-summit.jpg"],
        "rating": 4.5,
        "status": "Upcoming"
    },

    {
        "id": "evt_008",
        "name": "Chitwan Wildlife Photography Tour",
        "description": "A guided wildlife and jungle photography tour inside Chitwan National Park with professional wildlife photographers. Lorem ipsum dolor sit amet consectetur adipisicing elit. Commodi, temporibus voluptates nihil cupiditate quam placeat molestias at, quaerat fuga architecto necessitatibus dolorem ratione molestiae aspernatur excepturi similique neque exercitationem illum!",
        "category": "Adventure",
        "eventDate": "2025-06-15T05:00:00",
        "endDate": "2025-06-16T18:00:00",
        "priceStartingFrom": 4500,
        "venue": {
            "name": "Chitwan National Park",
            "address": "Sauraha, Chitwan",
            "latitude": 27.5833,
            "longitude": 84.4833
        },
        "organizer": {
            "name": "Wild Nepal Adventures",
            "contactEmail": "info@wildnepal.com",
            "contactPhone": "+977-9803125698"
        },
        "tickets": [
            { "type": "Standard", "price": 4500, "available": 40, "currency": "NPR" },
            { "type": "Premium Close-Up Tour", "price": 7500, "available": 15, "currency": "NPR" }
        ],
        "images": ["/images/wildlife-tour.jpg"],
        "rating": 4.8,
        "status": "Upcoming"
    },

    {
        "id": "evt_009",
        "name": "Winter Carnival & Ice Show 2025",
        "description": "A winter-themed entertainment event featuring ice skating shows, snow zones, carnival rides, food stalls, and fun games for families. Lorem ipsum dolor sit amet consectetur adipisicing elit. Rerum eius quo obcaecati a id culpa, earum eum dolore perspiciatis repellendus commodi! Atque, quasi quo.",
        "category": "Entertainment",
        "eventDate": "2025-12-05T12:00:00",
        "endDate": "2025-12-06T20:00:00",
        "priceStartingFrom": 600,
        "venue": {
            "name": "Bharatpur Arena",
            "address": "Chitwan, Nepal",
            "latitude": 27.664,
            "longitude": 84.439
        },
        "organizer": {
            "name": "Nepal Winter Events",
            "contactEmail": "winter@nepalevents.com",
            "contactPhone": "+977-9818000000"
        },
        "tickets": [
            { "type": "General Entry", "price": 600, "available": 350, "currency": "NPR" },
            { "type": "Ice Show Pass", "price": 1200, "available": 120, "currency": "NPR" }
        ],
        "images": ["/images/winter-carnival.jpg"],
        "rating": 4.3,
        "status": "Upcoming"
    },

    {
        "id": "evt_010",
        "name": "Live Stand-up Comedy Night",
        "description": "A hilarious evening featuring Nepal’s top stand-up comedians performing live at an intimate venue with interactive comedy segments. Lorem ipsum dolor sit amet consectetur adipisicing elit. Mollitia esse veniam, enim dignissimos maxime sint fuga temporibus illum maiores rerum delectus velit voluptatum ullam deserunt!",
        "category": "Comedy",
        "eventDate": "2025-05-28T18:30:00",
        "endDate": "2025-05-28T21:00:00",
        "priceStartingFrom": 700,
        "venue": {
            "name": "Moksh Live",
            "address": "Pulchowk, Lalitpur",
            "latitude": 27.673,
            "longitude": 85.316
        },
        "organizer": {
            "name": "Laugh Out Loud Nepal",
            "contactEmail": "laugh@lolnepal.com",
            "contactPhone": "+977-9807766554"
        },
        "tickets": [
            { "type": "General", "price": 700, "available": 100, "currency": "NPR" },
            { "type": "Front Row", "price": 1200, "available": 40, "currency": "NPR" }
        ],
        "images": ["/images/comedy-night.jpg"],
        "rating": 4.6,
        "status": "Upcoming"
    }

];


const EventDetailPage = () => {
    const { id } = useParams()
    const filteredEvent = eventData.filter((item) => item.id === id)

    return (
        <div className='max-w-7xl mx-auto'>
            {filteredEvent.map((item) => (
                <div key={item.id} className="flex gap-4">
                    <div className="w-[75%]">
                        <div className="relative w-full h-[600px]">
                            <Image src="/test.jpeg" width={500} height={500} alt="Picture of the author" className='absolute w-full h-full object-cover' />
                        </div>
                        <div className="mt-8 space-y-2">
                            <h3 className='text-xl font-semibold'>{item.name}</h3>
                            <p className='text-sm'>{item.description}</p>
                        </div>
                    </div>

                    <div className="w-[25%]">
                        <div className="border-2 p-4 space-y-4">
                            <span className='text-lg font-bold'>Select Your Tickets</span>

                            <div className="flex justify-between items-center">
                                <div className='flex flex-col items-start'>
                                    <span className='font-bold text-primary/50'>General Admission</span>
                                    <span className='font-semibold text-orange-400'>{item.priceStartingFrom}</span>
                                    <span className='text-xs text-primary/40'>Sale ends on Oct,2024</span>
                                </div>
                                <div className=""></div>
                            </div>

                            <div className="flex justify-between items-center">
                                <div className='flex flex-col items-start'>
                                    <span className='font-bold text-primary/50'>VIP Access</span>
                                    <span className='font-semibold text-orange-400'>{item.priceStartingFrom}</span>
                                    <span className='text-xs text-primary/40'>Selling fast!!</span>
                                </div>
                                <div className=""></div>
                            </div>
                        </div>
                    </div>
                </div>
            ))}
        </div>
    )
}

export default EventDetailPage