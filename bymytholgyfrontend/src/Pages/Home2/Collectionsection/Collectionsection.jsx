import React, { useEffect, useRef, useState } from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation } from "swiper/modules";
import "swiper/css";
import "swiper/css/navigation";
import { IoIosArrowRoundBack, IoIosArrowRoundForward } from "react-icons/io";
import { FaRegHeart, FaHeart } from "react-icons/fa";
import { toast, ToastContainer } from "react-toastify";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import "react-toastify/dist/ReactToastify.css";
import "./CollectionSection.scss";
import placeholderimg from "../../../assets/logo/logo.png";
import LoginModal from "../../../Components/Login/LoginModel/LoginModal";

const CollectionSection = () => {
    const sectionRef = useRef(null);
    const prevRef = useRef(null);
    const nextRef = useRef(null);
    const navigate = useNavigate();

    const [products, setProducts] = useState([]);
    const [wishlist, setWishlist] = useState({});
    const [showLoginModal, setShowLoginModal] = useState(false);
    const [isLoading, setIsLoading] = useState(true);
    const [updatingProductId, setUpdatingProductId] = useState(null);

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
                        // Store with fragrance as key for specific tracking
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

    useEffect(() => {
        const observer = new IntersectionObserver(
            ([entry]) => {
                if (entry.isIntersecting) {
                    sectionRef.current?.classList.add("collection-section--visible");
                    observer.disconnect();
                }
            },
            { threshold: 0.15 }
        );
        if (sectionRef.current) observer.observe(sectionRef.current);
        return () => observer.disconnect();
    }, []);

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
            // Optimistic update
            setWishlist((prev) => ({ ...prev, [wishlistKey]: !isCurrentlyWishlisted }));

            if (isCurrentlyWishlisted) {
                // REMOVE from wishlist
                await axios.delete(
                    `${import.meta.env.VITE_API_URL}/wishlist/remove/${productId}?userId=${userId}&fragrance=${firstFragrance}`,
                    {
                        headers: { Authorization: `Bearer ${token}` },
                    }
                );
                toast.success("Removed from wishlist");
            } else {
                // ADD to wishlist
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
                // REMOVED: navigate("/wishlist"); - Don't navigate away
            }
            setUpdatingProductId(null);
            window.dispatchEvent(new Event("wishlistUpdated"));
        } catch (error) {
            console.error("Error toggling wishlist:", error);
            // Rollback optimistic update
            setWishlist((prev) => ({ ...prev, [wishlistKey]: isCurrentlyWishlisted }));
            setUpdatingProductId(null);

            // Handle "already in wishlist" error gracefully
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

    const CollectionCard = ({ item }) => {
        const color = item.colors?.[0];
        const image = item.thumbnailImage || color?.images?.[0];
        const firstFragrance = color?.fragrances?.[0]?.name || null;
        const wishlistKey = firstFragrance
            ? `${item.productId}_${firstFragrance}`
            : item.productId;
        const isWishlisted = wishlist[wishlistKey] || false;
        const isUpdating = updatingProductId === item.productId;
        const priceInfo = calculatePrice(color);

        return (
            <div
                className="collection-section__card"
                onClick={() => {
                    const urlName = item.productName
                        .toLowerCase()
                        .replace(/[^\w\s]/g, "")
                        .replace(/\s+/g, "-");
                    navigate(`/product/${urlName}`, {
                        state: { productId: item.productId, selectedFragrance: firstFragrance },
                    });
                }}
            >
                <div className="collection-section__card-frame">
                    <div className="collection-section__card-frame-inner">
                        <img
                            src={image || placeholderimg}
                            alt={item.productName}
                            className="collection-section__card-img"
                            onError={(e) => {
                                e.target.onerror = null;
                                e.target.src = placeholderimg;
                            }}
                        />
                        <div className="collection-section__card-img-overlay" />

                        <button
                            className={`collection-section__wish-btn${isWishlisted ? " collection-section__wish-btn--active" : ""}`}
                            onClick={(e) => toggleWishlist(item, e)}
                            disabled={isUpdating}
                        >
                            {isUpdating ? (
                                <span className="collection-section__wish-spinner"></span>
                            ) : isWishlisted ? (
                                <FaHeart />
                            ) : (
                                <FaRegHeart />
                            )}
                        </button>

                        {priceInfo.hasOffer && (
                            <span className="collection-section__offer-badge">
                                {priceInfo.offerLabel}
                            </span>
                        )}
                    </div>
                </div>

                <div className="collection-section__card-info">
                    <h3 className="collection-section__card-name">{item.productName}</h3>

                    <div className="collection-section__prices">
                        <span className="collection-section__price">
                            ₹{formatCurrency(priceInfo.finalPrice)}
                        </span>
                        {priceInfo.originalPrice > priceInfo.finalPrice && (
                            <>
                                <span className="collection-section__original-price">
                                    ₹{formatCurrency(priceInfo.originalPrice)}
                                </span>
                                {priceInfo.discount > 0 && (
                                    <span className="collection-section__discount">
                                        {priceInfo.discount}% OFF
                                    </span>
                                )}
                            </>
                        )}
                    </div>
                </div>
            </div>
        );
    };

    if (isLoading) {
        return (
            <section className="collection-section" ref={sectionRef}>
                <div className="collection-section__loading">
                    <div className="collection-section__spinner"></div>
                    <p>Loading collection...</p>
                </div>
            </section>
        );
    }

    return (
        <section className="collection-section" ref={sectionRef}>
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

            <div className="collection-section__header">
                <p className="collection-section__eyebrow">The Sacred Chapters</p>
                <div className="collection-section__ornament">
                    <span className="collection-section__ornament-line" />
                    <svg className="collection-section__ornament-diamond" viewBox="0 0 20 10">
                        <polygon points="10,0 20,5 10,10 0,5" fill="#c9a84c" />
                    </svg>
                    <span className="collection-section__ornament-line" />
                </div>
                <h2 className="collection-section__heading">Explore the Collection</h2>
            </div>

            {/* SLIDER FOR ALL VIEWS */}
            <div className="collection-section__slider-wrapper">
                <Swiper
                    modules={[Navigation]}
                    navigation={{
                        prevEl: prevRef.current,
                        nextEl: nextRef.current,
                    }}
                    onBeforeInit={(swiper) => {
                        swiper.params.navigation.prevEl = prevRef.current;
                        swiper.params.navigation.nextEl = nextRef.current;
                    }}
                    loop={true}
                    spaceBetween={20}
                    slidesPerView={2}
                    breakpoints={{
                        0: {
                            slidesPerView: 2,
                            spaceBetween: 16
                        },
                        640: {
                            slidesPerView: 2,
                            spaceBetween: 16
                        },
                        768: {
                            slidesPerView: 3,
                            spaceBetween: 18
                        },
                        1024: {
                            slidesPerView: 3,
                            spaceBetween: 20
                        },
                        1200: {
                            slidesPerView: 4,
                            spaceBetween: 20
                        },
                        1400: {
                            slidesPerView: 5,
                            spaceBetween: 24
                        },
                    }}
                    className="collection-section__swiper"
                >
                    {products.map((item) => (
                        <SwiperSlide key={item.productId}>
                            <CollectionCard item={item} />
                        </SwiperSlide>
                    ))}
                </Swiper>

                <div className="collection-section__slider-arrows">
                    <button className="collection-section__slider-prev" ref={prevRef}>
                        <IoIosArrowRoundBack />
                    </button>
                    <button className="collection-section__slider-next" ref={nextRef}>
                        <IoIosArrowRoundForward />
                    </button>
                </div>
            </div>

            <div className="collection-section__footer">
                <a href="/collection" className="collection-section__view-all">
                    View All Collections
                    <span className="view-all-arrow"><IoIosArrowRoundForward /></span>
                </a>
            </div>
        </section>
    );
};

export default CollectionSection;