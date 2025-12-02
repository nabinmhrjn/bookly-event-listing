"use client"

import { Toggle } from "@/components/ui/toggle"
import { useState } from "react"

const TestPage = () => {
    const [selectedDay, setSelectedDay] = useState([])

    const handleDayChange = (day) => {
        setSelectedDay((prev) => {
            // if already selected, remove it (toggle)
            if (prev.includes(day)) {
                return prev.filter(d => d !== day)
            }
            // otherwise add it
            return [...prev, day]
        })
    }

    return (
        <div className="bg-primary/5 min-h-screen flex flex-col justify-center items-center">
            <div className="text-lg font-bold">
                {selectedDay.join("|")}
            </div>

            <div className="flex gap-2 flex-wrap mt-8">
                <Toggle
                    variant="outline"
                    pressed={selectedDay.includes("today")}
                    onPressedChange={() => handleDayChange('today')}
                >
                    Today
                </Toggle>
                <Toggle
                    variant="outline"
                    pressed={selectedDay.includes("tomorrow")}
                    onPressedChange={() => handleDayChange('tomorrow')}
                >
                    Tomorrow
                </Toggle>
                <Toggle
                    variant="outline"
                    pressed={selectedDay.includes("this-weekend")}
                    onPressedChange={() => handleDayChange('this-weekend')}
                >
                    This Weekend
                </Toggle>
            </div>
        </div>
    )
}

export default TestPage
