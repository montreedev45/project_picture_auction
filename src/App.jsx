import React, { useState } from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "./components/AuthContext";
import ProtectedRoute from "./components/ProtectedRoute";
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
import ProfileSettingPage from "./pages/ProfileSettingPage";
import "./index.css";
import "./app.css";
import AuctionDetailPage from "./pages/AuctionDetailPage";
import UpdatePasswordPage from "./pages/UpdatePasswordPage";
import ForgetPasswordPage from "./pages/forGetPass";
import ResetPasswordPage from "./pages/reSetPass";
import { ErrorProvider } from "./components/ErrorContext";

function App() {
  return (
    <BrowserRouter>
      <ErrorProvider>
        <AuthProvider>
          <Layout>
            <Routes>
              {/* --- 1. Public Routes (เข้าได้ทุกคน) --- */}
              <Route path="/" element={<HomePage />} />
              <Route path="/homepage" element={<HomePage />} />
              <Route path="/login" element={<LoginPage />} />
              <Route path="/SignUp" element={<SignUp />} />
              <Route path="/upcoming" element={<UpcomingPage />} />
              <Route path="/ended" element={<EndedPage />} />
              <Route path="/search" element={<SearchPage />} />
              <Route path="/forGetPass" element={<ForgetPasswordPage />} />
              <Route
                path="/reset-password/:token"
                element={<ResetPasswordPage />}
              />
              <Route path="/Page404" element={<Page404 />} />
              <Route path="/Page500" element={<Page500 />} />
              <Route path="*" element={<Page404 />} />

              {/* --- 2. 🛡️ Protected Routes (ต้อง Login ก่อน) --- */}
              {/* ใช้ <Route element={<ProtectedRoute />} > เพื่อทำหน้าที่เป็น Gatekeeper */}
              <Route element={<ProtectedRoute />}>
                <Route path="/DashBoard" element={<DashBoard />} />
                <Route
                  path="/profile-setting"
                  element={<ProfileSettingPage />}
                />
                <Route path="/mybid" element={<MybidPage />} />
                <Route path="/saveitem" element={<SaveItemPage />} />
                <Route path="/mywinning" element={<MywinningPage />} />
                <Route
                  path="/update-password"
                  element={<UpdatePasswordPage />}
                />
                <Route
                  path="/auction-detail/:id"
                  element={<AuctionDetailPage />}
                />
              </Route>
            </Routes>
          </Layout>
        </AuthProvider>
      </ErrorProvider>
    </BrowserRouter>
  );
}

export default App;
