import { useState, useEffect } from 'react';

const useCountdownTimer = (initialSeconds) => {
    const [secondsRemaining, setSecondsRemaining] = useState(initialSeconds);

    // 💡 Tech Stack: ใช้ useEffect ที่รับ initialSeconds เพื่อเริ่มนับ
    useEffect(() => {
        setSecondsRemaining(initialSeconds);
    }, [initialSeconds]); 

    useEffect(() => {
        // 🚨 Logic: หยุดนับเมื่อเวลาหมด
        if (secondsRemaining <= 0) return;

        // 💡 Logic: นับถอยหลังทุก 1 วินาที
        const intervalId = setInterval(() => {
            setSecondsRemaining(prev => prev - 1);
        }, 1000);

        // 🔑 Cleanup: เคลียร์ Interval เมื่อ Component ถูกถอดออกหรือ Dependency เปลี่ยน
        return () => clearInterval(intervalId);
    }, [secondsRemaining]); // 🚨 ให้ Hook ทำงานซ้ำเมื่อ secondsRemaining เปลี่ยน
    
    // 💡 Logic: แปลงวินาทีเป็น HH : MM : SS เพื่อใช้แสดงผล
    return formatSecondsToTime(secondsRemaining);
};

export default useCountdownTimer;