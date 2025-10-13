// src/components/Navbar.jsx
import React from 'react';
import {Icon} from '@iconify/react'
import { Link } from 'react-router-dom'; 
import './NavError.css'

function NavbarError({ isLoggedIn, onAuthAction }) { 
  
  const authButtons = isLoggedIn ? (
    <div className="auth-group">
     
    </div>
  ) : (
    <div className="auth-group">
     
    </div>
  );

  return (
    <nav className='Navbar-404'>
      <Link to="/"><Icon className="icon-logo-404" icon="gravity-ui:caret-left"/></Link>
    </nav>
  );
}

export default NavbarError;