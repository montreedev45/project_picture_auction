// src/components/Layout.jsx
import React from 'react';
import NavbarError from './NavbarError'; 
import Navbar from './Navbar'
import { useLocation } from 'react-router-dom';
import Footer from './Footer';

function Layout({ children, isLoggedIn, onAuthAction  }) {
  const location = useLocation();
  console.log(location)
  const NavbarError2 = location.pathname.startsWith("/Page404")
  const NavbarError3 = location.pathname.startsWith("/Page500")
  const currentPath = location.pathname; // ตัวอย่าง: "/" หรือ "/auctions"
  const pathsToHideFooter = ['/login', '/SignUp','/Page404','/Page500', ]; 
  const shouldHideFooter = pathsToHideFooter.includes(currentPath);

  return (
    <>
    
    {NavbarError2 || NavbarError3 ? <NavbarError /> : <Navbar />}
    {/* Check nav */}
    <div className="layout-container">
      
      {/* Navbar จะแสดงปุ่ม Login/Logout ตามสถานะ */}
      

      {/* ส่วนหลักที่เปลี่ยนไปตาม URL (นี่คือตำแหน่งของ LoginPage เมื่อ URL เป็น /login) */}
      <main className="layout-main">
        {children} 
      </main>
  

      {!shouldHideFooter && (
        <Footer /> // หรือ <div>... Footer Content ...</div>
      )}
    </div>
    </>
  );
}

export default Layout;