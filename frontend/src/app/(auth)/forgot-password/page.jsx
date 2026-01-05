"use client"

import { Button } from "@/components/ui/button";
import { ArrowLeftIcon } from "lucide-react";
import { useRouter } from "next/navigation";
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
import { useState } from "react";
import api from "@/lib/axios";
import { toast } from "sonner";


const formSchema = z.object({
    email: z
        .string()
        .min(1, { message: "Email is required" })
        .email({ message: "Invalid email address" }),
});

const ForgotPassword = () => {
    const router = useRouter();
    const [loading, setLoading] = useState(false);
    const [emailSent, setEmailSent] = useState(false);

    const form = useForm({
        resolver: zodResolver(formSchema),
        defaultValues: {
            email: "",
        }
    });

    const onSubmit = async (data) => {
        try {
            setLoading(true);
            const response = await api.post("/users/forgot-password", {
                email: data.email
            });

            toast.success(response.data.message);
            setEmailSent(true);

            // in development, log the reset URL
            if (response.data.resetUrl) {
                console.log("Reset URL:", response.data.resetUrl);
                toast.info("Check console for reset link (dev mode)");
            }

            form.reset();
        } catch (error) {
            console.error("Error sending reset email:", error);
            toast.error(error.response?.data?.message || "Failed to send reset email");
        } finally {
            setLoading(false);
        }
    }

    return (
        <div className='bg-secondary'>
            <div className="max-w-xl mx-auto min-h-screen flex flex-col items-start justify-center">
                <div className="w-full flex items-center overflow-hidden rounded-xl drop-shadow-2xl bg-white">
                    <div className="w-full space-y-8 p-12">
                        <div>
                            <div className="flex flex-col">
                                <span className="text-2xl font-semibold">
                                    Forgot Password?
                                </span>
                                <span className="text-sm text-muted-foreground">
                                    Enter your email address and we'll send you a link to reset your password
                                </span>
                            </div>
                        </div>

                        <Form {...form}>
                            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                                <FormField
                                    control={form.control}
                                    name="email"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>Email</FormLabel>
                                            <FormControl>
                                                <Input
                                                    placeholder="Enter your email"
                                                    disabled={loading}
                                                    {...field}
                                                />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                                <Button className="w-full" type="submit" disabled={loading}>
                                    {loading ? "Sending..." : "Send Reset Link"}
                                </Button>
                            </form>
                        </Form>

                        <div className="text-center text-sm">
                            <span
                                className="text-slate-600 cursor-pointer hover:underline"
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

export default ForgotPassword