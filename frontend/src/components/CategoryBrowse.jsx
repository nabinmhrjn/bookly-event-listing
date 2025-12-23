import React from 'react'
import { Music, Lightbulb, Trophy, Theater, Wine, Palette } from 'lucide-react'
import { Button } from './ui/button'

const CategoryBrowse = () => {
    const categories = [
        {
            name: 'Concerts',
            icon: Music,
            color: 'text-blue-600',
            bgColor: 'bg-blue-50',
            hoverBg: 'hover:bg-blue-100',
            size: 14
        },
        {
            name: 'Workshops',
            icon: Lightbulb,
            color: 'text-blue-600',
            bgColor: 'bg-blue-50',
            hoverBg: 'hover:bg-blue-100',
            size: 14
        },
        {
            name: 'Sports',
            icon: Trophy,
            color: 'text-blue-600',
            bgColor: 'bg-blue-50',
            hoverBg: 'hover:bg-blue-100',
            size: 14
        },
        {
            name: 'Theater',
            icon: Theater,
            color: 'text-blue-600',
            bgColor: 'bg-blue-50',
            hoverBg: 'hover:bg-blue-100',
            size: 14
        },
        {
            name: 'Food & Drink',
            icon: Wine,
            color: 'text-blue-600',
            bgColor: 'bg-blue-50',
            hoverBg: 'hover:bg-blue-100',
            size: 14
        },
        {
            name: 'Arts',
            icon: Palette,
            color: 'text-blue-600',
            bgColor: 'bg-blue-50',
            hoverBg: 'hover:bg-blue-100',
            size: 14
        },
        {
            name: 'Arts',
            icon: Palette,
            color: 'text-blue-600',
            bgColor: 'bg-blue-50',
            hoverBg: 'hover:bg-blue-100',
            size: 14
        },
        {
            name: 'Arts',
            icon: Palette,
            color: 'text-blue-600',
            bgColor: 'bg-blue-50',
            hoverBg: 'hover:bg-blue-100',
            size: 14
        }
    ]

    return (
        <div className='w-full bg-[#F5F6F8]'>
            <div className='max-w-7xl mx-auto pb-14'>
                <h2 className='text-2xl font-bold text-gray-900 mb-4'>Browse Events</h2>

                <div className='grid grid-cols-2 md:grid-cols-3 lg:grid-cols-8 gap-4'>
                    {categories.map((category, index) => {
                        const Icon = category.icon
                        return (
                            <Button key={index} variant="outline" className="cursor-pointer">
                                <Icon className={`${category.color} font-bold`} size={category.size} />
                                <span className='text-sm font-medium text-gray-700 text-center'>
                                    {category.name}
                                </span>
                            </Button>
                        )
                    })}
                </div>
            </div>
        </div>
    )
}

export default CategoryBrowse