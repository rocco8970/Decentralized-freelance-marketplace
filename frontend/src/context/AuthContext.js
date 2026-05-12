import React, { createContext, useState, useEffect } from 'react';
import axios from 'axios';

export const AuthContext = createContext();

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [token, setToken] = useState(localStorage.getItem('token') || null);
    const [loading, setLoading] = useState(true);

    const login = async (email, password) => {
        try {
            const res = await axios.post(`${API_URL}/auth/login`, { email, password });
            localStorage.setItem('token', res.data.token);
            setToken(res.data.token);
            setUser(res.data.user);
            return { success: true };
        } catch (error) {
            const message = error.response?.data?.message || 'Login Failed';
            return { success: false, message };
        }
    };

    const register = async (name, email, password) => {
        try {
            await axios.post(`${API_URL}/auth/register`, { name, email, password });
            return { success: true, message: 'Registration Successful! Please login.' };
        } catch (error) {
            const message = error.response?.data?.message || 'Registration Failed';
            return { success: false, message };
        }
    };

    const logout = () => {
        localStorage.removeItem('token');
        setToken(null);
        setUser(null);
    };

    const fetchProfile = async () => {
        const storedToken = localStorage.getItem('token');
        if (!storedToken) {
            setLoading(false);
            return;
        }
        try {
            const res = await axios.get(`${API_URL}/users/profile`, {
                headers: { Authorization: `Bearer ${storedToken}` }
            });
            setUser(res.data.user);
            setToken(storedToken);
        } catch (error) {
            localStorage.removeItem('token');
            setToken(null);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchProfile();
    }, []);

    return (
        <AuthContext.Provider value={{ user, token, login, register, logout, loading }}>
            {children}
        </AuthContext.Provider>
    );
};
