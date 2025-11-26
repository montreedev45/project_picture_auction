import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import "./MybidPage.css";
import axios from "axios";
import LikeButton from "./LikeButton";

function MybidPage() {
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
    (product) =>
      product.pro_status === "processing" || product.pro_status === "rebid now"
  );

  return (
    <>
      <div className="mybid-div-text">
        <h1>My bids Page</h1>
      </div>
      <div className="mybid-container">
        <div className="mybid-container-card">
          {filteredProducts.map((product) => {
            const imageSource = `http://localhost:5000/images/products/${product.pro_imgurl}` ;
            const isSaved = product.likes?.includes(currentUserId) ?? false;

            const statusClass = product.pro_status
              ? product.pro_status.toLowerCase()
              : "default";

            return (
              <div className="mybid-card" key={product.pro_id}>
                <div className="mybid-card-absolute">
                  <span className={`mybid-card-status-${statusClass}`}>
                    {product.pro_status}
                  </span>
                </div>
                <img
                  className="mybid-card-img"
                  src={imageSource}
                  alt={product.pro_name}
                />
                <div className="mybid-edcard-des">
                  <p>title : {product.pro_name}</p>
                  <p>bid price : {product.pro_price}</p>
                  <p>time remanding : {product.pro_time}</p>
                </div>
                <div className="mybid-card-button">
                  <div>
                    <LikeButton
                      productId={product.pro_id}
                      initialLikeCount={product.likes.length} // นับจำนวน Like จาก Array
                      userHasLiked={isSaved}
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

export default MybidPage;
