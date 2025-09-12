import React, { useEffect, useState } from 'react';
import { useSearchParams, Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { MdOutlineShoppingCart, MdFavoriteBorder, MdOutlineFavorite, MdDone } from "react-icons/md";
import anime from "../assets/Images/anime.4d0a3171.png";
import { HiChevronDoubleLeft, HiChevronDoubleRight } from "react-icons/hi";
import toast from 'react-hot-toast';
import "../assets/css/Body.css";

const ProductList = ({ handleAddProduct, handleAddFavorite, favorites, setSearchQuery, searchQuery, isLogin, category = 'non-anime' }) => {
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [currentPage, setCurrentPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const [filteredProducts, setFilteredProducts] = useState([]);
    const [minPrice, setMinPrice] = useState('');
    const [maxPrice, setMaxPrice] = useState('');
    const navigate = useNavigate();
    const itemsPerPage = 20;

    useEffect(() => {
        const fetchProducts = async () => {
            try {
                setLoading(true);
                const url = category === 'anime'
                    ? `https://api.mrh-store.com/api/filter/%D9%81%DB%8C%DA%AF%D9%88%D8%B1-%D9%87%D8%A7%DB%8C-%D8%A7%D9%86%DB%8C%D9%85%D9%87?page=${currentPage}&sort=new`
                    : `https://api.mrh-store.com/api/filter/%D9%81%DB%8C%DA%AF%D9%88%D8%B1-%D9%87%D8%A7%DB%8C-%D8%BA%DB%8C%D8%B1-%D8%A7%D9%86%DB%8C%D9%85%D9%87?page=${currentPage}&sort=new`;
                const response = await axios.get(url);
                
                const fetchedProducts = response.data.data.products.data.map(product => ({
                    ...product,
                    addedToCart: false
                }));

                setProducts(fetchedProducts);
                setTotalPages(response.data.data.products.last_page || 1);
            } catch (err) {
                setError(err);
            } finally {
                setLoading(false);
            }
        };

        fetchProducts();
    }, [currentPage, category]);

    useEffect(() => {
        let next = products;
        if (searchQuery.trim() !== "") {
            next = next.filter(product => {
                const productName = (product.name || '').toLowerCase();
                const productPrice = product.features && product.features[0] ? 
                    String(product.features[0].final_price || product.features[0].price) : '';
                return productName.includes(searchQuery.toLowerCase()) || productPrice.includes(searchQuery);
            });
        }
        if (minPrice !== '' || maxPrice !== '') {
            next = next.filter(product => {
                const p = product.features && product.features[0] ? Number(product.features[0].final_price || product.features[0].price) : 0;
                if (minPrice !== '' && p < Number(minPrice)) return false;
                if (maxPrice !== '' && p > Number(maxPrice)) return false;
                return true;
            });
        }
        setFilteredProducts(next);
    }, [products, searchQuery, minPrice, maxPrice]);

    const handlePageChange = (pageNumber) => {
        if (pageNumber >= 1 && pageNumber <= totalPages) {
            setCurrentPage(pageNumber);
            window.scrollTo(0, 0);
        }
    };

    const renderPagination = () => {
        const pages = [];
        const maxVisiblePages = 5;
        
        let startPage = Math.max(1, currentPage - Math.floor(maxVisiblePages / 2));
        let endPage = Math.min(totalPages, startPage + maxVisiblePages - 1);
        
        if (endPage - startPage + 1 < maxVisiblePages) {
            startPage = Math.max(1, endPage - maxVisiblePages + 1);
        }

        if (currentPage > 1) {
            pages.push(
                <button
                    key="prev"
                    onClick={() => handlePageChange(currentPage - 1)}
                    className="pagination-btn prev-btn"
                >
                    <HiChevronDoubleRight />
                </button>
            );
        }

        for (let i = startPage; i <= endPage; i++) {
            pages.push(
                <button
                    key={i}
                    onClick={() => handlePageChange(i)}
                    className={`pagination-btn ${i === currentPage ? 'active' : ''}`}
                >
                    {i}
                </button>
            );
        }

        if (currentPage < totalPages) {
            pages.push(
                <button
                    key="next"
                    onClick={() => handlePageChange(currentPage + 1)}
                    className="pagination-btn next-btn"
                >
                    <HiChevronDoubleLeft />
                </button>
            );
        }

        return pages;
    };

    if (loading) {
        return (
            <div className="loading-container">
                <div className="loading-spinner">
                    <div className="spinner"></div>
                    <p>در حال بارگذاری محصولات...</p>
                </div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="error-container">
                <p>خطا در بارگذاری محصولات: {error.message}</p>
            </div>
        );
    }

    return (
        <div className="products-container">
            <div className="filters" style={{ display: 'flex', gap: 20, alignItems: 'center', marginBottom: 20 }}>
                <div className="price-filter" style={{ display: 'flex', gap: 10, alignItems: 'center' }}>
                    <span>فیلتر قیمت:</span>
                    <input type="number" placeholder="حداقل" value={minPrice} onChange={(e) => setMinPrice(e.target.value)} style={{ width: 120 }} />
                    <input type="number" placeholder="حداکثر" value={maxPrice} onChange={(e) => setMaxPrice(e.target.value)} style={{ width: 120 }} />
                    <button onClick={() => { setMinPrice(''); setMaxPrice(''); }}>حذف فیلتر</button>
                </div>
                <div className="search-section">
                    <input
                        type="text"
                        placeholder="جستجو در محصولات..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="search-input"
                    />
                </div>
            </div>

            <div className="products-grid">
                {filteredProducts.map((product) => {
                    const isFavorite = favorites.some(fav => fav.id === product.product_id);
                    const productPrice = product.features && product.features[0] ? 
                        Number(product.features[0].final_price || product.features[0].price) : 0;
                    const productImage = product.images && product.images[0] ? 
                        (product.images[0].image_link || product.images[0].url) : '/placeholder.jpg';

                    return (
                        <div key={product.product_id} className="product-card">
                            <div className="product-image">
                                <img src={productImage} alt={product.name} />
                                <div className="product-overlay">
                                    <button
                                        className="favorite-btn"
                                        onClick={() => handleAddFavorite(product)}
                                    >
                                        {isFavorite ? <MdOutlineFavorite /> : <MdFavoriteBorder />}
                                    </button>
                                    <button
                                        className="cart-btn"
                                        onClick={() => {
                                            if (productPrice > 0) {
                                                handleAddProduct(product);
                                                toast.success('محصول به سبد خرید اضافه شد!');
                                            } else {
                                                toast.error('ناموجود');
                                            }
                                        }}
                                    >
                                        <MdOutlineShoppingCart />
                                    </button>
                                </div>
                            </div>
                            <div className="product-info">
                                <h3 className="product-name">{product.name}</h3>
                                {productPrice > 0 ? (
                                    <p className="product-price">{productPrice.toLocaleString()} تومان</p>
                                ) : (
                                    <p className="product-price" style={{ color: '#ef4444' }}>ناموجود</p>
                                )}
                                {product.subtitle && (
                                    <p className="product-subtitle">{product.subtitle}</p>
                                )}
                            </div>
                        </div>
                    );
                })}
            </div>

            {totalPages > 1 && (
                <div className="pagination-container">
                    <div className="pagination-info">
                        صفحه {currentPage} از {totalPages}
                    </div>
                    <div className="pagination-buttons">
                        {renderPagination()}
                    </div>
                </div>
            )}

            {filteredProducts.length === 0 && searchQuery.trim() !== "" && (
                <div className="no-results">
                    <p>هیچ محصولی با "{searchQuery}" یافت نشد.</p>
                </div>
            )}
        </div>
    );
};

export default ProductList;
