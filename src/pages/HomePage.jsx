import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import axios from "axios";
// ❌ ลบการ Import ที่มีปัญหาออก
// import "./HomePage.css";
// import view1 from "../assets/view1-ai-gen.png";
// import view2 from "../assets/view2-ai-gen.png";

function HomePage() {
  const [products, setProducts] = useState([]);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);

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
      strokeWidth="1.5" // Tech Stack: เปลี่ยนเป็น 1.5 เพื่อให้ icon ชัดขึ้น
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
      onClick={onClick}
      style={{ cursor: "pointer" }}
    >
      {/* Business Logic: Path ของ Icon รูปหัวใจ */}
      <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
    </svg>
  );

  useEffect(() => {
    const fecth_products = async () => {
      setError(null);
      setLoading(true);
      try {
        const API_URL = `http://localhost:5000/api/auction/products`;
        const res = await axios.get(API_URL);

        // 🚀 Tech Stack Fix: เข้าถึง Key 'products' ใน response object โดยตรง
        // และเพิ่ม isLiked property สำหรับ Business Logic
        const apiProducts = res.data.products || [];

        const initialData = apiProducts.map((product) => ({
          ...product,
          isLiked: false,
          status: "upcoming...", // 💡 Business Logic: กำหนดค่าเริ่มต้นให้กับ UI state
        }));

        setProducts(initialData);

        console.log("fecth products Success:", initialData);
      } catch (err) {
        const errorMsg =
          err.response?.data?.message || "Failed to connect to server.";

        setError(errorMsg); // ⬅️ แสดง Error ที่ถูกต้อง
        setProducts([]); // ⚠️ setProducts ให้เป็น Array เปล่าเสมอ

        console.error("Fetch Error:", errorMsg);
      } finally {
        setLoading(false);
      }
    };

    fecth_products();
  }, []);

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

  // ----------------------------------------------------------------
  // 3. 🚀 JSX Return
  // ----------------------------------------------------------------

  // 💡 UX/UI: แสดง Error Message ก่อน
  if (error) {
    return (
      <div className="p-8 text-center bg-red-100 border-l-4 border-red-500 text-red-700 max-w-lg mx-auto mt-10 shadow-lg rounded-lg">
        <p className="font-bold text-xl mb-2">Error Fetching Data:</p>
        <p className="text-sm">{error}</p>
        <p className="mt-4 text-xs">
          โปรดตรวจสอบว่า Backend Server ของคุณรันอยู่ที่พอร์ต 5000
        </p>
      </div>
    );
  }

  // 💡 UX/UI: แสดง Loading State
  if (loading) {
    return (
      <div className="text-center p-8 text-2xl text-indigo-500 mt-20">
        <svg className="animate-spin h-8 w-8 mx-auto mb-4" viewBox="0 0 24 24">
          <circle
            className="opacity-25"
            cx="12"
            cy="12"
            r="10"
            stroke="currentColor"
            strokeWidth="4"
          ></circle>
          <path
            className="opacity-75"
            fill="currentColor"
            d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
          ></path>
        </svg>
        <p className="font-semibold">Loading Auction Products...</p>
      </div>
    );
  }

  // 💡 UX/UI: แสดง No Data Found
  const filteredProducts = products.filter(
    (product) => product.status === "upcoming..."
  );
  if (products.length === 0 || filteredProducts.length === 0) {
    return (
      <div className="p-8 text-center text-gray-500 mt-10 text-xl font-medium">
        ไม่มีสินค้าประมูล "upcoming" ในขณะนี้
      </div>
    );
  }

  // 💡 Final Render: เมื่อข้อมูลมาครบถ้วน
  return (
    // 🚀 Tech Stack: ใช้ Tailwind สำหรับ Styling
    <div className="min-h-screen bg-gray-50 font-sans">
      {/* 1. Header Section */}
      <div className="text-center py-16 bg-white shadow-md">
        <h1 className="text-5xl font-extrabold text-gray-900 mb-2">
          Picture Auction
        </h1>
        <p className="text-xl text-gray-600 mb-6">
          The Real-time Digital Art Bidding Platform
        </p>
        <Link
          to="/upcoming"
          className="inline-block bg-indigo-600 text-white text-lg font-semibold py-3 px-8 rounded-xl shadow-lg hover:bg-indigo-700 transition duration-300 transform hover:scale-105"
        >
          View Live Auctions
        </Link>
      </div>

      {/* 2. Product Grid Section */}
      <div className="container mx-auto p-8">
        <h2 className="text-3xl font-bold text-gray-800 mb-8 border-b-2 border-indigo-200 pb-2">
          Upcoming Auctions ({filteredProducts.length})
        </h2>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
          {filteredProducts.map((product) => {
            // Business Logic: กำหนดสีตามสถานะ isLiked ของสินค้านั้นๆ
            const heartFillColor = product.isLiked ? "#FF4081" : "none";
            const heartStrokeColor = product.isLiked ? "#FF4081" : "#848484";

            // 💡 Tech Stack: ใช้ Placeholder Image แทนการ Import ไฟล์
            // สมมติว่า product.id ใช้เพื่อสร้าง Text ใน Placeholder
            const placeholderText = product.title
              ? product.title.split(" ")[0]
              : "Art";
            const imageSource = `https://placehold.co/400x300/22d3ee/ffffff?text=${placeholderText}`;

            return (
              <div
                className="bg-white rounded-xl shadow-xl hover:shadow-2xl transition duration-300 overflow-hidden flex flex-col"
                key={product.id}
              >
                <div className="relative">
                  <img
                    className="w-full h-48 object-cover"
                    src={imageSource}
                    alt={product.title}
                    onError={(e) => {
                      e.target.onerror = null;
                      e.target.src =
                        "https://placehold.co/400x300/e0e0e0/505050?text=Image+Unavailable";
                    }}
                  />
                  {/* Heart Button */}
                  <button
                    onClick={(e) => handleLikeToggle(e, product.id)}
                    className="absolute top-3 right-3 p-2 bg-white bg-opacity-80 rounded-full shadow-md backdrop-blur-sm"
                  >
                    <HeartIcon
                      size="24"
                      fill={heartFillColor}
                      stroke={heartStrokeColor}
                      className="transition hover:scale-110"
                    />
                  </button>
                </div>

                {/* Card Description */}
                <div className="p-4 flex flex-col flex-grow">
                  <p
                    className="text-xl font-semibold text-gray-900 truncate mb-1"
                    title={product.title}
                  >
                    {product.title || "Untitled Artwork"}
                  </p>
                  <p className="text-sm text-gray-500 mb-2">
                    <span className="font-medium text-gray-700">
                      Current Bid:
                    </span>{" "}
                    {product.price || "N/A"}
                  </p>
                  <p className="text-sm text-yellow-600 font-semibold mb-4">
                    Time Remaining: {product.time || "Live"}
                  </p>

                  {/* Bid Button */}
                  <div className="mt-auto">
                    <Link
                      to={`/auction-detail/${product.id}`}
                      className="w-full text-center block bg-indigo-500 text-white font-bold py-2 rounded-lg hover:bg-indigo-600 transition duration-200 shadow-md"
                    >
                      Bid Now
                    </Link>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}

export default HomePage;
