import React, { useState, useEffect } from "react";
import "./forgetpass.css";
import { useError } from "../components/ErrorContext";

function ForgetPasswordPage() {
  const { setError } = useError()
  const [currentEmail, setcurrentEmail] = useState("");

  // 🔑 (1) แยก Service ออกไปด้านนอก
  const ForgetPasswordAPI = async (currentEmail) => {
    const token = localStorage.getItem("jwt");

    if (!token) {
      throw new Error("User not authenticated. Please log in again.");
    }

    // 🔑 (2) สร้าง Object ข้อมูลที่ถูกต้อง
    const payload = {
      acc_email: currentEmail,
    };

    try {
      const response = await fetch(
        "http://localhost:5000/api/auction/forgot-password",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          // 🔑 (3) แก้ไข: JSON.stringify ต้องรับ Object เดียว
          body: JSON.stringify(payload),
        }
      );

      if (!response.ok) {
        const errorDetails = await response.json();
        throw new Error(
          errorDetails.message || "Send email fail please try again"
        );
      }

      return await response.json();
    } catch (error) {
      let errorMessage =
        "forgot password failed";

      if (
        error.response &&
        error.response.data &&
        error.response.data.message
      ) {
        errorMessage = error.response.data.message;
      }
      setError(errorMessage)
    }
  };

  // 🔑 (4) Logic การ Submit Form
  const handleSubmit = async (e) => {
    e.preventDefault();

    // 💡 (5) ดึงค่าจริงจาก State/Input มาใช้
    const newEmailValue = currentEmail;

    try {
      // 🔑 (6) เรียกฟังก์ชันและส่งค่าจริงเข้าไป
      const data = await ForgetPasswordAPI(newEmailValue);

      console.log("Sended Email successfully:", data);
      alert("Sended Email successfully");
    } catch (error) {
      let errorMessage =
        "Send email failed, Plese try again later";

      if (
        error.response &&
        error.response.data &&
        error.response.data.message
      ) {
        errorMessage = error.response.data.message;
      }
      setError(errorMessage)
    }
  };
  return (
    <>
      
      <div className="forget-password-container">
        <div className="forget-password-div-text">
        <h1>Forget Password</h1>
      </div>
        <form onSubmit={handleSubmit}>
          <label htmlFor="Input Email" className="input-forgot">
            <input
              type="email"
              className="currentEmail"
              name="currentEmail"
              id="currentEmail"
              required
              value={currentEmail}
              onChange={(e) => setcurrentEmail(e.target.value)}
            />
            <span>Current Email</span>
          </label>
          <button type="submit" className="btn-send">
            Send
          </button>
        </form>
      </div>
    </>
  );
}

export default ForgetPasswordPage;
