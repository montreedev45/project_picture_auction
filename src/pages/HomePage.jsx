import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import axios from "axios";
import LikeButton from "./LikeButton";
import "./HomePage.css";

import view1 from "../assets/view1-ai-gen.png";
import view2 from "../assets/view2-ai-gen.png";

function HomePage() {
  const [products, setProducts] = useState([]); // State สำหรับจัดการสินค้า
  const [error, setError] = useState(null); // State สำหรับจัดการข้อผิดพลาด
  const [loading, setLoading] = useState(true); // State สำหรับจัดการสถานะการโหลด

  // ----------------------------------------------------------------
  // 1. Data Fetching and State Initialization
  // ----------------------------------------------------------------
  useEffect(() => {
    const fecth_products = async () => {
      setError(null);
      setLoading(true);
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

        setError(errorMsg);
        setProducts([]); // setProducts ให้เป็น Array เปล่าเสมอ
      } finally {
        setLoading(false); // ต้องปิด Loading เสมอ ไม่ว่าจะสำเร็จหรือผิดพลาด
      }
    };

    fecth_products();
  }, []);

  // ----------------------------------------------------------------
  // 2. Business Logic: Handler สำหรับการกด Like/Unlike
  // ----------------------------------------------------------------
  const currentUserId = localStorage.getItem("acc_id");
  const userHasLiked = products.likes?.includes(currentUserId);

  // ----------------------------------------------------------------
  // 3. Filtering และ Conditional Rendering Logic
  // ----------------------------------------------------------------
  const productsToFilter = Array.isArray(products) ? products : [];
  const filteredProducts = productsToFilter.filter(
    (product) =>
      product.pro_status === "processing" || product.pro_status === ""
  );

  // UX/UI: แสดงสถานะ Loading ก่อน
  if (loading) {
    return <div className="loading-state">Loading Auction Products...</div>; // ใส่ Loading Component ของคุณที่นี่
  }

  // UX/UI: แสดงสถานะ Error
  if (error) {
    return <div className="error-state">Error: {error}</div>; // Error UI ของคุณที่นี่
  }

  // 💡 UX/UI: แสดง No Data Found
  if (filteredProducts.length === 0) {
    return <div className="no-data">ไม่มีสินค้าประมูล "Upcoming" ในขณะนี้</div>;
  }

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
          {filteredProducts.map((product) => {
            const imageSource = product.pro_imgurl === "view1" ? view1 : view2;
            const isSaved = product.likes?.includes(currentUserId) ?? false;
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
                  <Link
                    to={`/auction-detail/${product.pro_id}`}
                    className="button"
                  >
                    Bid Now
                  </Link>
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

export default HomePage;
