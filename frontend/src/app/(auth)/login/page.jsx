"use client"

import Image from "next/image"
import { z } from "zod"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { Button } from "@/components/ui/button"
import {
    Form,
    FormControl,
    FormDescription,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "@/components/ui/form"
import { Input } from "@/components/ui/input"

const formSchema = z.object({
    username: z.string().min(2, {
        message: "Username must be at least 2 characters.",
    }),
})

const Login = () => {
    // 1. Define your form.
    const form = useForm({
        resolver: zodResolver(formSchema),
        defaultValues: {
            username: "",
        },
    })

    // 2. Define a submit handler.
    function onSubmit(values) {
        // Do something with the form values.
        // ✅ This will be type-safe and validated.
        console.log(values)
    }
    return (
        <div className="max-w-7xl mx-auto min-h-screen flex items-center justify-center">
            <div className="w-full flex items-center gap-20 overflow-hidden rounded-3xl drop-shadow-2xl">
                <div className="w-1/2">
                    <div className="relative w-full h-[600px]">
                        <Image src="/test.jpeg" width={500} height={500} alt="Picture of the author" className='absolute w-full h-full object-cover' />
                    </div>
                </div>
                <div className="w-1/2 space-y-8">
                    <h3 className="text-center font-bold text-xl">Bookly</h3>

                    <div className="mt-4">
                        <div className="flex flex-col">
                            <span className="text-2xl font-semibold">Welcome Back!</span>
                            <span className="text-sm">Login  to your account</span>
                        </div>
                    </div>

                    {/* FORM */}
                    <Form {...form}>
                        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                            <FormField
                                control={form.control}
                                name="username"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Email or Username</FormLabel>
                                        <FormControl>
                                            <Input placeholder="Enter your email or username" {...field} />
                                        </FormControl>

                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                            <FormField
                                control={form.control}
                                name="username"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Password</FormLabel>
                                        <FormControl>
                                            <Input placeholder="Enter your password" {...field} />
                                        </FormControl>

                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                            <Button className="w-full" type="submit">Login</Button>
                        </form>
                    </Form>

                    <span className="text-center">New to Bookly? Create an account</span>

                </div>
            </div>
        </div>
    )
}

export default Login