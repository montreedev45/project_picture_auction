import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import axios from "axios";
import LikeButton from "./LikeButton";
import "./HomePage.css";
import myImage1 from "../assets/Mountain.jpg";
import myImage4 from "../assets/Nature.jpg";
import view1 from "../assets/view1-ai-gen.png";
import view2 from "../assets/view2-ai-gen.png";
import { Icon } from "@iconify/react";
import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";

import "../index.css";
import { useError } from "../components/ErrorContext";
const API_URL = import.meta.env.VITE_BACKEND_URL


function HomePage() {
  const { setError } = useError();
  const [products, setProducts] = useState([]); // State สำหรับจัดการสินค้า // State สำหรับจัดการสินค้า
  const [loading, setLoading] = useState(true); // State สำหรับจัดการสถานะการโหลด

  const [users, setUsers] = useState([]); // user account state
  // ----------------------------------------------------------------
  // 1. Data Fetching and State Initialization
  // ----------------------------------------------------------------

  useEffect(() => {
    const fecth_products = async () => {
      setLoading(true);
      try {
        const [productResult, userResult] = await Promise.allSettled([
          axios.get(`${API_URL}/api/auction/products`),
          axios.get(`${API_URL}/api/auction/users`),
        ]);

        if (productResult.status === "fulfilled") {
          const fetchedProductsObject = productResult.value.data.products;

          if (
            typeof fetchedProductsObject === "object" &&
            fetchedProductsObject !== null
          ) {
            const productsArray = Object.values(fetchedProductsObject).map(
              (product) => {
                return {
                  ...product,
                };
              }
            );
            setProducts(productsArray);
          } else {
            setProducts([]);
          }
        }

        if (userResult.status === "fulfilled") {
          const fetchedUsersObject = userResult.value.data.users;

          if (
            typeof fetchedUsersObject === "object" &&
            fetchedUsersObject !== null
          ) {
            const usersArray = Object.values(fetchedUsersObject).map((user) => {
              return {
                ...user,
              };
            });
            setUsers(usersArray);
          } else {
            setUsers([]);
          }
        }
      } catch (error) {
        let errorMessage = "fetch products failed, Pless check server"
        if (
          error.response &&
          error.response.data &&
          error.response.data.message
        ) {
          errorMessage = error.response.data.message;
        }
        setError(errorMessage);
        setProducts([]); // setProducts ให้เป็น Array เปล่าเสมอ
      } finally {
        setLoading(false); // ต้องปิด Loading เสมอ ไม่ว่าจะสำเร็จหรือผิดพลาด
      }
    };

    fecth_products();
  }, []);

  // ----------------------------------------------------------------
  // 2. Business Logic: Handler สำหรับการกด Like/Unlike
  // ----------------------------------------------------------------
const currentUserId = localStorage.getItem("acc_id");

const userHasLiked = Array.isArray(products)
  ? products.some(p => p.likes?.includes(currentUserId))
  : false;

  // ----------------------------------------------------------------
  // 3. Filtering และ Conditional Rendering Logic
  // ----------------------------------------------------------------
  // const usersToFilter = Array.isArray(users) ? users : [];
  // const filteredUsers = usersToFilter.filter(
  //   (user) => user.acc_coin === 10000
  // );
  // console.log('user:',filteredUsers)

  const productsToFilter = Array.isArray(products) ? products : [];
  const filteredProducts = productsToFilter.filter(
    (product) =>
      product.pro_status === "processing" || product.pro_status === ""
  );

  // UX/UI: แสดงสถานะ Loading ก่อน
  if (loading) {
    return <div className="loading-state">Loading Auction Products...</div>; // ใส่ Loading Component ของคุณที่นี่
  }

  // 💡 UX/UI: แสดง No Data Found
  if (filteredProducts.length === 0) {
    return <div className="no-data">ไม่มีสินค้าประมูล "Upcoming" ในขณะนี้</div>;
  }

  const settings = {
    dots: false,
    infinite: true,
    speed: 500,
    slidesToShow: 4,
    slidesToScroll: 4,
    initialSlide: 2,
    responsive: [
      {
        breakpoint: 1280,
        settings: {
          slidesToShow: 3,
          slidesToScroll: 3,
          infinite: true,
          dots: true,
        },
      },
      {
        breakpoint: 1024,
        settings: {
          slidesToShow: 2,
          slidesToScroll: 2,
          initialSlide: 2,
        },
      },
      {
        breakpoint: 768,
        settings: {
          slidesToShow: 1,
          slidesToScroll: 1,
          initialSlide: 2,
        },
      },
      {
        breakpoint: 480,
        settings: {
          slidesToShow: 1,
          slidesToScroll: 1,
        },
      },
    ],
  };

  {
  }
  const usersToFilter = Array.isArray(users) ? users : [];

  const loopPic = [
    { image1: "../assets/Mountain.jpg" },
    { image2: "../assets/Lake.jpg" },
    { image3: "../assets/Beach.jpg" },
    { image4: "../assets/Nature.jpg" },
  ];
  return (
    <>
      <div className="bg-red rounded-xl shadow-2xl p-6 w-80 mx-auto mt-10">
        test tailwind
      </div>
      <div className="div-text">
        <h1>Picture Auction</h1>
        <p>The Real-time Digital Art Bidding Platform</p>
        <Link to="/upcoming" className="button-view">
          View More
        </Link>
      </div>
      <div className="homepage-container">
        <div className="homepage-container-card">
          {filteredProducts.map((product) => {
            const imageSource = `${API_URL}/images/products/${product.pro_imgurl}`;
            const isSaved = product.likes?.includes(currentUserId) ?? false;
            return (
              <div className="card" key={product.pro_id}>
                <div className="card-absolute">
                  <span className={`card-status-${product.pro_status}`}>
                    {product.pro_status}
                  </span>
                </div>
                <img
                  className="card-img"
                  src={imageSource}
                  alt={product.pro_name}
                />
                <div className="card-des">
                  <p>title : {product.pro_name}</p>
                  <p>bid price : {product.pro_price}</p>
                  <p>time remanding : {product.pro_time}</p>
                </div>
                <div className="card-button">
                  <Link
                    to={`/auction-detail/${product.pro_id}`}
                    className="button"
                  >
                    Bid Now
                  </Link>
                  <div>
                    <LikeButton
                      productId={product.pro_id}
                      initialLikeCount={product.likes.length} // นับจำนวน Like จาก Array
                      userHasLiked={isSaved}
                    />
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
      {/* Vibe container */}
      <section className="Page-layout">
        <div className="cover-card-3">
          <h2 className="main-topic">Your Vibe</h2>
          <div className="card-box">
            <div className="box">
              <div className="menu-pic">
                <img className="first-pic" src={myImage4} alt="" />
              </div>
              <div className="content-box">
                <div className="detail-pic-3">
                  <h4>Your Vibe</h4>
                  <p>
                    Lorem, ipsum dolor sit amet consectetur adipisicing elit.
                    Maxime, voluptates.
                  </p>
                  <a href="#">Nature</a>
                </div>
              </div>
            </div>
            <div className="box">
              <div className="content-box">
                <div className="detail-pic-3">
                  <h4>Your Vibe</h4>
                  <p>
                    Lorem, ipsum dolor sit amet consectetur adipisicing elit.
                    Maxime, voluptates.
                  </p>
                  <a href="#">Mountain</a>
                </div>
              </div>
              <div className="menu-pic">
                <img className="second-pic" src={myImage1} alt="" />
              </div>
            </div>
            <div className="box">
              <div className="menu-pic">
                <img className="third-pic" src={view1} alt="" />
              </div>
              <div className="content-box">
                <div className="detail-pic-3">
                  <h4>Your Vibe</h4>
                  <p>
                    Lorem, ipsum dolor sit amet consectetur adipisicing elit.
                    Maxime, voluptates.
                  </p>
                  <a href="#">Lake</a>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
      <div className="section-2">
        <div className="text-box">
          <h2 className="animate-text">Oil Picture Auction</h2>
          <p className="animate-text">
            Our oil paintings capture timeless beauty with rich textures and
            vibrant colors, making each piece a unique treasure for collectors."
            "Every brushstroke tells a story—these oil artworks are crafted to
            inspire emotion and elevate any space." "Bid on exclusive oil
            paintings created by talented artists, blending tradition with
            modern creativity." "From serene landscapes to bold abstracts, our
            oil pictures showcase the depth and brilliance of this classic
            medium." "Own a masterpiece today—oil paintings that embody passion,
            detail, and enduring value."
          </p>
        </div>
        <div className="images-show">
          <img className="animate-image" src={view2} alt="" />
        </div>
      </div>
      <div className="cover-card-artis">
        <Slider {...settings}>
          {usersToFilter.map((user) => {
            const profilePicUrl = user.acc_profile_pic
              ? `${API_URL}/images/profiles/${user.acc_profile_pic}`
              : null;
            return (
              <div className="card-artis">
                <div className="backgroun-artis">
                  <a href="#">
                    <Icon icon="line-md:plus" className="bg-icon"></Icon>Follow
                  </a>
                  <div className="cover-profile-art">
                    <img src={profilePicUrl} alt="" className="profile-art" />
                  </div>
                </div>

                <div className="detail">
                  <div className="username-detail">
                    <h3 className="username-art">{user.acc_username}</h3>
                    <p>
                      Lorem ipsum dolor, sit amet consectetur adipisicing elit.
                      Optio, illum.
                    </p>
                  </div>
                  <div className="all-followerPost">
                    <div className="detail-LikePost">
                      <div className="amout-FP">
                        <h3>200K</h3>
                      </div>
                      <h4>Likes</h4>
                    </div>
                    <div className="detail-LikePost">
                      <div className="amout-FP">
                        <h3>100</h3>
                      </div>
                      <h4>Post</h4>
                    </div>
                  </div>
                </div>
                <div className="footer-artis">
                  <a href="">
                    <Icon
                      icon="ion:social-github"
                      className="icon-social"
                    ></Icon>
                  </a>
                  <a href="">
                    <Icon
                      icon="foundation:social-linkedin"
                      className="icon-social"
                    ></Icon>
                  </a>
                  <a href="">
                    <Icon
                      icon="mingcute:social-x-fill"
                      className="icon-social"
                    ></Icon>
                  </a>
                </div>
              </div>
            );
          })}
        </Slider>
        ;
      </div>
    </>
  );
}

export default HomePage;
