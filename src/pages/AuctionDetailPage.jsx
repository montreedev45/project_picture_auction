import { useState, useEffect } from "react";
import { Icon } from "@iconify/react";
import { useParams } from "react-router-dom";
import "./AuctionDetailPage.css";
import axios from "axios";
import io from "socket.io-client";
import useCountdownTimer from "../components/useCountdownTimer";
import { useError } from "../components/ErrorContext";
import { useAuth } from "../components/AuthContext";

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
  const { setError } = useError();
  const { id } = useParams();
  const { fetchUserProfile, userProfile } = useAuth(); //  ดึงข้อมูลผู้ใช้และฟังก์ชัน update จาก Context
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [bidPrice, setBidPrice] = useState("");
  const token = localStorage.getItem("jwt");
  const userId = localStorage.getItem("acc_id");

  // State: ใช้สำหรับ update data จาก socket ที่ส่งมา
  const [currentBidPrice, setCurrentBidPrice] = useState(0);
  const [bidHistory, setBidHistory] = useState([]);


  useEffect(() => {
    console.log("fetch profile")
    fetchUserProfile(token, userId)
  }, [bidHistory])
  // ------------------------------------------------------------------
  // useEffect 1: จัดการ Socket Connection และ Real-Time Update
  // ------------------------------------------------------------------
  useEffect(() => {
    // 1. เชื่อมต่อ Socket
    const socket = io(SOCKET_SERVER_URL);

    // 2. การจัดการ Connection/Room Join
    socket.on("connect", () => {
      // console.log("🔗 Connected to Socket Server (ID: " + socket.id + ")");
      // console.log(`Debug Client: Joining room with ID: ${id}`);
      socket.emit("join_auction", id);
    });

    // 3. การจัดการ Connection Error
    socket.on("connect_error", (err) => {
      console.error("❌ Socket Connection Failed:", err.message);
    });

    // 4. Listener สำหรับการอัปเดตข้อมูลทั้งหมด จาก broadcast ที่ส่งมา
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
      socket.off("auction_update");
      socket.disconnect();
      //console.log(`Disconnected from room ${id}.`);
    };
  }, [id, setProduct, setBidHistory]);

  // ------------------------------------------------------------------
  // useEffect 2: Fetch Initial Data
  // ------------------------------------------------------------------
  useEffect(() => {
    const fetchAllData = async () => {
      setError(null);
      setLoading(true);

      try {
        // ใช้ Promise.allSettled เพื่อยิง api พร้อมกัน
        const [productResult, historyResult] = await Promise.allSettled([
          axios.get(`http://localhost:5000/api/auction/product/${id}`),
          axios.get(
            `http://localhost:5000/api/auction/products/${id}/history`,
            {
              headers: { Authorization: `Bearer ${token}` },
            }
          ),
        ]);

        // เมื่อใช้ Promise.allSettled ต้องเช็ค status ด้วย
        // res from api product
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

        //res from api history
        if (historyResult.status === "fulfilled") {
          const fetchedHistory = historyResult.value.data.history || [];
          setBidHistory(fetchedHistory);
        } else {
          console.warn("History fetch failed:", historyResult.reason);
          setBidHistory([]);
        }
      } catch (error) {
        let errorMessage = "fetch data failed, Pless check server";

        if (
          error.response &&
          error.response.data &&
          error.response.data.message
        ) {
          errorMessage = error.response.data.message;
        }
        setError(errorMessage);
      } finally {
        setLoading(false);
      }
    };

    if (id) fetchAllData();
  }, [id, token]);

  // ------------------------------------------------------------------
  // Logic: การประมูล (Bid Action)
  // ------------------------------------------------------------------
  const auctionProducts = async () => {
    const requiredMinBid =
      (currentBidPrice || product.pro_price) + product.pro_min_increment;

    try {
      const payload = { bidPrice: parseFloat(bidPrice) };

      if (payload.bidPrice < requiredMinBid) {
        setError(`Bid must be at least $${requiredMinBid}`);
        return;
      }

      const Auction_Url = `http://localhost:5000/api/auction/products/${id}/bids`;
      await axios.post(Auction_Url, payload, {
        headers: { Authorization: `Bearer ${token}` },
      });

      setBidPrice("");
      setError(null);
      fetchUserProfile(token, userId);
    } catch (error) {
      let errorMessage = `Failed to place bid.`;

      if (
        error.response &&
        error.response.data &&
        error.response.data.message
      ) {
        errorMessage = error.response.data.message;
      }
      setError(errorMessage);
    }
  };

  const handleChange = (e) => {
    const { value } = e.target;
    setBidPrice(value);
  };

  const handleKeyDown = (event) => {
  if (event.key === 'Enter') {
    auctionProducts();
  }
};

  // ------------------------------------------------------------------
  // Rendering Logic (Timer and Data Access)
  // ------------------------------------------------------------------
  const auctionEndTimeString = product?.endTimeAuction; // ถ้ายังไม่มีการ bid .endTimeAuction จะไม่มีในระบบ
  // 1. การแปลงและตั้งค่าเริ่มต้น
  let endTimeTimestamp = 0;
  let initialSeconds = product?.pro_time ?? 0; // ตั้งค่าเริ่มต้นเป็นเวลาเต็มของสินค้า (กรณีไม่มี Bid แรก) เช่น 120 วิ
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
  const imageSource = product?.pro_imgurl
    ? `http://localhost:5000/images/products/${product.pro_imgurl}`
    : "";

  if (loading) {
    return <div className="auction-container-loading">กำลังโหลด...</div>;
  }

  if (!product) {
    return (
      <div className="auction-container-not-found">
        ไม่พบสินค้าที่ต้องการประมูล
      </div>
    );
  }

  return (
    <div className="auction-container">
      <div className="auction-container-imgDetail">
        <img src={imageSource} alt={product.pro_name} />
        <div className="auction-container-imgDetail-text">
          <b>{product.pro_name}</b>
          <p>{product.pro_des}</p>
        </div>
      </div>

      <div className="auction-container-bidDetail">
        <div className="auction-container-bidDetail-placeBid">
          <div className="auction-container-bidDetail-placeBid-top">
            <b>{product.pro_name}</b>
          </div>
          <div className="auction-container-bidDetail-placeBid-mid">
            <p>Time Remaining : {countdownDisplay}</p>
            <p>
              Current Bid : &nbsp;<Icon icon="mdi-coin"></Icon> &nbsp;
              {product.pro_price.toLocaleString('en-US') || "100"}
            </p>{" "}
            <p>
              Min Increment : &nbsp;<Icon icon="mdi-coin"></Icon> &nbsp;
              {product.pro_min_increment.toLocaleString('en-US')}{" "}
            </p>
            <input
              type="text"
              name="bidPrice"
              value={String(bidPrice)}
              onChange={handleChange}
              onKeyDown={handleKeyDown}
              className="bidPrice"
              placeholder="Your Bid Price"
            />
            <button className="auction-button" onClick={auctionProducts}>
              Place Bid
            </button>
          </div>
          <div className="auction-container-bidDetail-placeBid-bottom">
            <b>Bid History Log : </b>
            <ul className="auction-ui-history">
              {historyData.map((bid, index) => (
                <li key={index}>
                  <p>user {bid.acc_id} -- $ {bid.bidAmount.toLocaleString('en-US')}</p><p>{new Date(bid.createdAt).toLocaleTimeString()}</p>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}

export default AuctionDetailPage;
