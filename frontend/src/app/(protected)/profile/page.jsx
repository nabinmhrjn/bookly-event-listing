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
import { toast } from "sonner";

const formSchema = z.object({
    fullName: z
        .string()
        .min(2, {
            message: "Username must be at least 2 characters.",
        }),
    email: z
        .string()
        .min(1, "Email address is required")
        .email("Invalid email address"),
});

const UserProfilePage = () => {
    const { user, updateUser } = useAuth();
    const [userData, setUserData] = useState(null);
    const [loading, setLoading] = useState(false)

    const form = useForm({
        resolver: zodResolver(formSchema),
        defaultValues: {
            fullName: "",
            email: "",
        },
    });

    useEffect(() => {
        const fetchUserData = async () => {
            const response = await api.get(`/users/${user._id}`);
            setUserData(response.data);

            form.reset({
                fullName: response.data.fullName || "",
                email: response.data.email || "",
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

    const onSubmit = async (values) => {
        setLoading(true)
        try {
            const response = await updateUser(user._id, values);
            setUserData(response.user);
            form.reset({
                fullName: response.user.fullName,
                email: response.user.email,
            });
            toast.success(response.message || "Profile updated successfully!");
        } catch (error) {
            console.error("Error updating user: ", error)
            const errorMessage = error.response?.data?.message || "Failed to update user. Please try again.";
            toast.error(errorMessage);
        } finally {
            setLoading(false)
        }
    }
    return (
        <div className="bg-secondary pt-14 pb-16">
            <div className="max-w-4xl mx-auto">
                <div className="p-4 flex justify-between items-center bg-white">
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
                <div className="p-4 bg-white">
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
                                        name="fullName"
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
                                        name="email"
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
                            <Button type="submit" disabled={!form.formState.isDirty || loading}>
                                {loading ? "Saving..." : "Save Changes"}
                            </Button>
                        </form>
                    </Form>
                </div>
            </div>
        </div>
    );
};

export default UserProfilePage;
