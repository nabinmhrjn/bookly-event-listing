"use client"

import { usePathname } from "next/navigation";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

export default function ConditionalLayout({ children }) {
    const pathname = usePathname();
    const isAuthPage = pathname === "/login" || pathname === "/signup" || pathname === "/forgot-password" || pathname === "/reset-password";

    if (isAuthPage) {
        return <>{children}</>;
    }

    return (
        <>
            <Navbar />
            {children}
            <Footer />
        </>
    );
}
