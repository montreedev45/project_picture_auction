import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";

import "./Sign-up.css";
import { Icon } from "@iconify/react";

function SignUp({ onAuthAction }) {
  const [formData, setFormData] = useState({
    username: "",
    password: "",
    firstname: "",
    lastname: "",
    email: "",
    phone: "",
    address: "",
  });

  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({ ...prevData, [name]: value }));
  };

  const [response, setResponse] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault(); // ⚠️ สำคัญ: ป้องกันการ Reload Page

    try {
      const API_URL = `http://localhost:5000/api/auction/register`;

      const res = await axios.post(API_URL, formData);
      setResponse(res.data);
      console.log("Registration Success:", res.data);
    } catch (err) {
      // 4. จัดการ Error Response
      const errorMsg = err.response?.data?.message || err.message;
      setResponse(errorMsg);

      console.error("Registration Error:", errorMsg);
    }

    // Logic ถูกตัดออก: เราแค่จำลองการ Login สำเร็จเพื่ออัปเดต Navbar
    console.log("sign up Form Submitted (Mock):", formData);
    navigate("/login");
  };

  const showpass = () => {
    setShowPassword((prev) => !prev);
  };
  const inputType = showPassword ? "text" : "password";

  const showconfirmpass = () => {
    setShowConfirmPassword((prev) => !prev);
  };
  const inputConfirmType = showConfirmPassword ? "text" : "password";
  //API

  return (
    <div className="container-regis">
      <h2>Join Our Community</h2>

      <form onSubmit={handleSubmit}>
        <div className="div-username">
          <Icon className="icon-username" icon="mdi:email-outline" />
          <input
            className="input-username"
            type="text"
            placeholder="Email or Username"
            id="username"
            name="username"
            value={formData.username}
            onChange={handleChange}
            required
          />
        </div>

        <div className="div-password">
          <Icon className="icon-password" icon="gravity-ui:envelope" />
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
              className="eyeregis"
              onClick={showpass}
              icon="material-symbols-light:eye-tracking-outline"
            ></Icon>
          </span>
        </div>

        <div className="div-password">
          <Icon className="icon-password" icon="mdi:lock-outline" />
          <input
            className="input-password"
            type={inputConfirmType}
            placeholder="Confirm Password"
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
        </div>

        <div className="div-firstname">
          <Icon className="icon-firstname" icon="gravity-ui:person-fill" />
          <input
            className="input-firstname"
            type="text"
            placeholder="firstname"
            id="firstname"
            name="firstname"
            value={formData.firstname}
            onChange={handleChange}
            required
          />
        </div>

        <div className="div-lastname">
          <Icon className="icon-lastname" icon="gravity-ui:person-fill" />
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

        <div className="div-email">
          <Icon className="icon-email" icon="gravity-ui:envelope" />
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

        <div className="div-phone">
          <Icon className="icon-phone" icon="gravity-ui:handset" />
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

        <div className="div-address">
          <Icon className="icon-address" icon="gravity-ui:house" />
          <input
            className="input-address"
            type="text"
            placeholder="Address"
            id="address"
            name="address"
            value={formData.address}
            onChange={handleChange}
            required
          />
        </div>

        <button type="submit" className="button-submit">
          sign up
        </button>
      </form>
    </div>
  );
}
export default SignUp;
