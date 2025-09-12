import React, { useEffect, useState } from "react";
import { FiUser } from "react-icons/fi";
import { HiShoppingCart } from "react-icons/hi";
import logo from '../assets/Images/logo.8ea9ff34.png';
import { IoSearch } from "react-icons/io5";
import '../assets/css/Header.css';
import MenuWrapper from "./Menuwrapper";
import { Link, useNavigate } from "react-router-dom";
import { FaPowerOff } from "react-icons/fa";
import axios from "axios";

const Header = ({ cartItems, setSearchQuery, searchQuery }) => {
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);
    const [isSearchFocused, setIsSearchFocused] = useState(false);
    const [searchSuggestions, setSearchSuggestions] = useState([]);
    const [allProducts, setAllProducts] = useState([]);
    const navigate = useNavigate();
    const [name, setName] = useState(localStorage.getItem("name") || "");
    const [lastname, setLastName] = useState(localStorage.getItem("lastName") || "");

    useEffect(() => {
        const fetchAllProducts = async () => {
            try {
                const animeResponse = await axios.get('https://api.mrh-store.com/api/filter/%D9%81%DB%8C%DA%AF%D9%88%D8%B1-%D9%87%D8%A7%DB%8C-%D8%A7%D9%86%DB%8C%D9%85%D9%87?page=1&sort=new');
                const nonAnimeResponse = await axios.get('https://api.mrh-store.com/api/filter/%D9%81%DB%8C%DA%AF%D9%88%D8%B1-%D9%87%D8%A7%DB%8C-%غیر-%D8%A7%D9%86%DB%8C%D9%85%D9%87?page=1&sort=new');
                
                const animeProducts = animeResponse.data.data.products.data || [];
                const nonAnimeProducts = nonAnimeResponse.data.data.products.data || [];
                
                setAllProducts([...animeProducts, ...nonAnimeProducts]);
            } catch (error) {
                console.error('Error fetching products for search:', error);
            }
        };
        
        fetchAllProducts();
    }, []);

    const handleSearchChange = (event) => {
        const query = event.target.value;
        setSearchQuery(query);
        
        if (query.length > 2) {
            const suggestions = allProducts.filter(product => 
                (product.name || '').toLowerCase().includes(query.toLowerCase()) ||
                (product.features && product.features[0] && 
                 (product.features[0].price || product.features[0].final_price) && 
                 String(product.features[0].price || product.features[0].final_price).includes(query))
            ).slice(0, 8);
            setSearchSuggestions(suggestions);
        } else {
            setSearchSuggestions([]);
        }
    };

    const handleSuggestionClick = (product) => {
        setSearchQuery(product.name);
        setSearchSuggestions([]);
        navigate('/page2', { state: { searchQuery: product.name } });
    };

    const handleLogout = () => {
        localStorage.removeItem("name");
        localStorage.removeItem("lastName");
        localStorage.removeItem("cartItems");
        localStorage.removeItem("token"); 
        navigate("/Login");
    };

    const totalAmount = cartItems.reduce((acc, item) => acc + (Number(item.price) * item.quantity), 0);

    const handleAccountClick = () => {
        const token = localStorage.getItem("token");
        if (!token) {
            navigate("/Login"); 
        } else {
            setIsSidebarOpen(!isSidebarOpen); 
        }
    };

    return (
        <div className="header">
            <div className="rightSide">
                <div className="account" onClick={handleAccountClick}>
                    <FiUser />
                    <h5 className={`user-name-exciting ${name && lastname ? 'show' : ''}`}>
                        {name && lastname ? `${name} ${lastname}` : "حساب کاربری"}
                    </h5>
                </div>
                <div className={`sidebar ${isSidebarOpen ? 'show' : ''}`}>
                    <Link to="/panel" className="sidebar-link"><FiUser />پنل</Link>
                    <hr />
                    <span onClick={handleLogout} className="sidebar-link" style={{ cursor: 'pointer' }}>
                        <FaPowerOff />خروج
                    </span>
                </div>
                <Link to="/ShoppingCart" className="shoppingCart">
                    <HiShoppingCart />
                    <span className="cart-count">
                        {cartItems.length}
                    </span>
                    <div className="Hdetails">
                        <h5>سبد خرید</h5>
                        <h6>
                            {totalAmount.toLocaleString()} تومان
                        </h6>
                    </div>
                </Link>
            </div>
            <div className="logo">
                <img src={logo} alt="Logo" />
            </div>
            <div className="leftSide">
                <div className="searchBox">
                    <div className="search-icon" onClick={() => setIsSearchFocused(true)}>
                        <IoSearch />
                    </div>
                    <input
                        className={`input ${isSearchFocused ? 'focused' : ''}`}
                        type="text"
                        placeholder="جستجو..."
                        value={searchQuery}
                        onChange={handleSearchChange}
                        onFocus={() => setIsSearchFocused(true)}
                        onBlur={() => setTimeout(() => setIsSearchFocused(false), 200)}
                    />
                    {searchSuggestions.length > 0 && (
                        <div className="search-suggestions">
                            {searchSuggestions.map((product, index) => (
                                <div 
                                    key={index} 
                                    className="suggestion-item"
                                    onClick={() => handleSuggestionClick(product)}
                                >
                                    <div className="suggestion-image">
                                        <img 
                                            src={product.images && product.images[0] ? (product.images[0].image_link || product.images[0].url) : '/placeholder.jpg'} 
                                            alt={product.name} 
                                        />
                                    </div>
                                    <div className="suggestion-details">
                                        <h6>{product.name}</h6>
                                        <p>{product.features && product.features[0] ? `${Number(product.features[0].final_price || product.features[0].price).toLocaleString()} تومان` : ''}</p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            </div>
            <MenuWrapper />
        </div>
    );
}

export default Header;
