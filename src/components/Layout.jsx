// src/components/Layout.jsx
import React from 'react';
import Navbar from './Navbar'; 
import Footer from './Footer';

function Layout({ children, isLoggedIn, onAuthAction }) {
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
  
    </div>
  );
}

export default Layout;