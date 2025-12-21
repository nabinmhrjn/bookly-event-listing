import Image from "next/image"
import { Button } from "./ui/button"

const Hero = () => {
    return (
        <div>
            <div className="mx-auto max-w-7xl flex flex-col items-start justify-center gap-4">
                <div className="relative w-full h-[310px] overflow-hidden bg-red-400">
                    <Image src="/christmas.avif" width={2000} height={2000} alt="banner image" loading="eager" className="absolute w-full h-full object-contain" />
                    {/* <div className="absolute w-full h-full bg-black/60"></div> */}
                </div>

            </div>
        </div>
    )
}

export default Hero