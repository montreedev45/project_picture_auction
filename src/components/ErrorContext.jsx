import React, { createContext, useContext, useState, useMemo } from 'react';
import ErrorModal from './ErrorModal';

// 1. สร้าง Context
const ErrorContext = createContext();

// 2. Custom Hook สำหรับเรียกใช้ (Consumer)
export const useError = () => useContext(ErrorContext);

// 3. Component Provider (ตัวจ่ายข้อมูล)
export const ErrorProvider = ({ children }) => {
    console.log('Error start...')
  const [errorMsg, setErrorMsg] = useState(null);

  const clearError = () => {
    setErrorMsg(null);
  };
  
  // ใช้ useMemo เพื่อป้องกัน Re-render เกินจำเป็น
  const contextValue = useMemo(() => ({
    error: errorMsg,
    setError: setErrorMsg, // ฟังก์ชันสำหรับ Component อื่น ๆ เรียกใช้
    clearError: clearError, // ฟังก์ชันสำหรับ Modal เรียกใช้
  }), [errorMsg]); // ⬅️ อัปเดตเมื่อ errorMsg เปลี่ยน

  return (
    <ErrorContext.Provider value={contextValue}>
      {children} 
      {/* 🚨 Modal ถูก Render เพียงครั้งเดียว */}
      <ErrorModal 
        message={errorMsg} 
        onClose={clearError} 
      />
    </ErrorContext.Provider>
  );
};