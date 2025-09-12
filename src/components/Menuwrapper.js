import React, { useState } from "react";
import '../assets/css/Header.css';
import { BsHouseDoor } from "react-icons/bs";
import { HiOutlineShoppingBag } from "react-icons/hi2";
import { MdOutlineSmartToy } from "react-icons/md";
import { LuPhoneCall } from "react-icons/lu";
import { GoLaw } from "react-icons/go";
import { FaUsers } from "react-icons/fa";
import { Link } from "react-router-dom";
import { MdOutlineToys } from "react-icons/md";

const MenuWrapper = () => {
    const [hoveredMenu, setHoveredMenu] = useState(null);

    const handleMouseEnter = (menuType) => {
        setHoveredMenu(menuType);
    };

    const handleMouseLeave = () => {
        setHoveredMenu(null);
    };

    return (
        <div className="col-12">
            <div className="Wrap-out">
                <div className="wrapper">
                    <div className="col-2">
                        <div className="box-item">
                            <Link to="/">
                                <BsHouseDoor />
                                <h6>صفحه اصلی</h6>
                            </Link>
                        </div>
                    </div>
                    <div className="col-2">
                        <div className="box-item">
                            <a href="#">
                                <HiOutlineShoppingBag />
                                <h6>فروشگاه</h6>
                            </a>
                        </div>
                    </div>
                    <div className="col-2">
                        <div 
                            className="box-item has-submenu"
                            onMouseEnter={() => handleMouseEnter('products')}
                            onMouseLeave={handleMouseLeave}
                        >
                            <a href="#">
                                <MdOutlineSmartToy />
                                <h6>محصولات</h6>
                            </a>
                            {hoveredMenu === 'products' && (
                                <div className="submenu products-submenu">
                                    <Link to="/page2?category=anime" className="submenu-item">
                                        <MdOutlineSmartToy />
                                        <span>فیگورهای انیمه</span>
                                    </Link>
                                    <Link to="/page2?category=non-anime" className="submenu-item">
                                        <MdOutlineToys />
                                        <span>فیگورهای غیر انیمه</span>
                                    </Link>
                                </div>
                            )}
                        </div>
                    </div>
                
                    <div className="col-2">
                        <div className="box-item">
                            <a href="#">
                                <FaUsers />
                                <h6>ارتباط با ما</h6>
                            </a>
                        </div>
                    </div>
                    <div className="col-2">
                        <div className="box-item">
                            <a href="#">
                                <LuPhoneCall />
                                <h6>تماس با ما</h6>
                            </a>
                        </div>
                    </div>
                    <div className="col-2">
                        <div className="box-item">
                            <a href="#">
                                <GoLaw />
                                <h6>قوانین و مقررات</h6>
                            </a>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default MenuWrapper;
