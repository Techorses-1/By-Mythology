import React, { useEffect, useState, useRef } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation } from "swiper/modules";
import { IoIosArrowRoundBack, IoIosArrowRoundForward } from "react-icons/io";
import { FaRegHeart, FaHeart } from "react-icons/fa";
import { toast, ToastContainer } from "react-toastify";
import WishlistSidebar from "../../Wishlist/Sidebar/WishlistSidebar";
import LoginModal from "../../../Components/Login/LoginModel/LoginModal";
import "swiper/css";
import "swiper/css/navigation";
import "react-toastify/dist/ReactToastify.css";
import "./RelatedProducts.scss";

const RelatedProducts = ({
  productId,
  currentFragrances = [],
  categoryId,
  currentProductType,
  currentModelId
}) => {
  const [relatedProducts, setRelatedProducts] = useState([]);
  const [wishlist, setWishlist] = useState({});
  const [showWishlistSidebar, setShowWishlistSidebar] = useState(false);
  const [showLoginModal, setShowLoginModal] = useState(false);
  const [loading, setLoading] = useState(true);
  const [updatingProductId, setUpdatingProductId] = useState(null);

  // Refs for navigation buttons
  const prevRef = useRef(null);
  const nextRef = useRef(null);
  const [swiperReady, setSwiperReady] = useState(false);

  const navigate = useNavigate();

  useEffect(() => {
    fetchRelatedProducts();
  }, [productId, currentFragrances, categoryId]);

  useEffect(() => {
    if (relatedProducts.length > 0) {
      fetchUserWishlist();
    }
  }, [relatedProducts]);

  const fetchRelatedProducts = async () => {
    try {
      setLoading(true);

      if (currentFragrances && currentFragrances.length > 0) {
        const response = await axios.post(
          `${import.meta.env.VITE_API_URL}/products/related-by-fragrances`,
          {
            productId,
            fragrances: currentFragrances,
            categoryId,
            limit: 12
          }
        );

        if (response.data.success && response.data.products.length > 0) {
          try {
            const offersResponse = await axios.get(
              `${import.meta.env.VITE_API_URL}/productoffers/public-products-with-offers`
            );

            const offersMap = {};
            offersResponse.data.forEach(product => {
              if (product.colors?.[0]?.hasOffer) {
                offersMap[product.productId] = {
                  hasOffer: true,
                  offer: product.colors[0].offer
                };
              }
            });

            const mergedProducts = response.data.products
              .filter(product => product.productId !== productId)
              .map(product => {
                const offerData = offersMap[product.productId];
                if (offerData && product.colors?.[0]) {
                  return {
                    ...product,
                    colors: [{
                      ...product.colors[0],
                      hasOffer: offerData.hasOffer,
                      offer: offerData.offer
                    }]
                  };
                }
                return product;
              });

            setRelatedProducts(mergedProducts);
          } catch (offerErr) {
            setRelatedProducts(response.data.products.filter(p => p.productId !== productId));
          }
        } else {
          await fetchByCategory();
        }
      } else {
        await fetchByCategory();
      }
    } catch (error) {
      console.error("Error fetching related products:", error);
      await fetchByCategory();
    } finally {
      setLoading(false);
      setSwiperReady(true);
    }
  };

  const fetchByCategory = async () => {
    try {
      if (!categoryId) return;

      const response = await axios.get(
        `${import.meta.env.VITE_API_URL}/products/category/${categoryId}`
      );

      const filteredProducts = response.data
        .filter(product => product.productId !== productId)
        .slice(0, 12);

      setRelatedProducts(filteredProducts);
    } catch (error) {
      console.error("Error fetching category products:", error);
      await fetchAllProducts();
    }
  };

  const fetchAllProducts = async () => {
    try {
      const response = await axios.get(
        `${import.meta.env.VITE_API_URL}/products/all`
      );

      const filteredProducts = response.data
        .filter(product => product.productId !== productId)
        .slice(0, 12);

      setRelatedProducts(filteredProducts);
    } catch (error) {
      console.error("Error fetching all products:", error);
      setRelatedProducts([]);
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
          headers: { Authorization: `Bearer ${token}` }
        }
      );

      const wishlistStatus = {};
      const wishlistMap = new Map();

      response.data.wishlist?.forEach(item => {
        if (item.productId && item.isActive) {
          const key = `${item.productId}_${item.selectedFragrance || ''}`;
          wishlistMap.set(key, true);
        }
      });

      relatedProducts.forEach(product => {
        const firstFragrance = product.colors?.[0]?.fragrances?.[0]?.name || null;
        const key = firstFragrance ? `${product.productId}_${firstFragrance}` : product.productId;
        wishlistStatus[product.productId] = wishlistMap.get(key) || false;
      });

      setWishlist(prev => ({ ...prev, ...wishlistStatus }));
      setUpdatingProductId(null);
    } catch (error) {
      console.error("Error fetching wishlist:", error);
      setUpdatingProductId(null);
    }
  };

  const calculatePriceWithOffer = (color) => {
    if (!color) {
      return {
        finalPrice: 0,
        originalPrice: 0,
        discount: 0,
        hasOffer: false,
        offerLabel: null,
        offerPercentage: 0
      };
    }

    const originalPrice = Number(color.originalPrice) || 0;
    const baseCurrentPrice = Number(color.currentPrice) || originalPrice;
    const hasColorOffer = color.hasOffer && color.offer?.isCurrentlyValid;
    const offerPercentage = hasColorOffer ? Number(color.offer.offerPercentage) : 0;

    let finalPrice = baseCurrentPrice;
    let discountPercentage = 0;

    if (hasColorOffer && offerPercentage > 0) {
      const offerDiscountAmount = (baseCurrentPrice * offerPercentage) / 100;
      finalPrice = baseCurrentPrice - offerDiscountAmount;
      if (finalPrice < 0) finalPrice = 0;

      if (originalPrice > 0) {
        const totalDiscount = originalPrice - finalPrice;
        discountPercentage = Math.round((totalDiscount / originalPrice) * 100);
      }
    } else {
      if (originalPrice > 0 && baseCurrentPrice < originalPrice) {
        finalPrice = baseCurrentPrice;
        discountPercentage = Math.round(((originalPrice - baseCurrentPrice) / originalPrice) * 100);
      }
    }

    return {
      finalPrice: parseFloat(finalPrice.toFixed(2)),
      originalPrice: originalPrice,
      discount: discountPercentage,
      hasOffer: hasColorOffer,
      offerLabel: hasColorOffer ? color.offer.offerLabel : null,
      offerPercentage: offerPercentage
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

    const isCurrentlyWishlisted = wishlist[product.productId];
    const productIdToUpdate = product.productId;
    const firstFragrance = product.colors?.[0]?.fragrances?.[0]?.name || null;

    setUpdatingProductId(productIdToUpdate);

    try {
      setWishlist(prev => ({
        ...prev,
        [productIdToUpdate]: !isCurrentlyWishlisted
      }));

      if (isCurrentlyWishlisted) {
        await axios.delete(
          `${import.meta.env.VITE_API_URL}/wishlist/remove/${productIdToUpdate}?userId=${userId}&fragrance=${firstFragrance}`,
          { headers: { Authorization: `Bearer ${token}` } }
        );
        toast.success("Removed from wishlist");
      } else {
        const color = product.colors?.[0];
        const priceInfo = calculatePriceWithOffer(color);

        const wishlistData = {
          userId,
          productId: productIdToUpdate,
          productName: product.productName,
          categoryId: product.categoryId,
          categoryName: product.categoryName,
          productType: product.type || "simple",
          addedFrom: "related-products",
          selectedFragrance: firstFragrance,
          selectedModel: null,
          selectedSize: null,
          selectedColor: color ? {
            colorId: color.colorId,
            colorName: color.colorName,
            currentPrice: priceInfo.finalPrice,
            originalPrice: priceInfo.originalPrice
          } : null
        };

        await axios.post(
          `${import.meta.env.VITE_API_URL}/wishlist/add`,
          wishlistData,
          { headers: { Authorization: `Bearer ${token}` } }
        );
        toast.success("Added to wishlist!");

        if (window.innerWidth > 768) {
          setShowWishlistSidebar(true);
        }
      }

      setTimeout(() => fetchUserWishlist(), 500);
    } catch (error) {
      console.error("Error toggling wishlist:", error);
      setWishlist(prev => ({ ...prev, [productIdToUpdate]: isCurrentlyWishlisted }));
      setUpdatingProductId(null);

      if (error.response?.status === 400 && error.response?.data?.message?.includes("already in your wishlist")) {
        setWishlist(prev => ({ ...prev, [productIdToUpdate]: true }));
        toast.info("Already in your wishlist");
      } else {
        toast.error(error.response?.data?.message || "Error updating wishlist");
      }
    }
  };

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-IN', {
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount);
  };

  const createProductSlug = (productName) => {
    return productName
      .toLowerCase()
      .replace(/[^\w\s]/g, '')
      .replace(/\s+/g, '-');
  };

  // Check if we should show arrows based on product count
  const getSlidesPerView = () => {
    if (relatedProducts.length <= 2) return relatedProducts.length;
    if (window.innerWidth >= 1200) return Math.min(5, relatedProducts.length);
    if (window.innerWidth >= 768) return Math.min(3, relatedProducts.length);
    return Math.min(2, relatedProducts.length);
  };

  const shouldShowArrows = () => {
    const width = window.innerWidth;
    if (width >= 1200) return relatedProducts.length > 5;
    if (width >= 768) return relatedProducts.length > 3;
    return relatedProducts.length > 2;
  };

  if (loading) {
    return (
      <div className="related-products-loading">
        <div className="loading-spinner"></div>
        <p>Loading related products...</p>
      </div>
    );
  }

  if (relatedProducts.length === 0) {
    return null;
  }

  return (
    <>
      <ToastContainer position="top-center" autoClose={3000} />

      <WishlistSidebar
        isOpen={showWishlistSidebar}
        onClose={() => setShowWishlistSidebar(false)}
      />

      {showLoginModal && (
        <LoginModal
          onClose={() => {
            setShowLoginModal(false);
            fetchUserWishlist();
          }}
          showRegisterLink={true}
        />
      )}

      <section className="related-products-showcase">
        <div className="section-header">
         
          <h2 className="section-title">You Might Also Like</h2>
           <div className="section-ornament">
            <span className="section-ornament-line" />
            <svg className="section-ornament-diamond" viewBox="0 0 20 10">
              <polygon points="10,0 20,5 10,10 0,5" fill="#c9a84c" />
            </svg>
            <span className="section-ornament-line" />
          </div>
          {/* <p className="section-subtitle">Products with similar fragrances</p> */}
        </div>

        <div className="related-products-slider-container">
          <Swiper
            modules={[Navigation]}
            slidesPerView={getSlidesPerView()}
            spaceBetween={24}
            navigation={shouldShowArrows() ? {
              prevEl: prevRef.current,
              nextEl: nextRef.current,
            } : false}
            onBeforeInit={(swiper) => {
              if (shouldShowArrows()) {
                swiper.params.navigation.prevEl = prevRef.current;
                swiper.params.navigation.nextEl = nextRef.current;
              }
            }}
            breakpoints={{
              0: {
                slidesPerView: Math.min(2, relatedProducts.length),
                spaceBetween: 16,
              },
              768: {
                slidesPerView: Math.min(3, relatedProducts.length),
                spaceBetween: 20,
              },
              1200: {
                slidesPerView: Math.min(5, relatedProducts.length),
                spaceBetween: 24,
              },
            }}
            className="related-swiper"
          >
            {relatedProducts.map((product) => {
              const color = product.colors?.[0];
              const image = product.thumbnailImage || color?.images?.[0];
              const isWishlisted = wishlist[product.productId] || false;
              const isUpdating = updatingProductId === product.productId;
              const priceInfo = calculatePriceWithOffer(color);

              return (
                <SwiperSlide key={product.productId}>
                  <div
                    className="related-product-item"
                    onClick={() => {
                      const urlName = createProductSlug(product.productName);
                      navigate(`/product/${urlName}`, {
                        state: { productId: product.productId }
                      });
                    }}
                  >
                    <div className="image-wrapper">
                      {priceInfo.hasOffer && (
                        <div className="special-offer-badge">
                          {priceInfo.offerLabel || "Special Offer"}
                        </div>
                      )}

                      <button
                        className={`wishlist-btn ${isWishlisted ? 'wishlisted' : ''} ${isUpdating ? 'updating' : ''}`}
                        onClick={(e) => toggleWishlist(product, e)}
                        disabled={isUpdating}
                      >
                        {isUpdating ? (
                          <span className="loading-spinner-small"></span>
                        ) : isWishlisted ? (
                          <FaHeart className="wishlist-icon filled" />
                        ) : (
                          <FaRegHeart className="wishlist-icon" />
                        )}
                      </button>

                      {image ? (
                        <img
                          src={image}
                          alt={product.productName}
                          loading="lazy"
                          onError={(e) => {
                            e.target.onerror = null;
                            e.target.src = "https://via.placeholder.com/300x300?text=No+Image";
                          }}
                        />
                      ) : (
                        <div className="no-image-placeholder">
                          <span>No Image</span>
                        </div>
                      )}
                    </div>

                    <h3 className="product-name">{product.productName}</h3>

                    <div className="related-price-row">
                      <span className="price">₹{formatCurrency(priceInfo.finalPrice)}</span>

                      {priceInfo.originalPrice > priceInfo.finalPrice && (
                        <>
                          <span className="original">₹{formatCurrency(priceInfo.originalPrice)}</span>
                          {priceInfo.discount > 0 && (
                            <span className="off-badge">{priceInfo.discount}% OFF</span>
                          )}
                        </>
                      )}
                    </div>
                  </div>
                </SwiperSlide>
              );
            })}
          </Swiper>

          {shouldShowArrows() && relatedProducts.length > 0 && (
            <div className="slider-arrows">
              <button className="related-prod-prev" ref={prevRef} aria-label="Previous">
                <IoIosArrowRoundBack />
              </button>
              <button className="related-prod-next" ref={nextRef} aria-label="Next">
                <IoIosArrowRoundForward />
              </button>
            </div>
          )}
        </div>
      </section>
    </>
  );
};

export default RelatedProducts;