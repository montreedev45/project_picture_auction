import axios from "axios";
import React, { createContext, useState, useEffect, useContext } from "react";
import { useNavigate } from "react-router-dom";
import Loading from "./Loading";

const API_URL = import.meta.env.VITE_BACKEND_URL;
const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const navigate = useNavigate();

  // -------- initial values --------
  const initialToken = localStorage.getItem("jwt");
  const initialUserId = localStorage.getItem("acc_id");
  const initialUsername = localStorage.getItem("acc_username");

  // -------- state --------
  const [token, setToken] = useState(initialToken);
  const [userId, setUserId] = useState(initialUserId);
  const [username, setUsername] = useState(initialUsername);
  const [userProfile, setUserProfile] = useState(null);
  const [isLoggedIn, setIsLoggedIn] = useState(!!initialToken);
  const [loading, setLoading] = useState(true);

  // -------- helper: logout --------
  const logout = () => {
    localStorage.clear();
    setIsLoggedIn(false);
    setToken(null);
    setUserId(null);
    setUserProfile(null);
    navigate("/login", { replace: true });
  };

  // -------- helper: fetch profile --------
  const fetchUserProfile = async (currentToken, currentUserId) => {
    if (!currentToken || !currentUserId) {
      setUserProfile(null);
      return;
    }

    const URL = `${API_URL}/api/auction/users/${currentUserId}`;
    const res = await axios.get(URL, {
      headers: { Authorization: `Bearer ${currentToken}` },
    });

    const user = res.data.user;

    const profilePicUrl = user.acc_profile_pic
      ? `${API_URL}/images/profiles/${user.acc_profile_pic}`
      : null;

    setUserProfile({
      ...user,
      profilePicUrl,
    });
  };

  // -------- helper: check token --------
  const checkTokenExpireAndFetchProfile = async (
    currentToken,
    currentUserId
  ) => {
    if (!currentToken) {
      setLoading(false);
      return;
    }

    try {
      await axios.post(
        `${API_URL}/api/auction/checkToken`,
        {},
        { headers: { Authorization: `Bearer ${currentToken}` } }
      );

      await fetchUserProfile(currentToken, currentUserId);
    } catch (error) {
      console.error("Token invalid or expired");
      logout();
    } finally {
      setLoading(false);
    }
  };

  // -------- init auth (สำคัญมาก) --------
  useEffect(() => {
    checkTokenExpireAndFetchProfile(token, userId);
  }, [token, userId]);

  // -------- login --------
  const login = async (jwtToken, accId, username, profileData) => {
    localStorage.setItem("jwt", jwtToken);
    localStorage.setItem("acc_id", accId);
    localStorage.setItem("acc_username", username);

    setIsLoggedIn(true);
    setToken(jwtToken);
    setUserId(accId);
    setUsername(username);

    const profilePicUrl = profileData.acc_profile_pic
      ? `${API_URL}/images/profiles/${profileData.acc_profile_pic}`
      : null;

    setUserProfile({
      ...profileData,
      profilePicUrl,
    });
  };

  // -------- loading gate --------
if (loading) return <Loading text="Checking authentication..." />;

  return (
    <AuthContext.Provider
      value={{
        isLoggedIn,
        token,
        userProfile,
        login,
        logout,
        loading,
        fetchUserProfile,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);