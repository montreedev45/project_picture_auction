// src/pages/LoginPage.jsx
import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';

import './Sign-up.css'
import { Icon } from '@iconify/react';

function SignUp({ onAuthAction }) {
  
  const [formData, setFormData] = useState({
    username: '',
    password: ''
  });

    const navigate = useNavigate()
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prevData => ({ ...prevData, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault(); 
    
    // Logic ถูกตัดออก: เราแค่จำลองการ Login สำเร็จเพื่ออัปเดต Navbar
    console.log('Login Form Submitted (Mock):', formData);
    navigate("/login")
  };

  const showpass = () => {
      console.log(showPassword)
        // เปลี่ยนค่า State จาก true เป็น false หรือ false เป็น true
        setShowPassword(prev => !prev);
    };
    const inputType = showPassword ? 'text' : 'password';

    const showconfirmpass = () => {
        setShowConfirmPassword(prev => !prev);
    };
    const inputConfirmType = showConfirmPassword ? 'text' : 'password';


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
          <input className="input-password" type={inputType} placeholder='Password' id="password" name="password" value={formData.password} onChange={handleChange} required />
          <span><Icon className='eyeregis' onClick={showpass} icon="material-symbols-light:eye-tracking-outline"></Icon></span>
        </div>
        
        <div className="div-password" >
          <Icon className='icon-password' icon='mdi:lock-outline' />
          <input className="input-password" type={inputConfirmType} placeholder='Confirm Password' id="password-2" name="password-2"  required />
         <span><Icon className='eyeregis'onClick={showconfirmpass} icon="material-symbols-light:eye-tracking-outline"></Icon></span>
        </div>

        
        <button type="submit" className="button-submit">
          sign up
        </button>
      </form>
      
    </div>
  );

}
export default SignUp;