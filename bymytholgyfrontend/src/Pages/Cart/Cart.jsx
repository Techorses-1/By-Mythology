import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import "./Cart.scss";
import { FiShoppingBag } from "react-icons/fi";
import { FaTrashAlt } from "react-icons/fa";
import { IoIosRemove, IoIosAdd } from "react-icons/io";

const Cart = () => {
  const [cartItems, setCartItems] = useState([]);
  const [cartSummary, setCartSummary] = useState({
    totalItems: 0,
    subtotal: 0,
    originalSubtotal: 0,
    totalSavings: 0,
    shipping: 0,
    tax: 0,
    total: 0
  });
  const [loading, setLoading] = useState(false);
  const [updatingItemId, setUpdatingItemId] = useState(null);
  const [removingItemId, setRemovingItemId] = useState(null);
  const [isDesktop, setIsDesktop] = useState(window.innerWidth > 1024);
  const [inventoryStatus, setInventoryStatus] = useState({}); // Store stock per item
  const [stockError, setStockError] = useState(null);

  const token = localStorage.getItem("token");
  const userId = localStorage.getItem("userId");
  const navigate = useNavigate();

  // Listen for window resize
  useEffect(() => {
    const handleResize = () => {
      setIsDesktop(window.innerWidth > 1024);
    };
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const createProductSlug = (productName) => {
    return productName
      .toLowerCase()
      .replace(/[^\w\s]/g, '')
      .replace(/\s+/g, '-');
  };

  // Fetch inventory for a specific product and fragrance
  const fetchInventoryForItem = async (productId, fragrance, colorId) => {
    try {
      const params = new URLSearchParams();
      if (colorId) params.append('colorId', colorId);
      if (fragrance) params.append('fragrance', fragrance);

      const response = await axios.get(
        `${import.meta.env.VITE_API_URL}/inventory/product/${productId}/status?${params.toString()}`
      );
      return {
        stock: response.data.stock,
        threshold: response.data.threshold,
        status: response.data.status
      };
    } catch (error) {
      console.error('Error fetching inventory:', error);
      return { stock: 99, threshold: 10, status: 'in-stock' };
    }
  };

  // Fetch inventory for all cart items
  const fetchAllInventoryStatus = async (items) => {
    const statusMap = {};
    for (const item of items) {
      const colorId = item.selectedColor?.colorId;
      const fragrance = item.selectedFragrance;
      const inventory = await fetchInventoryForItem(item.productId, fragrance, colorId);
      statusMap[item._id] = inventory;
    }
    setInventoryStatus(statusMap);
    return statusMap;
  };

  useEffect(() => {
    if (token && userId) fetchCart();
  }, [token, userId]);

  useEffect(() => {
    const handleCartUpdate = () => {
      if (token && userId) fetchCart();
    };
    window.addEventListener("cartUpdated", handleCartUpdate);
    return () => window.removeEventListener("cartUpdated", handleCartUpdate);
  }, [token, userId]);

  const fetchCart = async () => {
    try {
      setLoading(true);
      const res = await axios.get(
        `${import.meta.env.VITE_API_URL}/cart/${userId}`,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      const items = res.data.cartItems || [];
      setCartItems(items);
      calculateSummary(items, res.data.summary);

      // Fetch inventory for each item
      await fetchAllInventoryStatus(items);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const calculateSummary = (items, apiSummary) => {
    const subtotal = items.reduce((sum, i) => sum + i.totalPrice, 0);
    const originalSubtotal = items.reduce((sum, i) => sum + (i.unitPrice * i.quantity), 0);
    const totalSavings = items.reduce((sum, i) => {
      if (i.hasOffer) {
        const originalItemTotal = i.unitPrice * i.quantity;
        const discountedItemTotal = i.finalPrice * i.quantity;
        return sum + (originalItemTotal - discountedItemTotal);
      }
      return sum;
    }, 0);
    const shipping = subtotal > 1000 ? 0 : 120;
    const tax = subtotal * 0.18;
    const total = subtotal + shipping + tax;

    setCartSummary({
      totalItems: items.reduce((s, i) => s + i.quantity, 0),
      subtotal,
      originalSubtotal,
      totalSavings,
      shipping,
      tax,
      total
    });
  };

  const updateQuantity = async (itemId, newQty, maxStock) => {
    if (!token) return;

    // Check if new quantity exceeds available stock
    if (newQty > maxStock) {
      setStockError(`Only ${maxStock} items available in stock`);
      setTimeout(() => setStockError(null), 3000);
      return;
    }

    if (newQty < 1) return;

    setUpdatingItemId(itemId);
    try {
      await axios.put(
        `${import.meta.env.VITE_API_URL}/cart/update/${itemId}`,
        { quantity: newQty, userId },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      // Refresh cart to get updated data
      await fetchCart();
      window.dispatchEvent(new Event("cartUpdated"));
    } catch (err) {
      console.error(err);
      if (err.response?.data?.message?.includes("stock")) {
        setStockError(err.response.data.message);
        setTimeout(() => setStockError(null), 3000);
      }
    } finally {
      setUpdatingItemId(null);
    }
  };

  const removeItem = async (itemId) => {
    if (!token) return;
    setRemovingItemId(itemId);
    try {
      await axios.delete(
        `${import.meta.env.VITE_API_URL}/cart/remove/${itemId}`,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      await fetchCart(); // Refresh cart
      window.dispatchEvent(new Event("cartUpdated"));
    } catch (err) {
      console.error(err);
    } finally {
      setRemovingItemId(null);
    }
  };

  const proceedToCheckout = () => {
    if (cartItems.length === 0) return;
    const checkoutCartData = {
      items: cartItems.map((item) => ({
        _id: item._id,
        productId: item.productId,
        productName: item.productName,
        quantity: item.quantity,
        unitPrice: item.unitPrice,
        finalPrice: item.finalPrice,
        totalPrice: item.totalPrice,
        selectedModel: item.selectedModel || null,
        selectedColor: item.selectedColor || null,
        selectedFragrance: item.selectedFragrance || null,
        selectedSize: item.selectedSize || null,
        hasOffer: item.hasOffer || false,
        offerDetails: item.offerDetails || null,
        thumbnailImage: item.selectedColor?.images?.[0] || item.thumbnailImage || null
      })),
      summary: { ...cartSummary },
      userId,
      totalItems: cartSummary.totalItems,
      grandTotal: cartSummary.total
    };
    navigate("/checkout", { state: { cartMode: true, cartData: checkoutCartData } });
  };

  const summaryCard = (
    <div className="cart-summary-card">
      <h2>ORDER SUMMARY</h2>
      {stockError && <div className="cart-stock-error">{stockError}</div>}
      <div className="cart-summary-row">
        <span>Subtotal</span>
        <span>₹{cartSummary.subtotal}</span>
      </div>
      <div className="cart-summary-row">
        <span>Shipping</span>
        <span>{cartSummary.shipping === 0 ? "FREE" : `₹${cartSummary.shipping}`}</span>
      </div>
      <div className="cart-summary-row">
        <span>Tax (18%)</span>
        <span>₹{cartSummary.tax}</span>
      </div>
      <div className="cart-summary-row total">
        <span>Estimated Total</span>
        <span>₹{cartSummary.total}</span>
      </div>
      <button className="cart-checkout-btn" onClick={proceedToCheckout}>
        CHECKOUT
      </button>
    </div>
  );

  const CartItemCard = ({ item }) => {
    const hasDiscount = item.unitPrice && item.unitPrice > item.finalPrice;
    const discountPercentage = hasDiscount ? Math.round(((item.unitPrice - item.finalPrice) / item.unitPrice) * 100) : 0;
    const isUpdating = updatingItemId === item._id;
    const isRemoving = removingItemId === item._id;

    // Get inventory for this item
    const inventory = inventoryStatus[item._id];
    const maxStock = inventory?.stock || 99;
    const isOutOfStock = inventory?.status === 'out-of-stock';
    const currentQty = item.quantity;
    const canIncrease = currentQty < maxStock && !isOutOfStock;
    const canDecrease = currentQty > 1;

    return (
      <div className={`cart-item-card ${isOutOfStock ? 'out-of-stock-item' : ''}`}>
        <div className="cart-item-img-wrap">
          <img
            src={item.selectedColor?.images?.[0] || item.thumbnailImage}
            alt={item.productName}
            onClick={() => {
              const urlSlug = createProductSlug(item.productName);
              navigate(`/product/${urlSlug}`, {
                state: {
                  productId: item.productId,
                  ...(item.selectedModel && { modelId: item.selectedModel.modelId }),
                  ...(item.selectedColor && { colorId: item.selectedColor.colorId }),
                  ...(item.selectedFragrance && { fragrance: item.selectedFragrance }),
                  ...(item.selectedSize && { size: item.selectedSize })
                }
              });
            }}
          />
        </div>
        <div className="cart-item-info">
          <h3>{item.productName}</h3>
          {/* FRAGRANCE HIDDEN - Commented out */}
          {/* {item.selectedFragrance && (
            <p className="cart-item-fragrance">Fragrance : {item.selectedFragrance}</p>
          )} */}

          {/* Stock warning if low */}
          {inventory?.status === 'low-stock' && (
            <p className="cart-stock-warning">Only {maxStock} left in stock!</p>
          )}
          {isOutOfStock && (
            <p className="cart-stock-error-msg">Out of Stock - Please remove item</p>
          )}

          {/* QTY BEFORE PRICING */}
          <div className="cart-item-qty">
            <button
              onClick={() => updateQuantity(item._id, currentQty - 1, maxStock)}
              disabled={isUpdating || !canDecrease || isOutOfStock}
            >
              {isUpdating ? <span className="cart-qty-spinner"></span> : <IoIosRemove />}
            </button>
            <span>{currentQty}</span>
            <button
              onClick={() => updateQuantity(item._id, currentQty + 1, maxStock)}
              disabled={isUpdating || !canIncrease || isOutOfStock}
            >
              {isUpdating ? <span className="cart-qty-spinner"></span> : <IoIosAdd />}
            </button>
          </div>

          {/* PRICING AFTER QTY */}
          <div className="cart-item-prices">
            <span className="cart-current-price">₹{item.finalPrice}</span>
            {item.unitPrice && item.unitPrice > item.finalPrice && (
              <>
                <span className="cart-original-price">₹{item.unitPrice}</span>
                {discountPercentage > 0 && (
                  <span className="cart-discount-badge">{discountPercentage}% OFF</span>
                )}
              </>
            )}
          </div>
        </div>
        <button className="cart-item-remove" onClick={() => removeItem(item._id)} disabled={isRemoving}>
          {isRemoving ? <span className="cart-remove-spinner"></span> : <FaTrashAlt />}
        </button>
      </div>
    );
  };

  // ============================================
  // DESKTOP LAYOUT: Summary in column 5 of first row
  // ============================================
  const renderDesktopLayout = () => {
    const items = [...cartItems];
    const firstRowProducts = items.slice(0, 4);
    const remainingProducts = items.slice(4);
    const emptySlots = 4 - firstRowProducts.length;

    return (
      <>
        <div className="cart-products-grid">
          {firstRowProducts.map((item) => (
            <CartItemCard key={item._id} item={item} />
          ))}
          {[...Array(emptySlots)].map((_, idx) => (
            <div key={`empty-${idx}`} className="cart-empty-placeholder"></div>
          ))}
          <div className="cart-summary-col">{summaryCard}</div>
        </div>
        {remainingProducts.length > 0 && (
          <div className="cart-products-grid">
            {remainingProducts.map((item) => (
              <CartItemCard key={item._id} item={item} />
            ))}
          </div>
        )}
      </>
    );
  };

  // ============================================
  // TABLET & MOBILE LAYOUT: Products first, then Summary AFTER
  // ============================================
  const renderMobileLayout = () => (
    <>
      <div className="cart-products-grid">
        {cartItems.map((item) => (
          <CartItemCard key={item._id} item={item} />
        ))}
      </div>
      <div className="cart-summary-mobile">{summaryCard}</div>
    </>
  );

  if (loading && cartItems.length === 0) {
    return (
      <div className="cart-page">
        <div className="cart-loading-container">
          <div className="cart-loading-spinner"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="cart-page">
      <div className="cart-container">
        <div className="cart-header">
          <h1>My Bag</h1>
        </div>

        {cartItems.length === 0 ? (
          <div className="cart-empty-container">
            <div className="cart-empty-icon"><FiShoppingBag size={80} /></div>
            <h2>Your bag is empty</h2>
            <p className="cart-empty-message">Looks like you haven't added any items to your bag yet.</p>
            <button className="cart-empty-btn" onClick={() => navigate('/')}>Continue Shopping</button>
          </div>
        ) : (
          <div className="cart-content">
            {isDesktop ? renderDesktopLayout() : renderMobileLayout()}
          </div>
        )}
      </div>
    </div>
  );
};

export default Cart;