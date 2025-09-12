import React, { useState, useEffect } from "react";
import "../assets/css/ShoppingCasrt.css";
import { FaShoppingBasket, FaPlus, FaMinus } from "react-icons/fa";
import { BsFillTrash3Fill } from "react-icons/bs";
import { IoGiftOutline } from "react-icons/io5";

const ShoppingCart = ({ cartItems, setCartItems }) => {
    const [discountCode, setDiscountCode] = useState("");
    const [appliedDiscount, setAppliedDiscount] = useState(null);
    const [discountError, setDiscountError] = useState("");

    const discountCodes = {
        "WELCOME20": { percentage: 20, description: "کد خوش‌آمدگویی - ۲۰٪ تخفیف" },
        "SAVE15": { percentage: 15, description: "کد ذخیره - ۱۵٪ تخفیف" },
        "SPECIAL10": { percentage: 10, description: "کد ویژه - ۱۰٪ تخفیف" },
        "NEWUSER25": { percentage: 25, description: "کاربر جدید - ۲۵٪ تخفیف" },
        "HOLIDAY30": { percentage: 30, description: "کد تعطیلات - ۳۰٪ تخفیف" }
    };

    const updateLocalStorage = (items) => {
        localStorage.setItem("cartItems", JSON.stringify(items));
    };

    const handleRemoveProduct = (id) => {
        const updatedCart = cartItems.filter(item => item.id !== id);
        setCartItems(updatedCart);
        updateLocalStorage(updatedCart);
        if (updatedCart.length === 0) {
            setAppliedDiscount(null);
        }
    };

    const handleIncreaseQuantity = (id) => {
        const updatedCart = cartItems.map(item => {
            if (item.id === id) {
                return { ...item, quantity: item.quantity + 1 };
            }
            return item;
        });
        setCartItems(updatedCart);
        updateLocalStorage(updatedCart);
    };

    const handleDecreaseQuantity = (id) => {
        const updatedCart = cartItems.map(item => {
            if (item.id === id) {
                if (item.quantity > 1) {
                    return { ...item, quantity: item.quantity - 1 };
                } else {
                    return null;
                }
            }
            return item;
        }).filter(item => item !== null);

        setCartItems(updatedCart);
        updateLocalStorage(updatedCart);
        
        if (updatedCart.length === 0) {
            setAppliedDiscount(null);
        }
    };

    const handleClearCart = () => {
        setCartItems([]);
        updateLocalStorage([]);
        setAppliedDiscount(null);
    };

    const handleApplyDiscount = () => {
        const code = discountCode.toUpperCase().trim();
        
        if (!code) {
            setDiscountError("لطفاً کد تخفیف را وارد کنید");
            return;
        }

        if (discountCodes[code]) {
            setAppliedDiscount(discountCodes[code]);
            setDiscountError("");
            setDiscountCode("");
        } else {
            setDiscountError("کد تخفیف نامعتبر است");
            setAppliedDiscount(null);
        }
    };

    const handleRemoveDiscount = () => {
        setAppliedDiscount(null);
        setDiscountError("");
    };

    const calculateSubtotal = () => {
        return cartItems.reduce((acc, item) => acc + (Number(item.price) * item.quantity), 0);
    };

    const calculateDiscount = () => {
        if (!appliedDiscount) return 0;
        return (calculateSubtotal() * appliedDiscount.percentage) / 100;
    };

    const calculateTotal = () => {
        return calculateSubtotal() - calculateDiscount();
    };

    return (
        <div className="basket">
            <div className="cart-items">
                <div className="cart-items-header">
                    <h3>سبد خرید</h3>
                    <button onClick={handleClearCart}><BsFillTrash3Fill /></button>
                </div>
                {cartItems.length === 0 ? (
                    <div className="col-12">
                        <div className="myBasket">
                            <div className="col-9">
                                <div className="prods">
                                    <p className="basketIcon"><FaShoppingBasket /></p>
                                    <p>سبد خرید شما خالی است.</p>
                                </div>
                            </div>
                        </div>
                    </div>
                ) : (
                    <div className="all-items">
                        <div className="col-9">
                            {cartItems.map((item) => (
                                <div key={item.id} className="cart-items-list" id={item.id}>
                                    <div className="image">
                                        <img className="cart-items-image" src={item.img} alt={item.name} />
                                    </div>
                                    <div className="about">
                                        <div className="price-name">
                                            <h4 className='product-title'>{item.name}</h4>
                                            <h6 className='product-price'>
                                                قیمت: {Number(item.price * item.quantity).toLocaleString()} تومان
                                            </h6>
                                        </div>
                                        <div className="details">
                                            <div className="numbers">
                                                <button onClick={() => handleDecreaseQuantity(item.id)}><FaMinus /></button>
                                                <span>{item.quantity}</span>
                                                <button onClick={() => handleIncreaseQuantity(item.id)}><FaPlus /></button>
                                            </div>
                                            <button onClick={() => handleRemoveProduct(item.id)}>Delete</button>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                        <div className="col-3">
                            <div className="manage-price">
                                <div className="m-p-header">
                                    <h6>جمع کل کالاها:</h6>
                                    <h6>{calculateSubtotal().toLocaleString()} تومان</h6>
                                </div>
                                
                                <div className="discount-section">
                                    <h6><IoGiftOutline /> کد تخفیف</h6>
                                    <div className="discount-input">
                                        <input
                                            type="text"
                                            placeholder="کد تخفیف را وارد کنید"
                                            value={discountCode}
                                            onChange={(e) => setDiscountCode(e.target.value)}
                                            disabled={!!appliedDiscount}
                                        />
                                        {!appliedDiscount ? (
                                            <button onClick={handleApplyDiscount}>اعمال</button>
                                        ) : (
                                            <button onClick={handleRemoveDiscount} className="remove-discount">حذف</button>
                                        )}
                                    </div>
                                    
                                    {discountError && <p className="discount-error">{discountError}</p>}
                                    
                                    {appliedDiscount && (
                                        <div className="applied-discount">
                                            <p>✅ {appliedDiscount.description}</p>
                                            <p className="discount-amount">-{calculateDiscount().toLocaleString()} تومان</p>
                                        </div>
                                    )}
                                </div>

                                <div className="total-section">
                                    {appliedDiscount && (
                                        <div className="discount-info">
                                            <span>تخفیف ({appliedDiscount.percentage}٪):</span>
                                            <span>-{calculateDiscount().toLocaleString()} تومان</span>
                                        </div>
                                    )}
                                    <div className="final-total">
                                        <h5>مبلغ قابل پرداخت:</h5>
                                        <h5>{calculateTotal().toLocaleString()} تومان</h5>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default ShoppingCart;
