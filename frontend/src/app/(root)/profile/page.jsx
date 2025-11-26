"use client"

import { Button } from '@/components/ui/button'
import Image from 'next/image'
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { z } from "zod"
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
    fullname: z.string().min(2, {
        message: "Username must be at least 2 characters.",
    }),
    phonenumber: z.number().min(10, {
        message: "Phone number must be at least of 10 digits"
    }),
    emailaddress: z.email().min(1, "Email address is required")
})



const UserProfilePage = () => {
    const form = useForm({
        resolver: zodResolver(formSchema),
        defaultValues: {
            fullname: "Navin Maharjan",
            phonenumber: "9876543210",
            emailaddress: "nabin@bookly.com"
        },
    })
    function onSubmit(values) {
        console.log(values)
    }
    return (
        <div className="bg-primary/5 pt-14 pb-16">
            <div className="max-w-4xl mx-auto">
                <div className="bg-white p-4 flex justify-between items-center">
                    <div className="flex gap-4 items-center">
                        <div className="w-20 h-20 rounded-full relative overflow-hidden">
                            <Image src="/test.jpeg" loading='eager' width={500} height={500} alt="Picture of the author" className='absolute w-full h-full object-cover' />
                        </div>
                        <div className="">
                            <p className='text-lg font-bold'>Navin Maharjan</p>
                            <p className='text-xs text-primary/40'>Joined March 2023</p>
                        </div>
                    </div>

                </div>
            </div>

            <div className="max-w-4xl mx-auto mt-8">
                <div className="bg-white p-4">
                    <div className="">
                        <p className='tet-lg font-bold'>Personal Details</p>
                        <p className='text-xs text-primary/40'>Update your profile photo and personal details</p>
                    </div>
                    <div className="flex gap-4 items-center mt-8">
                        <div className="w-14 h-14 rounded-full relative overflow-hidden">
                            <Image src="/test.jpeg" loading='eager' width={500} height={500} alt="Picture of the author" className='absolute w-full h-full object-cover' />
                        </div>
                        <Button>Upload New</Button>
                        <Button>Delete</Button>
                    </div>


                    <Form {...form}>
                        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
                            <div className="w-full flex items-center gap-4 mt-8">
                                <div className="w-1/2">
                                    <FormField
                                        className="w-1/2"
                                        control={form.control}
                                        name="fullname"
                                        render={({ field }) => (
                                            <FormItem>
                                                <FormLabel>FullName</FormLabel>
                                                <FormControl>
                                                    <Input placeholder="Enter your full name" {...field} />
                                                </FormControl>
                                                <FormMessage />
                                            </FormItem>
                                        )}
                                    />
                                </div>
                                <div className="w-1/2">
                                    <FormField
                                        className="w-1/2"
                                        control={form.control}
                                        name="phonenumber"
                                        render={({ field }) => (
                                            <FormItem>
                                                <FormLabel>Phone Number</FormLabel>
                                                <FormControl>
                                                    <Input placeholder="Enter your phone number" {...field} />
                                                </FormControl>
                                                <FormMessage />
                                            </FormItem>
                                        )}
                                    />
                                </div>
                            </div>

                            <div className="w-full flex items-center gap-4 mt-8">
                                <div className="w-1/2">
                                    <FormField
                                        className="w-1/2"
                                        control={form.control}
                                        name="emailaddress"
                                        render={({ field }) => (
                                            <FormItem>
                                                <FormLabel>Email Address</FormLabel>
                                                <FormControl>
                                                    <Input placeholder="Enter your email address" {...field} />
                                                </FormControl>
                                                <FormMessage />
                                            </FormItem>
                                        )}
                                    />
                                </div>
                            </div>


                            <Button type="submit">Save Changes</Button>
                        </form>
                    </Form>

                </div>
            </div>
        </div>
    )
}

export default UserProfilePage