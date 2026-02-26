import React, { Suspense, lazy, createContext } from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "./components/AuthContext";
import ProtectedRoute from "./components/ProtectedRoute";
import Layout from "./components/Layout";
import { ErrorProvider } from "./components/ErrorContext";
import "./index.css";
import "./App.css";
import Loading from "./components/Loading";

/* -------- Lazy Load Pages -------- */
const HomePage = lazy(() => import("./pages/HomePage"));
const LoginPage = lazy(() => import("./pages/LoginPage"));
const SignUp = lazy(() => import("./pages/Sign-up"));
const UpcomingPage = lazy(() => import("./pages/UpcomingPage"));
const EndedPage = lazy(() => import("./pages/EndedPage"));
const MybidPage = lazy(() => import("./pages/MybidPage"));
const Page404 = lazy(() => import("./pages/PageError404"));
const Page500 = lazy(() => import("./pages/PageError500"));
const SaveItemPage = lazy(() => import("./pages/SaveItemPage"));
const MywinningPage = lazy(() => import("./pages/MywinningPage"));
const SearchPage = lazy(() => import("./pages/SearchPage"));
const DashBoard = lazy(() => import("./pages/UserDashboard"));
const ProfileSettingPage = lazy(() => import("./pages/ProfileSettingPage"));
const AuctionDetailPage = lazy(() => import("./pages/AuctionDetailPage"));
const UpdatePasswordPage = lazy(() => import("./pages/UpdatePasswordPage"));
const ForgetPasswordPage = lazy(() => import("./pages/forGetPass"));
const ResetPasswordPage = lazy(() => import("./pages/reSetPass"));
const CoinPackage = lazy(() => import("./pages/Coin-Package"));

function App() {
  return (
    <BrowserRouter>
      <ErrorProvider>
        <AuthProvider>
          <Layout>
            <Suspense fallback={<Loading text="Loading page..." />}>
              <Routes>

                {/* --- Public Routes --- */}
                <Route path="/" element={<HomePage />} />
                <Route path="/homepage" element={<HomePage />} />
                <Route path="/login" element={<LoginPage />} />
                <Route path="/SignUp" element={<SignUp />} />
                <Route path="/upcoming" element={<UpcomingPage />} />
                <Route path="/ended" element={<EndedPage />} />
                <Route path="/search" element={<SearchPage />} />
                <Route path="/forGetPass" element={<ForgetPasswordPage />} />
                <Route path="/reset-password/:token" element={<ResetPasswordPage />} />
                <Route path="/Page404" element={<Page404 />} />
                <Route path="/Page500" element={<Page500 />} />
                <Route path="*" element={<Page404 />} />

                {/* --- Protected Routes --- */}
                <Route element={<ProtectedRoute />}>
                  <Route path="/DashBoard" element={<DashBoard />} />
                  <Route path="/profile-setting" element={<ProfileSettingPage />} />
                  <Route path="/mybid" element={<MybidPage />} />
                  <Route path="/saveitem" element={<SaveItemPage />} />
                  <Route path="/mywinning" element={<MywinningPage />} />
                  <Route path="/update-password" element={<UpdatePasswordPage />} />
                  <Route path="/auction-detail/:id" element={<AuctionDetailPage />} />
                  <Route path="/coin-packet" element={<CoinPackage />} />
                </Route>

              </Routes>
            </Suspense>
          </Layout>
        </AuthProvider>
      </ErrorProvider>
    </BrowserRouter>
  );
}

export default App;
