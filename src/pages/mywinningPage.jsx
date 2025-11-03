import { useState, useEffect } from "react";
import "./MywinningPage.css";
import view1 from "../assets/view1-ai-gen.png";
import view2 from "../assets/view2-ai-gen.png";
import axios from "axios";
import LikeButton from "./LikeButton";

function MywinningPage() {
  const [products, setProducts] = useState([]); // State สำหรับจัดการสินค้า
  const [error, setError] = useState(null); // State สำหรับจัดการข้อผิดพลาด
  const [loading, setLoading] = useState(true); // State สำหรับจัดการสถานะการโหลด

  // ----------------------------------------------------------------
  // 2. Business Logic: Handler สำหรับการกด Like/Unlike
  // ----------------------------------------------------------------
  const currentUserId = localStorage.getItem("acc_id");
  const userHasLiked = products.likes?.includes(currentUserId);

  useEffect(() => {
    const fecth_products = async () => {
      setError(null);
      setLoading(true); // ตั้งค่า Loading เป็น true ก่อนเริ่ม Fetch
      try {
        const API_URL = `http://localhost:5000/api/auction/products`;
        const res = await axios.get(API_URL);
        const apiProducts = res.data.products || [];

        // Tech Stack: คัดลอก Array และ Object เพื่อ Immutability
        const initialData = apiProducts.map((product) => ({
          ...product,
        }));

        setProducts(initialData);
      } catch (err) {
        const errorMsg =
          err.response?.data?.message || "Failed to connect to server.";

        setError(errorMsg); // แก้ไข: ตั้งค่า Error State
        setProducts([]); // setProducts ให้เป็น Array เปล่าเสมอ
      } finally {
        setLoading(false); // ต้องปิด Loading เสมอ ไม่ว่าจะสำเร็จหรือผิดพลาด
      }
    };

    fecth_products();
  }, []);

  const productsToFilter = Array.isArray(products) ? products : [];
  const filteredProducts = productsToFilter.filter(
    (product) => product.pro_status === "paid"
  );

  return (
    <>
      <div className="mywinning-div-text">
        <h1>My Winning Page</h1>
      </div>
      <div className="mywinning-container">
        <div className="mywinning-container-card">
          {filteredProducts.map((product) => {
            const imageSource = product.pro_imgurl === "view1" ? view1 : view2;
            const statusClass = product.pro_status
              ? product.pro_status.toLowerCase()
              : "default";

            return (
              <div className="mywinning-card" key={product.pro_id}>
                <div className="mywinning-card-absolute">
                  <span className={`mywinning-card-status-${statusClass}`}>
                    {product.pro_status}
                  </span>
                </div>
                <img
                  className="mywinning-card-img"
                  src={imageSource}
                  alt={product.pro_name}
                />
                <div className="mywinning-edcard-des">
                  <p>title : {product.pro_name}</p>
                  <p>bid price : {product.pro_price}</p>
                  <p>time remanding : {product.pro_time}</p>
                </div>
                <div className="mywinning-card-button">
                  <div>
                    <LikeButton
                      productId={product.pro_id}
                      initialLikeCount={product.likes.length} // นับจำนวน Like จาก Array
                      userHasLiked={userHasLiked}
                    />
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </>
  );
}

export default MywinningPage;
