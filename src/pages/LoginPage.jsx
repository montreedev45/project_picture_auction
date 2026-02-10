import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import "./LoginPage.css";
import { Icon } from "@iconify/react";
import axios from "axios";
import { useAuth } from "../components/AuthContext";
import { useError } from "../components/ErrorContext";
const API_URL = import.meta.env.VITE_BACKEND_URL

function LoginPage() {
  const [formData, setFormData] = useState({
    username: "",
    password: "",
  });

  const [showPassword, setShowPassword] = useState(false);

  const navigate = useNavigate();
  const { login } = useAuth();
  const { setError } = useError();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({ ...prevData, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const API_URL = `${API_URL}/api/auction/login`;
      const res = await axios.post(API_URL, formData);

      const token = res.data.token;
      const accId = res.data.user.acc_id;
      const username = res.data.user.acc_username
      const userProfileData = res.data.user;

      // ต้องเรียกใช้ login() แบบ await
      await login(token, accId, username, userProfileData);

      // นำผู้ใช้ไปยังหน้าใหม่ หลังจากที่ Context State ถูกอัปเดตแล้ว
      navigate("/mybid");
    } catch (error) {
      let errorMessage =
        "login failed, Pless check username or password";

      if (
        error.response &&
        error.response.data &&
        error.response.data.message
      ) {
        errorMessage = error.response.data.message;
      }
      setFormData({
        ...formData,
        username: "",
        password: ""
      })
      setError(errorMessage)
    }
  };

  const showpass = () => {
    //console.log(showPassword);
    // เปลี่ยนค่า State จาก true เป็น false หรือ false เป็น true
    setShowPassword((prev) => !prev);
  };

  const inputType = showPassword ? "text" : "password";

  return (
    <div className="login-container">
      <h1>Welcome Back</h1>

      <form onSubmit={handleSubmit} className="cover-form" >
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
          <Link to="/forGetPass" className="forget">Forget Password</Link>
          <Link to="/SignUp" className="account">Don't have an account</Link>
        </div>
        {/* {errorMsg && <p style={{ color: "red", margin:0 }}>Error: {errorMsg}</p>} */}

        <button type="submit" className="button-submit">
          sign in
        </button>
      </form>
    </div>
  );
}

export default LoginPage;
