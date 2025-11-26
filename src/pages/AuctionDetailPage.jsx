import { useState, useEffect } from "react";
import { Icon } from "@iconify/react";
import { useParams } from "react-router-dom";
import "./AuctionDetailPage.css";
import axios from "axios";
import io from "socket.io-client";
import useCountdownTimer from "../components/useCountdownTimer";
import ErrorModal from "../components/ErrorModal";

const SOCKET_SERVER_URL = "http://localhost:5000";
let socket = null;

// ------------------------------------------------------------------
// Helper Function: Format Time
// ------------------------------------------------------------------
function formatSecondsToTime(totalSeconds) {
  const remainingSeconds = Math.round(totalSeconds);
  if (remainingSeconds <= 0 || isNaN(remainingSeconds)) return "00 : 00 : 00";

  const hours = String(Math.floor(remainingSeconds / 3600)).padStart(2, "0");
  const minutes = String(Math.floor((remainingSeconds % 3600) / 60)).padStart(
    2,
    "0"
  );
  const seconds = String(remainingSeconds % 60).padStart(2, "0");
  return `${hours} : ${minutes} : ${seconds}`;
}

function AuctionDetailPage() {
  const { id } = useParams();
  const token = localStorage.getItem("jwt");

  const [product, setProduct] = useState(null);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);

  const [bidPrice, setBidPrice] = useState("");

  // Real-Time States: ใช้สำหรับ Socket Update
  const [currentBidPrice, setCurrentBidPrice] = useState(0);
  const [bidHistory, setBidHistory] = useState([]);

  // ------------------------------------------------------------------
  // 🎯 useEffect 1: จัดการ Socket Connection และ Real-Time Update
  // ------------------------------------------------------------------
  useEffect(() => {
    // 1. เชื่อมต่อ Socket
    const socket = io(SOCKET_SERVER_URL);

    // 2. การจัดการ Connection/Room Join
    socket.on("connect", () => {
      console.log("🔗 Connected to Socket Server (ID: " + socket.id + ")");
      console.log(`Debug Client: Joining room with ID: ${id}`);
      socket.emit("join_auction", id);
    });

    // 3. การจัดการ Connection Error
    socket.on("connect_error", (err) => {
      console.error("❌ Socket Connection Failed:", err.message);
    });

    // 4. Listener สำหรับการอัปเดตข้อมูลทั้งหมด (รวมถึงเวลาใหม่)
    socket.on("auction_update", (data) => {
      console.log("Received real-time update:", data);

      if (data.product) {
        setProduct(data.product);
      }
      if (data.history) {
        setBidHistory(data.history);
      }
    });

    // 5. Cleanup
    return () => {
      // การใช้ socket.off() ร่วมกับการ disconnect() เป็นสิ่งที่ถูกต้อง
      socket.off("auction_update");
      socket.disconnect();
      console.log(`Disconnected from room ${id}.`);
    };
  }, [id, setProduct, setBidHistory]); // Dependencies

  // ------------------------------------------------------------------
  // 🎯 useEffect 2: Fetch Initial Data
  // ------------------------------------------------------------------
  useEffect(() => {
    const fetchAllData = async () => {
      setError(null);
      setLoading(true);

      try {
        // ใช้ Promise.allSettled เพื่อความทนทานต่อข้อผิดพลาด (Fault Tolerance)
        const [productResult, historyResult] = await Promise.allSettled([
          axios.get(`http://localhost:5000/api/auction/product/${id}`),
          axios.get(
            `http://localhost:5000/api/auction/products/${id}/history`,
            {
              headers: { Authorization: `Bearer ${token}` },
            }
          ),
        ]);

        if (productResult.status === "fulfilled") {
          const fetchedProduct = productResult.value.data.product;
          setProduct(fetchedProduct);
          setCurrentBidPrice(fetchedProduct.pro_price);
        } else {
          console.error("Product fetch failed:", productResult.reason);
          setError(
            productResult.reason?.response?.data?.message ||
              `Failed to fetch product ${id}.`
          );
        }

        if (historyResult.status === "fulfilled") {
          const fetchedHistory = historyResult.value.data.history || [];
          setBidHistory(fetchedHistory);
        } else {
          console.warn("History fetch failed:", historyResult.reason);
          setBidHistory([]);
        }
      } catch (err) {
      } finally {
        setLoading(false);
      }
    };

    if (id) fetchAllData();
  }, [id, token]); // เพิ่ม token ใน Dependency Array

  // ------------------------------------------------------------------
  // 🎯 Logic: การประมูล (Bid Action)
  // ------------------------------------------------------------------

  const auctionProducts = async () => {
    const requiredMinBid =
      (currentBidPrice || product.pro_price) +
      (product.pro_min_increment || 100);

    try {
      const payload = { bidPrice: parseFloat(bidPrice) };

      if (payload.bidPrice < requiredMinBid) {
        setError(`Bid must be at least $${requiredMinBid}.`);
        return;
      }

      const Auction_Url = `http://localhost:5000/api/auction/products/${id}/bids`;

      await axios.post(Auction_Url, payload, {
        headers: { Authorization: `Bearer ${token}` },
      });

      // 🟢 Success State:
      // 1. ล้าง Input
      setBidPrice("");
      // 2. ล้าง Error
      setError(null);
    } catch (err) {
      const errorMsg = err.response?.data?.message || `Failed to place bid.`;
      console.log("test_error", errorMsg);
      setError(errorMsg);
      console.log(error);
    }
  };

  const handleChange = (e) => {
    const { value } = e.target;
    setBidPrice(value);
  };



  // ------------------------------------------------------------------
  // 🎯 Rendering Logic (Timer and Data Access)
  // ------------------------------------------------------------------
  const auctionEndTimeString = product?.endTimeAuction;

  // 1. ⚙️ การแปลงและตั้งค่าเริ่มต้น
  let endTimeTimestamp = 0;
  let initialSeconds = product?.pro_time ?? 0; // ตั้งค่าเริ่มต้นเป็นเวลาเต็มของสินค้า (กรณีไม่มี Bid แรก)
  let isAuctionActive = false;

  // 2. ถ้ามีเวลาสิ้นสุด (หมายถึงมีการ Bid ครั้งแรกแล้ว)
  if (auctionEndTimeString) {
    // แปลง ISO String เป็น Unix Timestamp (Number) เพื่อใช้ในการคำนวณ
    endTimeTimestamp = new Date(auctionEndTimeString).getTime();

    // 3.  คำนวณเวลาที่เหลือจริง
    const timeLeftMs = Math.max(0, endTimeTimestamp - Date.now());
    initialSeconds = Math.floor(timeLeftMs / 1000); // initialSeconds คือ "เวลาที่เหลือจริง"

    // 4. กำหนดสถานะ
    isAuctionActive = timeLeftMs > 0;
  }

  // 5. เรียกใช้ Hook นับถอยหลัง (ใช้เวลาที่เหลือจริง ถ้า Auction Active)
  const countdownFromHook = useCountdownTimer(
    isAuctionActive ? initialSeconds : 0
  );

  // 6. แสดงผล: ถ้า Active ใช้ค่าจาก Hook ถ้าไม่ Active ใช้ค่า initialSeconds (เวลาเต็ม/0)
  const secondsToDisplay = isAuctionActive ? countdownFromHook : initialSeconds;
  const countdownDisplay = formatSecondsToTime(secondsToDisplay);

  const historyData = Array.isArray(bidHistory) ? bidHistory : [];

  if (loading) {
    return <div className="loading-container">กำลังโหลด...</div>;
  }

  // หาก Fetch สำเร็จ แต่ product เป็น null (เช่น 404 Not Found)
  if (!product) {
    return <div className="not-found">ไม่พบสินค้าที่ต้องการประมูล</div>;
  }

  const imageSource = `http://localhost:5000/images/products/${product.pro_imgurl}`;

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
        <div className="auction-right-time">
          <h1>{product.pro_name}</h1>
          <div className="group-top">
            <p>Time Remaining : {countdownDisplay}</p>
            <p>Current Bid : ${product.pro_price || "100"}</p>{" "}
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
            <button className="auction-button" onClick={auctionProducts}>
              Place Bid
            </button>
          </div>
          <div className="group-bottom">
            <p>Your Max Bid : $1000</p>
            <p>Minimum Increment : $100 </p>
          </div>
        </div>

        <div className="auction-right-log">
          <h5>Bid History Log : </h5>
          <ul>
            {historyData.map((bid, index) => (
              <li key={index}>
                User: {bid.acc_id} - Price: $ {bid.bidAmount} - Time:{" "}
                {new Date(bid.createdAt).toLocaleTimeString()}
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
}

export default AuctionDetailPage;
