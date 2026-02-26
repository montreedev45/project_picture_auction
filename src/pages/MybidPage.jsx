import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import "./MybidPage.css";
import axios from "axios";
import LikeButton from "./LikeButton";
import { useError } from "../components/ErrorContext";
import { useAuth } from "../components/AuthContext";
import Loading from "../components/Loading";
const API_URL = import.meta.env.VITE_BACKEND_URL;

function MybidPage() {
  const { setError } = useError();
  const [products, setProducts] = useState([]); // State สำหรับจัดการสินค้า
  const [loading, setLoading] = useState(true); // State สำหรับจัดการสถานะการโหลด
  const { userProfile } = useAuth();

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
        const URL = `${API_URL}/api/auction/products`;
        const res = await axios.get(URL, {
          params: { page: "mybid", userId: currentUserId },
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

    fecth_products();
  }, []);

  if (loading) return <Loading text="Loading..." />;

  const productsToFilter = Array.isArray(products) ? products : [];
  const filteredProducts = productsToFilter.filter(
    (product) =>
      product.pro_status === "processing" || product.pro_status === "ended",
  );

  return (
    <>
      <div className="mybid-container">
        <div className="mybid-container-card">
          {filteredProducts.map((product) => {
            const imageSource = `${API_URL}/images/products/${product.pro_imgurl}`;
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
                <div className="mybid-card-des">
                  <p>title : {product.pro_name}</p>
                  <p>bid price : {product.pro_price}</p>
                  <p>time remanding : {product.pro_time}</p>
                </div>
                <div className="mybid-card-button">
                  {product.pro_status === "processing" && (
                    <Link
                      to={`/auction-detail/${product.pro_id}`}
                      className="button"
                    >
                      Bid Now
                    </Link>
                  )}
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
    </>
  );
}

export default MybidPage;
