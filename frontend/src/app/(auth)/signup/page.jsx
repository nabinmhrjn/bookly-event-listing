"use client";

import Image from "next/image";
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
import { EyeIcon, EyeOffIcon } from "lucide-react";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContext";
import { toast } from "sonner";
import { handleApiError } from "@/lib/utils";
import { Spinner } from "@/components/ui/spinner";

const formSchema = z
    .object({
        fullName: z
            .string()
            .min(1, { message: "Full Name is required:" })
            .min(2, { message: "Full Name must be at least 2 characters long" })
            .max(50, { message: "Full Name must be at most 50 characters long" }),
        email: z
            .string()
            .min(1, { message: "Email is required" })
            .email({ message: "Invalid email address" }),
        password: z.string().min(1, { message: "Password is required" }),
        confirmPassword: z
            .string()
            .min(1, { message: "Confirm Password is required" }),
    })
    .refine(
        (data) => {
            // Only check password matching if both fields have values
            if (data.password && data.confirmPassword) {
                return data.password === data.confirmPassword;
            }
            return true; // Skip this validation if either field is empty
        },
        {
            message: "Passwords do not match",
            path: ["confirmPassword"],
        }
    );

const Signup = () => {
    const router = useRouter();

    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);
    const [loading, setLoading] = useState(false);
    const { signup } = useAuth();

    const form = useForm({
        resolver: zodResolver(formSchema),
        defaultValues: {
            fullName: "",
            email: "",
            password: "",
            confirmPassword: "",
        },
    });

    const onSubmit = async (values) => {
        setLoading(true);

        try {
            await signup(values);
            router.push("/");
        } catch (error) {
            toast.error(handleApiError(error));
            setLoading(false);
        }
    };

    return (
        <div className="max-w-7xl mx-auto min-h-screen flex items-center justify-center">
            <div className="w-full flex items-center gap-20 overflow-hidden rounded-3xl drop-shadow-2xl">
                <div className="w-1/2">
                    <div className="relative w-full h-[600px]">
                        <Image
                            src="/test.jpeg"
                            width={500}
                            height={500}
                            loading="eager"
                            alt="Picture of the author"
                            className="absolute w-full h-full object-cover"
                        />
                    </div>
                </div>
                <div className="w-1/2 space-y-8">
                    <h3 className="text-center font-bold text-xl">Bookly</h3>

                    <div className="mt-4">
                        <div className="flex flex-col">
                            <span className="text-2xl font-semibold">
                                Create Your Account
                            </span>
                            <span className="text-sm">
                                Join us to discover and book tickets for amazing events
                            </span>
                        </div>
                    </div>

                    {/* FORM */}
                    <Form {...form}>
                        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                            <FormField
                                control={form.control}
                                name="fullName"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Full Name</FormLabel>
                                        <FormControl>
                                            <Input placeholder="Enter your full name" {...field} />
                                        </FormControl>

                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                            <FormField
                                control={form.control}
                                name="email"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Email Address</FormLabel>
                                        <FormControl>
                                            <Input placeholder="Enter your email" {...field} />
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
                                            <div className="flex items-center gap-2 border border-primary/10">
                                                <Input
                                                    type={showPassword ? "text" : "password"}
                                                    placeholder="Enter your password"
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
                                            <div className="flex items-center gap-2 border border-primary/10">
                                                <Input
                                                    type={showConfirmPassword ? "text" : "password"}
                                                    placeholder="Confirm password"
                                                    {...field}
                                                    className="w-full border-none focus-visible:ring-0"
                                                />
                                                {showConfirmPassword ? (
                                                    <EyeIcon
                                                        onClick={() =>
                                                            setShowConfirmPassword(!showConfirmPassword)
                                                        }
                                                        size={18}
                                                        className="cursor-pointer text-primary/40 mr-2"
                                                    />
                                                ) : (
                                                    <EyeOffIcon
                                                        onClick={() =>
                                                            setShowConfirmPassword(!showConfirmPassword)
                                                        }
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
                                        Signing up...
                                    </>
                                ) : (
                                    "Sign Up"
                                )}
                            </Button>
                        </form>
                    </Form>

                    <span className="text-center">
                        Already have an account?{" "}
                        <span
                            className="text-blue-600 cursor-pointer"
                            onClick={() => router.push("/login")}
                        >
                            Login
                        </span>
                    </span>
                </div>
            </div>
        </div>
    );
};

export default Signup;
