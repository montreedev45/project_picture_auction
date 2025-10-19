import React, { useState, useEffect } from 'react'; // ✅ Tech Stack: นำเข้า useState
import { Icon } from '@iconify/react';
import { useParams } from 'react-router-dom';
import './AuctionDetailPage.css'
//import { getProductById } from '../components/MockData';
import view1 from '../assets/view1-ai-gen.png'
import view2 from '../assets/view2-ai-gen.png'

function AuctionDetailPage() {

    const { id } = useParams(); 
    
    const [product, setProduct] = useState(null);
    const [loading, setLoading] = useState(true);

    

    // BUSINESS LOGIC: ดึงข้อมูลจาก Mock File
    useEffect(() => {
        if (id) {
            setLoading(true);
            
            // 💡 TECH STACK: กำหนด URL API ของ Express Backend
            const API_URL = `http://localhost:5000/api/auction/product/${id}`;

            // ใช้ fetch เพื่อเรียกข้อมูล
            fetch(API_URL)
                .then(response => {
                    // ตรวจสอบ HTTP Status (เช่น 404, 500)
                    if (!response.ok) {
                        // ถ้าสถานะไม่ OK (เช่น 404 Not Found), ให้ throw error
                        throw new Error(`HTTP error! status: ${response.status}`);
                    }
                    return response.json(); // แปลง Response เป็น JSON
                })
                .then(data => {
                    // ✅ Success: ได้รับข้อมูลสินค้า
                    setProduct(data); 
                    setLoading(false);
                })
                .catch(error => {
                    // 🛑 Error Handling: จัดการ Error (เช่น Network Error, 404)
                    console.error("Error fetching product:", error);
                    setProduct(null); // ตั้งค่า product เป็น null เพื่อแสดงหน้า Error
                    setLoading(false);
                });
            }
    }, [id]);
     

    // ✅ 1. ตรวจสอบ Loading State ก่อน
    if (loading) {
        return <div className="p-8 text-center text-blue-600">Loading product details...</div>;
    }
    
    // ✅ 2. ตรวจสอบ Product State ก่อน (หลังจาก Loading เสร็จ)
    if (!product) {
        return (
             <div className="p-8 text-center text-red-600">Product not found.</div>
        );
    }
    
    const imageSource = product.imageUrl === 'view1' ? view1 : view2;


    return (
        <>
            <div className="auction-container">
                <div className="auction-left">
                    <img src={imageSource} alt="" />
                    <div className="auction-left-text">
                        <p><b>title : </b>{product.title}</p>
                        <p><b>description : </b>{product.des}</p>
                    </div>
                </div>
                <div className="auction-right">
                    <div className="auction-right-time">
                        <h1>Auction Form</h1>
                        <h3>Time : 00 : 02 : 00</h3>
                        <h3>Current : 100$</h3>
                        <button className='auction-button'>Bid Now</button>
                        <p>Your Max Bid : 1000$</p>
                        <p>Minimum Increment : 100$ </p>
                    </div>
                    <div className="auction-right-log">
                        <h5>Bid History Log : </h5>
                        <div className='auction-right-log-div'>
                            <div className="auction-right-log-list">
                                <div className="auction-right-log-list-left">
                                    <Icon icon="mdi:user" className="icon" />
                                    <p>usertest bid : 100$</p>
                                </div>
                                <div className="auction-right-log-list-right">
                                    <p>5 seconds ago</p>
                                </div>
                            </div>
                            <div className="auction-right-log-list">
                                <div className="auction-right-log-list-left">
                                    <Icon icon="mdi:user" className="icon" />
                                    <p>usertest bid : 100$</p>
                                </div>
                                <div className="auction-right-log-list-right">
                                    <p>5 seconds ago</p>
                                </div>
                            </div>
                            <div className="auction-right-log-list">
                                <div className="auction-right-log-list-left">
                                    <Icon icon="mdi:user" className="icon" />
                                    <p>usertest bid : 100$</p>
                                </div>
                                <div className="auction-right-log-list-right">
                                    <p>5 seconds ago</p>
                                </div>
                            </div>
                            <div className="auction-right-log-list">
                                <div className="auction-right-log-list-left">
                                    <Icon icon="mdi:user" className="icon" />
                                    <p>usertest bid : 100$</p>
                                </div>
                                <div className="auction-right-log-list-right">
                                    <p>5 seconds ago</p>
                                </div>
                            </div>
                            <div className="auction-right-log-list">
                                <div className="auction-right-log-list-left">
                                    <Icon icon="mdi:user" className="icon" />
                                    <p>usertest bid : 100$</p>
                                </div>
                                <div className="auction-right-log-list-right">
                                    <p>5 seconds ago</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );

}

export default AuctionDetailPage