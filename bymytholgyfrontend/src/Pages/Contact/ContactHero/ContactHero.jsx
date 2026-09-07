import React, { useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import "./ContactHero.scss";
import hero from "../../../assets/images/home/contact-hero.jpg";
import { IoArrowForwardOutline } from "react-icons/io5";

const ContactHero = () => {
    const contentRef = useRef(null);
    const navigate = useNavigate();

    useEffect(() => {
        const timer = setTimeout(() => {
            if (contentRef.current) {
                contentRef.current.classList.add("contact-hero__content--visible");
            }
        }, 100);
        return () => clearTimeout(timer);
    }, []);

    const handleGetInTouch = () => {
        // Find the contact form element and scroll to it
        const contactForm = document.querySelector('.contact-page');
        if (contactForm) {
            contactForm.scrollIntoView({
                behavior: 'smooth',
                block: 'start'
            });
        } else {
            // If on a different page, navigate and then scroll
            navigate('/contact');
            setTimeout(() => {
                const form = document.querySelector('.contact-page');
                if (form) {
                    form.scrollIntoView({ behavior: 'smooth', block: 'start' });
                }
            }, 100);
        }
    };

    return (
        <section className="contact-hero">
            {/* Background Image */}
            <div className="contact-hero__bg">
                <img
                    src={hero}
                    alt="Contact Hero Background"
                    className="contact-hero__bg-img"
                />
                <div className="contact-hero__overlay" />
                <div className="contact-hero__overlay-left" />
            </div>

            {/* Content */}
            <div className="contact-hero__inner">
                <div className="contact-hero__content" ref={contentRef}>
                    {/* Eyebrow with Underline Ornament */}
                    <div className="contact-hero__eyebrow-wrapper">
                        <p className="contact-hero__eyebrow">
                            Connect With Us
                        </p>
                        {/* Underline Ornament - BELOW the text */}
                        <div className="contact-hero__eyebrow-ornament">
                            <span className="contact-hero__eyebrow-ornament-line" />
                            <svg className="contact-hero__eyebrow-ornament-diamond" viewBox="0 0 20 10">
                                <polygon points="10,0 20,5 10,10 0,5" fill="#c9a84c" />
                            </svg>
                            <span className="contact-hero__eyebrow-ornament-line" />
                        </div>
                    </div>

                    {/* Heading */}
                    <h1 className="contact-hero__heading">
                        <span className="contact-hero__heading-line contact-hero__heading-line--1">Let's</span>
                        <span className="contact-hero__heading-line contact-hero__heading-line--2">Begin a</span>
                        <span className="contact-hero__heading-line contact-hero__heading-line--3">Conversation</span>
                        <span className="contact-hero__heading-sub">We'd Love to Hear From You</span>
                    </h1>

                    {/* Description */}
                    <p className="contact-hero__desc">
                        Have a question about our Ramayan Collection? Need assistance with an order?
                        Or simply want to share your experience? Reach out to us — we're here to help.
                    </p>

                    {/* CTAs - Only Get in Touch button */}
                    <div className="contact-hero__ctas">
                        <button onClick={handleGetInTouch} className="contact-hero__btn contact-hero__btn--primary">
                            Get in Touch
                            <span className="contact-hero__btn-arrow">
                                <IoArrowForwardOutline />
                            </span>
                        </button>
                    </div>
                </div>
            </div>

            {/* Scroll Indicator */}
            <div className="contact-hero__scroll">
                <span className="contact-hero__scroll-label">Scroll to Connect</span>
                <div className="contact-hero__scroll-mouse">
                    <div className="contact-hero__scroll-wheel" />
                </div>
            </div>
        </section>
    );
};

export default ContactHero;