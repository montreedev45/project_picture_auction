import { useState, useEffect } from "react";
import "./EndedPage.css";
import view1 from "../assets/view1-ai-gen.png";
import view2 from "../assets/view2-ai-gen.png";
import axios from 'axios'

function EndedPage() {
  const [products, setProducts] = useState([]);
  const [error, setError] = useState(null); // 💡 State สำหรับจัดการข้อผิดพลาด
  const [loading, setLoading] = useState(true); // 💡 State สำหรับจัดการสถานะการโหลด

  // Icon heart svg
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
  // 2. Business Logic: Handler สำหรับการกด Like/Unlike
  // ----------------------------------------------------------------
  const handleLikeToggle = (e, id) => {
    e.preventDefault();

    // Tech Stack: การอัปเดต Array State แบบ Immutable
    setProducts((currentProducts) =>
      currentProducts.map((product) =>
        product.id === id
          ? { ...product, isLiked: !product.isLiked } // อัปเดตสถานะ Like ของ Card ที่ถูกกด
          : product
      )
    );
  };

  // Tech Stack: ใช้ Placeholder Image (เพื่อให้ภาพแสดงผลอย่างถูกต้อง)
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

  const productsToFilter = Array.isArray(products) ? products : [];
  const filteredProducts = productsToFilter.filter(
    (product) => product.pro_status === "sold"
  );
  return (
    <>
      <div className="ended-div-text">
        <h1>Ended Auction Page</h1>
      </div>
      <div className="ended-container">
        <div className="ended-container-card">
          {filteredProducts.map((product) => {
            // Business Logic: กำหนดสีตามสถานะ isLiked ของสินค้านั้นๆ
            const heartFillColor = product.pro_islike ? "#FF4081" : "none";
            const heartStrokeColor = product.pro_islike ? "#FF4081" : "#848484";
            const imageSource = product.pro_imgurl === "view1" ? view1 : view2;
            return (
              <div className="card" key={product.pro_id}>
                <div className="card-absolute">
                  <span className={`card-status-${product.pro_status}`}>
                    {product.pro_status}
                  </span>
                </div>
                <img
                  className="card-img"
                  src={imageSource}
                  alt={product.pro_name}
                />
                <div className="card-des">
                  <p>title : {product.pro_name}</p>
                  <p>bid price : {product.pro_price}</p>
                  <p>time remanding : {product.pro_time}</p>
                </div>
                <div className="card-button">
                  <HeartIcon
                    size="30"
                    fill={heartFillColor}
                    stroke={heartStrokeColor}
                    className="transition hover:scale-110"
                  />
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </>
  );
}

export default EndedPage;
