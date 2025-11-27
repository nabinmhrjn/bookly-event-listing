"use client"

import Link from "next/link"
import { Button } from "./ui/button"
import { useState } from "react"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from "./ui/dropdown-menu"
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar"
import { LogOut, Plug, Settings, User } from "lucide-react"


const UserProfile = () => {
    return (
        <DropdownMenu>
            <DropdownMenuTrigger className="flex items-center gap-2">
                <Avatar>
                    <AvatarImage src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQGsDTHdxkYt2qXH-sZoWC_V0sM319EKvaBtg&s" />

                    <AvatarFallback>CN</AvatarFallback>
                </Avatar>
                <span>Navin Maharjan</span>
            </DropdownMenuTrigger>
            <DropdownMenuContent sideOffset={16}>
                <DropdownMenuLabel>My Account</DropdownMenuLabel>
                <DropdownMenuSeparator />
                <Link href="/profile">
                    <DropdownMenuItem>
                        <User className="h-[1.2rem] w-[1.2rem] mr-2" />
                        Profile
                    </DropdownMenuItem>
                </Link>
                <Link href="/bookings">
                    <DropdownMenuItem>
                        <Plug className="h-[1.2rem] w-[1.2rem] mr-2" />
                        Bookings
                    </DropdownMenuItem>
                </Link>
                <Link href="/listings">
                    <DropdownMenuItem>
                        <Plug className="h-[1.2rem] w-[1.2rem] mr-2" />
                        Listings
                    </DropdownMenuItem>
                </Link>

                <DropdownMenuItem>
                    <LogOut className="h-[1.2rem] w-[1.2rem] mr-2" />
                    Logout
                </DropdownMenuItem>
            </DropdownMenuContent>
        </DropdownMenu>
    )
}

const Navbar = () => {
    const [isLoggedIn, setIsLoggedId] = useState(true)
    return (
        <nav className='max-w-7xl mx-auto flex justify-between items-center py-4'>
            {/* LOGO */}
            <div className="">
                <h3>BOOKLY</h3>
            </div>

            {/* MENU */}
            <div className="flex items-center gap-4">
                <Link href="/">
                    <span className="cursor-pointer">Home</span>
                </Link>
                <Link href="/events">
                    <span className="cursor-pointer">Events</span>
                </Link>
                <Link href="/events">
                    <span className="cursor-pointer">Contact</span>
                </Link>




            </div>

            {/* AUTH BUTTONS */}
            <div className="flex items-center gap-2">
                {/* <Link href="/create">
                    <Button>Create Event</Button>
                </Link> */}

                {isLoggedIn ? (
                    <UserProfile />
                ) : (
                    <div className="flex gap-2">
                        <Link href="/login">
                            <Button>Login</Button>
                        </Link>
                        <Link href="/signup">
                            <Button>Sign Up</Button>
                        </Link>
                    </div>


                )}



            </div>
        </nav>
    )
}

export default Navbar