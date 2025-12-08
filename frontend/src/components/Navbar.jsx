"use client";

import Link from "next/link";
import { Button } from "./ui/button";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "./ui/dropdown-menu";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";
import { LogOut, Plug, Settings, User } from "lucide-react";
import { useAuth } from "@/context/AuthContext";

const Navbar = () => {
    const { user, logout, loading } = useAuth();

    const handleLogout = () => {
        logout();
    };

    return (
        <nav className="max-w-7xl mx-auto flex justify-between items-center h-12">
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
                {loading ? (
                    // Show skeleton/placeholder while loading
                    <div className="flex items-center gap-2">
                        <div className="h-10 w-10 rounded-full bg-gray-100 animate-pulse" />
                        <div className="h-4 w-24 bg-gray-100 rounded animate-pulse" />
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
                            <span>{user.fullName || user.email}</span>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent sideOffset={8}>
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
                    <div className="flex gap-2">
                        <Link href="/login">
                            <Button>Login</Button>
                        </Link>
                        <Link href="/signup">
                            <Button variant="outline">Sign Up</Button>
                        </Link>
                    </div>
                )}
            </div>
        </nav>
    );
};

export default Navbar;
