// ProductPage.jsx - COMPLETE FIXED VERSION
import React, { useEffect, useState, useRef } from "react";
import { useParams, useNavigate, useLocation } from "react-router-dom";
import axios from "axios";
import { FaHeart, FaRegHeart } from "react-icons/fa";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, Autoplay, Thumbs } from "swiper/modules";
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/thumbs";
import "./ProductPage.scss";
import fallback from "../../assets/logo/newlogo.png";
import { IoIosArrowRoundBack, IoIosArrowRoundForward } from "react-icons/io";
import RelatedProducts from "./RelatedProducts/RelatedProducts";
import ReviewsSlider from "./ReviewsSlider/ReviewsSlider";

function ProductPage() {
  const { productName } = useParams();
  const location = useLocation();
  const navigate = useNavigate();
  const productIdFromState = location.state?.productId;
  const fragranceFromWishlist = location.state?.fragranceFromWishlist;
  const selectedFragranceFromState = location.state?.selectedFragrance;

  const token = localStorage.getItem("token");

  // Product states
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Offer states
  const [offers, setOffers] = useState([]);
  const [currentOffer, setCurrentOffer] = useState(null);

  // Selection states - SEPARATE for top and bottom
  const [selectedFragranceTop, setSelectedFragranceTop] = useState(null);
  const [selectedFragranceBottom, setSelectedFragranceBottom] = useState(null);
  const [selectedFragranceData, setSelectedFragranceData] = useState(null);
  const [selectedModel, setSelectedModel] = useState(null);
  const [selectedModelFragrance, setSelectedModelFragrance] = useState(null);

  // Quantity
  const [quantity, setQuantity] = useState(1);

  // Images
  const [images, setImages] = useState([]);
  const [thumbsSwiper, setThumbsSwiper] = useState(null);

  // Wishlist
  const [wishlist, setWishlist] = useState(false);

  // Inventory
  const [fragranceInventory, setFragranceInventory] = useState({});
  const [currentFragranceInventory, setCurrentFragranceInventory] = useState({
    stock: 0,
    threshold: 0,
    status: 'checking'
  });

  // Max quantity
  const [maxQuantity, setMaxQuantity] = useState(99);

  // Reviews
  const [showReviewsModal, setShowReviewsModal] = useState(false);
  const [reviews, setReviews] = useState([]);
  const [reviewsLoading, setReviewsLoading] = useState(false);
  const [reviewsStats, setReviewsStats] = useState({
    averageRating: 0,
    totalReviews: 0,
    ratingDistribution: { 5: 0, 4: 0, 3: 0, 2: 0, 1: 0 }
  });
  const [reviewsPage, setReviewsPage] = useState(1);
  const [reviewsLimit] = useState(5);

  // Force page to start at top
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  // ===== FETCH PRODUCT DATA =====
  const fetchProductById = async (id) => {
    try {
      setLoading(true);
      setError(null);

      const preSelectedFragrance = getPreSelectedFragrance();

      const productRes = await axios.get(
        `${import.meta.env.VITE_API_URL}/products/${id}`
      );
      const productData = productRes.data;
      setProduct(productData);

      const offersRes = await axios.get(
        `${import.meta.env.VITE_API_URL}/productoffers/product-color-offers/${id}`
      );
      setOffers(offersRes.data);

      if (productData.type === "simple" && productData.colors && productData.colors.length > 0) {
        const defaultColor = productData.colors[0];
        const fragrances = defaultColor.fragrances || [];

        if (preSelectedFragrance && fragrances.some(f => f.name === preSelectedFragrance)) {
          setSelectedFragranceTop(preSelectedFragrance);
          setSelectedFragranceBottom(preSelectedFragrance);
          const fragranceObj = defaultColor.fragrances.find(f => f.name === preSelectedFragrance);
          setSelectedFragranceData(fragranceObj);
          checkAndSetOffer(productData, defaultColor, null, preSelectedFragrance, offersRes.data);
        } else if (fragrances.length > 0) {
          setSelectedFragranceTop(fragrances[0].name);
          setSelectedFragranceBottom(fragrances[0].name);
          setSelectedFragranceData(fragrances[0]);
          checkAndSetOffer(productData, defaultColor, null, fragrances[0].name, offersRes.data);
        }

        if (defaultColor.images && defaultColor.images.length > 0) {
          setImages(defaultColor.images);
        }
      }
    } catch (err) {
      console.error("Error fetching product:", err);
      setError("Product not found or error loading product details.");
    } finally {
      setLoading(false);
    }
  };

  const fetchProductByName = async (name) => {
    try {
      setLoading(true);
      setError(null);

      const response = await axios.get(
        `${import.meta.env.VITE_API_URL}/products/by-name/${name}`
      );
      const productData = response.data.product;
      setProduct(productData);

      const offersRes = await axios.get(
        `${import.meta.env.VITE_API_URL}/productoffers/product-color-offers/${productData.productId}`
      );
      setOffers(offersRes.data);

      const preSelectedFragrance = getPreSelectedFragrance();

      if (productData.type === "simple" && productData.colors && productData.colors.length > 0) {
        const defaultColor = productData.colors[0];
        const fragrances = defaultColor.fragrances || [];

        if (preSelectedFragrance && fragrances.some(f => f.name === preSelectedFragrance)) {
          setSelectedFragranceTop(preSelectedFragrance);
          setSelectedFragranceBottom(preSelectedFragrance);
          const fragranceObj = defaultColor.fragrances.find(f => f.name === preSelectedFragrance);
          setSelectedFragranceData(fragranceObj);
          checkAndSetOffer(productData, defaultColor, null, preSelectedFragrance, offersRes.data);
        } else if (fragrances.length > 0) {
          setSelectedFragranceTop(fragrances[0].name);
          setSelectedFragranceBottom(fragrances[0].name);
          setSelectedFragranceData(fragrances[0]);
          checkAndSetOffer(productData, defaultColor, null, fragrances[0].name, offersRes.data);
        }

        if (defaultColor.images && defaultColor.images.length > 0) {
          setImages(defaultColor.images);
        }
      }
    } catch (err) {
      console.error("Error fetching product by name:", err);
      if (err.response?.status === 404) {
        setError("Product not found. Please check the URL.");
      } else {
        setError("Error loading product. Please try again.");
      }
    } finally {
      setLoading(false);
    }
  };

  const getPreSelectedFragrance = () => {
    if (selectedFragranceFromState) return selectedFragranceFromState;
    if (fragranceFromWishlist) return fragranceFromWishlist;
    const urlParams = new URLSearchParams(window.location.search);
    const urlFragrance = urlParams.get('fragrance');
    if (urlFragrance) return urlFragrance;
    return null;
  };

  useEffect(() => {
    if (productIdFromState) {
      fetchProductById(productIdFromState);
    } else if (productName) {
      fetchProductByName(productName);
    } else {
      setError("No product identifier provided.");
      setLoading(false);
    }
  }, [productIdFromState, productName]);

  const checkAndSetOffer = (productData, color, model, fragrance, offersArray) => {
    if (!color || !color.colorId) {
      setCurrentOffer(null);
      return;
    }

    const variableModelId = model ? (model._id || model.modelId) : "";

    const offer = offersArray.find(offer =>
      offer.productId === productData.productId &&
      offer.colorId === color.colorId &&
      (variableModelId ? offer.variableModelId === variableModelId : !offer.variableModelId) &&
      offer.isCurrentlyValid
    );

    setCurrentOffer(offer || null);
  };

  // ===== FETCH INVENTORY =====
  const fetchAllFragrancesInventory = async () => {
    if (!product) return;

    try {
      const allFragrances = getAvailableFragrances();
      const inventoryMap = {};

      for (const fragrance of allFragrances) {
        const params = new URLSearchParams();
        const defaultColorId = product.type === "simple"
          ? (product.colors?.[0]?.colorId)
          : (selectedModel?.colors?.[0]?.colorId);

        if (defaultColorId) params.append('colorId', defaultColorId);
        params.append('fragrance', fragrance);

        try {
          const response = await axios.get(
            `${import.meta.env.VITE_API_URL}/inventory/product/${product.productId}/status?${params.toString()}`
          );
          inventoryMap[fragrance] = {
            stock: response.data.stock,
            threshold: response.data.threshold,
            status: response.data.status
          };
        } catch (error) {
          inventoryMap[fragrance] = { stock: 0, threshold: 10, status: 'error' };
        }
      }

      setFragranceInventory(inventoryMap);

      const currentFragrance = product.type === "simple" ? selectedFragranceTop : selectedModelFragrance;
      if (currentFragrance && inventoryMap[currentFragrance]) {
        setCurrentFragranceInventory(inventoryMap[currentFragrance]);
      }
    } catch (error) {
      console.error('Error fetching inventory:', error);
    }
  };

  useEffect(() => {
    if (product) fetchAllFragrancesInventory();
  }, [product]);

  useEffect(() => {
    const currentFragrance = product?.type === "simple" ? selectedFragranceTop : selectedModelFragrance;
    if (currentFragrance && fragranceInventory[currentFragrance]) {
      setCurrentFragranceInventory(fragranceInventory[currentFragrance]);
    }
  }, [selectedFragranceTop, selectedModelFragrance, fragranceInventory, product]);

  useEffect(() => {
    if (currentFragranceInventory.status === 'in-stock' || currentFragranceInventory.status === 'low-stock') {
      setMaxQuantity(currentFragranceInventory.stock);
      if (quantity > currentFragranceInventory.stock) setQuantity(currentFragranceInventory.stock);
    } else if (currentFragranceInventory.status === 'out-of-stock') {
      setMaxQuantity(0);
      setQuantity(0);
    }
  }, [currentFragranceInventory]);

  // ===== FETCH REVIEWS =====
  const fetchProductReviews = async (page = 1) => {
    if (!product?.productId) return;
    try {
      setReviewsLoading(true);
      const response = await axios.get(
        `${import.meta.env.VITE_API_URL}/reviews/product/${product.productId}`,
        { params: { page, limit: reviewsLimit } }
      );
      if (response.data.success) {
        if (page === 1) {
          setReviews(response.data.reviews);
          setReviewsStats(response.data.stats);
        } else {
          setReviews(prev => [...prev, ...response.data.reviews]);
        }
      }
    } catch (error) {
      console.error('Error fetching reviews:', error);
    } finally {
      setReviewsLoading(false);
    }
  };

  useEffect(() => {
    if (product?.productId) fetchProductReviews();
  }, [product?.productId]);

  // ===== CHECK WISHLIST STATUS ON PAGE LOAD =====
  useEffect(() => {
    const checkWishlistStatus = async () => {
      const token = localStorage.getItem("token");
      const userId = localStorage.getItem("userId");

      if (!token || !userId || !product?.productId) return;

      const currentFragrance = product.type === "simple" ? selectedFragranceTop : selectedModelFragrance;
      if (!currentFragrance) return;

      try {
        const response = await axios.get(
          `${import.meta.env.VITE_API_URL}/wishlist/check/${product.productId}?userId=${userId}&fragrance=${currentFragrance}`,
          {
            headers: { Authorization: `Bearer ${token}` }
          }
        );

        if (response.data.isSpecificWishlisted || response.data.isInWishlist) {
          setWishlist(true);
        } else {
          setWishlist(false);
        }
      } catch (error) {
        console.error("Error checking wishlist status:", error);
      }
    };

    checkWishlistStatus();
  }, [product?.productId, selectedFragranceTop, selectedModelFragrance]);

  // ===== HELPER FUNCTIONS =====
  const getAvailableFragrances = () => {
    if (product.type === "simple" && product.colors?.[0]) {
      return product.colors[0].fragrances?.map(f => f.name) || [];
    }
    return [];
  };

  const getStockStatusText = () => {
    const status = currentFragranceInventory.status;
    if (status === 'in-stock') return 'In Stock';
    if (status === 'low-stock') return 'Low Stock';
    if (status === 'out-of-stock') return 'Out of Stock';
    if (status === 'checking') return 'Checking stock...';
    return 'Select a fragrance';
  };

  const getStockStatusClass = () => {
    const status = currentFragranceInventory.status;
    if (status === 'in-stock') return 'in-stock';
    if (status === 'low-stock') return 'low-stock';
    if (status === 'out-of-stock') return 'out-of-stock';
    return '';
  };

  const getBasePrice = () => {
    if (product.type === "simple" && product.colors?.[0]) {
      return product.colors[0].currentPrice || product.currentPrice || 0;
    }
    return product.currentPrice || 0;
  };

  const getOriginalPrice = () => {
    if (product.type === "simple" && product.colors?.[0]) {
      return product.colors[0].originalPrice || product.originalPrice || 0;
    }
    return product.originalPrice || 0;
  };

  const getOfferPrice = () => {
    const basePrice = getBasePrice();
    if (currentOffer && currentOffer.offerPercentage > 0) {
      const discountAmount = (basePrice * currentOffer.offerPercentage) / 100;
      return Math.max(0, basePrice - discountAmount);
    }
    return basePrice;
  };

  const getDiscountPercent = () => {
    const originalPrice = getOriginalPrice();
    const finalPrice = getOfferPrice();
    if (originalPrice > 0 && originalPrice > finalPrice) {
      return Math.round(((originalPrice - finalPrice) / originalPrice) * 100);
    }
    return 0;
  };

  const getTotalPrice = () => getOfferPrice() * quantity;

  const getDescription = () => {
    return product.description || "No description available.";
  };

  const getShortDescription = () => {
    const desc = getDescription();
    return desc.split('\n').slice(0, 3).join('\n');
  };

  const getSpecifications = () => {
    const specs = [];
    if (product.specifications && product.specifications.length > 0) {
      product.specifications.forEach(spec => specs.push({ key: spec.key, value: spec.value }));
    }
    return specs;
  };

  // Handle top fragrance selection (affects cart/wishlist/price)
  const handleTopFragranceSelect = (fragranceName) => {
    setSelectedFragranceTop(fragranceName);
    const defaultColor = product.colors?.[0];
    if (defaultColor) {
      const fragranceObj = defaultColor.fragrances?.find(f => f.name === fragranceName);
      setSelectedFragranceData(fragranceObj);
      checkAndSetOffer(product, defaultColor, null, fragranceName, offers);
    }
  };

  // Handle bottom fragrance selection (updates notes only, NO cart/price change)
  const handleBottomFragranceSelect = (fragranceName) => {
    setSelectedFragranceBottom(fragranceName);
    const defaultColor = product.colors?.[0];
    if (defaultColor) {
      const fragranceObj = defaultColor.fragrances?.find(f => f.name === fragranceName);
      setSelectedFragranceData(fragranceObj);
      // DO NOT update offer or price - only notes
    }
  };

  const canPurchaseProduct = () => {
    const currentFragrance = product?.type === "simple" ? selectedFragranceTop : selectedModelFragrance;
    if (!currentFragrance) return false;
    const fragranceStock = fragranceInventory[currentFragrance];
    if (!fragranceStock || fragranceStock.status === 'checking') return true;
    if (fragranceStock.status === 'out-of-stock') return false;
    if (fragranceStock.status === 'low-stock' || fragranceStock.status === 'in-stock') {
      return quantity <= fragranceStock.stock && quantity > 0;
    }
    return true;
  };

  const handleQuantityChange = (change) => {
    const newQuantity = quantity + change;
    if (currentFragranceInventory.status === 'out-of-stock') return;
    if (newQuantity >= 1 && newQuantity <= maxQuantity) setQuantity(newQuantity);
  };

  const toggleWishlist = async () => {
    const token = localStorage.getItem("token");
    const userId = localStorage.getItem("userId");
    if (!token || !userId) {
      navigate("/login");
      return;
    }

    const currentFragrance = product.type === "simple" ? selectedFragranceTop : selectedModelFragrance;
    const defaultColor = product.colors?.[0];

    const selectedColorData = defaultColor ? {
      colorId: defaultColor.colorId,
      colorName: defaultColor.colorName,
      currentPrice: getOfferPrice(),
      originalPrice: defaultColor.originalPrice || product.originalPrice || 0
    } : null;

    try {
      if (wishlist) {
        await axios.delete(
          `${import.meta.env.VITE_API_URL}/wishlist/remove/${product.productId}?userId=${userId}&fragrance=${currentFragrance}`,
          {
            headers: { Authorization: `Bearer ${token}` }
          }
        );
        setWishlist(false);
        window.dispatchEvent(new Event('wishlistUpdated'));
      } else {
        const wishlistData = {
          userId: userId,
          productId: product.productId,
          addedFrom: "product",
          selectedFragrance: currentFragrance || null,
          selectedColor: selectedColorData
        };

        await axios.post(
          `${import.meta.env.VITE_API_URL}/wishlist/add`,
          wishlistData,
          {
            headers: { Authorization: `Bearer ${token}` }
          }
        );
        setWishlist(true);
        window.dispatchEvent(new Event('wishlistUpdated'));
      }
    } catch (error) {
      console.error("Error toggling wishlist:", error);
      if (error.response?.status === 400 && error.response?.data?.message?.includes("already in your wishlist")) {
        setWishlist(true);
      }
    }
  };

  const handleAddToCart = async () => {
    if (!selectedFragranceTop && !selectedModelFragrance) return;
    if (!canPurchaseProduct()) return;

    const token = localStorage.getItem("token");
    const userId = localStorage.getItem("userId");
    if (!token || !userId) { navigate("/login"); return; }

    const basePrice = getBasePrice();
    const offerPrice = getOfferPrice();
    const hasOffer = currentOffer && currentOffer.offerPercentage > 0;
    const defaultColor = product.colors?.[0];

    const cartData = {
      userId, productId: product.productId, productName: product.productName,
      quantity, unitPrice: getOriginalPrice(), finalPrice: offerPrice, totalPrice: getTotalPrice(),
      selectedColor: defaultColor,
      selectedFragrance: product.type === "simple" ? selectedFragranceTop : selectedModelFragrance,
      hasOffer, offerDetails: hasOffer ? {
        offerId: currentOffer._id, offerPercentage: currentOffer.offerPercentage,
        offerLabel: currentOffer.offerLabel, originalPrice: basePrice, offerPrice, savedAmount: (basePrice - offerPrice) * quantity
      } : null
    };

    try {
      await axios.post(`${import.meta.env.VITE_API_URL}/cart/add`, cartData, {
        headers: { Authorization: `Bearer ${token}` }
      });
      window.dispatchEvent(new Event('cartUpdated'));
      navigate("/cart");
    } catch (error) {
      console.error("Error adding to cart:", error);
    }
  };

  const handleBuyNow = () => {
    if (!selectedFragranceTop && !selectedModelFragrance) return;
    if (!canPurchaseProduct()) return;

    const token = localStorage.getItem("token");
    const userId = localStorage.getItem("userId");
    if (!token || !userId) { navigate("/login"); return; }

    const basePrice = getBasePrice();
    const offerPrice = getOfferPrice();
    const hasOffer = currentOffer && currentOffer.offerPercentage > 0;
    const originalPrice = getOriginalPrice();
    const subtotal = offerPrice * quantity;
    const shipping = subtotal > 1000 ? 0 : 120;
    const tax = subtotal * 0.18;
    const total = subtotal + shipping + tax;
    const originalSubtotal = originalPrice * quantity;
    const totalSavings = originalSubtotal - subtotal;
    const defaultColor = product.colors?.[0];

    const buyNowData = {
      userId, productId: product.productId, productName: product.productName,
      quantity, unitPrice: originalPrice, finalPrice: offerPrice, totalPrice: subtotal,
      selectedColor: defaultColor,
      selectedFragrance: product.type === "simple" ? selectedFragranceTop : selectedModelFragrance,
      hasOffer, offerDetails: hasOffer ? {
        offerId: currentOffer._id, offerPercentage: currentOffer.offerPercentage,
        offerLabel: currentOffer.offerLabel, originalPrice: basePrice, offerPrice, savedAmount: totalSavings
      } : null,
      thumbnailImage: defaultColor?.images?.[0] || product.thumbnailImage,
      summary: { totalItems: quantity, subtotal, originalSubtotal, totalSavings, shipping, tax, total }
    };
    navigate('/checkout', { state: { buyNowMode: true, productData: buyNowData } });
  };

  const formatCurrency = (amount) => new Intl.NumberFormat("en-IN", { minimumFractionDigits: 0, maximumFractionDigits: 0 }).format(amount);
  const formatDate = (dateString) => new Date(dateString).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' });

  const renderRatingStars = (rating) => {
    const stars = [];
    const numericRating = typeof rating === 'number' ? rating : parseFloat(rating) || 0;
    for (let i = 1; i <= 5; i++) {
      stars.push(
        <span key={i} className={`star ${i <= Math.round(numericRating) ? 'filled' : 'empty'}`}>★</span>
      );
    }
    return stars;
  };

  if (loading) {
    return <div className="product-page"><div className="loading-container"><div className="loading-spinner"></div></div></div>;
  }

  if (error || !product) {
    return (
      <div className="product-page">
        <div className="error-container"><h2>{error || "Product not found"}</h2><button onClick={() => navigate(-1)}>Go Back</button></div>
      </div>
    );
  }

  const finalPrice = getOfferPrice();
  const originalPrice = getOriginalPrice();
  const discountPercent = getDiscountPercent();
  const availableFragrances = getAvailableFragrances();
  const specifications = getSpecifications();
  const description = getDescription();
  const shortDescription = getShortDescription();
  const stockStatus = getStockStatusText();
  const stockStatusClass = getStockStatusClass();
  const averageRating = typeof reviewsStats.averageRating === 'number' ? reviewsStats.averageRating : parseFloat(reviewsStats.averageRating) || 0;

  return (
    <div className="product-page">
      <div className="product-page-back-button">
        <button className="styled-back-button" onClick={() => navigate(-1)} aria-label="Go back">
          <span className="back-arrow">←</span>
          <span className="back-text">Back</span>
        </button>
      </div>

      {/* MAIN CONTAINER - 40% LEFT | 60% RIGHT */}
      <div className="product-main-container">
        {/* LEFT SIDE - 40% CONTENT */}
        <div className="product-left-column">
          <div className="product-name-row">
            <h1 className="product-title">{product.productName}</h1>
            <button className={`wishlist-icon-btn ${wishlist ? 'active' : ''}`} onClick={toggleWishlist}>
              {wishlist ? <FaHeart /> : <FaRegHeart />}
            </button>
          </div>

          <div className="short-description">
            <p className="description-text">{shortDescription}</p>
            {description.split('\n').length > 3 && <span className="ellipsis-indicator">...</span>}
          </div>

          <div className="price-section">
            <div className="price-row">
              <span className="current-price">₹{formatCurrency(finalPrice)}</span>
              {originalPrice > finalPrice && (
                <>
                  <span className="original-price">₹{formatCurrency(originalPrice)}</span>
                  <span className="discount-percent">{discountPercent}% OFF</span>
                </>
              )}
            </div>
          </div>

          <div className={`stock-status ${stockStatusClass}`}>{stockStatus}</div>

          <div className="reviews-row" onClick={() => setShowReviewsModal(true)}>
            <div className="stars-container">{renderRatingStars(averageRating)}</div>
            <div className="reviews-count">{reviewsStats.totalReviews} Review{reviewsStats.totalReviews !== 1 ? 's' : ''}</div>
          </div>

          {/* TOP FRAGRANCE SELECTION - Affects cart/price/wishlist */}
          {availableFragrances.length > 0 && (
            <div className="fragrance-selection-section">
              <h3>Select Fragrance</h3>
              <div className="fragrance-grid">
                {availableFragrances.map((fragrance, index) => {
                  const isSelected = selectedFragranceTop === fragrance;
                  const fragranceStock = fragranceInventory[fragrance];
                  const isOutOfStock = fragranceStock?.status === 'out-of-stock';
                  return (
                    <div
                      key={index}
                      className={`fragrance-box ${isSelected ? 'selected' : ''} ${isOutOfStock ? 'out-of-stock' : ''}`}
                      onClick={() => handleTopFragranceSelect(fragrance)}
                    >
                      <div className="fragrance-name">{fragrance}</div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          <div className="quantity-section">
            <h3>Quantity</h3>
            <div className="quantity-controls">
              <button className="quantity-btn minus" onClick={() => handleQuantityChange(-1)} disabled={quantity <= 1 || !selectedFragranceTop || currentFragranceInventory.status === 'out-of-stock'}>−</button>
              <input type="number" min="1" max={maxQuantity} value={quantity} onChange={(e) => {
                const val = parseInt(e.target.value) || 1;
                if (val >= 1 && val <= maxQuantity && currentFragranceInventory.status !== 'out-of-stock') setQuantity(val);
              }} className="quantity-input" disabled={!selectedFragranceTop || currentFragranceInventory.status === 'out-of-stock'} />
              <button className="quantity-btn plus" onClick={() => handleQuantityChange(1)} disabled={quantity >= maxQuantity || !selectedFragranceTop || currentFragranceInventory.status === 'out-of-stock'}>+</button>
              <div className="total-price">
                <span className="total-label">Total:</span>
                <span className="total-amount">₹{formatCurrency(getTotalPrice())}</span>
              </div>
            </div>
          </div>

          <div className="action-buttons-section">
            <button className={`add-to-cart-btn ${!canPurchaseProduct() || !selectedFragranceTop ? 'disabled' : ''}`} onClick={handleAddToCart} disabled={!canPurchaseProduct() || !selectedFragranceTop}>
              {!selectedFragranceTop ? 'Select Fragrance First' : currentFragranceInventory.status === 'out-of-stock' ? 'Out of Stock' : 'Add to Cart'}
            </button>
            <button className={`buy-now-btn ${!canPurchaseProduct() || !selectedFragranceTop ? 'disabled' : ''}`} onClick={handleBuyNow} disabled={!canPurchaseProduct() || !selectedFragranceTop}>
              {!selectedFragranceTop ? 'Select Fragrance First' : currentFragranceInventory.status === 'out-of-stock' ? 'Out of Stock' : 'Buy Now'}
            </button>
          </div>
        </div>

        {/* RIGHT SIDE - 60% IMAGE */}
        <div className="product-right-column">
          <div className="main-image-container">
            {images.length > 0 ? (
              <>
                <Swiper
                  modules={[Navigation, Autoplay, Thumbs]}
                  spaceBetween={0}
                  slidesPerView={1}
                  navigation={true}
                  autoplay={{ delay: 5000, disableOnInteraction: false }}
                  loop={true}
                  speed={800}
                  thumbs={{ swiper: thumbsSwiper }}
                  className="product-main-swiper"
                >
                  {images.map((img, index) => (
                    <SwiperSlide key={index}>
                      <div className="swiper-image-container">
                        <img src={img} alt={`${product.productName} - ${index + 1}`} onError={(e) => { e.target.onerror = null; e.target.src = fallback; }} />
                      </div>
                    </SwiperSlide>
                  ))}
                </Swiper>

                <div className="custom-swiper-nav">
                  <button
                    className="custom-nav-btn custom-prev"
                    onClick={() => {
                      const swiper = document.querySelector('.product-main-swiper')?.swiper;
                      if (swiper) swiper.slidePrev();
                    }}
                    aria-label="Previous image"
                  >
                    <IoIosArrowRoundBack size={28} />
                  </button>
                  <button
                    className="custom-nav-btn custom-next"
                    onClick={() => {
                      const swiper = document.querySelector('.product-main-swiper')?.swiper;
                      if (swiper) swiper.slideNext();
                    }}
                    aria-label="Next image"
                  >
                    <IoIosArrowRoundForward size={28} />
                  </button>
                </div>
              </>
            ) : (
              <div className="no-image-placeholder"><div className="no-image-icon">🖼️</div><p>No images available</p></div>
            )}
          </div>

          {images.length > 1 && (
            <div className="thumbnail-strip-horizontal">
              <Swiper
                onSwiper={setThumbsSwiper}
                spaceBetween={10}
                slidesPerView={Math.min(5, images.length)}
                freeMode={true}
                watchSlidesProgress={true}
                modules={[Thumbs]}
                className="product-thumbs-swiper"
              >
                {images.map((img, index) => (
                  <SwiperSlide key={index}>
                    <div className="thumb-item">
                      <img src={img} alt={`Thumbnail ${index + 1}`} onError={(e) => { e.target.onerror = null; e.target.src = fallback; }} />
                    </div>
                  </SwiperSlide>
                ))}
              </Swiper>
            </div>
          )}
        </div>
      </div>

      {/* PREMIUM SECTION: Fragrance | Notes | Description | Image */}
      <div className="premium-details-section">
        <div className="details-grid">
          {/* Fragrance Column - BOTTOM SELECTION (Independent, updates notes only) */}
          <div className="details-col fragrance-col">
            <div className="col-header">
              <span className="gold-accent"></span>
              <h3>Fragrances</h3>
            </div>
            <div className="fragrance-sidebar-list">
              {availableFragrances.map((fragrance, idx) => {
                const isSelected = selectedFragranceBottom === fragrance;
                const fragranceStock = fragranceInventory[fragrance];
                const isOutOfStock = fragranceStock?.status === 'out-of-stock';
                return (
                  <div
                    key={idx}
                    className={`sidebar-fragrance-item ${isSelected ? 'selected' : ''}`}
                    onClick={() => handleBottomFragranceSelect(fragrance)}
                  >
                    <span className="fragrance-name-sidebar">{fragrance}</span>
                    {isSelected && <span className="selected-gold-dot"></span>}
                  </div>
                );
              })}
            </div>
          </div>

          {/* Notes Column - Updates based on selected fragrance (from either selection) */}
          <div className="details-col notes-col">
            <div className="col-header">
              <span className="gold-accent"></span>
              <h3>Notes</h3>
            </div>
            {selectedFragranceData ? (
              <div className="notes-content">
                {selectedFragranceData.topNotes && selectedFragranceData.topNotes.length > 0 && (
                  <div className="note-group">
                    <span className="note-category">Top Notes</span>
                    <div className="note-bubbles">
                      {selectedFragranceData.topNotes.map((note, i) => (
                        <span key={i} className="note-bubble">{note}</span>
                      ))}
                    </div>
                  </div>
                )}
                {selectedFragranceData.heartNotes && selectedFragranceData.heartNotes.length > 0 && (
                  <div className="note-group">
                    <span className="note-category">Heart Notes</span>
                    <div className="note-bubbles">
                      {selectedFragranceData.heartNotes.map((note, i) => (
                        <span key={i} className="note-bubble">{note}</span>
                      ))}
                    </div>
                  </div>
                )}
                {selectedFragranceData.baseNotes && selectedFragranceData.baseNotes.length > 0 && (
                  <div className="note-group">
                    <span className="note-category">Base Notes</span>
                    <div className="note-bubbles">
                      {selectedFragranceData.baseNotes.map((note, i) => (
                        <span key={i} className="note-bubble">{note}</span>
                      ))}
                    </div>
                  </div>
                )}
                {selectedFragranceData.notes && selectedFragranceData.notes.length > 0 && (
                  <div className="note-group">
                    <span className="note-category">Fragrance Notes</span>
                    <div className="note-bubbles">
                      {selectedFragranceData.notes.map((note, i) => (
                        <span key={i} className="note-bubble">{note}</span>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            ) : (
              <div className="notes-placeholder">Select a fragrance to view notes</div>
            )}
          </div>

          {/* Description Column - FULL DESCRIPTION */}
          <div className="details-col description-col">
            <div className="col-header">
              <span className="gold-accent"></span>
              <h3>Description</h3>
            </div>
            <div className="full-description">
              {description.split('\n').map((para, idx) => (
                <p key={idx}>{para}</p>
              ))}
            </div>
          </div>

          {/* Image Column */}
          <div className="details-col image-col">
            <div className="col-header">
              <span className="gold-accent"></span>
              <h3>Fragrance Preview</h3>
            </div>
            <div className="premium-image-container">
              {/* Use coverImage first, fallback to first gallery image */}
              {(product.coverImage || images[0]) ? (
                <img
                  src={product.coverImage || images[0]}
                  alt={product.productName}
                  className="premium-product-image"
                />
              ) : (
                <div className="premium-no-image">
                  <span>🖼️</span>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      <section className="related-products-section">
        <RelatedProducts productId={product.productId} currentFragrances={getAvailableFragrances()} categoryId={product.categoryId} />
      </section>



      <>
        <ReviewsSlider />
      </>

      {/* REVIEWS MODAL */}
      {showReviewsModal && (
        <div className="premium-reviews-modal">
          <div className="modal-overlay" onClick={() => setShowReviewsModal(false)}></div>
          <div className="modal-container">
            <div className="modal-header">
              <div className="modal-title-section">
                <h2>Customer Reviews</h2>
                <div className="reviews-summary-badge">
                  <span className="average-rating">{averageRating.toFixed(1)}</span>
                  <span className="total-reviews-count">/5 • {reviewsStats.totalReviews} reviews</span>
                </div>
              </div>
              <button className="modal-close-btn" onClick={() => setShowReviewsModal(false)}>✕</button>
            </div>
            <div className="modal-body">
              <div className="reviews-stats-sidebar">
                <div className="overall-rating-box">
                  <div className="overall-rating-score">{averageRating.toFixed(1)}</div>
                  <div className="overall-rating-stars">{renderRatingStars(averageRating)}</div>
                  <div className="overall-rating-text">Based on {reviewsStats.totalReviews} review{reviewsStats.totalReviews !== 1 ? 's' : ''}</div>
                </div>
                <div className="rating-distribution-chart">
                  <h4>Rating Distribution</h4>
                  {[5, 4, 3, 2, 1].map(star => {
                    const count = reviewsStats.ratingDistribution[star] || 0;
                    const percentage = reviewsStats.totalReviews > 0 ? (count / reviewsStats.totalReviews) * 100 : 0;
                    return (
                      <div key={star} className="distribution-row">
                        <span className="star-label">{star} ★</span>
                        <div className="distribution-bar-container">
                          <div className="distribution-bar-fill" style={{ width: `${percentage}%` }}></div>
                        </div>
                        <span className="distribution-count">{count}</span>
                      </div>
                    );
                  })}
                </div>
              </div>
              <div className="reviews-list-container">
                <div className="reviews-list">
                  {reviewsLoading && reviews.length === 0 ? (
                    <div className="loading-reviews"><div className="loading-spinner"></div><p>Loading reviews...</p></div>
                  ) : reviews.length > 0 ? (
                    reviews.map((review, idx) => {
                      const reviewRating = typeof review.rating === 'number' ? review.rating : parseFloat(review.rating) || 0;
                      return (
                        <div key={idx} className="review-card">
                          <div className="review-header">
                            <div className="reviewer-details">
                              <div className="reviewer-name">{review.userName}</div>
                              <div className="review-meta">
                                <div className="review-stars">{renderRatingStars(reviewRating)}</div>
                                <span className="review-rating">{reviewRating}/5</span>
                                <span className="review-date">{formatDate(review.createdAt)}</span>
                                {review.isVerifiedPurchase && <span className="verified-badge">✅ Verified Purchase</span>}
                              </div>
                            </div>
                          </div>
                          <div className="review-content"><p className="review-text">"{review.reviewText || 'No review text provided'}"</p></div>
                        </div>
                      );
                    })
                  ) : (
                    <div className="no-reviews-message"><div className="no-reviews-icon">⭐</div><h3>No reviews yet</h3><p>Be the first to review this product!</p></div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default ProductPage;