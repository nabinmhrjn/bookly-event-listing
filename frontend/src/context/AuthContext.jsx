"use client"

import { createContext, useContext, useState, useEffect } from 'react';
import api from '@/lib/axios';

const AuthContext = createContext(null);

export const useAuth = () => {
    const context = useContext(AuthContext);
    if (!context) {
        throw new Error('useAuth must be used within AuthProvider');
    }
    return context;
};

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);

    // Check if user is logged in on mount
    useEffect(() => {
        const initAuth = () => {
            const token = localStorage.getItem('token');
            const userData = localStorage.getItem('user');

            if (token && userData) {
                setUser(JSON.parse(userData));
            }
            setLoading(false);
        };

        initAuth();
    }, []);

    const signup = async (userData) => {
        try {
            const response = await api.post('/users/signup', userData);

            // Store token and user data
            if (response.data.token) {
                localStorage.setItem('token', response.data.token);
            }

            if (response.data.user) {
                localStorage.setItem('user', JSON.stringify(response.data.user));
                setUser(response.data.user);
            }

            return response.data;
        } catch (error) {
            // Re-throw the error so component can handle it
            throw error;
        }
    };

    const login = async (credentials) => {
        try {
            const response = await api.post('/users/login', credentials);

            if (response.data.token) {
                localStorage.setItem('token', response.data.token);
            }

            if (response.data.user) {
                localStorage.setItem('user', JSON.stringify(response.data.user));
                setUser(response.data.user);
            }

            return response.data;
        } catch (error) {
            // Re-throw the error so component can handle it
            throw error;
        }
    };

    const logout = () => {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        setUser(null);
    };

    return (
        <AuthContext.Provider value={{ user, loading, signup, login, logout }}>
            {children}
        </AuthContext.Provider>
    );
};
