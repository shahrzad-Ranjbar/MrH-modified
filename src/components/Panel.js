import React, { useState, useEffect } from "react";
import { BsHouseDoor } from "react-icons/bs";
import "../assets/css/panel.css";
import { Link } from "react-router-dom";
import { FiUser, FiEdit3, FiHeart, FiTrendingUp, FiMenu } from "react-icons/fi";
import { GrFavorite } from "react-icons/gr";
import { FaTimes } from "react-icons/fa";
import Modal from "react-modal";
import { IoCloseOutline } from "react-icons/io5";
import myLogo from "../assets/Images/logo.8ea9ff34.png";
import ShoppingCart from "./ShoppingCart";
import UserInfoDisplay from "./userInfoDisplay";
import { FaTrash } from "react-icons/fa"; 

const Panel = ({
    name: initialName,
    lastname: initialLastname,
    favorites,
    handleAddFavorite,
    setName,
    setLastName,
    cartItems,
    setCartItems
}) => {
    const [modalIsOpen, setModalIsOpen] = useState(false);
    const [name, setNameLocal] = useState(initialName);
    const [lastname, setLastname] = useState(initialLastname);
    const [isHamburgerOpen, setIsHamburgerOpen] = useState(false);
    const [activeTab, setActiveTab] = useState('dashboard');
    const [userStats, setUserStats] = useState({
        totalPurchases: 0,
        totalSpent: 0,
        satisfactionRate: 85,
        favoriteCategories: ['فیگورهای انیمه', 'فیگورهای غیر انیمه']
    });

    useEffect(() => {
        const totalSpent = cartItems.reduce((acc, item) => acc + (item.price * item.quantity), 0);
        const totalPurchases = cartItems.length;

        setUserStats(prev => ({
            ...prev,
            totalPurchases,
            totalSpent
        }));
    }, [cartItems]);

    const openModal = () => {
        setModalIsOpen(true);
    };

    const closeModal = () => {
        setModalIsOpen(false);
    };

    const handleRemoveFavorite = (productId) => {
        handleAddFavorite(null, productId);
    };

    const handleApplyChanges = () => {
        localStorage.setItem("name", name);
        localStorage.setItem("lastName", lastname);
        setName(name);
        setLastName(lastname);
        closeModal();
    };

    const toggleHamburger = () => {
        setIsHamburgerOpen(!isHamburgerOpen);
    };

    const getGreeting = () => {
        const h = new Date().getHours();
        if (h < 12) return 'صبح بخیر';
        if (h < 18) return 'عصر بخیر';
        return 'شب بخیر';
    };

    const formatDateFa = () => {
        try {
            return new Date().toLocaleDateString('fa-IR', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' });
        } catch (e) {
            return new Date().toLocaleDateString();
        }
    };

    const renderDashboard = () => (
        <div className="dashboard-content">
            <div className="welcome-banner">
                <div className="welcome-text">
                    <h3>{getGreeting()} {name && lastname ? `${name} ${lastname}` : ''} 👋</h3>
                    <p>{formatDateFa()}</p>
                </div>
                <div className="welcome-logo">
                    <img src={myLogo} alt="Logo" />
                </div>
            </div>
            <div className="stats-grid">
                <div className="stat-card">
                    <div className="stat-icon">📊</div>
                    <h3>تعداد خریدها</h3>
                    <p>{userStats.totalPurchases}</p>
                </div>
                <div className="stat-card">
                    <div className="stat-icon">💰</div>
                    <h3>مجموع هزینه</h3>
                    <p>{userStats.totalSpent.toLocaleString()} تومان</p>
                </div>
                <div className="stat-card">
                    <div className="stat-icon">⭐</div>
                    <h3>رضایت</h3>
                    <p>{userStats.satisfactionRate}%</p>
                </div>
                <div className="stat-card">
                    <div className="stat-icon">❤️</div>
                    <h3>علاقه‌مندی‌ها</h3>
                    <p>{favorites.length}</p>
                </div>
            </div>

            <div className="charts-section">
                <div className="chart-container">
                    <h4>نمودار رضایت کاربر</h4>
                    <div className="satisfaction-chart">
                        <div className="chart-bar">
                            <div 
                                className="chart-fill" 
                                style={{ width: `${userStats.satisfactionRate}%` }}
                            ></div>
                        </div>
                        <span>{userStats.satisfactionRate}%</span>
                    </div>
                </div>

                <div className="chart-container">
                    <h4>دسته‌بندی‌های مورد علاقه</h4>
                    <div className="categories-chart">
                        {userStats.favoriteCategories.map((category, index) => (
                            <div key={index} className="category-item">
                                <span>{category}</span>
                                <div className="category-bar">
                                    <div 
                                        className="category-fill" 
                                        style={{ width: `${80 - (index * 20)}%` }}
                                    ></div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            <div className="edit-info-box" onClick={openModal} style={{ cursor: 'pointer' }}>
                <h4>ویرایش اطلاعات کاربری</h4>
                <FiEdit3 />
            </div>
        </div>
    );

    const renderFavorites = () => (
        <div className="favorites-content">
            <div className="empty">
                {favorites.length === 0 ? (
                    <>
                        <GrFavorite />
                        <h5>لیست علاقه مندی ها خالی است.</h5>
                    </>
                ) : (
                    <h5>محصولات علاقه‌مندی:</h5>
                )}
            </div>
            <div className="prods">
                {favorites.map(product => (
                    <div className="prodd" key={product.id}>
                        <img src={product.img} alt={product.name} />
                        <h6>{product.name}</h6>
                        <FaTrash onClick={() => handleRemoveFavorite(product.id)} style={{ cursor: 'pointer' }} />
                    </div>
                ))}
            </div>
        </div>
    );

    const renderRecommendations = () => {
        if (favorites.length < 3) {
            return (
                <div className="recommendations-content">
                    <h4>برای مشاهده پیشنهادات، حداقل ۳ محصول به علاقه‌مندی‌ها اضافه کنید.</h4>
                </div>
            );
        }
        const favoriteKeywords = favorites
            .map(f => (f.name || '').split(' '))
            .flat()
            .filter(w => w.length > 2);
        const unique = Array.from(new Set(favoriteKeywords)).slice(0, 6);
        const recommended = favorites
            .filter((p, idx) => favorites.findIndex(x => x.id === p.id) === idx)
            .slice(0, 6);
        return (
            <div className="recommendations-content">
                <h4>پیشنهادات بر اساس علاقه‌مندی‌های شما</h4>
                <div className="recommendations-grid">
                    {recommended.map((product, index) => (
                        <div key={index} className="recommendation-card">
                            <img src={product.img} alt={product.name} />
                            <h6>{product.name}</h6>
                            <p>برچسب‌ها: {unique.join(' • ')}</p>
                            <button className="add-to-cart-btn">افزودن به سبد</button>
                        </div>
                    ))}
                </div>
            </div>
        );
    };

    const renderContent = () => {
        switch (activeTab) {
            case 'dashboard':
                return renderDashboard();
            case 'favorites':
                return renderFavorites();
            case 'recommendations':
                return renderRecommendations();
            default:
                return renderDashboard();
        }
    };

    return (
        <>
            <div className="Panel">
                <div className="head">
                    <div className="head-in">
                        <div className="home">
                            <Link to="/" className="home">
                                <BsHouseDoor />
                            </Link>
                        </div>
                        <div className="information">
                            <div className="account" onClick={openModal} style={{ cursor: 'pointer' }}>
                                <FiUser />
                                <h5>{name && lastname ? `${name} ${lastname}` : " "}</h5>
                            </div>
                        </div>
                        <div className="hamburger-menu">
                            <button onClick={toggleHamburger} className="hamburger-btn">
                                {isHamburgerOpen ? <FaTimes /> : <FiMenu />}
                            </button>
                        </div>
                    </div>
                </div>

                <div className={`hamburger-panel ${isHamburgerOpen ? 'open' : ''}`}>
                    <div className="hamburger-header">
                        <h4>منوی کاربری</h4>
                        <button onClick={toggleHamburger} className="close-hamburger">
                            <FaTimes />
                        </button>
                    </div>
                    <div className="hamburger-content">
                        <button 
                            className={`hamburger-item ${activeTab === 'dashboard' ? 'active' : ''}`}
                            onClick={() => {
                                setActiveTab('dashboard');
                                setIsHamburgerOpen(false);
                            }}
                        >
                            <FiTrendingUp />
                            <span>داشبورد</span>
                        </button>
                        <button 
                            className={`hamburger-item ${activeTab === 'favorites' ? 'active' : ''}`}
                            onClick={() => {
                                setActiveTab('favorites');
                                setIsHamburgerOpen(false);
                            }}
                        >
                            <FiHeart />
                            <span>علاقه‌مندی‌ها</span>
                        </button>
                        <button 
                            className={`hamburger-item ${activeTab === 'recommendations' ? 'active' : ''}`}
                            onClick={() => {
                                setActiveTab('recommendations');
                                setIsHamburgerOpen(false);
                            }}
                        >
                            <FiTrendingUp />
                            <span>پیشنهادات</span>
                        </button>
                        <button 
                            className="hamburger-item edit-profile"
                            onClick={() => {
                                openModal();
                                setIsHamburgerOpen(false);
                            }}
                        >
                            <FiEdit3 />
                            <span>ویرایش اطلاعات</span>
                        </button>
                    </div>
                </div>

                <div className="panel-content">
                    <UserInfoDisplay name={name} lastname={lastname} />
                    {renderContent()}
                </div>

                <Modal
                    className="modal"
                    overlayClassName="custom-overlay"
                    isOpen={modalIsOpen}
                    onRequestClose={closeModal}
                    contentLabel="User Info"
                >
                    <div className="modalhead">
                        <button className="modalBtn" onClick={closeModal}>
                            <IoCloseOutline />
                        </button>
                        <h4>اطلاعات کاربر</h4>
                    </div>
                    <div className="myLogo">
                        <img src={myLogo} alt="Logo" />
                    </div>
                    <div className="desc">
                        <p>نام: <input type="text" value={name || " "} onChange={(e) => setNameLocal(e.target.value)} /></p>
                        <p>نام خانوادگی: <input type="text" value={lastname || " "} onChange={(e) => setLastname(e.target.value)} /></p>
                    </div>
                    <div className="submit">
                        <button onClick={handleApplyChanges}>
                            اعمال
                        </button>
                    </div>
                </Modal>
            </div>
            <ShoppingCart cartItems={cartItems} setCartItems={setCartItems} />
        </>
    );
}

export default Panel;
