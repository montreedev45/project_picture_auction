import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios'; // 💡 อย่าลืม import axios

const LikeButton = ({ productId, initialLikeCount, userHasLiked }) => {
  // 🔑 State สำหรับสถานะ Like และจำนวน Like
  const [isLiked, setIsLiked] = useState(userHasLiked);
  const [likeCount, setLikeCount] = useState(initialLikeCount);

  const navigate = useNavigate();
  // 🔑 Tech Stack: ใช้ชื่อตัวแปรให้ตรงกันเพื่อป้องกันข้อผิดพลาด
  const jwt = localStorage.getItem("jwt"); 

  const HeartIcon = ({
    className = "icon",
    size = "24",
    fill = "none",
    stroke = "currentColor",
    onClick,
  }) => (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill={fill}
      stroke={stroke}
      strokeWidth="1"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
      onClick={onClick}
      style={{ cursor: "pointer" }}
    >
      <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
    </svg>
  );

  // Function สำหรับการจัดการ Like/Unlike
  const handleToggleLike = async () => {
    const previousLikedState = isLiked;
    const previousCount = likeCount;

    // 🔑 Fix: ใช้ตัวแปร jwt ที่ดึงมาจาก localStorage
    if (!jwt) { 
      alert("กรุณาเข้าสู่ระบบ");
      navigate("/login");
      return; // ออกจาก Function ทันที
    }

    try {
      // 1. Optimistic Update (อัปเดต UI ทันที)
      setIsLiked(!isLiked);
      setLikeCount(isLiked ? likeCount - 1 : likeCount + 1);

      const api = `http://localhost:5000/api/auction/products/${productId}/toggle-like`;
      
      const response = await axios.post(api, null, {
        headers: {
          Authorization: `Bearer ${jwt}`, // 🔑 Fix: ใช้ jwt
        },
        transformResponse: [
          (data, headers, status) => {
            if (status === 204 || data === "" || data === "null") {
              return null;
            }
            try {
              return JSON.parse(data);
            } catch (e) {
              console.error("Manual JSON Parse Failed:", data);
              return data;
            }
          },
        ],
      });

      // 2. Optional: ยืนยันค่าจาก Server (ถ้า Server ส่ง Body กลับมา)
      if (response.data && typeof response.data.likeCount !== 'undefined') {
          // 💡 Tech Stack: อัปเดตด้วยค่าที่ถูกต้องจาก Server เพื่อความน่าเชื่อถือ
          // setIsLiked(response.data.pro_islike);
          // setLikeCount(response.data.likeCount);
      }

    } catch (error) {
      console.error("Failed to toggle like:", error);
      alert("บันทึก Like ไม่สำเร็จ กรุณาลองอีกครั้ง");
      // 3. Revert State (ถ้า API Error)
      // setIsLiked(previousLikedState);
      // setLikeCount(previousCount);
    }
  };

  // 🔑 FIX: ใช้ State (isLiked) เพื่อกำหนดสีและ React จะ Render ใหม่เมื่อ State เปลี่ยน
  const heartFillColor = isLiked ? "#FF4081" : "none";
  const heartStrokeColor = isLiked ? "#FF4081" : "#848484";

console.log(isLiked)  

  return (
    <div className="flex items-center space-x-1">
      <button className="icon-heart" onClick={handleToggleLike}>
        <HeartIcon
          size="30"
          fill={heartFillColor} // ⬅️ ใช้ State
          stroke={heartStrokeColor} // ⬅️ ใช้ State
          className="transition hover:scale-110"
        />
      </button>
      {/* 🔑 FIX: แสดงจำนวน Like ที่อัปเดตด้วย State */}
      <span className="text-gray-600 font-medium select-none">{likeCount}</span>
    </div>
  );
};

export default LikeButton;