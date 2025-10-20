// src/pages/LoginPage.jsx
import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import "./LoginPage.css";
import { Icon } from "@iconify/react";
import axios from "axios";
import { initialProducts } from "../components/MockData";

function LoginPage({ onAuthAction }) {
  const [formData, setFormData] = useState({
    username: "",
    password: "",
  });
  const [showPassword, setShowPassword] = useState(false);
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({ ...prevData, [name]: value }));
  };
  const [response, setResponse] = useState(null);
  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const API_URL = `http://localhost:5000/api/auction/login`;

      const res = await axios.post(API_URL, formData);
      setResponse(res.data);
      console.log("Login was Success:", res.data);
    } catch (err) {
      // 4. จัดการ Error Response
      const errorMsg = err.response?.data?.message || err.message;
      setResponse(errorMsg);

      console.error("Login Error:", errorMsg);
    }

    // Logic ถูกตัดออก: เราแค่จำลองการ Login สำเร็จเพื่ออัปเดต Navbar
    // console.log("Login Form Submitted (Mock):", formData);
    // navigate("/login");
    // Logic ถูกตัดออก: เราแค่จำลองการ Login สำเร็จเพื่ออัปเดต Navbar
    onAuthAction("login"); // ทำให้ Navbar เปลี่ยนเป็น Logout
    navigate("/mybid");
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

      <form onSubmit={handleSubmit}>
        <div className="div-username">
          <Icon className="icon-username" icon="mdi:email-outline" />
          <input
            className="input-username"
            type="text"
            placeholder="Email or Username"
            id="username2"
            name="username"
            value={formData.username}
            onChange={handleChange}
            required
          />
        </div>

        <div className="div-password">
          <Icon className="icon-password" icon="mdi:lock-outline" />
          <input
            className="input-password"
            type={inputType}
            placeholder="Password"
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
