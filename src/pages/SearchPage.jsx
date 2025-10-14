import React, { useState } from 'react'; // ✅ Tech Stack: นำเข้า useState
import { Link } from 'react-router-dom';
import './SearchPage.css'
import view1 from '../assets/view1-ai-gen.png'
import view2 from '../assets/view2-ai-gen.png'
import { initialProducts } from '../components/MockData';
import { Icon } from '@iconify/react';


// Tech Stack: Mock Data (เพิ่ม property 'isLiked' เริ่มต้น)


function SearchPage() {
    // ✅ Tech Stack: State Management สำหรับรายการ (Array State)
    const [products, setProducts] = useState(initialProducts);

    // Icon heart svg
    const HeartIcon = ({ className = "icon", size = "24", fill = "none", stroke = "currentColor", onClick }) => (
        <svg 
            xmlns="http://www.w3.org/2000/svg" 
            width={size} 
            height={size} 
            viewBox="0 0 24 24" 
            fill={fill} 
            stroke={stroke} 
            strokeWidth="1" 
            strokeLinecap="round" 
            strokeLinejoin="round" 
            className={className}
            onClick={onClick}
            style={{ cursor: 'pointer' }} 
        >
            {/* Business Logic: Path ของ Icon รูปหัวใจ */}
            <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/>
        </svg>
    );

    // ----------------------------------------------------------------
    // 2. Business Logic: Handler สำหรับการกด Like/Unlike
    // ----------------------------------------------------------------
    const handleLikeToggle = (e, id) => {
        e.preventDefault(); 
        
        // Tech Stack: การอัปเดต Array State แบบ Immutable 
        setProducts(currentProducts => 
            currentProducts.map(product => 
                product.id === id 
                    ? { ...product, isLiked: !product.isLiked } // อัปเดตสถานะ Like ของ Card ที่ถูกกด
                    : product 
            )
        );
    };

    // Tech Stack: ใช้ Placeholder Image (เพื่อให้ภาพแสดงผลอย่างถูกต้อง)
    
    return (
        <>
            <div className="search-input-wrapper">
                <input type="text" className="navbar-search" />
                <Icon icon="mdi:magnify" className="search-icon-overlay" />
                <Icon icon="mi:filter" className="search-icon-filter" />
                    
            </div>
            <div className="search-container">
                <div className="search-container-card">
                    
                    {/* ✅ Tech Stack: ใช้ .map() เพื่อ Render รายการสินค้าอัตโนมัติ */}
                    {products.filter(product => product.isLiked == true).map((product) => {
                        // Business Logic: กำหนดสีตามสถานะ isLiked ของสินค้านั้นๆ
                        const heartFillColor = product.isLiked ? "#FF4081" : "none";
                        const heartStrokeColor = product.isLiked ? "#FF4081" : "#848484";
                        const imageSource = product.id <= 3 ? view1 : view2; //condition change image by id

                        return (
                            <div className="search-card" key={product.id}> 
                                <img 
                                    className='search-card-img' 
                                    src={imageSource} 
                                    alt={product.title} 
                                />
                                <div className="search-edcard-des">
                                    <p>title : {product.title}</p>
                                    <p>bid price : {product.price}</p>
                                    <p>time remanding : {product.time}</p>
                                </div>
                                <div className="search-card-button">
                                    <button 
                                        onClick={(e) => handleLikeToggle(e, product.id)} 
                                        style={{ background: 'none', border: 'none', padding: 0 }}
                                    >
                                        <HeartIcon 
                                            size="30" 
                                            fill={heartFillColor} 
                                            stroke={heartStrokeColor} 
                                            className="transition hover:scale-110" 
                                        />
                                    </button>
                                </div>
                            </div>
                        );
                    })}

                </div>
            </div>
        </>
    );
}

export default SearchPage;
