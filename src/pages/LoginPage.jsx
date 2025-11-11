import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import "./LoginPage.css";
import { Icon } from "@iconify/react";
import axios from "axios";
// 🔑 FIX: นำเข้า useAuth เพื่อจัดการ Context
import { useAuth } from "../components/AuthContext";

// 🔑 FIX: ไม่ต้องรับ Prop onAuthAction อีกต่อไป
function LoginPage() {
  const [formData, setFormData] = useState({
    username: "",
    password: "",
  });
  const [showPassword, setShowPassword] = useState(false);
  const [errorMsg, setErrorMsg] = useState(null); // 🔑 FIX: ใช้ State สำหรับ Error Message

  const navigate = useNavigate();
  // 🔑 FIX: ดึงฟังก์ชัน login จาก Context
  const { login } = useAuth();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({ ...prevData, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMsg(null); // Clear previous error

    try {
      // 💡 Tech Stack: ควรใช้ HTTPS ใน Production
      const API_URL = `http://localhost:5000/api/auction/login`;

      const res = await axios.post(API_URL, formData);

      // 1. 🔑 FIX: เรียกใช้ฟังก์ชัน login จาก Context (ซึ่งควรจัดการ localStorage.setItem('jwt', ...) ไว้แล้ว)
      //    (หรือถ้าคุณยังคงใช้ localStorage ในไฟล์นี้ ให้เรียก login() ด้วย Token ที่ได้รับมา)

      // 💡 เราจะเรียกใช้ login() เพื่ออัปเดตสถานะ isLoggedin ใน Context
      login(res.data.token);

      // 2. เก็บ User ID สำหรับ Frontend Logic (Save Item Page)
      localStorage.setItem("acc_id", res.data.user.acc_id);

      // 3. นำผู้ใช้ไปยังหน้า My Bid
      navigate("/mybid");
    } catch (err) {
      let message = "An unexpected error occurred. Please try again later.";

      if (err.response) {
        // Error Message จาก Server
        message = err.response.data.message || "Server returned an error.";
      } else if (err.request) {
        // Network Error
        message = "Cannot connect to the server. Please check your connection.";
      }

      // 🔑 FIX: ตั้งค่า Error Message ที่จะแสดงใน UI
      setErrorMsg(message);
      console.error("Login Error:", message, err);
    }
  };

  const showpass = () => {
    console.log(showPassword);
    // เปลี่ยนค่า State จาก true เป็น false หรือ false เป็น true
    setShowPassword((prev) => !prev);
  };

  const inputType = showPassword ? "text" : "password";

  return (
    <div className="login-container">
      <h1>Welcome Back</h1>

      <form onSubmit={handleSubmit} className="cover-form">
        <div className="div-username">
          <Icon className="icon-username" icon="mdi:email-outline" />
          <input
            className="input-username"
            type="text"
            id="username2"
            name="username"
            value={formData.username}
            onChange={handleChange}
            required
          />
          <span className="text-place">Email or Username</span>
        </div>

        <div className="div-password">
          <Icon className="icon-password" icon="mdi:lock-outline" />
          <input
            className="input-password"
            type={inputType}
            id="password"
            name="password"
            value={formData.password}
            onChange={handleChange}
            required
          />

          <span>
            <Icon
              className="showeyeslog"
              onClick={showpass}
              id="show-pass"
              icon="material-symbols-light:eye-tracking-outline"
            ></Icon>
          </span>
          <span className="pass-place">Password</span>
        </div>

        <div className="div-forget-account">
          <Link className="forget">Forget Password</Link>
          <Link className="account">Don't have an account</Link>
        </div>

        <button type="submit" className="button-submit">
          sign in
        </button>
      </form>
    </div>
  );
}

export default LoginPage;
