import { useState, useEffect } from "react";
import { Icon } from "@iconify/react";
import { useParams } from "react-router-dom";
import "./AuctionDetailPage.css";
import view1 from "../assets/view1-ai-gen.png";
import view2 from "../assets/view2-ai-gen.png";
import axios from "axios";
import useCountdownTimer from "../components/useCountdownTimer";

// 💡 Tech Stack: การใช้ Hook, Axios และ Routing

function formatSecondsToTime(totalSeconds) {
  if (totalSeconds <= 0 || totalSeconds === null || isNaN(totalSeconds))
    return "00 : 00 : 00";
  const hours = String(Math.floor(totalSeconds / 3600)).padStart(2, "0");
  const minutes = String(Math.floor((totalSeconds % 3600) / 60)).padStart(
    2,
    "0"
  );
  const seconds = String(totalSeconds % 60).padStart(2, "0");
  return `${hours} : ${minutes} : ${seconds}`;
}


function AuctionDetailPage() {
  const { id } = useParams(); // 🔑 1. ดึง ID จาก URL
  const token = localStorage.getItem("jwt");
  const TIMER_START_KEY = `timer_start_timestamp_${id}`;


  // 🔑 2. State สำหรับสินค้าตัวเดียว (ใช้ Object แทน Array)
  const [product, setProduct] = useState(null);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);
  const [bidPrice, setBidPrice] = useState(0); // ✅ ถูก: Number
  // const [isCounting, setIsCounting] = useState(() => {
  //   // 💡 Tech Stack: ตรวจสอบ Local Storage เมื่อโหลดครั้งแรก
  //   // ถ้ามี Key `timer_started_${id}` และมีค่าเป็น 'true' ให้เริ่มนับเลย
  //   return localStorage.getItem(`timer_started_${id}`) === "true";
  // });

  const [timerStartTimestamp, setTimerStartTimestamp] = useState(() => {
    // 💡 ตรวจสอบ Local Storage เมื่อโหลดครั้งแรก
    const savedTime = localStorage.getItem(TIMER_START_KEY);
    // ถ้ามีค่าอยู่ใน localStorage ให้ใช้ค่านั้น (ถ้าไม่มีจะเป็น null)
    return savedTime ? parseInt(savedTime) : null;
  });

  useEffect(() => {
    // 💡 คำแนะนำ: ตั้งชื่อฟังก์ชันให้สอดคล้องกับ Action (fetchProductDetail)
    const fetchProductDetail = async () => {
      setError(null);
      setLoading(true);

      // ⚠️ การตรวจสอบ: ถ้าไม่มี ID หรือ ID เป็นค่าว่าง ไม่ต้อง Fetch
      if (!id) {
        setError("Product ID is missing.");
        setLoading(false);
        return;
      }

      try {
        const API_URL = `http://localhost:5000/api/auction/product/${id}`;
        const res = await axios.get(API_URL);
        const fetchedProduct = res.data.product;

        setProduct(fetchedProduct);
      } catch (err) {
        const errorMsg =
          err.response?.data?.message || `Failed to fetch product ${id}.`;

        setError(errorMsg);
      } finally {
        setLoading(false);
      }
    };

    fetchProductDetail();
    // 🔑 Dependency Array: ใส่ [id] เพื่อให้ Fetch ใหม่เมื่อ ID เปลี่ยน (เช่น Navigate จาก ID 1 ไป ID 2)
  }, [id]);

  const auctionProducts = async () => {
    try {
      const payload = { bidPrice: parseInt(bidPrice) };
      const Auction_Url = `http://localhost:5000/api/auction/products/${id}/bids`;

      const res = await axios.post(Auction_Url, payload, {
        headers: {
          // 💡 Content-Type เป็นค่า Default อยู่แล้ว แต่ระบุไว้เพื่อความชัดเจน
          "Content-Type": "application/json",
          // 🔑 Authorization Header ที่ถูกต้อง
          Authorization: `Bearer ${token}`,
        },
      });

      console.log(res.data.product);

      setProduct(res.data.product);
      if (!isCounting) {
        const startTime = Date.now();
        setTimerStartTimestamp(startTime); // อัปเดต State
        localStorage.setItem(TIMER_START_KEY, startTime.toString()); // บันทึกลง Local Storage
      }

      // 🚨 ไม่ว่า Bid จะครั้งแรกหรือครั้งที่สอง อัปเดตข้อมูลสินค้าเสมอ
      setBidPrice(0); // ล้าง Input
    } catch (err) {
      const errorMsg =
        err.response?.data?.message || `Failed to auctions product ${id}.`;

      setError(errorMsg);
    } finally {
      setLoading(false);
    }
  };

  // --- Rendering Logic ---
  const isCounting = timerStartTimestamp !== null;
  const productTime = product?.pro_time ?? 0;
  let initialSeconds;
  if (isCounting) {
    // 🚨 Logic ข้อ 3: เมื่อ Refresh ต้องนับต่อจากเวลาที่เหลืออยู่จริง
    // เวลาที่เหลือจริง = เวลาเริ่มต้น (pro_time) - (เวลานับถึงปัจจุบัน - เวลาเริ่มนับ)
    const secondsElapsedSinceStart = Math.floor(
      (Date.now() - timerStartTimestamp) / 1000
    );

    // 🚨 คำนวณเวลาที่เหลือจริง
    initialSeconds = Math.max(0, productTime - secondsElapsedSinceStart);
  } else {
    // Logic ข้อ 1: ยังไม่นับ ให้ใช้เวลาจาก Server โดยตรง
    initialSeconds = productTime;
  }

  const countdownFromHook = useCountdownTimer(initialSeconds);

  // 💡 Logic การแสดงผล: ถ้ากำลังนับ ให้แสดง Hook ถ้าไม่นับ ให้แสดงค่า Freeze
  const countdownDisplay = isCounting
    ? countdownFromHook
    : formatSecondsToTime(productTime);
  const handleChange = (e) => {
    const { value } = e.target;
    setBidPrice(value);
  };

  if (loading) {
    return <div className="loading-container">กำลังโหลด...</div>;
  }

  if (error) {
    return <div className="error-container">Error: {error}</div>;
  }

  // 🔑 5. หาก Fetch สำเร็จ แต่ product เป็น null (เช่น 404 Not Found)
  if (!product) {
    return <div className="not-found">ไม่พบสินค้าที่ต้องการประมูล</div>;
  }

  // 🔑 6. Render Component Detail เพียงตัวเดียว
  const imageSource = product.pro_imgurl === "view1" ? view1 : view2; // ใช้ URL จริงจาก API

  return (
    <div className="auction-container">
      <div className="auction-left">
        <img src={imageSource} alt={product.pro_name} />
        <div className="auction-left-text">
          <p>
            <b>Title : </b>
            {product.pro_name}
          </p>
          <p>
            <b>Description : </b>
            {product.pro_des}
          </p>
        </div>
      </div>

      <div className="auction-right">
        {/* ... ส่วน Bid Form และ Log History (คงเดิม) ... */}
        <div className="auction-right-time">
          <h1>{product.pro_name}</h1>
          <div className="group-top">
            <p>Time Remaining : {countdownDisplay || "00 : 00 : 00"}</p>{" "}
            {/* 💡 ดึงค่าจริง */}
            <p>Current Bid : ${product.pro_price || "100"}</p>{" "}
            {/* 💡 ดึงค่าจริง */}
          </div>
          <div className="group-mid">
            <p>Place Your Bid</p>
            <input
              type="text"
              name="bidPrice"
              value={String(bidPrice)}
              onChange={handleChange}
              className="bidPrice"
            />
            <button
              className="auction-button"
              onClick={auctionProducts}
              disabled={countdownDisplay === "00:00:00"}
            >
              Place Bid
            </button>
          </div>
          <div className="group-bottom">
            <p>Your Max Bid : $1000</p>
            <p>Minimum Increment : $100 </p>
          </div>
        </div>

        <div className="auction-right-log">
          {/* 💡 ควรวนซ้ำ Bid History ของ product จริง ๆ */}
          <h5>Bid History Log : </h5>
          {/* ... Bid Log JSX ... */}
        </div>
      </div>
    </div>
  );
}

export default AuctionDetailPage;
