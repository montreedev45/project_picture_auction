import React, { useState, useEffect } from "react";
import { Link, useParams } from "react-router-dom"; // 💡 Tech Stack: ใช้ useParams สำหรับดึง ID
import { Icon } from "@iconify/react"; // ✅ Tech Stack: การใช้ Iconify
import "./ProfileSettingPage.css";
import axios from "axios";

function ProfileSettingPage() {
  const [userProfile, setUserProfile] = useState({
    acc_username: "",
    acc_firstname: "",
    acc_lastname: "",
    acc_email: "",
    acc_phone: "",
    acc_address: "",
  });

  const [formData, setFormData] = useState({
    // State สำหรับ Form ที่จะถูกแก้ไข
    acc_username: "",
    acc_firstname: "",
    acc_lastname: "",
    acc_email: "",
    acc_phone: "",
    acc_address: "",
  });

  const token = localStorage.getItem("jwt");

  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);
  const [apiMessage, setApiMessage] = useState(null); // สำหรับข้อความ Success/Error

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({ ...prevData, [name]: value }));
  };

  const getChangedFields = (originalData, formData) => {
    const changes = {};
    for (const key in formData) {
        // 1. ตรวจสอบว่า Field นั้นอยู่ใน originalData และไม่ใช่ Field รหัสผ่าน
        if (originalData.hasOwnProperty(key)) {
            
            // 2. เปรียบเทียบค่า
            if (originalData[key] !== formData[key]) {
                changes[key] = formData[key];
            }
        }
    }
    return changes; // Object นี้จะมีเฉพาะ Field ที่เปลี่ยน
};

  useEffect(() => {
    //const userId = MOCK_USER_ID; // 💡 ใช้ ID จริงที่ได้จากการ Login
    const userId = localStorage.getItem("acc_id");
    const fecth_user_profile = async () => {
      setError(null);
      setLoading(true);

      try {
        const API_URL = `http://localhost:5000/api/auction/users/${userId}`;
        const res = await axios.get(API_URL);

        const user = res.data.user || {};

        setUserProfile(user);
        setFormData({
          acc_username: user.acc_username || "",
          acc_firstname: user.acc_firstname || "",
          acc_lastname: user.acc_lastname || "",
          acc_phone: user.acc_phone || "",
          acc_email: user.acc_email || "",
          acc_address: user.acc_address || "",
        });
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

    const changesToSubmit = getChangedFields(userProfile, formData);

    if (Object.keys(changesToSubmit).length === 0) {
        setApiMessage("ไม่มีการเปลี่ยนแปลงข้อมูลที่ต้องบันทึก");
        return;
    }

    try {
      console.log(token);
      const API_URL = `http://localhost:5000/api/auction/users/profile`;
      // 💡 Tech Stack: ใช้ Git/Postman ในการตรวจสอบ Body ของ Request
      // ส่งเฉพาะข้อมูลที่ต้องการอัปเดต
      const updateData = {
        acc_username: formData.acc_username,
        acc_firstname: formData.acc_firstname,
        acc_lastname: formData.acc_lastname,
        acc_phone: formData.acc_phone,
        acc_email: formData.acc_email,
        acc_address: formData.acc_address,
      };

      // 1. Data (Payload) เป็น Argument ตัวที่สอง
      // 2. Configuration (Headers) เป็น Argument ตัวที่สาม
      const res = await axios.put(API_URL, changesToSubmit, {
        headers: {
          // 💡 Content-Type เป็นค่า Default อยู่แล้ว แต่ระบุไว้เพื่อความชัดเจน
          "Content-Type": "application/json",
          // 🔑 Authorization Header ที่ถูกต้อง
          Authorization: `Bearer ${token}`,
        },
      });
      setApiMessage(res.data.message || "Profile updated successfully!");
      setUserProfile((prev) => ({
        ...prev,
        acc_username: formData.acc_username,
      }));
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
        <form
          className="profile-setting-container-form"
          onSubmit={handleSubmit}
        >
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
              id="acc_username"
              name="acc_username"
              value={formData.acc_username}
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
              id="acc_firstname"
              name="acc_firstname"
              value={formData.acc_firstname}
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
              id="acc_lastname"
              name="acc_lastname"
              value={formData.acc_lastname}
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
              id="acc_email"
              name="acc_email"
              value={formData.acc_email}
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
              id="acc_phone"
              name="acc_phone"
              value={formData.acc_phone}
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
              id="acc_address"
              name="acc_address"
              value={formData.acc_address}
              onChange={handleChange}
              required
            />
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
