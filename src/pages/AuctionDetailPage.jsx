import React, { useState, useEffect } from 'react'; // ✅ Tech Stack: นำเข้า useState
import { Icon } from '@iconify/react';
import { useParams } from 'react-router-dom';
import './AuctionDetailPage.css'
import { getProductById } from '../components/MockData';
import view1 from '../assets/view1-ai-gen.png'
import view2 from '../assets/view2-ai-gen.png'

function AuctionDetailPage() {

    const { id } = useParams(); 
    
    const [product, setProduct] = useState(null);
    const [loading, setLoading] = useState(true);

    

    // BUSINESS LOGIC: ดึงข้อมูลจาก Mock File
    useEffect(() => {
        if (id) {
            const foundProduct = getProductById(id); 
            
            // 💡 UX/UI Tip: จำลองการหน่วงเวลา (Latency) เพื่อให้เห็น loading state
            setTimeout(() => {
                setProduct(foundProduct);
                setLoading(false); // 🚩 ตั้งค่า loading เป็น false เมื่อได้ข้อมูลแล้ว
            }, 300); // 300ms delay
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