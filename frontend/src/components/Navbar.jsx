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
import { LogOut, Menu, Plug, Settings, Ticket, User, X } from "lucide-react";
import { useAuth } from "@/context/AuthContext";
import { ModeToggle } from "@/components/ModeToggle"
import { useState } from "react";

const Navbar = () => {
    const { user, logout, loading } = useAuth();
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

    const handleLogout = () => {
        logout();
    };

    const toggleMobileMenu = () => {
        setIsMobileMenuOpen(!isMobileMenuOpen);
    };

    const closeMobileMenu = () => {
        setIsMobileMenuOpen(false);
    };

    return (
        <header className="py-4 sticky top-0 z-40 border-b border-slate-200 bg-white/80 backdrop-blur">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex justify-between items-center">

                {/* LOGO */}
                <Link href="/" className="flex items-center gap-2 cursor-pointer">
                    <div className='w-8 h-8 bg-primary flex items-center justify-center'>
                        <Ticket className='text-white font-semibold' size={20} />
                    </div>
                    <h3 className='text-xl font-semibold'>Bookly</h3>
                </Link>

                {/* DESKTOP MENU */}
                <nav className="hidden md:flex items-center text-sm font-medium tracking-normal">
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


                {/* AUTH BUTTONS - DESKTOP */}
                <div className="hidden md:flex items-center gap-2">
                    {/* <div className="mr-2">
                        <ModeToggle />
                    </div> */}
                    {loading ? (
                        <div className="flex items-center gap-2">
                            <div className="h-10 w-10 rounded-full bg-gray-100 animate-pulse" />
                        </div>
                    ) : user ? (
                        <DropdownMenu>
                            <DropdownMenuTrigger className="flex items-center gap-2">
                                <Avatar>
                                    <AvatarImage
                                        src={user.profileImage || "/default-avatar.png"}
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
                                <span>Hi, {user.fullName}</span>
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

                {/* MOBILE MENU BUTTON & AUTH */}
                <div className="flex md:hidden items-center gap-2">
                    <div className="mr-2">
                        <ModeToggle />
                    </div>
                    {loading ? (
                        <div className="h-10 w-10 rounded-full bg-gray-100 animate-pulse" />
                    ) : user ? (
                        <DropdownMenu>
                            <DropdownMenuTrigger>
                                <Avatar>
                                    <AvatarImage
                                        src={user.profileImage || "/default-avatar.png"}
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
                            </DropdownMenuTrigger>
                            <DropdownMenuContent sideOffset={10} align="end">
                                <DropdownMenuLabel>My Account</DropdownMenuLabel>
                                <DropdownMenuSeparator />
                                <Link href="/profile" onClick={closeMobileMenu}>
                                    <DropdownMenuItem>
                                        <User className="h-[1.2rem] w-[1.2rem] mr-2" />
                                        Profile
                                    </DropdownMenuItem>
                                </Link>
                                <Link href="/bookings" onClick={closeMobileMenu}>
                                    <DropdownMenuItem>
                                        <Plug className="h-[1.2rem] w-[1.2rem] mr-2" />
                                        Bookings
                                    </DropdownMenuItem>
                                </Link>
                                <Link href="/listings" onClick={closeMobileMenu}>
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
                        <Link className={buttonVariants({ size: "sm" })} href="/login">Log In</Link>
                    )}

                    <Button
                        variant="ghost"
                        size="icon"
                        className="md:hidden"
                        onClick={toggleMobileMenu}
                    >
                        {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
                    </Button>
                </div>
            </div>

            {/* MOBILE MENU */}
            {isMobileMenuOpen && (
                <div className="md:hidden border-t border-slate-200 bg-white">
                    <nav className="flex flex-col px-4 py-4 space-y-2">
                        <Link
                            href="/events"
                            className="px-4 py-3 text-slate-600 hover:text-slate-900 hover:bg-slate-50 rounded-md transition"
                            onClick={closeMobileMenu}
                        >
                            Events
                        </Link>
                        <Link
                            href="/#"
                            className="px-4 py-3 text-slate-600 hover:text-slate-900 hover:bg-slate-50 rounded-md transition"
                            onClick={closeMobileMenu}
                        >
                            About
                        </Link>
                        <Link
                            href="/#"
                            className="px-4 py-3 text-slate-600 hover:text-slate-900 hover:bg-slate-50 rounded-md transition"
                            onClick={closeMobileMenu}
                        >
                            Contact
                        </Link>
                    </nav>
                </div>
            )}
        </header>
    );
};

export default Navbar;
