import { useState, useEffect } from "react";
import "./MywinningPage.css";
import view1 from "../assets/view1-ai-gen.png";
import view2 from "../assets/view2-ai-gen.png";
import axios from "axios";
import LikeButton from "./LikeButton";
import { useError } from "../components/ErrorContext";
import Loading from "../components/Loading";
const API_URL = import.meta.env.VITE_BACKEND_URL;

function MywinningPage() {
  const { setError } = useError();
  const [products, setProducts] = useState([]); // State สำหรับจัดการสินค้า
  const [loading, setLoading] = useState(true); // State สำหรับจัดการสถานะการโหลด

  // ----------------------------------------------------------------
  // 2. Business Logic: Handler สำหรับการกด Like/Unlike
  // ----------------------------------------------------------------
  const currentUserId = localStorage.getItem("acc_id");
  const token = localStorage.getItem("jwt");

  const fecth_products = async () => {
    setError(null);
    setLoading(true); // ตั้งค่า Loading เป็น true ก่อนเริ่ม Fetch
    try {
      const URL = `${API_URL}/api/auction/products`;
      const res = await axios.get(URL, {
        headers: { Authorization: `Bearer ${token}` },
        params: { acc_id: currentUserId, is_time_sensitive: true },
      });
      const apiProducts = res.data.products || [];

      // Tech Stack: คัดลอก Array และ Object เพื่อ Immutability
      const initialData = apiProducts.map((product) => ({
        ...product,
      }));

      setProducts(initialData);
    } catch (error) {
      let errorMessage = "fetch products failed, Pless check server";
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

  useEffect(() => {
    fecth_products();
  }, []);

  if (loading) return <Loading text="Loading..." />;
  const productsToFilter = Array.isArray(products) ? products : [];
  const filteredProducts = productsToFilter.filter(
    (product) => product.pro_status === "ended",
  );

  return (
    <>
      {filteredProducts && filteredProducts.length > 0 && (
        <div className="mywinning-container">
          <div className="mywinning-container-card">
            {filteredProducts.map((product) => {
              const imageSource = `${API_URL}/images/products/${product.pro_imgurl}`;
              const isSaved = product.likes?.includes(currentUserId) ?? false;

              const statusClass = product.pro_status
                ? product.pro_status.toLowerCase()
                : "default";

              return (
                <div className="mywinning-card" key={product.pro_id}>
                  <div className="mywinning-card-absolute">
                    <span className={`mywinning-card-status-${statusClass}`}>
                      {product.pro_status == "ended" && <span>winning</span>}
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
                        initialLikeCount={product.likes?.length ?? 0}
                        userHasLiked={isSaved}
                      />
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </>
  );
}

export default MywinningPage;
