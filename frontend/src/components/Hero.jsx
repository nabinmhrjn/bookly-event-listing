import Image from "next/image"
import { Button } from "./ui/button"

const Hero = () => {
    return (
        <div className="bg-[#F5F6F8]">
            <div className="mx-auto max-w-7xl flex flex-col items-start justify-center gap-4 py-12">
                <div className="relative w-full h-[600px] overflow-hidden">
                    <Image src="/test.jpeg" width={2000} height={2000} alt="banner image" loading="eager" className="absolute w-full h-full object-cover" />
                    {/* <div className="absolute w-full h-full bg-black/60"></div> */}
                    {/* <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 z-20">
                        <div className="w-[650px] text-center">
                            <h1 className="text-7xl font-bold text-white">Discover Your Next Experience</h1>
                        </div>
                        <div className="w-[550px] text-center">
                            <h4 className="text-md font-medium text-white">Find and book the best events, concerts, workshops and other events happening near you</h4>
                        </div>

                    </div> */}
                </div>

            </div>
        </div>
    )
}

export default Hero