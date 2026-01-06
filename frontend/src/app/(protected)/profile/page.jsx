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
    const [loading, setLoading] = useState(false);
    const [selectedImage, setSelectedImage] = useState(null);
    const [imagePreview, setImagePreview] = useState(null);
    const [uploadingImage, setUploadingImage] = useState(false);

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

    const handleImageSelect = (e) => {
        const file = e.target.files?.[0];
        if (!file) return;

        // Validate file type
        const validTypes = ['image/jpeg', 'image/png'];
        if (!validTypes.includes(file.type)) {
            toast.error('Please select a JPG or PNG image');
            return;
        }

        // Validate file size (4MB)
        const maxSize = 4 * 1024 * 1024;
        if (file.size > maxSize) {
            toast.error('Image size must be less than 4MB');
            return;
        }

        setSelectedImage(file);

        // Create preview
        const reader = new FileReader();
        reader.onloadend = () => {
            setImagePreview(reader.result);
        };
        reader.readAsDataURL(file);
    };

    const handleImageUpload = async () => {
        if (!selectedImage) return;

        setUploadingImage(true);
        try {
            const formData = new FormData();
            formData.append('profileImage', selectedImage);
            formData.append('fullName', userData.fullName);
            formData.append('email', userData.email);

            const response = await updateUser(user._id, formData);
            setUserData(response.user);
            setSelectedImage(null);
            setImagePreview(null);
            toast.success('Profile image updated successfully!');
        } catch (error) {
            console.error('Error uploading image:', error);
            const errorMessage = error.response?.data?.message || 'Failed to upload image. Please try again.';
            toast.error(errorMessage);
        } finally {
            setUploadingImage(false);
        }
    };

    const handleCancelImageUpload = () => {
        setSelectedImage(null);
        setImagePreview(null);
    };

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
        <div className="bg-secondary pt-8 sm:pt-14 pb-12 sm:pb-16">
            <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="p-4 sm:p-6 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 sm:gap-0 bg-white rounded-lg">
                    <div className="flex gap-3 sm:gap-4 items-center">
                        <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-full relative overflow-hidden bg-gray-200 shrink-0">
                            <Image
                                src={user.profileImage || "/default-avatar.png"}
                                loading="eager"
                                width={500}
                                height={500}
                                alt="Profile picture"
                                className="absolute w-full h-full object-cover"
                            />
                        </div>
                        <div className="">
                            <p className="text-base sm:text-lg font-bold">{userData?.fullName}</p>
                            <p className="text-xs text-slate-600">
                                Joined <span>{formattedDate}</span>
                            </p>
                        </div>
                    </div>
                </div>
            </div>

            <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 mt-6 sm:mt-8">
                <div className="p-4 sm:p-6 bg-white rounded-lg">
                    <div className="">
                        <p className="text-base sm:text-lg font-bold">Personal Details</p>
                        <p className="text-xs sm:text-sm text-slate-600 mt-1">
                            Update your profile photo and personal details
                        </p>
                    </div>
                    <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 items-start sm:items-center mt-6 sm:mt-8">
                        <div className="w-12 h-12 sm:w-14 sm:h-14 rounded-full relative overflow-hidden bg-gray-200 shrink-0">
                            <Image
                                src={imagePreview || user.profileImage || "/default-avatar.png"}
                                loading="eager"
                                width={500}
                                height={500}
                                alt="Profile picture"
                                className="absolute w-full h-full object-cover"
                            />
                        </div>

                        {selectedImage ? (
                            <div className="flex gap-2">
                                <Button
                                    type="button"
                                    onClick={handleImageUpload}
                                    disabled={uploadingImage}
                                    size="sm"
                                >
                                    {uploadingImage ? "Uploading..." : "Upload"}
                                </Button>
                                <Button
                                    type="button"
                                    variant="outline"
                                    onClick={handleCancelImageUpload}
                                    disabled={uploadingImage}
                                    size="sm"
                                >
                                    Cancel
                                </Button>
                            </div>
                        ) : (
                            <>
                                <input
                                    type="file"
                                    id="profileImageInput"
                                    accept="image/jpeg,image/png"
                                    onChange={handleImageSelect}
                                    className="hidden"
                                />
                                <Button
                                    type="button"
                                    onClick={() => document.getElementById('profileImageInput').click()}
                                    size="sm"
                                >
                                    Upload New
                                </Button>
                            </>
                        )}
                    </div>

                    <Form {...form}>
                        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6 sm:space-y-8">
                            <div className="w-full flex flex-col sm:flex-row items-start gap-4 mt-6 sm:mt-8">
                                <div className="w-full sm:w-1/2">
                                    <FormField
                                        control={form.control}
                                        name="fullName"
                                        render={({ field }) => (
                                            <FormItem>
                                                <FormLabel>Full Name</FormLabel>
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
                                <div className="w-full sm:w-1/2">
                                    <FormField
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
