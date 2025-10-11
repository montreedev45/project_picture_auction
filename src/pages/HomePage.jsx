// src/pages/HomePage.jsx
import React from 'react';
import './HomePage.css'
import { Link } from 'react-router-dom';

function HomePage() {
    return (
        <div className='div-text'>
            <h1>Picture Auction</h1>
            <p>The Real-time Digital Art Bidding Platform</p>

            <Link className='button-view'>View Live Auctions</Link>
        </div>


    );
}

export default HomePage;