import React, { useState, useEffect, useRef, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { FiSearch, FiX, FiHeart } from 'react-icons/fi';
import { FaHeart, FaRegHeart } from 'react-icons/fa';
import { BsHandbag } from 'react-icons/bs';
import './SearchModal.scss';
import placeholderimg from '../../assets/logo/logo.png';
import LoginModal from '../Login/LoginModel/LoginModal';

const SearchModal = ({ isOpen, onClose }) => {
    const navigate = useNavigate();
    const [searchTerm, setSearchTerm] = useState('');
    const [products, setProducts] = useState([]);
    const [filteredProducts, setFilteredProducts] = useState([]);
    const [loading, setLoading] = useState(false);
    const [wishlist, setWishlist] = useState({});
    const [showLoginModal, setShowLoginModal] = useState(false);
    const [updatingProductId, setUpdatingProductId] = useState(null);
    
    const debounceTimerRef = useRef(null);
    const modalRef = useRef(null);
    const inputRef = useRef(null);

    const token = localStorage.getItem('token');
    const userId = localStorage.getItem('userId');

    // Fetch all products on modal open
    useEffect(() => {
        if (isOpen) {
            fetchAllProducts();
            fetchUserWishlist();
            // Focus input when modal opens
            setTimeout(() => {
                inputRef.current?.focus();
            }, 100);
        }
    }, [isOpen]);

    // Close modal on ESC key
    useEffect(() => {
        const handleEsc = (e) => {
            if (e.key === 'Escape' && isOpen) {
                onClose();
            }
        };
        window.addEventListener('keydown', handleEsc);
        return () => window.removeEventListener('keydown', handleEsc);
    }, [isOpen]);

    // Debounced search
    useEffect(() => {
        if (debounceTimerRef.current) {
            clearTimeout(debounceTimerRef.current);
        }

        debounceTimerRef.current = setTimeout(() => {
            if (searchTerm.trim() === '') {
                setFilteredProducts([]);
            } else {
                performSearch();
            }
        }, 300);

        return () => {
            if (debounceTimerRef.current) {
                clearTimeout(debounceTimerRef.current);
            }
        };
    }, [searchTerm]);

    const fetchAllProducts = async () => {
        try {
            setLoading(true);
            const response = await axios.get(
                `${import.meta.env.VITE_API_URL}/productoffers/public-products-with-offers`
            );
            setProducts(response.data);
            setFilteredProducts([]);
        } catch (error) {
            console.error('Error fetching products:', error);
            toast.error('Failed to load products');
        } finally {
            setLoading(false);
        }
    };

    const fetchUserWishlist = async () => {
        const token = localStorage.getItem('token');
        const userId = localStorage.getItem('userId');
        if (!token || !userId) return;

        try {
            const response = await axios.get(
                `${import.meta.env.VITE_API_URL}/wishlist/my-wishlist`,
                {
                    params: { userId },
                    headers: { Authorization: `Bearer ${token}` }
                }
            );
            const wishlistStatus = {};
            if (response.data?.wishlist?.length > 0) {
                response.data.wishlist.forEach((item) => {
                    if (item.productId && item.isActive) {
                        wishlistStatus[item.productId] = true;
                    }
                });
            }
            setWishlist(wishlistStatus);
        } catch (error) {
            console.error('Error fetching wishlist:', error);
        }
    };

    const performSearch = () => {
        const term = searchTerm.toLowerCase().trim();
        const results = products.filter(product => 
            product.productName.toLowerCase().includes(term) ||
            product.productDescription?.toLowerCase().includes(term) ||
            product.categoryName?.toLowerCase().includes(term)
        );
        setFilteredProducts(results);
    };

    const calculatePrice = (color) => {
        if (!color) return { finalPrice: 0, originalPrice: 0, discount: 0, hasOffer: false, offerLabel: "" };

        const originalPrice = Number(color.originalPrice) || 0;
        let currentPrice = Number(color.currentPrice) || originalPrice;
        let discount = 0;
        let hasOffer = false;
        let offerLabel = "";

        if (color.hasOffer && color.offer?.isCurrentlyValid) {
            hasOffer = true;
            offerLabel = color.offer.offerLabel || "Special Offer";
            const offerPercentage = Number(color.offer.offerPercentage) || 0;
            const offerDiscount = (currentPrice * offerPercentage) / 100;
            currentPrice = currentPrice - offerDiscount;
        }

        if (originalPrice > 0 && currentPrice < originalPrice) {
            discount = Math.round(((originalPrice - currentPrice) / originalPrice) * 100);
        }

        return {
            finalPrice: parseFloat(currentPrice.toFixed(2)),
            originalPrice: originalPrice,
            discount: discount,
            hasOffer: hasOffer,
            offerLabel: offerLabel,
        };
    };

    const toggleWishlist = async (product, e) => {
        e.stopPropagation();
        const token = localStorage.getItem('token');
        const userId = localStorage.getItem('userId');

        if (!token || !userId) {
            setShowLoginModal(true);
            toast.info("Please login to add items to wishlist");
            return;
        }

        const isCurrentlyWishlisted = wishlist[product.productId];
        const productId = product.productId;
        const firstFragrance = product.colors?.[0]?.fragrances?.[0] || null;

        setUpdatingProductId(productId);

        try {
            setWishlist((prev) => ({ ...prev, [productId]: !isCurrentlyWishlisted }));

            if (isCurrentlyWishlisted) {
                await axios.delete(
                    `${import.meta.env.VITE_API_URL}/wishlist/remove/${productId}?userId=${userId}&fragrance=${firstFragrance}`,
                    {
                        headers: { Authorization: `Bearer ${token}` },
                    }
                );
                toast.success("Removed from wishlist");
            } else {
                const color = product.colors?.[0];
                const priceInfo = calculatePrice(color);
                const wishlistData = {
                    userId,
                    productId: productId,
                    productName: product.productName,
                    categoryId: product.categoryId,
                    categoryName: product.categoryName,
                    addedFrom: "search",
                    selectedFragrance: firstFragrance,
                    selectedModel: null,
                    selectedSize: null,
                    selectedColor: color ? {
                        colorId: color.colorId,
                        colorName: color.colorName,
                        currentPrice: priceInfo.finalPrice,
                        originalPrice: priceInfo.originalPrice,
                    } : null,
                };

                await axios.post(
                    `${import.meta.env.VITE_API_URL}/wishlist/add`,
                    wishlistData,
                    { headers: { Authorization: `Bearer ${token}` } }
                );
                toast.success("Added to wishlist!");
            }
            setUpdatingProductId(null);
            fetchUserWishlist();
            window.dispatchEvent(new Event('wishlistUpdated'));
        } catch (error) {
            console.error("Error toggling wishlist:", error);
            setWishlist((prev) => ({ ...prev, [productId]: isCurrentlyWishlisted }));
            setUpdatingProductId(null);
            toast.error("Error updating wishlist. Please try again.");
        }
    };

    const formatCurrency = (amount) => {
        return new Intl.NumberFormat("en-IN", {
            minimumFractionDigits: 0,
            maximumFractionDigits: 0,
        }).format(amount);
    };

    const handleProductClick = (product) => {
        const urlName = product.productName
            .toLowerCase()
            .replace(/[^\w\s]/g, '')
            .replace(/\s+/g, '-');
        navigate(`/product/${urlName}`, {
            state: { productId: product.productId }
        });
        onClose();
    };

    const handleCloseModal = (e) => {
        if (modalRef.current === e.target) {
            onClose();
        }
    };

    if (!isOpen) return null;

    const hasResults = filteredProducts.length > 0;
    const displayProducts = searchTerm.trim() === '' ? [] : filteredProducts;

    return (
        <>
            <ToastContainer position="top-center" autoClose={3000} theme="dark" />
            
            {showLoginModal && (
                <LoginModal
                    onClose={() => {
                        setShowLoginModal(false);
                        fetchUserWishlist();
                    }}
                    showRegisterLink={true}
                />
            )}

            <div className="search-modal-overlay" ref={modalRef} onClick={handleCloseModal}>
                <div className="search-modal-container">
                    <div className="search-modal-header">
                        <div className="search-input-wrapper">
                            <FiSearch className="search-icon" />
                            <input
                                ref={inputRef}
                                type="text"
                                className="search-input"
                                placeholder="Search for candles, fragrances, chapters..."
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                            />
                            {searchTerm && (
                                <button className="clear-search" onClick={() => setSearchTerm('')}>
                                    <FiX />
                                </button>
                            )}
                        </div>
                        <button className="close-modal" onClick={onClose}>
                            <FiX />
                        </button>
                    </div>

                    <div className="search-modal-body">
                        {loading ? (
                            <div className="search-loading">
                                <div className="spinner"></div>
                                <p>Loading products...</p>
                            </div>
                        ) : searchTerm.trim() === '' ? (
                            <div className="search-empty">
                                <FiSearch className="empty-icon" />
                                <h3>Start typing to search</h3>
                                <p>Search for your favorite candles, fragrances, or chapters</p>
                            </div>
                        ) : !hasResults ? (
                            <div className="search-empty">
                                <FiSearch className="empty-icon" />
                                <h3>No products found</h3>
                                <p>We couldn't find any products matching "{searchTerm}"</p>
                                <p className="search-suggestion">Try different keywords or browse our collection</p>
                            </div>
                        ) : (
                            <div className="search-results">
                                <div className="results-header">
                                    <h3>Found {displayProducts.length} result{displayProducts.length !== 1 ? 's' : ''}</h3>
                                </div>
                                <div className="products-grid">
                                    {displayProducts.map((product) => {
                                        const color = product.colors?.[0];
                                        const image = product.thumbnailImage || color?.images?.[0];
                                        const isWishlisted = wishlist[product.productId] || false;
                                        const isUpdating = updatingProductId === product.productId;
                                        const priceInfo = calculatePrice(color);

                                        return (
                                            <div 
                                                key={product.productId} 
                                                className="search-product-card"
                                                onClick={() => handleProductClick(product)}
                                            >
                                                <div className="search-product-image-wrapper">
                                                    <img
                                                        src={image || placeholderimg}
                                                        alt={product.productName}
                                                        className="search-product-image"
                                                        onError={(e) => {
                                                            e.target.onerror = null;
                                                            e.target.src = placeholderimg;
                                                        }}
                                                    />
                                                    {priceInfo.hasOffer && (
                                                        <span className="search-offer-badge">{priceInfo.offerLabel}</span>
                                                    )}
                                                    <button
                                                        className={`search-wishlist-btn ${isWishlisted ? 'active' : ''}`}
                                                        onClick={(e) => toggleWishlist(product, e)}
                                                        disabled={isUpdating}
                                                    >
                                                        {isUpdating ? (
                                                            <span className="search-wishlist-spinner"></span>
                                                        ) : isWishlisted ? (
                                                            <FaHeart />
                                                        ) : (
                                                            <FaRegHeart />
                                                        )}
                                                    </button>
                                                </div>
                                                <div className="search-product-info">
                                                    <h4 className="search-product-name">{product.productName}</h4>
                                                    <div className="search-product-prices">
                                                        <span className="search-current-price">₹{formatCurrency(priceInfo.finalPrice)}</span>
                                                        {priceInfo.originalPrice > priceInfo.finalPrice && (
                                                            <>
                                                                <span className="search-original-price">₹{formatCurrency(priceInfo.originalPrice)}</span>
                                                                {priceInfo.discount > 0 && (
                                                                    <span className="search-discount-badge">{priceInfo.discount}% OFF</span>
                                                                )}
                                                            </>
                                                        )}
                                                    </div>
                                                </div>
                                            </div>
                                        );
                                    })}
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </>
    );
};

export default SearchModal;