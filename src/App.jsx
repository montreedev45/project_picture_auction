// src/App.jsx
import React, { useState } from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Layout from "./components/Layout";
import HomePage from "./pages/HomePage";
import LoginPage from "./pages/LoginPage";
import SignUp from "./pages/Sign-up";
import UpcomingPage from "./pages/UpcomingPage";
import EndedPage from "./pages/EndedPage";
import MybidPage from "./pages/MybidPage";
import Page404 from "./pages/PageError404";
import Page500 from "./pages/PageError500";
import SaveItemPage from "./pages/SaveItemPage";
import MywinningPage from "./pages/mywinningPage";
import SearchPage from "./pages/SearchPage";
import DashBoard from "./pages/UserDashboard";
import ProfileSettingPage from './pages/ProfileSettingPage';
import "./index.css";
import "./app.css";
import AuctionDetailPage from "./pages/AuctionDetailPage";
import UpdatePasswordPage from "./pages/UpdatePasswordPage";

function App() {
  // State ถูกตั้งค่าไว้ แต่เราจะยังไม่ใช้ Logic ในตอนนี้
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  // ฟังก์ชัน Mock (จำลอง) การจัดการสิทธิ์
  const handleAuthAction = (action) => {
    //console.log(`Auth action: ${action} triggered (Mock)`);
    setIsLoggedIn(action === 'login'); // ตั้งค่าสถานะตาม action
  };

  return (
    <BrowserRouter>
      <Layout isLoggedIn={isLoggedIn} onAuthAction={handleAuthAction}>
        <Routes>
          {/* 1. หน้าหลัก (แสดงเนื้อหาเริ่มต้น) */}
          <Route path="/" element={<HomePage />} />

          {/* 2. หน้า Login: แสดงผล LoginPage Component */}
          <Route path="/login" element={<LoginPage onAuthAction={handleAuthAction} />} />
          <Route path="/SignUp" element={<SignUp onAuthAction={handleAuthAction} />} />
          <Route path="/upcoming" element={<UpcomingPage onAuthAction={handleAuthAction} />} />
          <Route path="/ended" element={<EndedPage onAuthAction={handleAuthAction} />} />
          <Route path="/mybid" element={<MybidPage onAuthAction={handleAuthAction} />} />
          <Route path="/saveitem" element={<SaveItemPage onAuthAction={handleAuthAction} />} />
          <Route path="/mywinning" element={<MywinningPage onAuthAction={handleAuthAction} />} />
          <Route path="/search" element={<SearchPage onAuthAction={handleAuthAction} />} />
          <Route path="/DashBoard" element={<DashBoard />} />
          <Route path="/profile-setting" element={<ProfileSettingPage onAuthAction={handleAuthAction} />} />
          <Route path="/auction-detail/:id" element={<AuctionDetailPage onAuthAction={handleAuthAction} />} />
          <Route path="/update-password" element={<UpdatePasswordPage onAuthAction={handleAuthAction} />} />
          
          {/* 3. หน้า 404 Fallback */}
          <Route path="/Page404" element={<Page404 />}></Route>
          <Route path="/Page500" element={<Page500 />}></Route>
          <Route path="/HomePage" element={<HomePage />}></Route>
        </Routes>
      </Layout>
    </BrowserRouter>
  );
}

export default App;
