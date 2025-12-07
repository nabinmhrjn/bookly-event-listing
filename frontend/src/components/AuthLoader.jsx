"use client"

import { useAuth } from "@/context/AuthContext";
import Loader from "./Loader";

const AuthLoader = () => {
    const { isAuthenticating } = useAuth();

    if (!isAuthenticating) return null;

    return <Loader />;
};

export default AuthLoader;
