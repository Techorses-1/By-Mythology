import React, { useState, useEffect, useRef } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import { GoSearch } from "react-icons/go";
import { BsHandbag, BsHeart, BsPerson } from "react-icons/bs";
import { RxHamburgerMenu } from "react-icons/rx";
import { IoCloseOutline } from "react-icons/io5";
import axios from "axios";
import "./Navbar.scss";
import logo from "../../../assets/logo/logo.png";
import SearchModal from "../../SearchModel/SearchModal";

const NAV_LINKS = [
    { label: "Home", to: "/" },
    { label: "Collection", to: "/collection" },
    { label: "The Journey", to: "/the-journey" },
    { label: "About", to: "/about" },
    // { label: "Journal", to: "/journal" },
    { label: "Contact", to: "/contact" },
];

const Navbar = () => {
    const navigate = useNavigate();
    const [menuOpen, setMenuOpen] = useState(false);
    const [scrolled, setScrolled] = useState(false);
    const [wishlistCount, setWishlistCount] = useState(0);
    const [cartCount, setCartCount] = useState(0);
    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const [isSearchOpen, setIsSearchOpen] = useState(false);
    const menuRef = useRef(null);

    // Check login status
    useEffect(() => {
        const token = localStorage.getItem("token");
        setIsLoggedIn(!!token);
    }, []);

    // Fetch counts when logged in
    useEffect(() => {
        const fetchCounts = async () => {
            const token = localStorage.getItem("token");
            const userId = localStorage.getItem("userId");
            if (!token || !userId) return;

            try {
                const [wishRes, cartRes] = await Promise.all([
                    axios.get(`${import.meta.env.VITE_API_URL}/wishlist/count?userId=${userId}`, {
                        headers: { Authorization: `Bearer ${token}` }
                    }),
                    axios.get(`${import.meta.env.VITE_API_URL}/cart/${userId}`, {
                        headers: { Authorization: `Bearer ${token}` }
                    })
                ]);
                setWishlistCount(wishRes.data.count || 0);
                setCartCount(cartRes.data.cartItems?.reduce((sum, item) => sum + item.quantity, 0) || 0);
            } catch (error) {
                console.error("Error fetching counts:", error);
            }
        };

        if (isLoggedIn) {
            fetchCounts();
        } else {
            setWishlistCount(0);
            setCartCount(0);
        }

        window.addEventListener("wishlistUpdated", fetchCounts);
        window.addEventListener("cartUpdated", fetchCounts);
        return () => {
            window.removeEventListener("wishlistUpdated", fetchCounts);
            window.removeEventListener("cartUpdated", fetchCounts);
        };
    }, [isLoggedIn]);

    // Scroll effect
    useEffect(() => {
        const handleScroll = () => setScrolled(window.scrollY > 60);
        window.addEventListener("scroll", handleScroll, { passive: true });
        return () => window.removeEventListener("scroll", handleScroll);
    }, []);

    // Close menu on outside click
    useEffect(() => {
        if (!menuOpen) return;
        const handleOutside = (e) => {
            if (menuRef.current && !menuRef.current.contains(e.target)) {
                setMenuOpen(false);
            }
        };
        document.addEventListener("mousedown", handleOutside);
        return () => document.removeEventListener("mousedown", handleOutside);
    }, [menuOpen]);

    // Lock body scroll when mobile menu open
    useEffect(() => {
        document.body.style.overflow = menuOpen ? "hidden" : "";
        return () => { document.body.style.overflow = ""; };
    }, [menuOpen]);

    const closeMenu = () => setMenuOpen(false);

    const handleWishlistClick = () => {
        const token = localStorage.getItem("token");
        if (!token) {
            navigate("/login");
            return;
        }
        navigate("/wishlist");
        if (menuOpen) closeMenu();
    };

    const handleCartClick = () => {
        const token = localStorage.getItem("token");
        if (!token) {
            navigate("/login");
            return;
        }
        navigate("/cart");
        if (menuOpen) closeMenu();
    };

    const handleUserClick = () => {
        const token = localStorage.getItem("token");
        if (!token) {
            navigate("/login");
        } else {
            navigate("/profile");
        }
        if (menuOpen) closeMenu();
    };

    const handleSearchClick = () => {
        setIsSearchOpen(true);
        if (menuOpen) closeMenu();
    };

    return (
        <>
            {/* Search Modal */}
            <SearchModal isOpen={isSearchOpen} onClose={() => setIsSearchOpen(false)} />

            <header
                className={`navbar${scrolled ? " navbar--scrolled" : ""}${menuOpen ? " navbar--open" : ""}`}
                ref={menuRef}
            >
                <div className="navbar__inner">

                    {/* Logo */}
                    <NavLink to="/" className="navbar__logo" onClick={closeMenu}>
                        <img src={logo} alt="Ramayana Scented Candles" className="navbar__logo-img" />
                    </NavLink>

                    {/* Desktop Nav Links */}
                    <nav className="navbar__links" aria-label="Main navigation">
                        {NAV_LINKS.map((link) => (
                            <NavLink
                                key={link.to}
                                to={link.to}
                                end={link.to === "/"}
                                className={({ isActive }) =>
                                    `navbar__link${isActive ? " navbar__link--active" : ""}`
                                }
                            >
                                {link.label}
                            </NavLink>
                        ))}
                    </nav>

                    {/* Right Icons */}
                    <div className="navbar__actions">
                        {/* Search Button - Opens Modal */}
                        <button
                            className="navbar__action-btn"
                            aria-label="Search"
                            onClick={handleSearchClick}
                            type="button"
                        >
                            <GoSearch />
                        </button>

                        {/* Wishlist Button */}
                        <button
                            className="navbar__action-btn navbar__action-btn--wishlist"
                            aria-label="Wishlist"
                            onClick={handleWishlistClick}
                            type="button"
                        >
                            <BsHeart />
                            {isLoggedIn && wishlistCount > 0 && (
                                <span className="navbar__wishlist-badge">{wishlistCount}</span>
                            )}
                        </button>

                        {/* Cart Button */}
                        <button
                            className="navbar__action-btn navbar__action-btn--cart"
                            aria-label="Cart"
                            onClick={handleCartClick}
                            type="button"
                        >
                            <BsHandbag />
                            {isLoggedIn && cartCount > 0 && (
                                <span className="navbar__cart-badge">{cartCount}</span>
                            )}
                        </button>

                        {/* User/Profile Button */}
                        <button
                            className="navbar__action-btn navbar__action-btn--user"
                            aria-label="Profile"
                            onClick={handleUserClick}
                            type="button"
                        >
                            <BsPerson />
                        </button>

                        {/* Hamburger (mobile/tablet only) */}
                        <button
                            className="navbar__hamburger"
                            aria-label={menuOpen ? "Close menu" : "Open menu"}
                            aria-expanded={menuOpen}
                            onClick={() => setMenuOpen((prev) => !prev)}
                            type="button"
                        >
                            {menuOpen ? <IoCloseOutline /> : <RxHamburgerMenu />}
                        </button>
                    </div>
                </div>

                {/* Mobile / Tablet Dropdown Menu */}
                <nav
                    className={`navbar__mobile-menu${menuOpen ? " navbar__mobile-menu--open" : ""}`}
                    aria-label="Mobile navigation"
                >
                    <ul className="navbar__mobile-list">
                        {NAV_LINKS.map((link) => (
                            <li key={link.to} className="navbar__mobile-item">
                                <NavLink
                                    to={link.to}
                                    end={link.to === "/"}
                                    className={({ isActive }) =>
                                        `navbar__mobile-link${isActive ? " navbar__mobile-link--active" : ""}`
                                    }
                                    onClick={closeMenu}
                                >
                                    {link.label}
                                </NavLink>
                            </li>
                        ))}
                    </ul>

                    {/* Ornament divider */}
                    <div className="navbar__mobile-ornament">
                        <span className="navbar__mobile-ornament-line" />
                        <svg viewBox="0 0 20 10" className="navbar__mobile-ornament-diamond">
                            <polygon points="10,0 20,5 10,10 0,5" fill="#c9a84c" />
                        </svg>
                        <span className="navbar__mobile-ornament-line" />
                    </div>

                    {/* Mobile Action Icons - ICONS ONLY */}
                    <div className="navbar__mobile-actions-icons">
                        <button
                            className="navbar__mobile-icon-btn"
                            onClick={handleSearchClick}
                            aria-label="Search"
                        >
                            <GoSearch />
                        </button>
                        <button
                            className="navbar__mobile-icon-btn"
                            onClick={handleWishlistClick}
                            aria-label="Wishlist"
                        >
                            <BsHeart />
                            {isLoggedIn && wishlistCount > 0 && (
                                <span className="navbar__mobile-badge">{wishlistCount}</span>
                            )}
                        </button>
                        <button
                            className="navbar__mobile-icon-btn"
                            onClick={handleCartClick}
                            aria-label="Cart"
                        >
                            <BsHandbag />
                            {isLoggedIn && cartCount > 0 && (
                                <span className="navbar__mobile-badge">{cartCount}</span>
                            )}
                        </button>
                        <button
                            className="navbar__mobile-icon-btn"
                            onClick={handleUserClick}
                            aria-label="Profile"
                        >
                            <BsPerson />
                        </button>
                    </div>
                </nav>
            </header>

            {/* Backdrop for mobile menu */}
            {menuOpen && (
                <div
                    className="navbar__backdrop"
                    onClick={closeMenu}
                    aria-hidden="true"
                />
            )}
        </>
    );
};

export default Navbar;