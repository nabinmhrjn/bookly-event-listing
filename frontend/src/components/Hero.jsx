import Image from "next/image"
import { Button } from "./ui/button"
import { ArrowRight, Calendar, MapPin, Sparkles } from "lucide-react"
import Link from "next/link"

const Hero = () => {
    return (
        <div className="relative w-full h-[450px] sm:h-[500px] md:h-[550px] lg:h-[600px] overflow-hidden">
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
                <div className="max-w-7xl mx-auto w-full px-4 sm:px-6 lg:px-8">
                    <div className="max-w-2xl space-y-3 sm:space-y-4">
                        <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold text-white leading-tight">
                            Your Next Great
                            <span className="text-primary"> Experience </span>Awaits
                        </h1>
                        <p className="text-sm sm:text-base md:text-lg text-white/90 max-w-xl leading-relaxed">
                            From electrifying concerts to inspiring workshops, find and book the perfect event that moves you. Join thousands discovering unforgettable experiences.
                        </p>
                        <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 pt-2 sm:pt-4">
                            <Link href="/events">
                                <Button size="lg" className="text-base px-8 w-full sm:w-auto group">
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