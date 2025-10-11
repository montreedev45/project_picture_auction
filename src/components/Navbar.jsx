// src/components/Navbar.jsx
import React from 'react';
import {Icon} from '@iconify/react'
import { Link } from 'react-router-dom'; 

function Navbar({ isLoggedIn, onAuthAction }) { 
  
  const authButtons = isLoggedIn ? (
    <div className="auth-group">
      <button onClick={() => onAuthAction('logout')} className="nav-button sign-in-text">
        Logout
      </button>
    </div>
  ) : (
    <div className="auth-group">
      <Link to="/login" className="nav-button sign-in-text">
        sign in
      </Link>
      <Link to="/SignUp" className="nav-button sign-up-btn" style={{backgroundColor: 'white', color: 'blue'}}>
        sign up
      </Link>
    </div>
  );

  return (
    <nav>
      <div className="navbar-left">
        <Link to="/" className='navbar-brand'><Icon className="icon-logo" icon="mdi:gavel"/> Picture Auction</Link>
      </div>
      
      <div className="navbar-center" >
        <div className="search-input-wrapper">
          <input type="text" className="navbar-search" />
          <Icon icon="mdi:magnify" className="search-icon-overlay" />
         
        </div>
      </div>
      
      <div className="navbar-right">
        {authButtons}
      </div>
    </nav>
  );
}

export default Navbar;