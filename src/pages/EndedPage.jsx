import { useState, useEffect } from "react";
import "./EndedPage.css";
import view1 from "../assets/view1-ai-gen.png";
import view2 from "../assets/view2-ai-gen.png";
import axios from "axios";

function EndedPage() {
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
    (product) => product.pro_status === "ended" || product.pro_status === ""
  );

  return (
    <>
      <div className="ended-div-text">
        <h1>Ended Auction Page</h1>
      </div>
      <div className="ended-container">
        <div className="ended-container-card">
          {filteredProducts.map((product) => {
            const imageSource = `http://localhost:5000/images/products/${product.pro_imgurl}` ;
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
                <div>
                  <LikeButton
                    productId={product.pro_id}
                    initialLikeCount={product.likes.length} // นับจำนวน Like จาก Array
                    userHasLiked={isSaved}
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
