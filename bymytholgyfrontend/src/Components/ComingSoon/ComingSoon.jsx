import React, { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import './ComingSoon.scss';
import logo from '../../assets/images/logo/footer-logo.png';
import { FiMail, FiArrowRight, FiSend } from 'react-icons/fi';
import { FaInstagram, FaFacebookF, FaPinterestP, FaYoutube } from 'react-icons/fa';

const ComingSoon = () => {
    const [email, setEmail] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [days, setDays] = useState(0);
    const [hours, setHours] = useState(0);
    const [minutes, setMinutes] = useState(0);
    const [seconds, setSeconds] = useState(0);
    const heroRef = useRef(null);

    // Launch date - set your target date here
    const launchDate = new Date('2026-07-15T00:00:00').getTime();

    useEffect(() => {
        // Hero animation
        const observer = new IntersectionObserver(
            ([entry]) => {
                if (entry.isIntersecting) {
                    heroRef.current?.classList.add('coming-soon--visible');
                    observer.disconnect();
                }
            },
            { threshold: 0.1 }
        );

        if (heroRef.current) observer.observe(heroRef.current);
        return () => observer.disconnect();
    }, []);

    useEffect(() => {
        const timer = setInterval(() => {
            const now = new Date().getTime();
            const distance = launchDate - now;

            if (distance < 0) {
                clearInterval(timer);
                setDays(0);
                setHours(0);
                setMinutes(0);
                setSeconds(0);
            } else {
                setDays(Math.floor(distance / (1000 * 60 * 60 * 24)));
                setHours(Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)));
                setMinutes(Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60)));
                setSeconds(Math.floor((distance % (1000 * 60)) / 1000));
            }
        }, 1000);

        return () => clearInterval(timer);
    }, [launchDate]);

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
                { email, source: "coming-soon" },
                { timeout: 30000 }
            );

            if (response.data.success) {
                toast.success(response.data.message || "Successfully subscribed! We'll notify you.");
                setEmail("");
            } else {
                toast.error(response.data.message || "Something went wrong");
            }
        } catch (error) {
            let errorMessage = "Failed to subscribe. Please try again.";
            if (error.response?.data?.message) {
                errorMessage = error.response.data.message;
            }
            toast.error(errorMessage);
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div className="coming-soon" ref={heroRef}>
            <ToastContainer
                position="top-right"
                autoClose={4000}
                hideProgressBar={false}
                newestOnTop={true}
                closeOnClick={true}
                rtl={false}
                pauseOnFocusLoss={false}
                draggable={true}
                pauseOnHover={true}
                theme="dark"
                style={{ zIndex: 9999 }}
                toastStyle={{
                    background: '#0f0f0f',
                    color: '#f5f0e8',
                    border: '1px solid #c9a84c',
                    borderRadius: '10px',
                }}
            />

            {/* Background Elements */}
            <div className="coming-soon__bg">
                <div className="coming-soon__bg-gradient"></div>
                <div className="coming-soon__bg-mandala"></div>
                <div className="coming-soon__bg-particles">
                    {Array.from({ length: 30 }).map((_, i) => (
                        <span key={i} className="coming-soon__particle"></span>
                    ))}
                </div>
            </div>

            {/* Navigation */}
            {/* <nav className="coming-soon__nav">
                <Link to="/" className="coming-soon__logo">
                    <img src={logo} alt="Bymythology" />
                </Link>
                <div className="coming-soon__nav-links">
                    <Link to="/collection" className="coming-soon__nav-link">Collection</Link>
                    <Link to="/the-journey" className="coming-soon__nav-link">Journey</Link>
                    <Link to="/contact" className="coming-soon__nav-link">Contact</Link>
                </div>
            </nav> */}

            {/* Main Content */}
            <div className="coming-soon__content">
                <div className="coming-soon__header">
                    <div className="coming-soon__eyebrow">
                        <span className="coming-soon__dash"></span>
                        Coming Soon
                        <span className="coming-soon__dash"></span>
                    </div>
                    <h1 className="coming-soon__title">
                        <span>Something</span>
                        <span className="gold">Sacred</span>
                        <span>is Coming</span>
                    </h1>
                    <div className="coming-soon__ornament">
                        <span className="coming-soon__ornament-line"></span>
                        <svg width="14" height="8" viewBox="0 0 14 8">
                            <polygon points="7,0 14,4 7,8 0,4" fill="#c9a84c" />
                        </svg>
                        <span className="coming-soon__ornament-line"></span>
                    </div>
                    <p className="coming-soon__desc">
                        We're crafting a sacred experience inspired by ancient epics.<br />
                        Join our inner circle to be the first to know when we launch.
                    </p>
                </div>

                {/* Countdown Timer */}
                <div className="coming-soon__timer">
                    <div className="coming-soon__timer-block">
                        <span className="coming-soon__timer-number">{String(days).padStart(2, '0')}</span>
                        <span className="coming-soon__timer-label">Days</span>
                    </div>
                    <span className="coming-soon__timer-sep">:</span>
                    <div className="coming-soon__timer-block">
                        <span className="coming-soon__timer-number">{String(hours).padStart(2, '0')}</span>
                        <span className="coming-soon__timer-label">Hours</span>
                    </div>
                    <span className="coming-soon__timer-sep">:</span>
                    <div className="coming-soon__timer-block">
                        <span className="coming-soon__timer-number">{String(minutes).padStart(2, '0')}</span>
                        <span className="coming-soon__timer-label">Minutes</span>
                    </div>
                    <span className="coming-soon__timer-sep">:</span>
                    <div className="coming-soon__timer-block">
                        <span className="coming-soon__timer-number">{String(seconds).padStart(2, '0')}</span>
                        <span className="coming-soon__timer-label">Seconds</span>
                    </div>
                </div>

                {/* Newsletter Form */}
                <div className="coming-soon__form-wrapper">
                    <p className="coming-soon__form-label">Get notified when we launch</p>
                    <form className="coming-soon__form" onSubmit={handleNewsletterSubmit}>
                        <div className="coming-soon__input-wrapper">
                            <FiMail className="coming-soon__input-icon" />
                            <input
                                type="email"
                                className="coming-soon__input"
                                placeholder="Enter your email address"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                disabled={isSubmitting}
                                required
                            />
                            <button
                                type="submit"
                                className={`coming-soon__submit ${isSubmitting ? 'submitting' : ''}`}
                                disabled={isSubmitting}
                            >
                                {isSubmitting ? (
                                    <span className="spinner"></span>
                                ) : (
                                    <>
                                        Notify Me <FiSend />
                                    </>
                                )}
                            </button>
                        </div>
                    </form>
                </div>

                {/* Social Links */}
                <div className="coming-soon__social">
                    <a href="https://instagram.com" target="_blank" rel="noopener noreferrer" className="coming-soon__social-link">
                        <FaInstagram />
                    </a>
                    <a href="https://facebook.com" target="_blank" rel="noopener noreferrer" className="coming-soon__social-link">
                        <FaFacebookF />
                    </a>
                    <a href="https://pinterest.com" target="_blank" rel="noopener noreferrer" className="coming-soon__social-link">
                        <FaPinterestP />
                    </a>
                    <a href="https://youtube.com" target="_blank" rel="noopener noreferrer" className="coming-soon__social-link">
                        <FaYoutube />
                    </a>
                </div>
            </div>

            {/* Footer */}
            <div className="coming-soon__footer">
                <p>© {new Date().getFullYear()} Bymythology. Illuminating ancient stories.</p>
            </div>
        </div>
    );
};

export default ComingSoon;