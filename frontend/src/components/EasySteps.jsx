import { Search } from "lucide-react"
import { Card, CardAction, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "./ui/card"

const easyStep = [
    {
        "id": "1",
        "icon": "Search",
        "title": "Discover",
        "description": "Browse our current list of events to find what excites you"
    },
    {
        "id": "2",
        "icon": "",
        "title": "Select",
        "description": "Browse our current list of events to find what excites you"
    },
    {
        "id": "3",
        "icon": "",
        "title": "Attend",
        "description": "Browse our current list of events to find what excites you"
    },

]

const EasySteps = () => {
    return (
        <div className='bg-white py-10'>
            <div className="max-w-7xl mx-auto">
                <div className="w-full flex flex-col items-center py-4">
                    <h3 className="font-bold text-3xl">Booking Tickets in 3 Easy Steps</h3>
                    <p>Getting your  tickets is as simple as it gets. Follow these three easy steps to secure your spot at the next big event.</p>
                </div>
                <div className="grid grid-cols-3 items-center gap-4">
                    {easyStep.map((item) => (
                        <div key={item.id} className="w-full p-8 flex flex-col items-center justify-center gap-2">
                            <div className="p-2 flex items-center justify-center bg-primary/10 rounded-full">
                                <Search />
                            </div>
                            <span className="text-xl font-extrabold">{item.title}</span>
                            <span className="text-center">{item.description}</span>
                        </div>
                    ))}
                </div>
            </div>

        </div>
    )
}

export default EasySteps

