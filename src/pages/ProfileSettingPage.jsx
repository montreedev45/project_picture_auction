import React, { useState } from 'react'; // ✅ Tech Stack: นำเข้า useState
import { Link } from 'react-router-dom';
import { Icon } from '@iconify/react';
import './ProfileSettingPage.css'
import view1 from '../assets/view1-ai-gen.png'
import view2 from '../assets/view2-ai-gen.png'
import { initialProducts } from '../components/MockData';


// Tech Stack: Mock Data (เพิ่ม property 'isLiked' เริ่มต้น)


function ProfileSettingPage() {
    // ✅ Tech Stack: State Management สำหรับรายการ (Array State)
    const [products, setProducts] = useState(initialProducts);
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);

    const showpass = () => {
        setShowPassword(prev => !prev);
    };
    const inputType = showPassword ? 'password' : 'text';

    const showconfirmpass = () => {
        setShowConfirmPassword(prev => !prev);
    };
    const inputConfirmType = showConfirmPassword ? 'password' : 'text';



    return (
        <>
            <div className='profile-setting-div-text'>
                <h1>Profile Setting</h1>
            </div>
            <div className="profile-setting-container">
                <form className="profile-setting-container-form">
                    <div className="div-img">
                        <div className='div-mdi-user'>
                            <Icon icon="mdi:user" className="mdi-user" />

                        </div>
                        <div className="custom-file-upload">
                            <input type="file" id="file-upload-input" className="hidden-input" />
                            
                            {/* 💡 Label นี้จะทำหน้าที่เป็นปุ่มที่เรามองเห็น */}
                            <label htmlFor="file-upload-input" className="custom-button">
                                Change
                            </label>
                        </div>
                    </div>
                    <div className="profile-div-username">
                        <Icon className='icon-username' icon='mdi:email-outline' />
                        <input className="input-username" type="text" placeholder="Email or Username" id="username" name="username" required />
                    </div>
            
                    <div className="profile-div-password" >
                        <Icon className='icon-password' icon='mdi:lock-outline' />
                        <input className="input-password" type={inputType} placeholder='Password' id="password" name="password"  required />
                        <span><Icon className='eyeregis' onClick={showpass} icon="material-symbols-light:eye-tracking-outline"></Icon></span>
                    </div>
                    
                    <div className="profile-div-password" >
                        <Icon className='icon-password' icon='mdi:lock-outline' />
                        <input className="input-password" type={inputConfirmType} placeholder='Confirm Password' id="password-2" name="password-2"  required />
                        <span><Icon className='eyeregis'onClick={showconfirmpass} icon="material-symbols-light:eye-tracking-outline"></Icon></span>
                    </div>
            
                    
                    <button type="submit" className="button-submit">
                        save
                    </button>
                </form>
                    
            </div>
        </>
    );
}

export default ProfileSettingPage;
