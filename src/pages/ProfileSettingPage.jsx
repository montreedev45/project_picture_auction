import React, { useState, useEffect, useRef } from "react";
import { Link, useParams } from "react-router-dom";
import { Icon } from "@iconify/react";
import "./ProfileSettingPage.css";
import axios from "axios";
import { useError } from "../components/ErrorContext";
import { useAuth } from "../components/AuthContext";
const API_URL = import.meta.env.VITE_BACKEND_URL

function ProfileSettingPage() {
  const { setError } = useError();
  const fileInputRef = useRef(null);
  const { fetchUserProfile } = useAuth()
  const userId = localStorage.getItem("acc_id")
  const token = localStorage.getItem("jwt");

  const [userProfile, setUserProfile] = useState({
    acc_username: "",
    acc_firstname: "",
    acc_lastname: "",
    acc_email: "",
    acc_phone: "",
    acc_address: "",
    acc_profile_pic: null, // เพิ่ม field สำหรับเก็บ URL รูปโปรไฟล์เดิม
  });

  const [formData, setFormData] = useState({
    acc_username: "",
    acc_firstname: "",
    acc_lastname: "",
    acc_email: "",
    acc_phone: "",
    acc_address: "",
  });

  // State สำหรับแสดงภาพ Preview ทันทีที่ผู้ใช้เลือก
  const [profilePicPreview, setProfilePicPreview] = useState(null);


  const [loading, setLoading] = useState(true);
  const [apiMessage, setApiMessage] = useState(null);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({ ...prevData, [name]: value }));
  };

  // 💡 NEW: ฟังก์ชันสำหรับแสดงรูปภาพ Preview เมื่อผู้ใช้เลือกไฟล์
  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      // สร้าง URL ชั่วคราวสำหรับแสดงใน <img>
      setProfilePicPreview(URL.createObjectURL(file));
    } else {
      setProfilePicPreview(null);
    }
  };

  const getChangedFields = (originalData, currentData) => {
    // ฟังก์ชันนี้จะถูกใช้เพื่อตรวจสอบว่ามีการเปลี่ยนแปลง Text Data หรือไม่
    const changes = {};
    for (const key in currentData) {
      if (originalData.hasOwnProperty(key)) {
        if (originalData[key] !== currentData[key]) {
          changes[key] = currentData[key];
        }
      }
    }
    // console.log(changes);
    return changes;
  };

  useEffect(() => {
    const userId = localStorage.getItem("acc_id");

    const fecth_user_profile = async () => {
      setError(null);
      setLoading(true);

      try {
        const URL = `${API_URL}/api/auction/users/${userId}`;
        // 💡 Tech Stack: ควรกำหนด Header Authorization สำหรับการดึงข้อมูลส่วนตัวด้วย
        const res = await axios.get(URL, {
          headers: { Authorization: `Bearer ${token}` },
        });

        const user = res.data.user || {};

        // ตั้งค่ารูปภาพ Profile เดิมสำหรับแสดงผล
        const profilePicUrl = user.acc_profile_pic
          ? `${API_URL}/images/profiles/${user.acc_profile_pic}`
          : null;

        setUserProfile({
          ...user,
          acc_profile_pic: user.acc_profile_pic,
        });

        // ตั้งค่า Preview ให้แสดงรูปเดิมถ้ามี
        setProfilePicPreview(profilePicUrl);

        setFormData({
          acc_username: user.acc_username || "",
          acc_firstname: user.acc_firstname || "",
          acc_lastname: user.acc_lastname || "",
          acc_phone: user.acc_phone || "",
          acc_email: user.acc_email || "",
          acc_address: user.acc_address || "",
        });
      } catch (error) {
        let errorMessage = "Failed to fetch user profile.";
        if (
          error.response &&
          error.response.data &&
          error.response.data.message
        ) {
          errorMessage = error.response.data.message;
        }
        setError(errorMessage);
        setUserProfile({});
      } finally {
        setLoading(false);
      }
    };

    fecth_user_profile();
  }, [token]); // เพิ่ม token ใน dependency array

  // ----------------------------------------------------------------
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setApiMessage(null);
    setError(null);

    // 1. สร้าง FormData Object ใหม่
    const updateFormData = new FormData();

    // 2. ตรวจสอบ Text Data ที่เปลี่ยนไป
    const changesToSubmit = getChangedFields(userProfile, formData);
    // console.log(changesToSubmit);

    // 3. วนลูปและแนบเฉพาะ Text Data ที่เปลี่ยนไปเข้า FormData
    for (const key in changesToSubmit) {
      updateFormData.append(key, changesToSubmit[key]);
    }
    console.log("--- Checking FormData Contents ---");
    // วิธีที่แนะนำ: ใช้ .entries() เพื่อดึง Key-Value Pair
    for (const [key, value] of updateFormData.entries()) {
      // 💡 ถ้าข้อมูลถูก append แล้ว จะแสดงตรงนี้
      console.log(`${key}: ${value}`);
    }
    console.log("----------------------------------");

    // 🚨 โค้ดสำหรับตรวจสอบเนื้อหา FormData
    console.log("--- START: DEBUGGING FormData Contents ---");

    // ใช้วิธีวนลูปผ่าน entries()
    for (const [key, value] of updateFormData.entries()) {
      // 💡 ถ้าเป็นไฟล์, value จะเป็น File Object
      if (value instanceof File) {
        console.log(
          `FILE KEY: ${key}, FILENAME: ${value.name}, SIZE: ${value.size} bytes`
        );
      } else {
        // 💡 ถ้าเป็น Text, value จะเป็น String
        console.log(`TEXT KEY: ${key}, VALUE: ${value}`);
      }
    }

    console.log("--- END: DEBUGGING FormData Contents ---");

    // 4. ตรวจสอบและแนบ File Data
    const fileInput = fileInputRef.current;
    const hasNewFile = fileInput && fileInput.files.length > 0;

    if (hasNewFile) {
      // 🔑 จุดแก้ไข: แนบไฟล์เข้า FormData ที่จะใช้ส่ง
      updateFormData.append("profile_pic", fileInput.files[0]);
      console.log("File ready for upload:", fileInput.files[0].name);
    }

    // 5. ตรวจสอบว่ามีการเปลี่ยนแปลงหรือไม่
    if (Object.keys(changesToSubmit).length === 0 && !hasNewFile) {
      setApiMessage("No changes to the data for the record.");
      setLoading(false);
      return;
    }

    try {
      console.log(updateFormData);
      const URL = `${API_URL}/api/auction/users/profile`;

      // 6. ส่ง FormData Object เป็น Payload หลัก
      // 🚨 สำคัญ: เมื่อส่ง FormData ต้องใช้ POST หรือ PUT และไม่ต้องระบุ Content-Type: application/json
      const res = await axios.put(URL, updateFormData, {
        headers: {
          // 🔑 Authorization Header ที่ถูกต้อง
          Authorization: `Bearer ${token}`,
          // ไม่ต้องกำหนด Content-Type: multipart/form-data เอง เพราะ FormData จะจัดการให้
        },
      });
      setApiMessage(res.data.message || "Profile updated successfully!");

      // 7. อัปเดต userProfile ด้วยข้อมูลใหม่ที่บันทึก
      setUserProfile((prev) => ({
        ...prev,
        ...formData, // อัปเดต Text fields ที่เปลี่ยนไป
        acc_profile_pic: hasNewFile ? res.data.fileName : prev.acc_profile_pic, // อัปเดตชื่อไฟล์ใหม่
      }));

      fetchUserProfile(token, userId)

      // 8. ถ้ามีการอัปโหลดไฟล์ใหม่ ให้ล้างค่า input file เพื่อป้องกันการส่งซ้ำ
      if (hasNewFile && fileInputRef.current) {
        fileInputRef.current.value = "";
      }
    } catch (error) {
      let errorMessage = "Failed to update profile.";
      if (
        error.response &&
        error.response.data &&
        error.response.data.message
      ) {
        errorMessage = error.response.data.message;
      }
      setError(errorMessage);
      setApiMessage(null);
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
              {/* 💡 แสดงรูป Preview หรือ Icon default */}
              {profilePicPreview ? (
                <img
                  src={profilePicPreview}
                  alt="Profile"
                  className="profile-pic-preview"
                />
              ) : (
                <Icon icon="mdi:user" className="mdi-user" />
              )}
            </div>
            <div className="custom-file-upload">
              <input
                type="file"
                id="profileImageInput" // ต้องมี ID เพื่อผูกกับ label
                ref={fileInputRef}
                accept="image/*"
                onChange={handleFileChange} // 🔑 เมื่อมีการเลือกไฟล์
                style={{ display: "none" }} // ซ่อน input จริง
              />

              {/* 💡 Label นี้จะทำหน้าที่เป็นปุ่มที่เรามองเห็น */}
              <label htmlFor="profileImageInput" className="custom-button">
                Change
              </label>
            </div>
          </div>

          {/* ... Input fields อื่นๆ ยังคงเดิม ... */}
          <div className="profile-div-username">
            <Icon className="icon-username" icon="gravity-ui:person-fill" />
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
            <Icon className="icon-firstname" icon="gravity-ui:person-fill" />
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
            <Icon className="icon-lastname" icon="gravity-ui:person-fill" />
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
            <Icon className="icon-phone" icon="gravity-ui:handset" />
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
            <Icon className="icon-address" icon="gravity-ui:house" />
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
          {loading && <p>Saving...</p>}
          <button type="submit" className="button-submit" disabled={loading}>
            save
          </button>
        </form>
      </div>
    </>
  );
}

export default ProfileSettingPage;
