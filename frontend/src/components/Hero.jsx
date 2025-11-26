import { Button } from "./ui/button"

const Hero = () => {
    return (
        <div className="bg-primary/20">
            <div className=" mx-auto max-w-7xl flex flex-col items-start justify-center gap-4 py-32">
                <div className="w-[50%]">
                    <h1 className="text-6xl font-semibold">Your Next Unforgettable Event Awaits</h1>
                </div>
                <div className="w-[30%]">
                    <p>Discover, book and experience the best events in your city. From concerts to workshop, your next great story starts here.</p>
                </div>
                <div className="mt-4 flex gap-4">
                    <Button>Explore Events</Button>
                    <Button variant="outline">Create Event</Button>
                </div>
            </div>
        </div>
    )
}

export default Hero