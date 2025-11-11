import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from './AuthContext'; // ⬅️ ดึงสถานะจาก Context

// 💡 Outlet มาจาก React Router DOM v6 ใช้แทน Component
const ProtectedRoute = () => {
    const { isLoggedIn } = useAuth(); 
    
    if (!isLoggedIn) {
        // ❌ ถ้ายังไม่ได้ Login ให้ Redirect ไปหน้า Login
        return <Navigate to="/login" replace />;
    }
    
    // ✅ ถ้า Login แล้ว ให้แสดง Child Component (เนื้อหาของหน้านั้น)
    return <Outlet />; 
};

export default ProtectedRoute;