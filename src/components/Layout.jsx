// src/components/Layout.jsx
import React from 'react';
import NavbarError from './NavbarError'; 
import Navbar from './Navbar'
import { useLocation } from 'react-router-dom';
import Footer from './Footer';

function Layout({ children, isLoggedIn, onAuthAction  }) {
  const location = useLocation();
  const NavbarError2 = location.pathname.startsWith("/Page404")
  const NavbarError3 = location.pathname.startsWith("/Page500")
  const currentPath = location.pathname; // ตัวอย่าง: "/" หรือ "/auctions"
  const pathsToHideFooter = ['/login', '/SignUp','/Page404','/Page500', ]; 
  const shouldHideFooter = pathsToHideFooter.includes(currentPath);

  return (
    <>
    
    {NavbarError2 || NavbarError3 ? <NavbarError /> : <Navbar isLoggedIn={isLoggedIn} onAuthAction={onAuthAction}/>}
    <div className="layout-container">      

      <main className="layout-main">
        {children} 
      </main>

      {!shouldHideFooter && (
        <Footer />
      )}
    </div>
    </>
  );
}

export default Layout;