import React, { useState } from "react";
import { BrowserRouter as Router, Routes, Route, useLocation } from "react-router-dom";

import "./App.css";
import Home from "./Pages/Home/Home";
import Navbar from "./Components/NewNavbar/Navbar/Navbar";
// import Navbar from "./Components/Navbar/Navbar";
import Login from "./Components/Login/Login";
import Register from "./Components/Register/Register";
import AdminDashboard from "./Pages/AdminPanel/AdminDashboard/AdminDashboard";
import AdminLayout from "./Pages/AdminPanel/AdminLayout/AdminLayout";
import AdminCategories from "./Pages/AdminPanel/Categories/AdminCategories";
import ListProducts from "./Pages/AdminPanel/ListProducts/ListProducts";
import Inventories from "./Pages/AdminPanel/Inventory/Inventories";
import ProductOffers from "./Pages/AdminPanel/ProductOffers/ProductOffers";
import ProductPage from "./Pages/ProductPage/ProductPage";
import NotFound from "./Pages/NoPage/NotFound";
import Wishlist from "./Pages/Wishlist/Wishlist";
import Profile from "./Pages/Profile/Profile/Profile";
import Checkout from "./Pages/CheckOut/Checkout";
import UserOrders from "./Pages/Profile/UserOrders/UserOrders";
import AdminOrders from "./Pages/AdminPanel/AdminOrders/AdminOrders";
import UserReviews from "./Pages/Profile/UserReviews/UserReviews";
import Footer from "./Components/NewFooter/Footer/Footer";
import ScrollToTop from "./Components/GoToTop/ScrollToTop";
import Cart from "./Pages/Cart/Cart";
import AdminAuth from "./Pages/AdminAuth/AdminAuth";
import RamayanNavbar from "./Components/SeriesNavbar/RamayanNav/RamayanNavbar";
import Dummy from "./Pages/Dummy/Dummy";
import Home2 from "./Pages/Home2/Home2";
import Collection from "./Pages/Collection/Collection";
import About from "./Pages/About/About";
import AuthPage from "./Components/Authentication/AuthPage";
import Contact from "./Pages/Contact/Contact";
import Journey from "./Pages/Journey/Journey";
import ComingSoon from "./Components/ComingSoon/ComingSoon";

// ✅ COMING SOON MODE - Set to true to show coming soon page for all routes
const IS_COMING_SOON = false; // Change to false when ready to launch

// ✅ Admin routes that should still work even in coming soon mode
const ADMIN_ROUTES = ['/adminlogin', '/admin/dashboard', '/admin/categories', '/admin/products', '/admin/inventories', '/admin/productoffers', '/admin/orders'];

function AppContent() {
  const location = useLocation();
  const [showValmiki, setShowValmiki] = useState(false);
  const [isModelOpen, setIsModelOpen] = useState(false);

  const showRamayanNav = location.pathname === "/";

  // Hide Navbar & Footer on Dummy page
  const hideLayout = location.pathname === "/dummy";

  // Hide Navbar & Footer on ALL admin pages
  const isAdminRoute = location.pathname.startsWith("/admin");

  // ✅ Check if current route is admin route that should bypass coming soon
  const isAllowedRoute = ADMIN_ROUTES.includes(location.pathname);

  // ✅ If coming soon mode is ON and not an allowed route, show Coming Soon page
  if (IS_COMING_SOON && !isAllowedRoute) {
    return (
      <>
        <ScrollToTop />
        <ComingSoon />
      </>
    );
  }

  return (
    <>
      <ScrollToTop />

      {/* Only show Navbar if NOT on admin routes AND NOT on dummy page */}
      {!hideLayout && !isAdminRoute && (
        <>
          <Navbar />
        </>
      )}

      <Routes>
        <Route path="/extra" element={<Home />} />
        <Route path="/" element={<Home2 />} />
        {/* <Route path="/" element={<ComingSoon />} /> */}

        <Route path="/the-journey" element={<Journey />} />
        <Route path="/contact" element={<Contact />} />
        <Route path="/dummy" element={<Dummy />} />
        <Route path="/login" element={<AuthPage />} />
        <Route path="/collection" element={<Collection />} />
        <Route path="/about" element={<About />} />
        <Route path="/register" element={<Register />} />
        <Route path="/adminlogin" element={<AdminAuth />} />
        <Route path="/product/:productName" element={<ProductPage />} />
        <Route path="*" element={<NotFound />} />
        <Route path="/wishlist" element={<Wishlist />} />
        <Route path="/cart" element={<Cart />} />
        <Route path="/profile" element={<Profile />} />
        <Route path="/checkout" element={<Checkout />} />
        <Route path="/orders" element={<UserOrders />} />
        <Route path="/my-reviews" element={<UserReviews />} />

        {/* ✅ ALL Admin routes wrapped with AdminLayout */}
        <Route
          path="/admin/dashboard"
          element={
            <AdminLayout>
              <AdminDashboard />
            </AdminLayout>
          }
        />

        <Route
          path="/admin/categories"
          element={
            <AdminLayout>
              <AdminCategories />
            </AdminLayout>
          }
        />

        <Route
          path="/admin/products"
          element={

            <ListProducts />

          }
        />

        <Route
          path="/admin/inventories"
          element={
            <AdminLayout>
              <Inventories />
            </AdminLayout>
          }
        />

        <Route
          path="/admin/productoffers"
          element={
            <AdminLayout>
              <ProductOffers />
            </AdminLayout>
          }
        />

        <Route
          path="/admin/orders"
          element={
            <AdminLayout>
              <AdminOrders />
            </AdminLayout>
          }
        />
      </Routes>

      {/* Only show Footer if NOT on admin routes AND NOT on dummy page */}
      {!hideLayout && !isAdminRoute && <Footer />}
    </>
  );
}

function App() {
  return (
    <Router>
      <AppContent />
    </Router>
  );
}

export default App;
