import React, { createContext, useState, useEffect, useContext } from 'react';
import { useNavigate } from 'react-router-dom';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
    const [isLoggedIn, setIsLoggedIn] = useState(() => {
        const token = localStorage.getItem('jwt');
        return !!token; // คืนค่า true ถ้ามี Token, false ถ้าไม่มี
    }); 
    const navigate = useNavigate();

    /*
    useEffect(() => {
        // หากต้องการตรวจสอบ Token ที่หมดอายุ ให้ทำ API Call ตรวจสอบ Token ที่นี่
    }, []);
    */

    const login = (token) => {
        localStorage.setItem('jwt', token); 
        setIsLoggedIn(true);
    };

    const logout = () => {
        localStorage.clear(); 
        setIsLoggedIn(false);
        navigate('/login'); 
    };

    return (
        <AuthContext.Provider value={{ isLoggedIn, login, logout }}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => useContext(AuthContext);
