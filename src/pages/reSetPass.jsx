import React, { useState, useEffect } from "react";
import "./UpdatePasswordPage.css";
import { useParams, useNavigate, Navigate } from "react-router-dom";

function ResetPasswordPage() {
  const { token } = useParams();
  const navigate = useNavigate();
  const [reSetPass, setreSetPass] = useState("");

  // 🔑 (1) แยก Service ออกไปด้านนอก
  const ResetPasswordAPI = async (token, reSetPass) => {
    if (!token) {
      throw new Error("User not authenticated. Please log in again.");
    }

    // 🔑 (2) สร้าง Object ข้อมูลที่ถูกต้อง
    const payload = {
      newPassword: reSetPass,
    };

    try {
      const response = await fetch(
        `http://localhost:5000/api/auction/reset-password/${token}`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          // 🔑 (3) แก้ไข: JSON.stringify ต้องรับ Object เดียว
          body: JSON.stringify(payload),
        }
      );

      if (!response.ok) {
        const errorDetails = await response.json();
        throw new Error(
          errorDetails.message || "Reset Password fail please try again"
        );
      }

      navigate("/login");

      return await response.json();
    } catch (error) {
      throw error;
    }
  };

  // 🔑 (4) Logic การ Submit Form
  const handleSubmit = async (e) => {
    e.preventDefault();

    // 💡 (5) ดึงค่าจริงจาก State/Input มาใช้
    const reSetPassValue = reSetPass;

    try {
      // 🔑 (6) เรียกฟังก์ชันและส่งค่าจริงเข้าไป
      const data = await ResetPasswordAPI(token, reSetPassValue);

      console.log("Reset Password successfully:", data);
      alert("Reset Password successfully");
    } catch (error) {
      console.error("Reset Password Error:", error.message);
      alert(`Error: ${error.message}`);
    }
  };
  return (
    <>
      <div className="forget-password-div-text">
        <h1>Forget Password</h1>
      </div>
      <div className="forget-password-container">
        <form onSubmit={handleSubmit}>
          <input
            type="password"
            className="currentEmail"
            name="currentEmail"
            id="currentEmail"
            placeholder="currentEmail"
            value={reSetPass}
            onChange={(e) => setreSetPass(e.target.value)}
          />
          <button type="submit">save</button>
        </form>
      </div>
    </>
  );
}

export default ResetPasswordPage;
