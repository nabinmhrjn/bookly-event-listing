import { clsx } from "clsx";
import { twMerge } from "tailwind-merge"

export function cn(...inputs) {
  return twMerge(clsx(inputs));
}

export const handleApiError = (error) => {
  if (error.response) {
    // Server responded with error
    const { status, data } = error.response;

    switch (status) {
      case 400:
        return data.message || "Invalid input. Please check your data.";
      case 401:
        return "Authentication failed. Please login again.";
      case 409:
        return data.message || "This email is already registered.";
      case 500:
        return "Server error. Please try again later.";
      default:
        return data.message || "Something went wrong. Please try again.";
    }
  } else if (error.request) {
    return "Network error. Please check your internet connection.";
  } else {
    return "An unexpected error occurred.";
  }
};

