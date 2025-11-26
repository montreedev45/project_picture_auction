import React from 'react';

const ErrorModal = ({ message, onClose }) => {
    if (!message) {
        return null; //ถ้าไม่มี message ให้แสดง ก็ไม่ render อะไรเลย
    }

    return (
        <div 
            style={styles.backdrop} 
            onClick={onClose}
        >
            {/* Modal Content (ตัวกล่องข้อความ) */}
            <div 
                style={styles.modalContent} 
                onClick={(e) => e.stopPropagation()} //ป้องกันไม่ให้คลิกแล้วปิด Modal ทันที
            >
                <div style={styles.header}>
                    <span style={styles.icon}>🚨</span> Error!
                </div>
                
                {/* ข้อความ Error จริง */}
                <p style={styles.message}>{message}</p>
                
                {/* ปุ่มปิด */}
                <button 
                    onClick={onClose} 
                    style={styles.button}
                >
                    Close
                </button>
            </div>
        </div>
    );
};

// CSS Styles (ใช้ Inline Style เพื่อความรวดเร็ว)
const styles = {
    backdrop: {
        position: 'fixed',
        top: 0,
        left: 0,
        width: '100%',
        height: '100%',
        backgroundColor: 'rgba(0, 0, 0, 0.6)',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        zIndex: 1000, // ให้ Modal อยู่บนสุด
    },
    modalContent: {
        backgroundColor: 'white',
        padding: '25px',
        borderRadius: '8px',
        maxWidth: '400px',
        width: '90%',
        boxShadow: '0 5px 15px rgba(0, 0, 0, 0.3)',
        textAlign: 'center',
    },
    header: {
        fontSize: '1.2em',
        fontWeight: 'bold',
        color: '#D9534F',
        marginBottom: '15px',
        borderBottom: '1px solid #eee',
        paddingBottom: '10px',
    },
    icon: {
        marginRight: '10px',
    },
    message: {
        color: '#333',
        marginTop: '30px',
        marginBottom: '10px',
    },
    button: {
        padding: '10px 20px',
        backgroundColor: '#D9534F',
        color: 'white',
        border: 'none',
        borderRadius: '5px',
        cursor: 'pointer',
    }
};

export default ErrorModal;