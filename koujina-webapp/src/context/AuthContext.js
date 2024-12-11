// src/context/AuthContext.js

import React, { createContext, useEffect, useState } from "react";

import { api } from "../services/api";
import { useNavigate } from "react-router-dom";

export const AuthContext = createContext({
    isLoggedIn: false,
    login: () => {},
    logout: () => {},
    loading: false,
    setLoading: () => {}
});

export const AuthProvider = ({ children }) => {
    const [isLoggedIn, setIsLoggedIn] = useState(!!localStorage.getItem("token"));
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    const login = async (email, password) => {
        setLoading(true);
        try {
            const response = await api.login({ email, password });
            if (response.data && response.data.token) {
                localStorage.setItem("token", response.data.token);
                setIsLoggedIn(true);
                navigate("/menu");
            }
        } catch (error) {
            console.error("Login failed:", error);
            alert("Failed to login. Please try again.");
        } finally {
            setLoading(false);
        }
    };

    const logout = () => {
        localStorage.removeItem("token");
        setIsLoggedIn(false);
        navigate("/");
    };

    useEffect(() => {
        const handleStorageChange = () => {
            setIsLoggedIn(!!localStorage.getItem("token"));
        };
        window.addEventListener("storage", handleStorageChange);
        return () => window.removeEventListener("storage", handleStorageChange);
    }, []);

    return (
        <AuthContext.Provider value={{ isLoggedIn, login, logout, loading, setLoading }}>
            {children}
        </AuthContext.Provider>
    );
};
