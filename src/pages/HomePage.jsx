import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import axios from "axios";
import LikeButton from "./LikeButton";
import "./HomePage.css";
import myImage1 from "../assets/Mountain.jpg";
import myImage2 from "../assets/Lake.jpg";
import myImage3 from "../assets/Beach.jpg";
import myImage4 from "../assets/Nature.jpg";
import view1 from "../assets/view1-ai-gen.png";
import view2 from "../assets/view2-ai-gen.png";
import { Icon } from "@iconify/react";
import img1 from "../assets/person1.jpg";
import img2 from "../assets/person2.jpg";
import img3 from "../assets/person3.jpg";
import img4 from "../assets/person4.jpg";
import img5 from "../assets/davin-fake.jpg";
import Slider from "react-slick";

function HomePage() {
  const [products, setProducts] = useState([]); // State สำหรับจัดการสินค้า // State สำหรับจัดการสินค้า
  const [error, setError] = useState(null); // State สำหรับจัดการข้อผิดพลาด
  const [loading, setLoading] = useState(true); // State สำหรับจัดการสถานะการโหลด

  const [users, setUsers] = useState([]); // user account state
  // ----------------------------------------------------------------
  // 1. Data Fetching and State Initialization
  // ----------------------------------------------------------------

  useEffect(() => {
    const fecth_products = async () => {
      setError(null);
      setLoading(true);
      try {
        const [productResult, userResult] = await Promise.allSettled([
          axios.get(`http://localhost:5000/api/auction/products`),
          axios.get(`http://localhost:5000/api/auction/users`),
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
      } catch (err) {
        const errorMsg =
          err.response?.data?.message || "Failed to connect to server.";

        setError(errorMsg);
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
  const userHasLiked = products.likes?.includes(currentUserId);

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

  // UX/UI: แสดงสถานะ Error
  if (error) {
    return <div className="error-state">Error: {error}</div>; // Error UI ของคุณที่นี่
  }

  // 💡 UX/UI: แสดง No Data Found
  if (filteredProducts.length === 0) {
    return <div className="no-data">ไม่มีสินค้าประมูล "Upcoming" ในขณะนี้</div>;
  }
  const settings = {
    dots: true,
    infinite: true,
    speed: 500,
    slidesToShow: 3,
    slidesToScroll: 3,
  };
  {
  }
  const usersToFilter = Array.isArray(users) ? users : [];
  console.log(usersToFilter);

  return (
    <>
      <div className="div-text">
        <h1>Picture Auction</h1>
        <p>The Real-time Digital Art Bidding Platform</p>
        <Link to="/upcoming" className="button-view">
          View Live Auctions
        </Link>
      </div>

      <div className="homepage-container w-3">
        <div className="homepage-container-card">
          {filteredProducts.map((product) => {
            const imageSource = `http://localhost:5000/images/products/${product.pro_imgurl}`;
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
      <section className="Page-layout">
        <div className="cover-content">
          <h1>Select your vibe</h1>
          <div className="articel-content">
            <img src={myImage1} alt="" />

            <div className="conten-one">
              <span className="content">The Great Path</span>
              <h2>Mountain</h2>
              <a href="" className="link-to-view">
                Read more
              </a>
            </div>
          </div>
          <div className="articel-content">
            <img src={myImage2} alt="" />

            <div className="conten-one">
              <span className="content">The Great Path</span>
              <h2>
                <b>Nature</b>
              </h2>
              <a href="" className="link-to-view">
                Read more
              </a>
            </div>
          </div>
          <div className="articel-content">
            <img src={myImage3} alt="" />

            <div className="conten-one">
              <span className="content">The Great Path</span>
              <h2>Beach</h2>
              <a href="" className="link-to-view">
                Read more
              </a>
            </div>
          </div>
          <div className="articel-content">
            <img src={myImage4} alt="" />

            <div className="conten-one">
              <span className="content">The Great Path</span>
              <h2>Lake</h2>
              <a href="" className="link-to-view">
                Read more
              </a>
            </div>
          </div>
        </div>
      </section>
      <div className="section-2">
        <div className="text-box">
          <h2>Oil Picture Auction</h2>
          <p>
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
          <img src={view2} alt="" />
        </div>
      </div>
      <div className="Artis-card">
        <div className="cover-box">
          {usersToFilter.map((user) => {
            return (
              <div className="cover-card">
                {/* Bakcground */}
                <div className="bg-content">
                  <span className="icon-follow">
                    <Icon icon="Element Plus"></Icon>
                  </span>
                </div>
                {/* Profile */}
                <div className="profile-content">
                  <img src={img3} alt="" />
                </div>
                {/* detail content */}
                <div className="detail-content">
                  <h2 id="artis-name">{user.acc_username}</h2>
                  <p>
                    Lorem ipsum dolor sit amet consectetur adipisicing elit.
                    Excepturi, debitis!
                  </p>
                </div>

                {/* Post Like content */}
                <div className="post-like-content">
                  <div className="like-content">
                    <h4>10.9K</h4>
                    <p>Likes</p>
                  </div>
                  <div className="post-content">
                    <h4>100</h4>
                    <p>Posts</p>
                  </div>
                </div>
                {/* Social media content */}
                <div className="socialmedea-content">
                  <a href="#">
                    <Icon icon={"typcn:social-instagram"} />
                  </a>
                  <a href="#">
                    <Icon icon={"ion:social-github"} />
                  </a>
                  <a href="#">
                    <Icon icon={"ion:social-linkedin"} />
                  </a>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </>
  );
}

export default HomePage;
