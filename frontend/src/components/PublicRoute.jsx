"use client"

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';

export default function PublicRoute({ children }) {
    const { user, loading } = useAuth();
    const router = useRouter();

    useEffect(() => {
        // If user is authenticated, redirect to home page
        if (!loading && user) {
            router.push('/');
        }
    }, [user, loading, router]);

    // Show ONLY loading screen while checking authentication
    if (loading) {
        return (
            <div className="fixed inset-0 flex items-center justify-center bg-white z-50">
                <div className="text-center">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900 mx-auto"></div>
                    <p className="mt-4 text-gray-600">Loading...</p>
                </div>
            </div>
        );
    }

    // Don't render auth pages if already authenticated
    if (user) {
        return null;
    }

    // User is not authenticated, render the public content (login/signup)
    return <>{children}</>;
}
