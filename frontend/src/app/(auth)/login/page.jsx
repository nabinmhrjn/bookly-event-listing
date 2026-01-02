"use client";

import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { Button } from "@/components/ui/button";
import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { EyeIcon, EyeOffIcon, ArrowLeftIcon } from "lucide-react";
import { useAuth } from "@/context/AuthContext";
import { toast } from "sonner";
import { handleApiError } from "@/lib/utils";
import { Spinner } from "@/components/ui/spinner";

const formSchema = z.object({
    email: z
        .string()
        .min(1, { message: "Email is required" })
        .email({ message: "Invalid email address" }),
    password: z
        .string()
        .min(1, { message: "Password is required" })
        .min(6, { message: "Password must be at least 6 characters" }),
});

const Login = () => {
    const router = useRouter();
    const { login } = useAuth();
    const [showPassword, setShowPassword] = useState(false);
    const [loading, setLoading] = useState(false);

    const form = useForm({
        resolver: zodResolver(formSchema),
        defaultValues: {
            email: "",
            password: "",
        },
    });

    const onSubmit = async (values) => {
        setLoading(true);

        try {
            await login(values);
            router.push("/");

        } catch (error) {
            const errorMessage = handleApiError(error);
            toast.error(errorMessage);
            setLoading(false); // Only set loading to false on error
        }
    };

    return (
        <div className="bg-secondary">
            <div className="max-w-xl mx-auto min-h-screen flex items-start flex-col justify-center">
                <div className="mb-2">
                    <Button
                        variant="ghost"
                        onClick={() => router.push("/")}
                        className="flex items-center gap-2 hover:bg-transparent cursor-pointer"
                    >
                        <ArrowLeftIcon size={18} />
                        Back to Home
                    </Button>
                </div>

                <div className="w-full flex items-center overflow-hidden rounded-xl drop-shadow-2xl bg-white">
                    <div className="w-full space-y-8 p-12">
                        <div className="flex flex-col">
                            <span className="text-2xl font-semibold">Welcome Back!</span>
                            <span className="text-sm">Login to your account</span>
                        </div>

                        {/* FORM */}
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
                                <FormField
                                    control={form.control}
                                    name="password"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>Password</FormLabel>
                                            <FormControl>
                                                <div className="flex items-center gap-2 border border-primary/10 rounded-md">
                                                    <Input
                                                        type={showPassword ? "text" : "password"}
                                                        placeholder="Enter your password"
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
                                <Button className="w-full" type="submit" disabled={loading}>
                                    {loading ? (
                                        <>
                                            <Spinner className="mr-2" />
                                            Logging in...
                                        </>
                                    ) : (
                                        "Login"
                                    )}
                                </Button>
                            </form>
                        </Form>

                        <div className="flex justify-between">
                            <span className="text-center text-sm">
                                New to Bookly?{" "}
                                <span
                                    className="text-blue-600 cursor-pointer hover:underline text-sm"
                                    onClick={() => router.push("/signup")}
                                >
                                    Create an account
                                </span>
                            </span>
                            <span>
                                <span
                                    className="text-blue-600 cursor-pointer hover:underline text-sm"
                                    onClick={() => router.push("/forgot-password")}
                                >
                                    Forgot Password?
                                </span>
                            </span>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Login;