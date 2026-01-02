"use client"

import { Button } from "@/components/ui/button";
import { EyeIcon, EyeOffIcon } from "lucide-react";
import { useRouter, useSearchParams } from "next/navigation";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { useState, useEffect } from "react";
import api from "@/lib/axios";
import { toast } from "sonner";

const formSchema = z.object({
    newPassword: z
        .string()
        .min(6, { message: "Password must be at least 6 characters" }),
    confirmPassword: z
        .string()
        .min(6, { message: "Password must be at least 6 characters" }),
}).refine((data) => data.newPassword === data.confirmPassword, {
    message: "Passwords don't match",
    path: ["confirmPassword"],
});

const ResetPassword = () => {
    const router = useRouter();
    const searchParams = useSearchParams();
    const [loading, setLoading] = useState(false);
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);
    const [token, setToken] = useState("");

    useEffect(() => {
        const tokenFromUrl = searchParams.get("token");
        if (!tokenFromUrl) {
            toast.error("Invalid reset link");
            router.push("/forgot-password");
        } else {
            setToken(tokenFromUrl);
        }
    }, [searchParams, router]);

    const form = useForm({
        resolver: zodResolver(formSchema),
        defaultValues: {
            newPassword: "",
            confirmPassword: "",
        }
    });

    const onSubmit = async (data) => {
        try {
            setLoading(true);
            const response = await api.post("/users/reset-password", {
                token: token,
                newPassword: data.newPassword
            });

            toast.success(response.data.message);

            // Redirect to login after 2 seconds
            setTimeout(() => {
                router.push("/login");
            }, 2000);

        } catch (error) {
            console.error("Error resetting password:", error);
            toast.error(error.response?.data?.message || "Failed to reset password");
        } finally {
            setLoading(false);
        }
    }

    if (!token) {
        return null;
    }

    return (
        <div className='bg-secondary'>
            <div className="max-w-xl mx-auto min-h-screen flex flex-col items-start justify-center">
                <div className="w-full flex items-center overflow-hidden rounded-xl drop-shadow-2xl bg-white">
                    <div className="w-full space-y-8 p-12">
                        <div>
                            <div className="flex flex-col">
                                <span className="text-2xl font-semibold">
                                    Reset Your Password
                                </span>
                                <span className="text-sm text-muted-foreground">
                                    Enter your new password below
                                </span>
                            </div>
                        </div>

                        <Form {...form}>
                            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                                <FormField
                                    control={form.control}
                                    name="newPassword"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>New Password</FormLabel>
                                            <FormControl>
                                                <div className="flex items-center gap-2 border border-primary/10 rounded-md">
                                                    <Input
                                                        type={showPassword ? "text" : "password"}
                                                        placeholder="Enter new password"
                                                        disabled={loading}
                                                        {...field}
                                                        className="w-full border-none focus-visible:ring-0"
                                                    />
                                                    {showPassword ? (
                                                        <EyeIcon
                                                            onClick={() => setShowPassword(!showPassword)}
                                                            size={18}
                                                            className="cursor-pointer text-primary/40 mr-2"
                                                        />
                                                    ) : (
                                                        <EyeOffIcon
                                                            onClick={() => setShowPassword(!showPassword)}
                                                            size={18}
                                                            className="cursor-pointer text-primary/40 mr-2"
                                                        />
                                                    )}
                                                </div>
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                                <FormField
                                    control={form.control}
                                    name="confirmPassword"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>Confirm Password</FormLabel>
                                            <FormControl>
                                                <div className="flex items-center gap-2 border border-primary/10 rounded-md">
                                                    <Input
                                                        type={showConfirmPassword ? "text" : "password"}
                                                        placeholder="Confirm new password"
                                                        disabled={loading}
                                                        {...field}
                                                        className="w-full border-none focus-visible:ring-0"
                                                    />
                                                    {showConfirmPassword ? (
                                                        <EyeIcon
                                                            onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                                                            size={18}
                                                            className="cursor-pointer text-primary/40 mr-2"
                                                        />
                                                    ) : (
                                                        <EyeOffIcon
                                                            onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                                                            size={18}
                                                            className="cursor-pointer text-primary/40 mr-2"
                                                        />
                                                    )}
                                                </div>
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                                <Button className="w-full" type="submit" disabled={loading}>
                                    {loading ? "Resetting..." : "Reset Password"}
                                </Button>
                            </form>
                        </Form>

                        <div className="text-center text-sm">
                            <span
                                className="text-blue-600 cursor-pointer hover:underline"
                                onClick={() => router.push("/login")}
                            >
                                Back to Login
                            </span>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default ResetPassword
