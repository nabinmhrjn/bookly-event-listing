import Image from "next/image"
import { Button } from "./ui/button"
import { ArrowRight, Calendar, MapPin, Sparkles } from "lucide-react"
import Link from "next/link"

const Hero = () => {
    return (
        <div className="relative w-full h-[350px] overflow-hidden">
            <Image
                src="/test.jpeg"
                fill
                alt="Hero background"
                loading="eager"
                className="object-cover object-center"
                priority
            />
            <div className="absolute inset-0 bg-linear-to-b from-black/60 via-black/50 to-black/70 z-10"></div>
            <div className="relative z-20 h-full flex items-center">
                <div className="max-w-7xl mx-auto w-full">
                    <div className="max-w-2xl space-y-2">
                        <h1 className="text-5xl md:text-6xl lg:text-7xl font-bold text-white">
                            Your Next Great
                            <span className="text-primary"> Experience </span> Awaits
                        </h1>
                        <p className="text-md md:text-md text-white/90 max-w-xl leading-relaxed">
                            From electrifying concerts to inspiring workshops, find and book the perfect event that moves you. Join thousands discovering unforgettable experiences.
                        </p>
                        <div className="flex flex-col sm:flex-row gap-4 pt-4">
                            <Link href="/events">
                                <Button size="lg" className="text-base px-8 group">
                                    Browse Events
                                    <ArrowRight className="transition-transform" size={20} />
                                </Button>
                            </Link>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default Hero