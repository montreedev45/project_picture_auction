import { useState, useEffect } from "react";
import "./SaveItemPage.css";
import view1 from "../assets/view1-ai-gen.png";
import view2 from "../assets/view2-ai-gen.png";
import axios from "axios";
import LikeButton from "./LikeButton";

function SaveItemPage() {
  const [products, setProducts] = useState([]); // State สำหรับจัดการสินค้า
  const [error, setError] = useState(null); // State สำหรับจัดการข้อผิดพลาด
  const [loading, setLoading] = useState(true); // State สำหรับจัดการสถานะการโหลด

  // ----------------------------------------------------------------
  // 2. Business Logic: Handler สำหรับการกด Like/Unlike
  // ----------------------------------------------------------------

  const currentUserId = localStorage.getItem("acc_id");

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
    (product) => product.likes?.includes(currentUserId) ?? false
  );

  return (
    <>
      <div className="saveitem-div-text">
        <h1>Save Item Page</h1>
      </div>
      <div className="saveitem-container">
        <div className="saveitem-container-card">
          {filteredProducts.map((product) => {
            const imageSource = product.pro_imgurl === "view1" ? view1 : view2;
            const isSaved = product.likes?.includes(currentUserId) ?? false;
            const statusClass = product.pro_status
              ? product.pro_status.toLowerCase()
              : "default";

            return (
              <div className="saveitem-card" key={product.pro_id}>
                <img
                  className="saveitem-card-img"
                  src={imageSource}
                  alt={product.pro_name}
                />
                <div className="saveitem-edcard-des">
                  <p>title : {product.pro_name}</p>
                  <p>bid price : {product.pro_price}</p>
                  <p>time remanding : {product.pro_time}</p>
                </div>
                <div className="saveitem-card-button">
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

export default SaveItemPage;
