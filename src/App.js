import React, { useState, useEffect } from "react";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import Header from "./components/Header.js";
import Body from "./components/Body.js";
import Footer from "./components/Footer.js";
import Page2 from "./components/Pagination.js";
import ShoppingCart from "./components/ShoppingCart.js";
import Login from  "./components/Signup.js";
import "./App.css";
import Verify from "./components/Verify.js";
import Panel from "./components/Panel.js";
import { Toaster } from 'react-hot-toast';
import logo from "./assets/Images/logo.8ea9ff34.png";

const App = () => {
    const [cartItems, setCartItems] = useState(() => {
        const savedCartItems = localStorage.getItem("cartItems");
        return savedCartItems ? JSON.parse(savedCartItems) : [];
    });

    const [favorites, setFavorites] = useState(() => {
        const savedFavorites = localStorage.getItem("favorites");
        return savedFavorites ? JSON.parse(savedFavorites) : [];
    });

    const [name, setName] = useState(() => localStorage.getItem("name") || '');
    const [lastname, setLastName] = useState(() => localStorage.getItem("lastName") || '');
    const [searchQuery, setSearchQuery] = useState("");
    const [isLogin, setIsLogin] = useState(false);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const timer = setTimeout(() => {
            setIsLoading(false);
        }, 2000);

        return () => clearTimeout(timer);
    }, []);




    useEffect(() => {
        localStorage.setItem("cartItems", JSON.stringify(cartItems));
    }, [cartItems]);

    useEffect(() => {
        localStorage.setItem("favorites", JSON.stringify(favorites));
    }, [favorites]);

    const handleAddProduct = (product) => {
        const normalized = {
            id: product.product_id || product.id,
            name: product.name,
            img: (product.images && product.images[0] && (product.images[0].image_link || product.images[0].url)) || product.img || '',
            price: Number((product.features && product.features[0] && (product.features[0].final_price || product.features[0].price)) || product.price || 0),
        };
        const productExist = cartItems.find((item) => item.id === normalized.id);
        if (productExist) {
            setCartItems(cartItems.map((item) => item.id === normalized.id ? { ...item, quantity: item.quantity + 1 } : item));
        } else {
            setCartItems([...cartItems, { ...normalized, quantity: 1 }]);
        }
    };

    const handleAddFavorite = (product, productIdToRemove) => {
        if (productIdToRemove) {
            setFavorites(prevFavorites => prevFavorites.filter(item => item.id !== productIdToRemove));
        } else {
            const normalized = {
                id: product.product_id || product.id,
                name: product.name,
                img: (product.images && product.images[0] && (product.images[0].image_link || product.images[0].url)) || product.img || '',
                price: Number((product.features && product.features[0] && (product.features[0].final_price || product.features[0].price)) || product.price || 0),
                subtitle: product.subtitle || ''
            };
            setFavorites(prevFavorites => {
                const exists = prevFavorites.find(item => item.id === normalized.id);
                if (!exists) {
                    return [...prevFavorites, normalized];
                }
                return prevFavorites;
            });
        }
    };

    const [isFirstTime, setIsFirstTime] = useState(false);

    if (isLoading) {
        return (
            <div className="initial-loader">
                <div className="loader-content">
                    <div className="logo-container">
                        <img src={logo} alt="Logo" className="loader-logo" />
                    </div>
                    <div className="loader-text">
                        <h2>خوش آمدید به فروشگاه </h2>
                        <p>در حال بارگذاری...</p>
                    </div>
                    <div className="loader-spinner">
                        <div className="spinner-ring"></div>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <BrowserRouter>
            <Toaster />
            <div className="all">
                <Routes>
                    <Route
                        path="/"
                        element={
                            <>
                                <Header
                                    cartItems={cartItems}
                                    name={name}
                                    lastname={lastname}
                                    setSearchQuery={setSearchQuery}
                                    searchQuery={searchQuery}
                                />
                                <Body
                                    handleAddProduct={handleAddProduct}
                                    handleAddFavorite={handleAddFavorite}
                                    favorites={favorites}
                                    searchQuery={searchQuery}
                                    setSearchQuery={setSearchQuery}
                                    isLogin={isLogin}
                                    name={name}
                                    lastname={lastname}
                                />
                                <Footer />
                            </>
                        }
                    />
                    <Route
                        path="/page2"
                        element={
                            <>
                                <Header cartItems={cartItems} name={name} lastname={lastname}  />
                                <Page2
                                    favorites={favorites}
                                    handleAddFavorite={handleAddFavorite}
                                    handleAddProduct={handleAddProduct}
                                />
                                <Footer />
                            </>
                        }
                    />
                    <Route
                        path="/ShoppingCart"
                        element={
                            <>
                                <Header cartItems={cartItems} name={name} lastname={lastname}  />
                                <ShoppingCart cartItems={cartItems} setCartItems={setCartItems} />
                                <Footer />
                            </>
                        }
                    />
                    <Route
                        path="/panel"
                        element={
                            <Panel
                                name={name}
                                setName={setName}
                                lastname={lastname}
                                setLastName={setLastName}
                                favorites={favorites}
                                handleAddFavorite={handleAddFavorite}
                                cartItems={cartItems}
                                setCartItems={setCartItems}
                            />
                        }
                    />
                    <Route path="/Login" element={<Login />} />
                    <Route
                        path="/Verify"
                        element={
                            <Verify
                                setIsFirstTime={setIsFirstTime}
                                isFirstTime={isFirstTime}
                                setName={setName}
                                setLastName={setLastName}
                                setIsLogin={setIsLogin} 
                            />
                        }
                    />
                </Routes>
            </div>
        </BrowserRouter>
    );
}

export default App;
