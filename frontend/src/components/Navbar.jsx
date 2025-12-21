"use client";

import Link from "next/link";
import { Button, buttonVariants } from "./ui/button";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "./ui/dropdown-menu";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";
import { LogOut, Plug, Settings, Ticket, User } from "lucide-react";
import { useAuth } from "@/context/AuthContext";
import { ModeToggle } from "@/components/ModeToggle"

const Navbar = () => {
    const { user, logout, loading } = useAuth();

    const handleLogout = () => {
        logout();
    };

    return (
        <header className="py-4 sticky top-0 z-40 border-b border-slate-200 bg-white/80 backdrop-blur">
            <div className=" max-w-7xl mx-auto flex justify-between items-center">

                {/* LOGO */}
                <Link href="/" className="flex items-center gap-2 cursor-pointer">
                    <div className='w-8 h-8 bg-primary rounded flex items-center justify-center'>
                        <Ticket className='text-white font-semibold' size={20} />
                    </div>
                    <h3 className='text-xl font-semibold'>Bookly</h3>
                </Link>

                {/* MENU */}
                <nav className="flex items-center text-sm font-medium tracking-normal">
                    <Link href="/events" className="px-5 py-2">
                        <span className="text-slate-600 hover:text-slate-900 transition">Events</span>
                    </Link>
                    <Link href="/#" className="px-5 py-2">
                        <span className="text-slate-600 hover:text-slate-900 transition">About</span>
                    </Link>
                    <Link href="/#" className="px-5 py-2">
                        <span className="text-slate-600 hover:text-slate-900 transition">Contact</span>
                    </Link>
                </nav>


                {/* AUTH BUTTONS */}
                <div className="flex items-center gap-2">
                    <div className=" mr-2">
                        <ModeToggle />
                    </div>
                    {loading ? (
                        // Show skeleton/placeholder while loading
                        <div className="flex items-center gap-2">
                            <div className="h-10 w-10 rounded-full bg-gray-100 animate-pulse" />
                            {/* <div className="h-4 w-24 bg-gray-100 rounded animate-pulse" /> */}
                        </div>
                    ) : user ? (
                        <DropdownMenu>
                            <DropdownMenuTrigger className="flex items-center gap-2">
                                <Avatar>
                                    <AvatarImage
                                        src={
                                            user.profileImage ||
                                            "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQGsDTHdxkYt2qXH-sZoWC_V0sM319EKvaBtg&s"
                                        }
                                    />
                                    <AvatarFallback>
                                        {user.fullName
                                            ? user.fullName
                                                .split(" ")
                                                .map((n) => n[0])
                                                .join("")
                                                .toUpperCase()
                                            : "U"}
                                    </AvatarFallback>
                                </Avatar>
                                {/* <span>{user.fullName || user.email}</span> */}
                            </DropdownMenuTrigger>
                            <DropdownMenuContent sideOffset={10} align="end">
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

                                <DropdownMenuItem onClick={handleLogout}>
                                    <LogOut className="h-[1.2rem] w-[1.2rem] mr-2" />
                                    Logout
                                </DropdownMenuItem>
                            </DropdownMenuContent>
                        </DropdownMenu>
                    ) : (
                        <Link className={buttonVariants()} href="/login">Log In</Link>
                    )
                    }
                </div>
            </div>
        </header>
    );
};

export default Navbar;
