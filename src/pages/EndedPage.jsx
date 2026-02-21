import { useState, useEffect } from "react";
import "./EndedPage.css";
import axios from "axios";
import { useError } from "../components/ErrorContext";
import LikeButton from "./LikeButton";
const API_URL = import.meta.env.VITE_BACKEND_URL


function EndedPage() {
  const { setError } = useError();
  const [products, setProducts] = useState([]); // State สำหรับจัดการสินค้า
  const [loading, setLoading] = useState(true); // State สำหรับจัดการสถานะการโหลด

  // ----------------------------------------------------------------
  // 1. Data Fetching and State Initialization
  // ----------------------------------------------------------------
  useEffect(() => {
    const fecth_products = async () => {
      setError(null);
      setLoading(true);
      try {
        const URL = `${API_URL}/api/auction/products`;
        const res = await axios.get(URL);
        const apiProducts = res.data.products || [];

        // Tech Stack: คัดลอก Array และ Object เพื่อ Immutability
        const initialData = apiProducts.map((product) => ({
          ...product,
        }));

        setProducts(initialData);
      } catch (error) {
        let errorMessage = "fetch products failed, Pless check server"
        if (
          error.response &&
          error.response.data &&
          error.response.data.message
        ) {
          errorMessage = error.response.data.message;
        }
        setError(errorMessage);
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
    (product) => product.pro_status === "ended"
  );

  return (
    <>
      <div className="ended-container">
        <div className="ended-container-card">
          {filteredProducts.map((product) => {
            const imageSource = `${API_URL}/images/products/${product.pro_imgurl}` ;
            const isSaved = product.likes?.includes(currentUserId) ?? false;
            return (
              <div className="ended-card" key={product.pro_id}>
                <div className="ended-card-absolute">
                  <span className={`ended-card-status-${product.pro_status}`}>
                    {product.pro_status}
                  </span>
                </div>
                <img
                  className="ended-card-img"
                  src={imageSource}
                  alt={product.pro_name}
                />
                <div className="ended-card-des">
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
