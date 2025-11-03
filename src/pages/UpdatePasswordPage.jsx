import { useState, useEffect } from "react";
import "./UpdatePasswordPage.css";

function UpdatePasswordPage() {
  const [currentPassword, setcurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");

  // 🔑 (1) แยก Service ออกไปด้านนอก
  const updatePasswordAPI = async (currentPassword, newPassword) => {
    const token = localStorage.getItem("jwt");

    if (!token) {
      throw new Error("User not authenticated. Please log in again.");
    }

    // 🔑 (2) สร้าง Object ข้อมูลที่ถูกต้อง
    const payload = {
      currentPassword: currentPassword,
      newPassword: newPassword,
    };

    try {
      const response = await fetch(
        "http://localhost:5000/api/auction/profile/password",
        {
          method: "PUT",
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
        throw new Error(errorDetails.message || "Password update failed.");
      }

      return await response.json();
    } catch (error) {
      throw error;
    }
  };

  // 🔑 (4) Logic การ Submit Form
  const handleSubmit = async (e) => {
    e.preventDefault();

    // 💡 (5) ดึงค่าจริงจาก State/Input มาใช้
    const currentPasswordValue = currentPassword;
    const newPasswordValue = newPassword;

    try {
      // 🔑 (6) เรียกฟังก์ชันและส่งค่าจริงเข้าไป
      const data = await updatePasswordAPI(
        currentPasswordValue,
        newPasswordValue
      );

      console.log("Password updated successfully:", data);
      alert("Password updated!");
    } catch (error) {
      console.error("Password Update Error:", error.message);
      alert(`Error: ${error.message}`);
    }
  };
  return (
    <>
      <div className="update-password-div-text">
        <h1>Update Password</h1>
      </div>
      <div className="update-password-container">
        <form onSubmit={handleSubmit}>
          <input
            type="password"
            className="currentPassword"
            name="currentPassword"
            id="currentPassword"
            placeholder="currect-password"
            value={currentPassword}
            onChange={(e) => setcurrentPassword(e.target.value)}
          />
          <input
            type="password"
            className="NewPassword"
            name="NewPassword"
            id="NewPassword"
            placeholder="new-password"
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
          />
          <button type="submit">save</button>
        </form>
      </div>
    </>
  );
}

export default UpdatePasswordPage;
