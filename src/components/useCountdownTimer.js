import { useState, useEffect } from 'react';

const useCountdownTimer = (initialSeconds) => {
    const [seconds, setSeconds] = useState(initialSeconds);
    
    useEffect(() => {
        // 1. ถ้า initialSeconds เป็น 0 หรือไม่ได้เริ่มนับ ให้หยุด
        if (initialSeconds <= 0) {
            setSeconds(initialSeconds); // ตั้งค่าให้เป็น 0
            return;
        }

        // 2. ตั้งค่า State เริ่มต้นใหม่ทุกครั้งที่ initialSeconds เปลี่ยน
        setSeconds(initialSeconds);

        const interval = setInterval(() => {
            setSeconds(prevSeconds => {
                if (prevSeconds <= 1) {
                    clearInterval(interval);
                    return 0;
                }
                return prevSeconds - 1;
            });
        }, 1000);

        return () => clearInterval(interval);
    }, [initialSeconds]); // เริ่มนับใหม่เมื่อค่า initialSeconds เปลี่ยนไป

    return seconds;
}

export default useCountdownTimer;