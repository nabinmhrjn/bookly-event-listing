"use client";

import Image from "next/image";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { Button } from "@/components/ui/button";
import {
    Form,
    FormControl,
    FormDescription,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { EyeIcon, EyeOffIcon } from "lucide-react";

const formSchema = z.object({
    email: z
        .string()
        .min(1, { message: "Email is required" })
        .email({ message: "Invalid email address" }),
    password: z
        .string()
        .min(1, { message: "Password is required" }),
});

const Login = () => {
    const router = useRouter();

    const [showPassword, setShowPassword] = useState(false);

    const form = useForm({
        resolver: zodResolver(formSchema),
        defaultValues: {
            email: "",
            password: "",
        },
    });

    function onSubmit(values) {
        console.log(values);
    }
    return (
        <div className="max-w-7xl mx-auto min-h-screen flex items-center justify-center">
            <div className="w-full flex items-center gap-20 overflow-hidden rounded-3xl drop-shadow-2xl">
                <div className="w-1/2">
                    <div className="relative w-full h-[600px]">
                        <Image
                            src="/test.jpeg"
                            width={500}
                            height={500}
                            alt="Picture of the author"
                            className="absolute w-full h-full object-cover"
                        />
                    </div>
                </div>
                <div className="w-1/2 space-y-8">
                    <h3 className="text-center font-bold text-xl">Bookly</h3>

                    <div className="mt-4">
                        <div className="flex flex-col">
                            <span className="text-2xl font-semibold">Welcome Back!</span>
                            <span className="text-sm">Login to your account</span>
                        </div>
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
                                                placeholder="Enter your email or username"
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
                            <Button className="w-full" type="submit">
                                Login
                            </Button>
                        </form>
                    </Form>

                    <div className="flex justify-between">
                        <span className="text-center">
                            New to Bookly?{" "}
                            <span
                                className="text-blue-600 cursor-pointer"
                                onClick={() => router.push("/signup")}
                            >
                                Create an account
                            </span>
                        </span>
                        <span>
                            <span
                                className="text-blue-600 cursor-pointer"
                                onClick={() => router.push("#")}
                            >
                                Forgot Password?
                            </span>
                        </span>
                    </div>

                </div>
            </div>
        </div>
    );
};

export default Login;
