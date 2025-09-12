import React, { useState } from "react";
import ImageSlider from "./ImageSlider";
import { useNavigate } from "react-router-dom";
import animeImg from "../assets/Images/anime.4d0a3171.png";
import nonAnimeImg from "../assets/Images/Nonaniamte.webp";
import "../assets/css/Body.css";

const Body = () => {
    const navigate = useNavigate();
    const [activeCategory, setActiveCategory] = useState('anime');

    const handleCategoryClick = (category) => {
        setActiveCategory(category);
        navigate(`/page2?category=${category}`);
    };

    return (
        <div className="body">
            <ImageSlider />
            <div className="category-tiles">
                <div className={`category-card ${activeCategory === 'anime' ? 'active' : ''}`} onClick={() => handleCategoryClick('anime')}>
                    <div className="category-image">
                        <img src={animeImg} alt="فیگورهای انیمه" />
                    </div>
                    <div className="category-info">
                        <h3>فیگورهای انیمه</h3>
                        <p>Explore Anime Figures</p>
                    </div>
                </div>
                <div className={`category-card ${activeCategory === 'non-anime' ? 'active' : ''}`} onClick={() => handleCategoryClick('non-anime')}>
                    <div className="category-image">
                        <img src={nonAnimeImg} alt="فیگورهای غیر انیمه" />
                    </div>
                    <div className="category-info">
                        <h3>فیگورهای غیر انیمه</h3>
                        <p>Explore Non-Anime Figures</p>
                    </div>
                </div>
            </div>
            <div className="category-description">
                <div className="desc-inner">
                    <h2>اکشن فیگورهای انیمه‌ای و غیرانیمه‌ای</h2>
                    <div className="desc-text">
                        <p>
                            اکشن فیگورها، مجسمه‌های کوچک و قابل جمع‌آوری هستند که براساس شخصیت‌های مختلف از انیمه‌ها، مانگاها، فیلم‌های اکشن و سریال‌های تلویزیونی ساخته می‌شوند.
                            این شخصیت‌های زیبا با جزئیات دقیق و کیفیت ساخت بالا، حس داستان و مبارزات قهرمانان محبوب شما را زنده می‌کنند.
                        </p>
                        <p>
                            در بخش دسته‌بندی‌ها می‌توانید بین فیگورهای انیمه و غیرانیمه انتخاب کنید و مجموعه مورد علاقه‌تان را بسازید.
                        </p>
                    </div>
                    <a className="see-more" href="https://mrh-store.com/" target="_blank" rel="noopener noreferrer">مشاهده بیشتر</a>
                </div>
            </div>
        </div>
    );
}

export default Body;
