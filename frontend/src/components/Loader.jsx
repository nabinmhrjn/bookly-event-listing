import { cn } from "@/lib/utils"
import { LoaderIcon } from "lucide-react"

function Spinner({ className, ...props }) {
    return (
        <LoaderIcon
            role="status"
            aria-label="Loading"
            className={cn("size-4 animate-spin", className)}
            {...props}
        />
    )
}


const Loader = () => {
    return (
        <div className='w-full h-screen'>
            <Spinner />
        </div>
    )
}

export default Loader