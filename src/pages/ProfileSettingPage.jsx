import React, { useState, useEffect } from "react";
import { Link, useParams } from "react-router-dom"; // 💡 Tech Stack: ใช้ useParams สำหรับดึง ID
import { Icon } from "@iconify/react"; // ✅ Tech Stack: การใช้ Iconify
import "./ProfileSettingPage.css";
import axios from "axios";

const MOCK_USER_ID = "1";

function ProfileSettingPage() {

  const [userProfile, setUserProfile] = useState({ 
    id: "",
    username: "",
    firstname: "",
    lastname: "",
    email: "",
    phone: "",
    adddress: ""
  });

  const [formData, setFormData] = useState({ // State สำหรับ Form ที่จะถูกแก้ไข
    username: "",
    currentPassword: "", // สำหรับยืนยันการเปลี่ยนข้อมูล
    newPassword: "",
    confirmPassword: "",
    firstname: "",
    lastname: "",
    email: "",
    phone: "",
    adddress: ""
  });

  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [apiMessage, setApiMessage] = useState(null); // สำหรับข้อความ Success/Error

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({ ...prevData, [name]: value }));
  };

  const showpass = () => setShowPassword((prev) => !prev);
  const inputType = showPassword ? "text" : "password";

  const showconfirmpass = () => setShowConfirmPassword((prev) => !prev);
  const inputConfirmType = showConfirmPassword ? "text" : "password";

  useEffect(() => {
    //const userId = MOCK_USER_ID; // 💡 ใช้ ID จริงที่ได้จากการ Login
    const userId = localStorage.getItem('userId');
    console.log(`user id : ${userId}`)
    const fecth_user_profile = async () => {
      setError(null);
      setLoading(true);

      try {
        const API_URL = `http://localhost:5000/api/auction/users/${userId}`;
        const res = await axios.get(API_URL);
        
        const user = res.data.user || {}; 

        setUserProfile(user); 
        setFormData({ 
            username: user.username || "", 
            firstname: user.firstname || "", 
            lastname: user.lastname || "", 
            phone: user.phone || "", 
            email: user.email || "", 
            adddress: user.address || "", 
            // ไม่ต้องใส่ password ใน form state, ใส่แค่ช่องที่จะเปลี่ยน
            currentPassword: "", 
            newPassword: "",
            confirmPassword: "",
        });
        
        console.log("User Profile Fetched:", user);
        
      } catch (err) {
        const errorMsg =
          err.response?.data?.message || "Failed to fetch user profile.";

        setError(errorMsg);
        setUserProfile({});
        console.error("Fetch Error:", errorMsg);
      } finally {
        setLoading(false);
      }
    };

    fecth_user_profile();
  }, []);




  // 3. Update Profile Logic (Business Logic/CRUD)
  // ----------------------------------------------------------------
  const handleSubmit = async (e) => {
      e.preventDefault();
      setLoading(true);
      setApiMessage(null);
      setError(null);
      
      const userId = localStorage.getItem('userId');

      try {
          const API_URL = `http://localhost:5000/api/auction/users/${userId}`;
          // 💡 Tech Stack: ใช้ Git/Postman ในการตรวจสอบ Body ของ Request
          // ส่งเฉพาะข้อมูลที่ต้องการอัปเดต
          const updateData = {
            username: formData.username,
            firstname: user.firstname , 
            lastname: user.lastname , 
            phone: user.phone , 
            email: user.email , 
            adddress: user.address ,
              // Business Logic: ส่งรหัสผ่านใหม่ไปเมื่อมีการกรอกเท่านั้น
              ...(formData.newPassword && { 
                  newPassword: formData.newPassword,
                  currentPassword: formData.currentPassword 
              })
          };
          
          const res = await axios.put(API_URL, updateData); // หรือ PATCH
          
          setApiMessage(res.data.message || "Profile updated successfully!");
          setUserProfile(prev => ({...prev, username: formData.username}));
          
      } catch (err) {
           const errorMsg =
            err.response?.data?.message || "Failed to update profile.";
            
           setError(errorMsg);
           setApiMessage(null);
           console.error("Update Error:", errorMsg);
           
      } finally {
          setLoading(false);
      }
  };




  return (
    <>
      <div className="profile-setting-div-text">
        <h1>Profile Setting</h1>
      </div>
      <div className="profile-setting-container">
        <form className="profile-setting-container-form" onSubmit={handleSubmit}>
          <div className="div-img">
            <div className="div-mdi-user">
              <Icon icon="mdi:user" className="mdi-user" />
            </div>
            <div className="custom-file-upload">
              <input
                type="file"
                id="file-upload-input"
                className="hidden-input"
              />

              {/* 💡 Label นี้จะทำหน้าที่เป็นปุ่มที่เรามองเห็น */}
              <label htmlFor="file-upload-input" className="custom-button">
                Change
              </label>
            </div>
          </div>
          <div className="profile-div-username">
            <Icon className="icon-username" icon="mdi:email-outline" />
            <input
              className="input-username"
              type="text"
              placeholder="Username"
              id="username"
              name="username"
              value={formData.username}
              onChange={handleChange}
              required
            />
          </div>

          <div className="profile-div-firstname">
            <Icon className="icon-firstname" icon="mdi:email-outline" />
            <input
              className="input-firstname"
              type="text"
              placeholder="First name"
              id="firstname"
              name="firstname"
              value={formData.firstname}
              onChange={handleChange}
              required
            />
          </div>

          <div className="profile-div-lastname">
            <Icon className="icon-lastname" icon="mdi:email-outline" />
            <input
              className="input-lastname"
              type="text"
              placeholder="Last name"
              id="lastname"
              name="lastname"
              value={formData.lastname}
              onChange={handleChange}
              required
            />
          </div>

          <div className="profile-div-email">
            <Icon className="icon-email" icon="mdi:email-outline" />
            <input
              className="input-email"
              type="email"
              placeholder="Email"
              id="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              required
            />
          </div>

          <div className="profile-div-phone">
            <Icon className="icon-phone" icon="mdi:email-outline" />
            <input
              className="input-phone"
              type="text"
              placeholder="Phone"
              id="phone"
              name="phone"
              value={formData.phone}
              onChange={handleChange}
              required
            />
          </div>

          <div className="profile-div-address">
            <Icon className="icon-address" icon="mdi:email-outline" />
            <input
              className="input-address"
              type="text"
              placeholder="Address"
              id="address"
              name="address"
              value={formData.adddress}
              onChange={handleChange}
              required
            />
          </div>
          {/* <div className="profile-div-password">
            <Icon className="icon-password" icon="mdi:lock-outline" />
            <input
              className="input-password"
              type={inputConfirmType}
              placeholder="Password"
              id="password-2"
              name="password-2"
              required
            />
            <span>
              <Icon
                className="eyeregis"
                onClick={showconfirmpass}
                icon="material-symbols-light:eye-tracking-outline"
              ></Icon>
            </span>
          </div> */}

          <button type="submit" className="button-submit">
            save
          </button>
        </form>
      </div>
    </>
  );
}

export default ProfileSettingPage;
