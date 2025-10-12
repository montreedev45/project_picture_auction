// src/components/Layout.jsx
import React from 'react';
import { useLocation } from 'react-router-dom';
import Navbar from './Navbar'; 
import Footer from './Footer';

function Layout({ children, isLoggedIn, onAuthAction }) {
    const location = useLocation();
    const currentPath = location.pathname; // ตัวอย่าง: "/" หรือ "/auctions"

    const pathsToHideFooter = ['/login', '/SignUp', ]; 

    const shouldHideFooter = pathsToHideFooter.includes(currentPath);

  return (
    <div className="layout-container">
      {/* Navbar จะแสดงปุ่ม Login/Logout ตามสถานะ */}
      <Navbar 
        isLoggedIn={isLoggedIn}
        onAuthAction={onAuthAction}
      />

      {/* ส่วนหลักที่เปลี่ยนไปตาม URL (นี่คือตำแหน่งของ LoginPage เมื่อ URL เป็น /login) */}
      <main className="layout-main">
        {children} 
      </main>
  

      {!shouldHideFooter && (
        <Footer /> // หรือ <div>... Footer Content ...</div>
      )}
    </div>
  );
}

export default Layout;