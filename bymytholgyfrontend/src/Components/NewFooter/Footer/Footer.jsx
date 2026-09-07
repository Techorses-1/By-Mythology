import React, { useState, useEffect } from "react";
import { NavLink, useLocation } from "react-router-dom";
import axios from "axios";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { FaInstagram, FaFacebookF, FaPinterestP } from "react-icons/fa";
import { FiArrowRight } from "react-icons/fi";
import "./Footer.scss";
import logo from "../../../assets/logo/logo.png";

const SOCIAL_LINKS = [
    { icon: <FaInstagram />, href: "https://instagram.com", label: "Instagram" },
    { icon: <FaFacebookF />, href: "https://facebook.com", label: "Facebook" },
    { icon: <FaPinterestP />, href: "https://pinterest.com", label: "Pinterest" },
];

const Footer = () => {
    const [email, setEmail] = useState("");
    const [isSubmitting, setIsSubmitting] = useState(false);
    const location = useLocation();

    const handleNewsletterSubmit = async (e) => {
        e.preventDefault();

        if (!email) {
            toast.error("Please enter your email address");
            return;
        }

        const emailRegex = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;
        if (!emailRegex.test(email)) {
            toast.error("Please enter a valid email address");
            return;
        }

        if (isSubmitting) return;

        setIsSubmitting(true);

        try {
            const response = await axios.post(
                `${import.meta.env.VITE_API_URL}/newsletter/subscribe`,
                { email, source: "footer" },
                { timeout: 30000 }
            );

            if (response.data.success) {
                toast.success(response.data.message || "Successfully subscribed! Check your email.");
                setEmail("");
            } else {
                toast.error(response.data.message || "Something went wrong");
            }
        } catch (error) {
            let errorMessage = "Failed to subscribe. Please try again.";

            if (error.response?.data?.message) {
                errorMessage = error.response.data.message;
            } else if (error.code === "ECONNABORTED") {
                errorMessage = "Request timed out. Please check your connection.";
            } else if (!navigator.onLine) {
                errorMessage = "You appear to be offline. Please check your internet connection.";
            }

            toast.error(errorMessage);
        } finally {
            setIsSubmitting(false);
        }
    };

    // Function to scroll to section
    const scrollToSection = (sectionId) => {
        const element = document.getElementById(sectionId);
        if (element) {
            setTimeout(() => {
                element.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
            }, 100);
        }
    };

    // Effect to handle scroll when location changes (hash in URL)
    useEffect(() => {
        if (location.pathname === '/about' && location.hash) {
            const targetId = location.hash.substring(1);
            scrollToSection(targetId);
        }
    }, [location]);

    return (
        <footer className="site-footer">
            {/* REMOVED ToastContainer from here - use one in App or main layout */}

            <div className="site-footer__inner">

                {/* ── Col 1: Logo + tagline ─────────────────────────────────────── */}
                <div className="site-footer__brand">
                    <NavLink to="/" className="site-footer__logo-link">
                        <img src={logo} alt="Bymythology" className="site-footer__logo-img" />
                    </NavLink>
                    <p className="site-footer__tagline">
                        Illuminating ancient stories.<br />
                        Inspiring modern souls.
                    </p>
                </div>

                {/* ── Col 2: Pages ──────────────────────────────────────────────── */}
                <div className="site-footer__col">
                    <h4 className="site-footer__col-heading">Pages</h4>
                    <ul className="site-footer__col-list">
                        <li><NavLink to="/" className="site-footer__col-link">Home</NavLink></li>
                        <li><NavLink to="/collection" className="site-footer__col-link">Collection</NavLink></li>
                        <li><NavLink to="/the-journey" className="site-footer__col-link">Journey</NavLink></li>
                        <li><NavLink to="/contact" className="site-footer__col-link">Contact</NavLink></li>
                    </ul>
                </div>

                {/* ── Col 3: About with Anchor Links ──────────────────────────────── */}
                <div className="site-footer__col">
                    <h4 className="site-footer__col-heading">About</h4>
                    <ul className="site-footer__col-list">
                        <li>
                            <NavLink to="/about#our-story" className="site-footer__col-link">
                                Our Story
                            </NavLink>
                        </li>
                        <li>
                            <NavLink to="/about#making" className="site-footer__col-link">
                                Making
                            </NavLink>
                        </li>
                        <li>
                            <NavLink to="/about#our-promise" className="site-footer__col-link">
                                Our Promise
                            </NavLink>
                        </li>
                    </ul>
                </div>

                {/* ── Col 4: Newsletter ──────────────────────────────────────────── */}
                <div className="site-footer__newsletter">
                    <h4 className="site-footer__col-heading">Newsletter</h4>
                    <p className="site-footer__newsletter-text">
                        Subscribe to receive updates on new chapters, exclusive offers and more.
                    </p>
                    <form className="site-footer__newsletter-form" onSubmit={handleNewsletterSubmit}>
                        <div className="site-footer__newsletter-wrapper">
                            <input
                                type="email"
                                className="site-footer__newsletter-input"
                                placeholder="Your email address"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                disabled={isSubmitting}
                                required
                            />
                            <button
                                type="submit"
                                className={`site-footer__newsletter-btn ${isSubmitting ? 'submitting' : ''}`}
                                disabled={isSubmitting}
                            >
                                {isSubmitting ? (
                                    <span className="spinner"></span>
                                ) : (
                                    <FiArrowRight />
                                )}
                            </button>
                        </div>
                    </form>

                    {/* Social Icons inside Newsletter column */}
                    <div className="site-footer__social">
                        <div className="site-footer__social-icons">
                            {SOCIAL_LINKS.map((s) => (
                                <a
                                    key={s.label}
                                    href={s.href}
                                    className="site-footer__social-btn"
                                    aria-label={s.label}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                >
                                    {s.icon}
                                </a>
                            ))}
                        </div>
                    </div>
                </div>

            </div>

            {/* ── Bottom bar ──────────────────────────────────────────────────── */}
            <div className="site-footer__bottom">
                <div className="site-footer__bottom-content">
                    <p className="site-footer__copy">
                        © {new Date().getFullYear()} Bymythology. All rights reserved.
                    </p>
                    <p className="site-footer__credit">
                        Design and Developed By
                        <a href="https://techorses.com" target="_blank" rel="noopener noreferrer" className="site-footer__credit-link">
                            Techorses
                        </a>
                    </p>
                </div>
            </div>
        </footer>
    );
};

export default Footer;