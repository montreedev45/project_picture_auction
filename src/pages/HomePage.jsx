import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import axios from "axios";
// 💡 Tech Stack: หากต้องการใช้ไฟล์ CSS ต้องแน่ใจว่าได้สร้างและ import ถูกต้องแล้ว
import "./HomePage.css"; 

// ✅ Tech Stack: การ Import รูปภาพถูกต้องแล้ว
import view1 from "../assets/view1-ai-gen.png";
import view2 from "../assets/view2-ai-gen.png";

function HomePage() {
  // ✅ Tech Stack: เพิ่ม State สำหรับ Loading และ Error/Success Handling
  const [products, setProducts] = useState([]);
  const [error, setError] = useState(null); // 💡 State สำหรับจัดการข้อผิดพลาด
  const [loading, setLoading] = useState(true); // 💡 State สำหรับจัดการสถานะการโหลด

  // Icon heart svg Component
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

  // ----------------------------------------------------------------
  // 1. Data Fetching and State Initialization
  // ----------------------------------------------------------------
  useEffect(() => {
    const fecth_products = async () => {
      setError(null);
      setLoading(true); // 💡 ตั้งค่า Loading เป็น true ก่อนเริ่ม Fetch
      try {
        const API_URL = `http://localhost:5000/api/auction/products`;
        const res = await axios.get(API_URL);
        const apiProducts = res.data.products || [];
        
        //console.log("Raw API Products:", apiProducts);
        
        // Tech Stack: คัดลอก Array และ Object เพื่อ Immutability
        const initialData = apiProducts.map((product) => ({
          ...product,
          // หาก isLiked ไม่ได้มาจาก Backend ให้กำหนด default value (ถ้าจำเป็น)
        }));

        setProducts(initialData);
        //console.log("fecth products Success:", initialData);

      } catch (err) {
        const errorMsg =
          err.response?.data?.message || "Failed to connect to server.";

        setError(errorMsg); // ✅ แก้ไข: ตั้งค่า Error State
        setProducts([]); // ⚠️ setProducts ให้เป็น Array เปล่าเสมอ

        //console.error("Fetch Error:", errorMsg);
      } finally {
        setLoading(false); // ✅ ต้องปิด Loading เสมอ ไม่ว่าจะสำเร็จหรือผิดพลาด
      }
    };

    fecth_products();
  }, []);

  // ----------------------------------------------------------------
  // 2. Business Logic: Handler สำหรับการกด Like/Unlike
  // ----------------------------------------------------------------
  const handleLikeToggle = (e, id) => {
    e.preventDefault();

    setProducts((currentProducts) =>
      currentProducts.map((product) =>
        product.id === id
          ? { ...product, isLiked: !product.isLiked }
          : product
      )
    );
  };
  
  // ----------------------------------------------------------------
  // 3. Filtering และ Conditional Rendering Logic
  // ----------------------------------------------------------------
  const productsToFilter = Array.isArray(products) ? products : [];
  const filteredProducts = productsToFilter.filter(
    (product) => product.statusLabel === "upcoming..."
  );

  // 💡 UX/UI: แสดงสถานะ Loading ก่อน
  if (loading) {
    return <div className="loading-state">Loading Auction Products...</div>; // ⬅️ ใส่ Loading Component ของคุณที่นี่
  }
  
  // 💡 UX/UI: แสดงสถานะ Error
  if (error) {
    return <div className="error-state">Error: {error}</div>; // ⬅️ ใส่ Error UI ของคุณที่นี่
  }

  // 💡 UX/UI: แสดง No Data Found 
  if (filteredProducts.length === 0) {
     return <div className="no-data">ไม่มีสินค้าประมูล "Upcoming" ในขณะนี้</div>;
  }

    // 💡 UX/UI: แสดง Loading State (ถ้าคุณมี State loading)
    // if (loading) { return <div>Loading...</div>; }
    return (
      <>
        <div className="div-text">
          <h1>Picture Auction</h1>
          <p>The Real-time Digital Art Bidding Platform</p>
          <Link to="/upcoming" className="button-view">
            View Live Auctions
          </Link>
        </div>

        <div className="homepage-container">
          <div className="homepage-container-card">
            {/* ✅ Tech Stack: ใช้ .map() เพื่อ Render รายการสินค้าอัตโนมัติ */}
            {filteredProducts.map((product) => {
                // Business Logic: กำหนดสีตามสถานะ isLiked ของสินค้านั้นๆ
                const heartFillColor = product.isLiked ? "#FF4081" : "none";
                const heartStrokeColor = product.isLiked
                  ? "#FF4081"
                  : "#848484";
                const imageSource =
                  product.imageUrl === "view1" ? view1 : view2;
                return (
                  <div className="card" key={product.id}>
                    <img
                      className="card-img"
                      src={imageSource}
                      alt={product.title}
                    />
                    <div className="card-des">
                      <p>title : {product.title}</p>
                      <p>bid price : {product.price}</p>
                      <p>time remanding : {product.time}</p>
                    </div>
                    <div className="card-button">
                      <Link
                        to={`/auction-detail/${product.id}`}
                        className="button"
                      >
                        Bid Now
                      </Link>
                      <button
                        onClick={(e) => handleLikeToggle(e, product.id)}
                        style={{
                          background: "none",
                          border: "none",
                          padding: 0,
                        }}
                      >
                        <HeartIcon
                          size="30"
                          fill={heartFillColor}
                          stroke={heartStrokeColor}
                          className="transition hover:scale-110"
                        />
                      </button>
                    </div>
                  </div>
                );
              })}
          </div>
        </div>
      </>
    );
}

export default HomePage;
