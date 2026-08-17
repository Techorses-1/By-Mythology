import React, { useEffect, useState } from "react";
import "./CollectionProducts.scss";

import {
    IoArrowBackOutline,
    IoArrowForwardOutline,
} from "react-icons/io5";
import { FaRegHeart, FaHeart } from "react-icons/fa";
import { toast, ToastContainer } from "react-toastify";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import "react-toastify/dist/ReactToastify.css";
import placeholderimg from "../../../assets/logo/logo.png";
import LoginModal from "../../../Components/Login/LoginModel/LoginModal";

const CollectionProducts = () => {
    const navigate = useNavigate();
    const [products, setProducts] = useState([]);
    const [wishlist, setWishlist] = useState({});
    const [showLoginModal, setShowLoginModal] = useState(false);
    const [isLoading, setIsLoading] = useState(true);
    const [updatingProductId, setUpdatingProductId] = useState(null);
    const [currentPage, setCurrentPage] = useState(1);
    const productsPerPage = 6;

    // Fetch products from API
    const fetchProducts = async () => {
        try {
            setIsLoading(true);
            const res = await axios.get(
                `${import.meta.env.VITE_API_URL}/productoffers/public-products-with-offers`
            );
            setProducts(res.data.slice(0, 10));
        } catch (err) {
            console.error("Error fetching products:", err);
            toast.error("Failed to load products");
        } finally {
            setIsLoading(false);
        }
    };

    // Fetch user wishlist
    const fetchUserWishlist = async () => {
        const token = localStorage.getItem("token");
        const userId = localStorage.getItem("userId");
        if (!token || !userId) return;

        try {
            const response = await axios.get(
                `${import.meta.env.VITE_API_URL}/wishlist/my-wishlist`,
                {
                    params: { userId },
                    headers: { Authorization: `Bearer ${token}` },
                }
            );
            const wishlistStatus = {};
            if (response.data?.wishlist?.length > 0) {
                response.data.wishlist.forEach((item) => {
                    if (item.productId && item.isActive) {
                        const key = item.selectedFragrance
                            ? `${item.productId}_${item.selectedFragrance}`
                            : item.productId;
                        wishlistStatus[key] = true;
                    }
                });
            }
            setWishlist(wishlistStatus);
        } catch (error) {
            console.error("Error fetching wishlist:", error);
        }
    };

    useEffect(() => {
        fetchProducts();
        fetchUserWishlist();
    }, []);

    useEffect(() => {
        if (products.length > 0) {
            fetchUserWishlist();
        }
    }, [products]);

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
        const token = localStorage.getItem("token");
        const userId = localStorage.getItem("userId");

        if (!token || !userId) {
            setShowLoginModal(true);
            toast.info("Please login to add items to wishlist");
            return;
        }

        const productId = product.productId;
        const firstFragrance = product.colors?.[0]?.fragrances?.[0]?.name || null;
        const wishlistKey = firstFragrance
            ? `${productId}_${firstFragrance}`
            : productId;
        const isCurrentlyWishlisted = wishlist[wishlistKey] || false;

        setUpdatingProductId(productId);

        try {
            setWishlist((prev) => ({ ...prev, [wishlistKey]: !isCurrentlyWishlisted }));

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
                    productType: product.type || "simple",
                    addedFrom: "collection",
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
            window.dispatchEvent(new Event("wishlistUpdated"));
        } catch (error) {
            console.error("Error toggling wishlist:", error);
            setWishlist((prev) => ({ ...prev, [wishlistKey]: isCurrentlyWishlisted }));
            setUpdatingProductId(null);

            if (error.response?.status === 400 && error.response?.data?.message?.includes("already in your wishlist")) {
                setWishlist((prev) => ({ ...prev, [wishlistKey]: true }));
                toast.info("Item is already in your wishlist");
            } else {
                toast.error(error.response?.data?.message || "Error updating wishlist. Please try again.");
            }
        }
    };

    const formatCurrency = (amount) => {
        return new Intl.NumberFormat("en-IN", {
            minimumFractionDigits: 0,
            maximumFractionDigits: 0,
        }).format(amount);
    };

    const truncateDescription = (description, maxLength = 200) => {
        if (!description) return "";
        if (description.length <= maxLength) return description;
        return description.substring(0, maxLength) + "...";
    };

    // Get first fragrance name
    const getFirstFragranceName = (product) => {
        const fragrance = product.colors?.[0]?.fragrances?.[0];
        return fragrance?.name || null;
    };

    // Get ALL notes from notes array only
    const getAllFragranceNotes = (product) => {
        const fragrance = product.colors?.[0]?.fragrances?.[0];
        if (!fragrance) return [];
        if (fragrance.notes && fragrance.notes.length > 0) {
            return fragrance.notes;
        }
        return [];
    };

    // Get TOP notes
    const getTopNotes = (product) => {
        const fragrance = product.colors?.[0]?.fragrances?.[0];
        if (!fragrance) return [];
        if (fragrance.topNotes && fragrance.topNotes.length > 0) {
            return fragrance.topNotes;
        }
        return [];
    };

    // Get HEART notes
    const getHeartNotes = (product) => {
        const fragrance = product.colors?.[0]?.fragrances?.[0];
        if (!fragrance) return [];
        if (fragrance.heartNotes && fragrance.heartNotes.length > 0) {
            return fragrance.heartNotes;
        }
        return [];
    };

    // Get BASE notes
    const getBaseNotes = (product) => {
        const fragrance = product.colors?.[0]?.fragrances?.[0];
        if (!fragrance) return [];
        if (fragrance.baseNotes && fragrance.baseNotes.length > 0) {
            return fragrance.baseNotes;
        }
        return [];
    };

    // Pagination logic
    const indexOfLastProduct = currentPage * productsPerPage;
    const indexOfFirstProduct = indexOfLastProduct - productsPerPage;
    const currentProducts = products.slice(indexOfFirstProduct, indexOfLastProduct);
    const totalPages = Math.ceil(products.length / productsPerPage);

    const paginate = (pageNumber) => setCurrentPage(pageNumber);

    if (isLoading) {
        return (
            <section className="collection-products">
                <div className="collection-products__loading">
                    <div className="collection-products__spinner"></div>
                    <p>Loading products...</p>
                </div>
            </section>
        );
    }

    return (
        <section className="collection-products">
            <ToastContainer position="top-center" autoClose={3000} />

            {showLoginModal && (
                <LoginModal
                    onClose={() => {
                        setShowLoginModal(false);
                        fetchUserWishlist();
                    }}
                    showRegisterLink={true}
                />
            )}

            {/* TOP BAR */}
            <div className="collection-products__topbar">
                <div className="collection-products__filters">
                    <span className="collection-products__filter-label">
                        FILTER BY
                    </span>
                    <button>FRAGRANCE NOTES</button>
                    <button>MOOD</button>
                    <button>INGREDIENTS</button>
                    <button>AVAILABILITY</button>
                </div>

                <div className="collection-products__topbar-right">
                    <div className="collection-products__sort">
                        <span>SORT BY</span>
                        <button>FEATURED</button>
                    </div>
                </div>
            </div>

            {/* PRODUCTS LIST VIEW - 3 COLUMN GRID */}
            <div className="collection-products__list">
                {currentProducts.map((product) => {
                    const color = product.colors?.[0];
                    const image = product.thumbnailImage || color?.images?.[0];
                    const firstFragrance = getFirstFragranceName(product);
                    const allNotes = getAllFragranceNotes(product);
                    const topNotes = getTopNotes(product);
                    const heartNotes = getHeartNotes(product);
                    const baseNotes = getBaseNotes(product);
                    const wishlistKey = firstFragrance
                        ? `${product.productId}_${firstFragrance}`
                        : product.productId;
                    const isWishlisted = wishlist[wishlistKey] || false;
                    const isUpdating = updatingProductId === product.productId;
                    const priceInfo = calculatePrice(color);
                    const description = product.description || product.productDescription || "";

                    return (
                        <div
                            key={product.productId}
                            className="collection-products__item"
                            onClick={() => {
                                const urlName = product.productName
                                    .toLowerCase()
                                    .replace(/[^\w\s]/g, "")
                                    .replace(/\s+/g, "-");
                                navigate(`/product/${urlName}`, {
                                    state: { productId: product.productId, selectedFragrance: firstFragrance },
                                });
                            }}
                        >
                            {/* COLUMN 1 - IMAGE (NO HEART) */}
                            <div className="collection-products__col1">
                                <div className="collection-products__item-image">
                                    <img
                                        src={image || placeholderimg}
                                        className="main-image"
                                        alt={product.productName}
                                        onError={(e) => {
                                            e.target.onerror = null;
                                            e.target.src = placeholderimg;
                                        }}
                                    />
                                    {priceInfo.hasOffer && (
                                        <span className="collection-products__offer-badge">
                                            {priceInfo.offerLabel}
                                        </span>
                                    )}
                                </div>
                            </div>

                            {/* COLUMN 2 - PRODUCT NAME (WITH WISHLIST), FRAGRANCE, NOTES, DESCRIPTION */}
                            <div className="collection-products__col2">
                                <div className="collection-products__item-header">
                                    <h3 className="collection-products__item-title">
                                        {product.productName}
                                    </h3>
                                    <button
                                        className={`collection-products__wishlist-btn${isWishlisted ? " collection-products__wishlist-btn--active" : ""}`}
                                        onClick={(e) => toggleWishlist(product, e)}
                                        disabled={isUpdating}
                                    >
                                        {isUpdating ? (
                                            <span className="collection-products__wish-spinner"></span>
                                        ) : isWishlisted ? (
                                            <FaHeart />
                                        ) : (
                                            <FaRegHeart />
                                        )}
                                        <span>WISHLIST</span> 
                                    </button>
                                </div>

                                {/* FRAGRANCE NAME */}
                                {firstFragrance && (
                                    <div className="collection-products__item-fragrance">
                                        <span className="collection-products__item-fragrance-label">FRAGRANCE:</span>
                                        <span className="collection-products__item-fragrance-value">{firstFragrance}</span>
                                    </div>
                                )}

                                {/* NOTES - Only from notes array */}
                                {allNotes.length > 0 && (
                                    <div className="collection-products__item-notes">
                                        <span className="collection-products__item-notes-label">NOTES:</span>
                                        <div className="collection-products__item-notes-list">
                                            {allNotes.map((note, index) => (
                                                <span key={index} className="collection-products__item-note">
                                                    {note}
                                                    {index < allNotes.length - 1 && ","}
                                                </span>
                                            ))}
                                        </div>
                                    </div>
                                )}

                                {/* DESCRIPTION */}
                                <p className="collection-products__item-description">
                                    {truncateDescription(description, 250)}
                                </p>
                            </div>

                            {/* COLUMN 3 - TOP NOTES, HEART NOTES, BASE NOTES, PRICING, BUTTON */}
                            <div className="collection-products__col3">
                                {/* TOP NOTES */}
                                {topNotes.length > 0 && (
                                    <div className="collection-products__item-topnotes">
                                        <span className="collection-products__item-notes-label">TOP NOTES:</span>
                                        <div className="collection-products__item-notes-list">
                                            {topNotes.map((note, index) => (
                                                <span key={index} className="collection-products__item-note">
                                                    {note}
                                                    {index < topNotes.length - 1 && ","}
                                                </span>
                                            ))}
                                        </div>
                                    </div>
                                )}

                                {/* HEART NOTES */}
                                {heartNotes.length > 0 && (
                                    <div className="collection-products__item-heartnotes">
                                        <span className="collection-products__item-notes-label">HEART NOTES:</span>
                                        <div className="collection-products__item-notes-list">
                                            {heartNotes.map((note, index) => (
                                                <span key={index} className="collection-products__item-note">
                                                    {note}
                                                    {index < heartNotes.length - 1 && ","}
                                                </span>
                                            ))}
                                        </div>
                                    </div>
                                )}

                                {/* BASE NOTES */}
                                {baseNotes.length > 0 && (
                                    <div className="collection-products__item-basenotes">
                                        <span className="collection-products__item-notes-label">BASE NOTES:</span>
                                        <div className="collection-products__item-notes-list">
                                            {baseNotes.map((note, index) => (
                                                <span key={index} className="collection-products__item-note">
                                                    {note}
                                                    {index < baseNotes.length - 1 && ","}
                                                </span>
                                            ))}
                                        </div>
                                    </div>
                                )}

                                {/* PRICING */}
                                <div className="collection-products__pricing-row">
                                    <span className="collection-products__final-price">
                                        ₹{formatCurrency(priceInfo.finalPrice)}
                                    </span>
                                    {priceInfo.originalPrice > priceInfo.finalPrice && (
                                        <>
                                            <span className="collection-products__original-price">
                                                ₹{formatCurrency(priceInfo.originalPrice)}
                                            </span>
                                            {priceInfo.discount > 0 && (
                                                <span className="collection-products__discount-percent">
                                                    {priceInfo.discount}% OFF
                                                </span>
                                            )}
                                        </>
                                    )}
                                </div>

                                {/* VIEW DETAILS BUTTON */}
                                <button className="collection-products__view-details-btn">
                                    VIEW DETAILS
                                    <span>→</span>
                                </button>
                            </div>
                        </div>
                    );
                })}
            </div>

            {/* PAGINATION */}
            {totalPages > 1 && (
                <div className="collection-products__pagination">
                    <button
                        onClick={() => paginate(currentPage - 1)}
                        disabled={currentPage === 1}
                        className="collection-products__pagination-btn"
                    >
                        <IoArrowBackOutline />
                    </button>
                    {Array.from({ length: totalPages }, (_, i) => i + 1).map((number) => (
                        <button
                            key={number}
                            onClick={() => paginate(number)}
                            className={`collection-products__pagination-btn ${currentPage === number ? "collection-products__pagination-btn--active" : ""
                                }`}
                        >
                            {number}
                        </button>
                    ))}
                    <button
                        onClick={() => paginate(currentPage + 1)}
                        disabled={currentPage === totalPages}
                        className="collection-products__pagination-btn"
                    >
                        <IoArrowForwardOutline />
                    </button>
                </div>
            )}
        </section>
    );
};

export default CollectionProducts;