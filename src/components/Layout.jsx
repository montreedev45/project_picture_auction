import React from 'react';
import NavbarError from './NavbarError'; 
import Navbar from './Navbar'
import { useLocation } from 'react-router-dom';
import Footer from './Footer';

function Layout({ children }) { 
  const location = useLocation();
  const currentPath = location.pathname; 

  // 💡 Logic การตรวจสอบว่าควรแสดง NavbarError หรือไม่
  const isErrorPage = currentPath.startsWith("/Page404") || currentPath.startsWith("/Page500");

  // 💡 Logic การซ่อน Footer
  const pathsToHideFooter = ['/login', '/SignUp','/Page404','/Page500', ]; 
  const shouldHideFooter = pathsToHideFooter.includes(currentPath);

  return (
    <>
      {isErrorPage ? <NavbarError /> : <Navbar/>} 
      
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