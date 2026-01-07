"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { Home, ArrowLeft, Search, Ticket } from "lucide-react";
import { Button } from "@/components/ui/button";
import Image from "next/image";

export default function NotFound() {
    const router = useRouter();

    return (
        <div className="min-h-screen flex justify-center items-center">
            <span className="text-slate-600 text-3xl">Oops!! Page not found</span>
            <span></span>
        </div>
    );
}
