import React, { useState, useEffect, useCallback } from "react";
import { Link, useLocation } from "react-router-dom";
import "./SearchPage.css";
import { Icon } from "@iconify/react";
import { useError } from "../components/ErrorContext";
import LikeButton from "./LikeButton";
import axios from "axios";
import Loading from "../components/Loading";
const API_URL = import.meta.env.VITE_BACKEND_URL;

function SearchPage() {
  const location = useLocation();
  const urlParams = new URLSearchParams(location.search);
  const initialSearch = urlParams.get("pro_name_input");

  const { setError } = useError();
  const [products, setProducts] = useState([]);
  const [filterCriteria, setfilterCriteria] = useState({
    pro_name_input: initialSearch || "",
    statuses: [], // Array สำหรับ Checkbox/Multi-select (Status)
  });
  const [loading, setLoading] = useState(true);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  const currentUserId = localStorage.getItem("acc_id");
  const ALL_CATEGORIES = ["upcoming", "ended", "processing"];
  let queryCriteria = {};

  const fecth_products = useCallback(async () => {
    console.log("fecth_products start...");
    setLoading(true);

    if (filterCriteria.statuses && filterCriteria.statuses.length > 0) {
      queryCriteria.status = filterCriteria.statuses;
    }

    if (
      filterCriteria.pro_name_input &&
      filterCriteria.pro_name_input.length > 0
    ) {
      queryCriteria.pro_name_input = filterCriteria.pro_name_input;
    }

    try {
      console.log("queryCriteria : ", queryCriteria);
      const URL = `${API_URL}/api/auction/products`;
      const res = await axios.get(URL, { params: queryCriteria });

      const apiProducts = res.data.products || [];

      // Tech Stack: คัดลอก Array และ Object เพื่อ Immutability
      const initialData = apiProducts.map((product) => ({
        ...product,
      }));

      setProducts(initialData);
    } catch (error) {
      let errorMessage = "fetch products failed, Pless check server";
      if (
        error.response &&
        error.response.data &&
        error.response.data.message
      ) {
        errorMessage = error.response.data.message;
      }
      setError(errorMessage);
      setProducts([]);
    } finally {
      setLoading(false);
    }
  }, [filterCriteria]);

  if (loading) return <Loading text="Loading..." />;

  useEffect(() => {
    fecth_products();
  }, [location.search]);

  const handleAccountClick = () => {
    console.log("criteria start...");
    setIsDropdownOpen((prev) => !prev);
  };

  const handleCheckboxChange = (event) => {
    // ดึงข้อมูลที่จำเป็นจาก Event
    const targetKey = event.target.name; // 'statuses'
    const itemToToggle = event.target.value; // 'upcoming', 'active' ฯลฯ
    const isChecked = event.target.checked;

    setfilterCriteria((prevCriteria) => {
      // ดึง Array ปัจจุบันของ Field นั้นออกมา
      const currentArray = prevCriteria[targetKey] || [];

      let newArray;
      if (isChecked) {
        // เพิ่มเข้าไป
        newArray = [...currentArray, itemToToggle];
      } else {
        // กรองออก
        newArray = currentArray.filter((item) => item !== itemToToggle);
      }

      // คืนค่า Object State ใหม่ (ใช้ Dynamic Key)
      return {
        ...prevCriteria,
        // ใช้ targetKey ('statuses') เป็น Dynamic Key ใน Object
        [targetKey]: newArray,
      };
    });
  };

  const handleCheckInput = (e) => {
    const input_value = e.target.value;
    const input_name = e.target.name;

    setfilterCriteria((prev) => {
      return {
        ...prev,
        [input_name]: input_value,
      };
    });
  };

  console.log(filterCriteria);

  const handleRefreshClick = async () => {
    console.log("Refreshing data...");
    // 🚨 การเรียก fetchProducts() ตรงๆ
    await fecth_products();

    // หรือถ้าอยากให้ useEffect Trigger อีกครั้ง:
    // setShouldRefetch(prev => !prev);
  };

  const productsArray = Array.isArray(products) ? products : [];
  return (
    <>
      <div className="search-input-wrapper-page">
        <input
          type="text"
          name="pro_name_input"
          className="navbar-search-page"
          value={filterCriteria.pro_name_input}
          onChange={handleCheckInput}
          onKeyDown={(e) => {
            if (e.key === "Enter") {
              handleRefreshClick();
            }
          }}
        />
        <Icon
          icon="mdi:magnify"
          className="search-icon-overlay-page"
          onClick={handleRefreshClick}
        />
        <Icon
          icon="mi:filter"
          className="search-icon-filter-page"
          onClick={handleAccountClick}
        />
      </div>
      {isDropdownOpen && (
        <div className="criteria-container">
          <b className="cate-status">status</b>
          {ALL_CATEGORIES.map((status) => (
            <div className="search-dropdown" key={status}>
              <input
                type="checkbox"
                id={status}
                name="statuses"
                value={status}
                checked={filterCriteria.statuses.includes(status)}
                onChange={handleCheckboxChange}
              />
              <label htmlFor={status}>{status}</label>
            </div>
          ))}
        </div>
      )}

      <div className="search-container">
        <div className="search-container-card">
          {productsArray.map((product) => {
            const imageSource = `${API_URL}/images/products/${product.pro_imgurl}`;
            const isSaved = product.likes?.includes(currentUserId) ?? false;

            return (
              <div className="search-card" key={product.pro_id}>
                <div className="search-card-absolute">
                  <span className={`search-card-status-${product.pro_status}`}>
                    {product.pro_status}
                  </span>
                </div>
                <img
                  className="search-card-img"
                  src={imageSource}
                  alt={product.pro_name}
                />
                <div className="search-card-des">
                  <p>title : {product.pro_name}</p>
                  <p>bid price : {product.pro_price}</p>
                  <p>time remanding : {product.pro_time}</p>
                </div>
                <div className="search-card-button">
                  <Link
                    to={`/auction-detail/${product.pro_id}`}
                    className="button"
                  >
                    Bid Now
                  </Link>
                  <div>
                    <LikeButton
                      productId={product.pro_id}
                      initialLikeCount={product.likes?.length ?? 0}
                      userHasLiked={isSaved}
                    />
                  </div>
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
