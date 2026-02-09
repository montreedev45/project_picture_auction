import { useState } from "react";
import { Icon } from "@iconify/react";
import { Link, useLocation } from "react-router-dom";
import { useAuth } from "./AuthContext";

function Navbar() {
  const { isLoggedIn, logout, userProfile } = useAuth(); // ⬅️ ดึงสถานะและฟังก์ชันจาก Context
  //console.log('userProfile : ',userProfile)
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [menuList, setMenulist] = useState(false);

  const location = useLocation();
  const currentPath = location.pathname;
  const pathsToHideInputSearch = ["/search"];
  const shouldHideInputSearch = pathsToHideInputSearch.includes(currentPath);

  const handleAccountClick = () => {
    setIsMenuOpen((prev) => !prev);
    setMenulist((prev) => !prev);
  };

  const handleLogout = () => {
    logout();
    setIsMenuOpen(false);
  };

  const authButtons = isLoggedIn ? (
    <div className="auth-group-1">
      <button className="icon-profile" onClick={handleAccountClick}>
        {userProfile?.profilePicUrl ? (
          <img // ถ้า userProfile เป็น null บรรทัดนี้จะไม่ถูกประมวลผล
            src={userProfile.profilePicUrl}
            alt="Profile"
            className="navbar-profile-pic"
          />
        ) : (
          <Icon icon="mdi:user" className="mdi:userAC" /> // แสดง Icon เมื่อไม่มีรูปภาพ
        )}
      </button>
      {isMenuOpen && (
        <div className="dropdown">
          <Link
            className="Link"
            to="/profile-setting"
            onClick={() => setIsMenuOpen(false)}
          >
            <Icon icon="mdi:user" className="Link-icon" />
            Profile Setting
          </Link>
          <Link
            className="Link"
            to="/DashBoard "
            onClick={() => setIsMenuOpen(false)}
          >
            <Icon icon="ix:piechart-filled" className="Link-icon" />
            Dash Board
          </Link>
          <Link
            className="Link"
            to="/mybid"
            onClick={() => setIsMenuOpen(false)}
          >
            <Icon icon="mdi:gavel" className="Link-icon" />
            My Bids
          </Link>
          <Link
            className="Link"
            to="/mywinning"
            onClick={() => setIsMenuOpen(false)}
          >
            <Icon icon="healthicons:award-trophy" className="Link-icon" />
            My Winning
          </Link>
          <Link
            className="Link"
            to="/saveitem"
            onClick={() => setIsMenuOpen(false)}
          >
            <Icon icon="iconoir:star-solid" className="Link-icon" />
            Save Item
          </Link>
          <Link
            className="Link"
            to="/update-password"
            onClick={() => setIsMenuOpen(false)}
          >
            <Icon icon="" className="Link-icon" />
            Update Password
          </Link>
          <Link className="Link" to="/homepage" onClick={handleLogout}>
            <Icon
              icon="material-symbols:logout"
              className="Link-icon"
              id="hed"
            />
            Log Out
          </Link>
        </div>
      )}
    </div>
  ) : (
    <div className="auth-group">
      <div className="link-login">
        <Link to="/login" className="nav-button sign-in-text">
          <h4 className="sign-page">sign in</h4>
        </Link>
        <Link to="/SignUp" className="nav-button sign-up-btn">
          <h4 className="sign-page">Sign Up</h4>
        </Link>
      </div>

      {menuList && (
        <div className="dropdown">
          <Link className="Link" to="/login" onClick={() => setMenulist(false)}>
            <Icon icon="ri:lock-2-line" className="Link-icon" />
            Sign In
          </Link>
          <Link
            className="Link"
            to="/SignUp"
            onClick={() => setMenulist(false)}
          >
            <Icon icon="iconoir:star-solid" className="Link-icon" />
            Sign up
          </Link>
        </div>
      )}
    </div>
  );

  return (
    <nav>
      <ul>
        <div className="navbar-left">
          <Link to="/" className="navbar-brand">
            <Icon className="icon-logo" icon="mdi:gavel" /> Picture Auction
          </Link>
        </div>
        {!shouldHideInputSearch && (
          <div className="navbar-center">
            <div className="search-input-wrapper">
              <input type="text" className="navbar-search" />
              <Icon icon="mdi:magnify" className="search-icon-overlay" />
            </div>
          </div>
        )}
        <div className="navbar-right">{authButtons}</div>
        <div className="logo-menu-list">
          <Icon
            className="icons-menu-list"
            onClick={handleAccountClick}
            icon="mage:dash-menu"
          />
        </div>
      </ul>
      {/* <div className="navbar-left">
        <Link to="/" className="navbar-brand">
          <Icon className="icon-logo" icon="mdi:gavel" /> Picture Auction
        </Link>
      </div>
      {!shouldHideInputSearch && (
        <div className="navbar-center">
          <div className="search-input-wrapper">
            <input type="text" className="navbar-search" />
            <Icon icon="mdi:magnify" className="search-icon-overlay" />
          </div>
        </div>
      )}
      <div className="navbar-right">{authButtons}</div>
      <div className="logo-menu-list">
        <Icon
          className="icons-menu-list"
          onClick={handleAccountClick}
          icon="mage:dash-menu"
        />
      </div> */}
    </nav>
  );
}

export default Navbar;
