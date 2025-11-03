import { useState } from "react";
import { Icon } from "@iconify/react";
import { Link, useLocation } from "react-router-dom";

function Navbar({ isLoggedIn, onAuthAction }) {
  const [isMenuOpen, setIsMenuOpen] = useState(false); //state for dropdown

  const location = useLocation();
  const currentPath = location.pathname;
  const pathsToHideInputSearch = ["/search"];
  const shouldHideInputSearch = pathsToHideInputSearch.includes(currentPath); // hidden icon search if path= /search

  const handleAccountClick = () => {
    setIsMenuOpen((prev) => !prev);
  };

  const handleLogout = () => {
    onAuthAction("logout");
    setIsMenuOpen(false);
  };

  const authButtons = isLoggedIn ? (
    <div className="auth-group-1">
      <button className='icon-profile' onClick={handleAccountClick} >
        <Icon icon="mdi:user" className="mdi:user" />
      </button>

      {isMenuOpen && (
        <div className="dropdown">
          {/* Item 1: Profile */}
          <Link className="Link"
            to="/profile-setting"
            onClick={() => setIsMenuOpen(false)}
          >
            <Icon icon="mdi:user" className="Link-icon" />
            Profile Setting
          </Link>

          <Link className="Link"
            to="/DashBoard "
            onClick={() => setIsMenuOpen(false)}
          >
            <Icon icon="ix:piechart-filled" className="Link-icon" />
            Dash Board
          </Link>

          <Link className="Link"
            to="/mybid"
            onClick={() => setIsMenuOpen(false)}
          >
            <Icon icon="mdi:gavel" className="Link-icon" />
            My Bids
          </Link>

          {/* Item 2: Settings */}
          <Link className="Link"
            to="/mywinning"
            onClick={() => setIsMenuOpen(false)}
          >
            <Icon icon="healthicons:award-trophy" className="Link-icon" />
            My Winning
          </Link>

          <Link className="Link"
            to="/saveitem"
            onClick={() => setIsMenuOpen(false)}
          >
            <Icon icon="iconoir:star-solid" className="Link-icon" />
            Save Item
          </Link>

          {/* Item 3: Logout Button (มีเส้นแบ่ง) */}
          <Link className="Link"
            to="/update-password"
            onClick={() => setIsMenuOpen(false)}
          >
            <Icon icon="" className="Link-icon" />
            Update Password
          </Link>
          <Link className="Link"
            to="/homepage"
            onClick={handleLogout}
          >
            <Icon icon="material-symbols:logout" className="Link-icon" />
            Log Out
          </Link>
        </div>
      )}
    </div>
  ) : (
    <div className="auth-group">
      <Link to="/login" className="nav-button sign-in-text">
        sign in
      </Link>
      <Link
        to="/SignUp"
        className="nav-button sign-up-btn"
        style={{ backgroundColor: "white", color: "blue" }}
      >
        sign up
      </Link>
    </div>
  );

  return (
    <nav>
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
    </nav>
  );
}

export default Navbar;
