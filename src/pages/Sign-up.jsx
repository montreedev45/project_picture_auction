// src/pages/LoginPage.jsx
import React, { useState } from 'react';
import { Link } from 'react-router-dom';

import './Sign-up.css'
import { Icon } from '@iconify/react';

function SignUp({ onAuthAction }) {
  
  const [formData, setFormData] = useState({
    username: '',
    password: ''
  });
  
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prevData => ({ ...prevData, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault(); 
    
    // Logic ถูกตัดออก: เราแค่จำลองการ Login สำเร็จเพื่ออัปเดต Navbar
    console.log('Login Form Submitted (Mock):', formData);
    onAuthAction('login'); // ทำให้ Navbar เปลี่ยนเป็น Logout

  };

  return (
    <div className="container-regis">
      <h2>Join Our Community</h2>
      
      <form onSubmit={handleSubmit} >
        
        <div className="div-username">
          <Icon className='icon-username' icon='mdi:email-outline' />
          <input className="input-username" type="text" placeholder="Email or Username" id="username" name="username" value={formData.username} onChange={handleChange} required />
        </div>

        <div className="div-password" >
          <Icon className='icon-password' icon='mdi:lock-outline' />
          <input className="input-password" type="password" placeholder='Password' id="password" name="password" value={formData.password} onChange={handleChange} required />
          <span><Icon className='eyeregis' icon="material-symbols-light:eye-tracking-outline"></Icon></span>
        </div>
        
        <div className="div-password" >
          <Icon className='icon-password' icon='mdi:lock-outline' />
          <input className="input-password" type="password" placeholder='Confirm Password' id="password-2" name="password-2"  required />
         <span><Icon className='eyeregis' icon="material-symbols-light:eye-tracking-outline"></Icon></span>
        </div>

        
        <button type="submit" className="button-submit">
          sign in
        </button>
      </form>
      
    </div>
  );

}
export default SignUp;