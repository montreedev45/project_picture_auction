import { useEffect, useState } from "react";
import { Icon } from "@iconify/react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { useAuth } from "./AuthContext";
import io, { Socket } from "socket.io-client";

const API_URL = import.meta.env.VITE_BACKEND_URL;


const SOCKET_SERVER_URL = API_URL;

function Navbar() {
  const navigate = useNavigate()
  const { isLoggedIn, logout, userProfile, fetchUserProfile } = useAuth(); // ⬅️ ดึงสถานะและฟังก์ชันจาก Context
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isNotificationOpen, setIsNotification] = useState(false);
  const [notification, setNotification] = useState([]);
  const [showReddot, setShowReddot] = useState(false);
  const [menuList, setMenulist] = useState(false);
  const [textSearch , setTextSearch] = useState("")

  const location = useLocation();
  const currentPath = location.pathname;
  const pathsToHideInputSearch = ["/search", "/login", "/SignUp"];
  const shouldHideInputSearch = pathsToHideInputSearch.includes(currentPath);
  const acc_id = localStorage.getItem("acc_id");
  const token = localStorage.getItem("jwt");
  const statusColor = {
    rebid: { color: "red", message: "⚠️ Please rebid" },
    winner: { color: "green", message: "✅ You are winner" },
    start: { color: "blue", message: "🔥 First bid start..." },
  };

  useEffect(() => {
    const socket = io(SOCKET_SERVER_URL);

    const handleNotification = (data) => {
      const recieved_socket = data.notification;

      const latestSocketData = recieved_socket?.[0];
      const socketAccId = Number(latestSocketData?.acc_id);
      const currentAccId = Number(acc_id);
      const status = latestSocketData?.status;

      const isMyBid = socketAccId === currentAccId;
      const isOthersBid = socketAccId !== currentAccId;

      const shouldShowReddot =
        (isOthersBid && status === "rebid") ||
        (isMyBid && status === "winner") ||
        (status === "start")

      setShowReddot(shouldShowReddot);

      setNotification((prev) => {
        // 2. เช็กซ้ำ (Duplicate Check) โดยใช้ notic_id
        // ป้องกัน Error "Encountered two children with the same key"
        const isDuplicate = prev.some((item) =>
          recieved_socket.some((newItem) => newItem.notic_id === item.notic_id),
        );

        if (isDuplicate) return prev;

        // 3. ใช้ Spread Operator (...) เพื่อกระจาย Array ไม่ให้เกิด Array ซ้อน Array
        return [...prev, ...recieved_socket];
      });
    };

    // ดักฟัง Event
    socket.on("received_notification", handleNotification);
    socket.on("winner", handleNotification);

    // 4. Clean-up Function: สำคัญมากสำหรับ Full Stack
    // ป้องกันปัญหาการสร้างตัวดักฟังซ้ำเมื่อ Component Re-render
    return () => {
      socket.off("received_notification", handleNotification);
      socket.disconnect(); // ปิดการเชื่อมต่อเมื่อไม่ได้ใช้หน้า Navbar แล้ว
    };
  }, []); // [] มั่นใจว่ารันแค่ครั้งเดียวตอน Mount


  const handleSearch = (e) => {
    setTextSearch(e.target.value)
  }


  const searchWithText = () => {
    navigate(`/search?pro_name_input=${textSearch}`)
  }

  // ใส่ไว้นอกฟังก์ชันรับ Socket
  useEffect(() => {
  }, [notification]); // ฟังก์ชันนี้จะทำงานทุกครั้งที่ notification เปลี่ยนค่า

  const handleAccountClick = () => {
    setIsMenuOpen((prev) => !prev);
    setMenulist((prev) => !prev);
  };

  const handleLogout = () => {
    logout();
    setIsMenuOpen(false);
  };

  const handleNotification = () => {
    setShowReddot(false);
    setIsNotification((prev) => !prev);
  };

  const notificationBox = isNotificationOpen && isLoggedIn && (
    <div className="notification-container">
      {notification // ✅ กรองเอาเฉพาะแจ้งเตือนของคนอื่น (ที่เราต้องไปสู้ราคา)
        .slice()
        .reverse()
        .filter((item) => {
          const itemAccId = String(item.acc_id);
          const myAccId = String(acc_id);
          const status = item.status;

          const isActionStatus = status === "rebid" ;
          const isWinningStatus = status === "winner";
          const isFirstBid = status === "start"
          const isMyAccount = itemAccId === myAccId;

          return (
            (isActionStatus && !isMyAccount) || (isWinningStatus && isMyAccount) || (isFirstBid)
          );
        })
        .map((item) => {
          const classColor = statusColor[item.status];

          return (
            <div
              className={`notification-container-relative ${classColor.color}`}
              key={item.notic_id || crypto.randomUUID()} // ✅ ป้องกันกรณีไม่มี ID
            >
              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                  width: "100%",
                }}
              >
                <h5>{classColor.message}</h5>
                <small>PRO_ID: {item.pro_id}</small>
              </div>
            </div>
          );
        })}
    </div>
  );

  const authButtons = isLoggedIn ? (
    <div className="auth-group-1">
      <button className="icon-profile" onClick={handleAccountClick}>
        {userProfile?.profilePicUrl ? (
          <img // ถ้า userProfile เป็น null บรรทัดนี้จะไม่ถูกประมวลผล
            src={userProfile.profilePicUrl}
            alt="Profile"
            className="navbar-profile-pic"
          />
        ) : (
          <Icon icon="mdi:user" className="mdi:userAC" /> // แสดง Icon เมื่อไม่มีรูปภาพ
        )}
      </button>
      {isMenuOpen && (
        <div className="dropdown">
          <Link className="Link" to="/" onClick={() => setIsMenuOpen(false)}>
            <Icon icon="mdi:gavel" className="Link-icon" />
            Auction
          </Link>

          <Link
            className="Link"
            to="/profile-setting"
            onClick={() => setIsMenuOpen(false)}
          >
            <Icon icon="mdi:user" className="Link-icon" />
            Profile Setting
          </Link>
          <Link
            className="Link"
            to="/DashBoard "
            onClick={() => setIsMenuOpen(false)}
          >
            <Icon icon="ix:piechart-filled" className="Link-icon" />
            Dash Board
          </Link>
          <Link
            className="Link"
            to="/mybid"
            onClick={() => setIsMenuOpen(false)}
          >
            <Icon icon="mdi:gavel" className="Link-icon" />
            My Bids
          </Link>
          <Link
            className="Link"
            to="/mywinning"
            onClick={() => setIsMenuOpen(false)}
          >
            <Icon icon="healthicons:award-trophy" className="Link-icon" />
            My Winning
          </Link>
          <Link
            className="Link"
            to="/saveitem"
            onClick={() => setIsMenuOpen(false)}
          >
            <Icon icon="iconoir:star-solid" className="Link-icon" />
            Save Item
          </Link>
          <Link
            className="Link"
            to="/update-password"
            onClick={() => setIsMenuOpen(false)}
          >
            <Icon icon="" className="Link-icon" />
            Update Password
          </Link>
          <Link className="Link" to="/coin-packet">
            Coin Packet
          </Link>
          <Link className="Link" to="/homepage" onClick={handleLogout}>
            <Icon
              icon="material-symbols:logout"
              className="Link-icon"
              id="hed"
            />
            Log Out
          </Link>
        </div>
      )}
    </div>
  ) : (
    <div className="auth-group">
      <div className="link-login">
        <Link to="/login" className="nav-button sign-in-text">
          <h4 className="sign-page">sign in</h4>
        </Link>
        <Link to="/SignUp" className="nav-button sign-up-btn">
          <h4 className="sign-page">Sign Up</h4>
        </Link>
      </div>

      {menuList && (
        <div className="dropdown">
          <Link className="Link" to="/login" onClick={() => setMenulist(false)}>
            <Icon icon="ri:lock-2-line" className="Link-icon" />
            Sign In
          </Link>
          <Link
            className="Link"
            to="/SignUp"
            onClick={() => setMenulist(false)}
          >
            <Icon icon="iconoir:star-solid" className="Link-icon" />
            Sign up
          </Link>
        </div>
      )}
    </div>
  );

  return (
    <nav>
      <ul>
        <div className="navbar-left">
          <Link to="/" className="navbar-brand">
            <Icon className="icon-logo" icon="mdi:gavel" /> Picture Auction
          </Link>
        </div>
        {!shouldHideInputSearch && (
          <div className="navbar-center">
            <div className="search-input-wrapper">
              <input type="text" className="navbar-search" value={textSearch} onChange={handleSearch} onKeyDown={(e) => e.key === "Enter" && searchWithText()}/>
              <Icon icon="mdi:magnify" className="search-icon-overlay"  style={{cursor: "pointer"}} onClick={searchWithText}/>
            </div>
          </div>
        )}
        <div className="navbar-right">
          {isLoggedIn && (
            <div className="icon-container">
              <Icon
                icon="mdi-bell"
                className="mdi-bell"
                onClick={handleNotification}
                style={{ marginRight: "1rem", fontSize: "2.5rem" }}
              ></Icon>
              {showReddot ? <span className="red-dot"></span> : ""}
              {notificationBox}

              <span>{userProfile?.acc_coin}</span>
            </div>
          )}{authButtons}</div>
        <div className="logo-menu-list">
          <Icon
            className="icons-menu-list"
            onClick={handleAccountClick}
            icon="mage:dash-menu"
          />
        </div>
      </ul>
    </nav>
  );
}

export default Navbar;
