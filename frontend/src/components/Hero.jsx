import Image from "next/image"
import { Button } from "./ui/button"

const Hero = () => {
    return (
        <div>
            <div className="flex flex-col items-start justify-center gap-4">
                <div className="relative w-full h-[510px] overflow-hidden">
                    <Image src="/test.jpeg" width={2000} height={2000} alt="banner image" loading="eager" className="absolute w-full h-full object-cover" />
                    {/* <div className="absolute w-full h-full bg-black/60"></div> */}
                </div>

            </div>
        </div>
    )
}

export default Hero