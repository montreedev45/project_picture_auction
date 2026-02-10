import axios from "axios";
import React, { createContext, useState, useEffect, useContext } from "react";
import { useNavigate } from "react-router-dom";
const API_URL = import.meta.env.VITE_BACKEND_URL

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  // 1. States หลัก
  const [userProfile, setUserProfile] = useState(null); // 🔑 เก็บข้อมูลผู้ใช้ทั้งหมด
  const [loading, setLoading] = useState(true); // 💡 State สำหรับรอการตรวจสอบ Token/Profile
  const initialToken = localStorage.getItem("jwt");
  const initialUserId = localStorage.getItem("acc_id");
  const initialUsername = localStorage.getItem("acc_username")

  const [token, setToken] = useState(initialToken);
  const [userId, setUserId] = useState(initialUserId);
  const [username, setUsername] = useState(initialUsername);

  const [isLoggedIn, setIsLoggedIn] = useState(!!initialToken);
  const navigate = useNavigate();

  // ----------------------------------------------------------------
  // 2. Helper Functions (ย้าย Logic ที่ซับซ้อนมาที่นี่)
  // ----------------------------------------------------------------

  // A. 🔑 ฟังก์ชัน Fetch Profile
  const fetchUserProfile = async (currentToken, currentUserId) => {
    if (!currentToken || !currentUserId) {
      setUserProfile(null);
      return;
    }

    try {
      const URL = `${API_URL}/api/auction/users/${currentUserId}`;
      const res = await axios.get(URL, {
        headers: { Authorization: `Bearer ${currentToken}` },
      });

      const user = res.data.user;

      // สร้าง URL รูปภาพที่สมบูรณ์
      const profilePicUrl = user.acc_profile_pic
        ? `${API_URL}/images/profiles/${user.acc_profile_pic}`
        : null;

      // 🔑 เก็บข้อมูล Profile และ URL รูปภาพ
      setUserProfile({
        ...user,
        profilePicUrl: profilePicUrl,
      });
    } catch (error) {
      console.error("Failed to fetch user profile:", error);
      // หากดึง Profile ล้มเหลว อาจหมายถึง ID ไม่ถูกต้อง
      logout();
    }
  };

  // B. ฟังก์ชันตรวจสอบ/ต่ออายุ Token
  const checkTokenExpireAndFetchProfile = async (
    currentToken,
    currentUserId
  ) => {
    if (!currentToken) {
      setLoading(false);
      return;
    }

    try {
      // 💡 Tech Stack: ใช้ API checkToken เพื่อตรวจสอบความถูกต้องของ Token
      await axios.post(
        `${API_URL}/api/auction/checkToken`,
        {},
        { headers: { Authorization: `Bearer ${currentToken}` } }
      );

      // 🔑 ถ้า Token ถูกต้อง: ดึง Profile ต่อไป
      await fetchUserProfile(currentToken, currentUserId);
    } catch (error) {
      // 🚨 Token หมดอายุ/ไม่ถูกต้อง
      console.error("Token invalid or expired. Auto-logging out.");
      if (
        error.response &&
        (error.response.status === 401 || error.response.status === 403)
      ) {
      }
      // เรียก logout โดยตรงเพื่อให้ล้าง storage และนำทาง
      logout();
    } finally {
      setLoading(false); // 💡 เมื่อเสร็จสิ้นกระบวนการตรวจสอบ
    }
  };

  // ----------------------------------------------------------------
  // 3. Effect Hooks
  // ----------------------------------------------------------------

  // 🔑 เมื่อ Component Mount ให้ตรวจสอบ Token และดึง Profile
  useEffect(() => {
    if (token) {
      // 🔑 เรียกใช้ฟังก์ชันตรวจสอบ Token และดึง Profile
      //console.log(55);
      checkTokenExpireAndFetchProfile(token, userId);
    } else {
      setLoading(false);
    }
  }, []); // ⚠️ รันแค่ครั้งเดียวเมื่อ Component Mount

  // ----------------------------------------------------------------
  // 4. Auth Actions
  // ----------------------------------------------------------------

  const login = async (jwtToken, accId, username,profileData) => {
    //console.log(profileData);
    localStorage.setItem("jwt", jwtToken);
    localStorage.setItem("acc_id", accId);
    localStorage.setItem("acc_username", username)
    setIsLoggedIn(true);
    setToken(jwtToken);
    setUserId(accId);
    setUsername(username);

    const profilePicUrl = profileData.acc_profile_pic
      ? `${API_URL}/images/profiles/${profileData.acc_profile_pic}`
      : null; // 🔑 FIX: อัปเดต userProfile State ทันทีด้วยข้อมูลที่ได้รับ พร้อม URL

    setUserProfile({
      ...profileData,
      profilePicUrl: profilePicUrl, // ⬅️ เพิ่ม Field นี้
    });

    // 🔑 FIX: อัปเดต userProfile State ทันทีด้วยข้อมูลที่ได้รับ
  };

  const logout = () => {
    localStorage.clear();
    setIsLoggedIn(false);
    setToken(null);
    setUserId(null);
    setUserProfile(null);
    navigate("/login");
  };

  return (
    <AuthContext.Provider
      value={{
        isLoggedIn,
        login,
        logout,
        token,
        userProfile, // 🔑 Export userProfile
        loading, // 💡 Export loading status
        fetchUserProfile, // 💡 Export เพื่อให้ ProfileSettingPage ใช้ Update
      }}
    >
      {children}       {" "}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
