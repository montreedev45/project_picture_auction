import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";

import "./Sign-up.css";
import { Icon } from "@iconify/react";

function SignUp() {
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
  const [errorMsg, setErrorMsg] = useState(null);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({ ...prevData, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault(); // ⚠️ สำคัญ: ป้องกันการ Reload Page
    setErrorMsg(null);

    try {
      const API_URL = `http://localhost:5000/api/auction/register`;

      const res = await axios.post(API_URL, formData);
      console.log("Registration Success:", res.data);
      navigate("/login");
    } catch (err) {
      let errorMessage = "";
      errorMessage = err.response.data.message;
      setErrorMsg(errorMessage);
    }
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
        <div className="div-username-signup">
          <Icon className="icon-username" icon="mdi:email-outline" />
          <input
            className="input-username"
            type="text"
            id="username"
            name="username"
            value={formData.username}
            onChange={handleChange}
            required
          />
          <span className="user-place">Email or Username</span>
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
              className="eyeregis"
              onClick={showpass}
              icon="material-symbols-light:eye-tracking-outline"
            ></Icon>
          </span>
          <span className="passSign-place">Password</span>
        </div>

        <div className="div-password">
          <Icon className="icon-firstname" icon="mdi:lock-outline" />
          <input
            className="input-password"
            type={inputConfirmType}
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
          <span className="confpass-place">Confirm Password</span>
        </div>

        <div className="div-firstname">
          <Icon className="icon-firstname" icon="gravity-ui:person-fill" />
          <input
            className="input-firstname"
            type="text"
            id="firstname"
            name="firstname"
            value={formData.firstname}
            onChange={handleChange}
            required
          />
          <span className="firstname-place">First Name</span>
        </div>

        <div className="div-lastname">
          <Icon className="icon-firstname" icon="gravity-ui:person-fill" />
          <input
            className="input-lastname"
            type="text"
            id="lastname"
            name="lastname"
            value={formData.lastname}
            onChange={handleChange}
            required
          />
          <span className="Lastname-place">Last Name</span>
        </div>

        <div className="div-email">
          <Icon className="icon-firstname" icon="gravity-ui:envelope" />
          <input
            className="input-email"
            type="text"
            id="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            required
          />
          <span className="email-place">Email</span>
        </div>

        <div className="div-phone">
          <Icon className="icon-firstname" icon="gravity-ui:handset" />
          <input
            className="input-phone"
            type="text"
            id="phone"
            name="phone"
            value={formData.phone}
            onChange={handleChange}
            required
          />
          <span className="phone-place">Phone</span>
        </div>

        <div className="div-address">
          <Icon className="icon-firstname" icon="gravity-ui:house" />
          <input
            className="input-address"
            type="text"
            id="address"
            name="address"
            value={formData.address}
            onChange={handleChange}
            required
          />
          <span className="address-place">Address</span>
        </div>

        {errorMsg && <p style={{ color: "red", margin:0 }}>Error: {errorMsg}</p>}

        <button type="submit" className="button-submit">
          sign up
        </button>
      </form>
    </div>
  );
}
export default SignUp;
