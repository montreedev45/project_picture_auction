// useCountdownTimer.js
import { useState, useEffect } from 'react';

// 🚨 ต้องรวมฟังก์ชัน formatSecondsToTime ไว้ใน Hook หรือ Import มาใช้
// เนื่องจาก Hook นี้ต้องรับผิดชอบในการแปลงค่าสุดท้าย
const formatSecondsToTime = (totalSeconds) => {
    if (totalSeconds <= 0 || totalSeconds === null || isNaN(totalSeconds))
        return "00 : 00 : 00";
    const hours = String(Math.floor(totalSeconds / 3600)).padStart(2, "0");
    const minutes = String(Math.floor((totalSeconds % 3600) / 60)).padStart(2, "0");
    const seconds = String(totalSeconds % 60).padStart(2, "0");
    return `${hours} : ${minutes} : ${seconds}`;
};


const useCountdownTimer = (initialSeconds) => {
    // 1. State ภายในสำหรับเก็บวินาทีที่เหลือ
    const [secondsRemaining, setSecondsRemaining] = useState(initialSeconds);
    
    // 2. 🔑 useEffect: ตั้งค่าเริ่มต้นใหม่ทุกครั้งที่ initialSeconds เปลี่ยน (Refresh/Bid)
    useEffect(() => {
        // เมื่อ initialSeconds เปลี่ยน (จากการคำนวณใน AuctionDetailPage) 
        // ให้ set State ภายในใหม่ทันที
        setSecondsRemaining(initialSeconds);
    }, [initialSeconds]); 

    // 3. 🚨 useEffect: Logic การนับถอยหลัง (Interval)
    useEffect(() => {
        // ถ้าเวลาหมดแล้ว หรือเวลานับเป็น 0 ให้หยุด
        if (secondsRemaining <= 0) return;

        // 💡 Tech Stack: ตั้ง Interval ที่วิ่งทุก 1 วินาที
        const intervalId = setInterval(() => {
            // ใช้ Functional Update (prev => prev - 1) เพื่อให้ Interval วิ่งอย่างอิสระ
            // โดยไม่ต้องพึ่งพา secondsRemaining ใน Dependency Array 
            setSecondsRemaining(prev => {
                if (prev <= 1) { // เมื่อนับถึง 1 วินาทีสุดท้าย ให้เคลียร์ Interval
                    clearInterval(intervalId);
                    return 0;
                }
                return prev - 1;
            });
        }, 1000);

        // 🔑 Cleanup: เคลียร์ Interval ทุกครั้งที่ Effect ถูกเรียกซ้ำหรือ Component ถูกถอดออก
        return () => clearInterval(intervalId);

    }, [secondsRemaining]); // 🚨 ให้ Effect รันซ้ำทุกครั้งที่ secondsRemaining เปลี่ยน
    
    // 4. คืนค่าเป็น String ที่จัดรูปแบบแล้ว
    return formatSecondsToTime(secondsRemaining);
};

export default useCountdownTimer;