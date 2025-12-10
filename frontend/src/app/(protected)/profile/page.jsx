"use client";

import { Button } from "@/components/ui/button";
import Image from "next/image";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { useAuth } from "@/context/AuthContext";
import api from "@/lib/axios";
import { useEffect, useState } from "react";

const formSchema = z.object({
    fullname: z
        .string()
        .min(2, {
            message: "Username must be at least 2 characters.",
        }),
    emailaddress: z
        .string()
        .min(1, "Email address is required")
        .email("Invalid email address"),
});

const UserProfilePage = () => {
    const { user } = useAuth();
    const [userData, setUserData] = useState(null);

    const form = useForm({
        resolver: zodResolver(formSchema),
        defaultValues: {
            fullname: "",
            emailaddress: "",
        },
    });

    useEffect(() => {
        const fetchUserData = async () => {
            const response = await api.get(`/users/${user._id}`);
            setUserData(response.data);

            form.reset({
                fullname: response.data.fullName || "",
                emailaddress: response.data.email || "",
            });
        };

        if (user?._id) {
            fetchUserData();
        }
    }, [user?._id, form]);

    const formattedDate = userData?.createdAt
        ? new Date(userData.createdAt).toLocaleDateString("en-US", {
            month: "short",
            day: "2-digit",
            year: "numeric",
        })
        : "";

    function onSubmit(values) {
        console.log(values);
    }
    return (
        <div className="bg-primary/5 pt-14 pb-16">
            <div className="max-w-4xl mx-auto">
                <div className="bg-white p-4 flex justify-between items-center">
                    <div className="flex gap-4 items-center">
                        <div className="w-20 h-20 rounded-full relative overflow-hidden">
                            <Image
                                src="/test.jpeg"
                                loading="eager"
                                width={500}
                                height={500}
                                alt="Picture of the author"
                                className="absolute w-full h-full object-cover"
                            />
                        </div>
                        <div className="">
                            <p className="text-lg font-bold">{userData?.fullName}</p>
                            <p className="text-xs text-primary/60">
                                Joined <span>{formattedDate}</span>
                            </p>
                        </div>
                    </div>
                </div>
            </div>

            <div className="max-w-4xl mx-auto mt-8">
                <div className="bg-white p-4">
                    <div className="">
                        <p className="tet-lg font-bold">Personal Details</p>
                        <p className="text-xs text-primary/40">
                            Update your profile photo and personal details
                        </p>
                    </div>
                    <div className="flex gap-4 items-center mt-8">
                        <div className="w-14 h-14 rounded-full relative overflow-hidden">
                            <Image
                                src="/test.jpeg"
                                loading="eager"
                                width={500}
                                height={500}
                                alt="Picture of the author"
                                className="absolute w-full h-full object-cover"
                            />
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
                                                    <Input
                                                        placeholder="Enter your full name"
                                                        {...field}
                                                    />
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
                                        name="emailaddress"
                                        render={({ field }) => (
                                            <FormItem>
                                                <FormLabel>Email Address</FormLabel>
                                                <FormControl>
                                                    <Input
                                                        placeholder="Enter your email address"
                                                        {...field}
                                                    />
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
    );
};

export default UserProfilePage;
