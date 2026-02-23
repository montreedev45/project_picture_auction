import React from "react";
import { useState, useEffect } from "react";
import NavbarError from "./NavbarError";
import Navbar from "./Navbar";
import { useLocation } from "react-router-dom";
import Footer from "./Footer";

function Layout({ children }) {
  const location = useLocation();
  const currentPath = location.pathname;

  // 💡 Logic การตรวจสอบว่าควรแสดง NavbarError หรือไม่
  const isErrorPage =
    currentPath.startsWith("/Page404") || currentPath.startsWith("/Page500");

  // 💡 Logic การซ่อน Footer
  const pathsToHideFooter = ["/login", "/SignUp", "/Page404", "/Page500"];
  const shouldHideFooter = pathsToHideFooter.includes(currentPath);

  const [fix, setFix] = useState(false);

  function setFixed() {
    if (window.scrollY > 0) {
      setFix(true);
    } else {
      setFix(false);
    }
  }

  useEffect(() => {
    window.addEventListener("scroll", setFixed);
    return () => window.removeEventListener("scroll", setFixed);
  }, []);
  return (
    <>
      <div className="layout-container">
        <div className={fix ? "nav fixed" : "nav"}>
          {isErrorPage ? <NavbarError /> : <Navbar />}
        </div>
        <main className="layout-main">{children}</main>
      </div>
      <div className="footer-div">{!shouldHideFooter && <Footer />}</div>
    </>
  );
}

export default Layout;
