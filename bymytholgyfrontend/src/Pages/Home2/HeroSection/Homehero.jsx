import React, { useEffect, useRef } from "react";
import "./HomeHero.scss";
import hero from "../../../assets/images/home/newhero.jpeg";
import { IoArrowForwardOutline } from "react-icons/io5";

const HomeHero = () => {
    const heroRef = useRef(null);
    const contentRef = useRef(null);

    useEffect(() => {
        const timer = setTimeout(() => {
            if (contentRef.current) {
                contentRef.current.classList.add("home-hero__content--visible");
            }
        }, 100);
        return () => clearTimeout(timer);
    }, []);

    return (
        <section className="home-hero" ref={heroRef}>
            {/* Background Image */}
            <div className="home-hero__bg">
                <img
                    src={hero}
                    alt="Hero Background"
                    className="home-hero__bg-img"
                />
                <div className="home-hero__overlay" />
                <div className="home-hero__overlay-left" />
            </div>

            {/* Content */}
            <div className="home-hero__inner">
                <div className="home-hero__content" ref={contentRef}>
                    {/* Eyebrow with Underline Ornament - UPDATED */}
                    <div className="home-hero__eyebrow-wrapper">
                        <p className="home-hero__eyebrow">
                            Scented Stories. Sacred Journeys.
                        </p>
                        {/* Underline Ornament - BELOW the text */}
                        <div className="home-hero__eyebrow-ornament">
                            <span className="home-hero__eyebrow-ornament-line" />
                            <svg className="home-hero__eyebrow-ornament-diamond" viewBox="0 0 20 10">
                                <polygon points="10,0 20,5 10,10 0,5" fill="#c9a84c" />
                            </svg>
                            <span className="home-hero__eyebrow-ornament-line" />
                        </div>
                    </div>

                    {/* Heading */}
                    <h1 className="home-hero__heading">
                        <span className="home-hero__heading-line home-hero__heading-line--1">The</span>
                        <span className="home-hero__heading-line home-hero__heading-line--2">Ramayan</span>
                        <span className="home-hero__heading-line home-hero__heading-line--3">Collection</span>
                        <span className="home-hero__heading-sub">A Journey Through Fragrance & Divinity
                        </span>
                    </h1>

                    {/* Description */}
                    <p className="home-hero__desc">
                        Step into the sacred world of the Ramayana through an exclusive collection of perfumed candles inspired by devotion, courage,
                        purity, and timeless love.
                    </p>

                    {/* CTAs - UPDATED WITH ICON */}
                    <div className="home-hero__ctas">
                        <a href="/collection" className="home-hero__btn home-hero__btn--primary">
                            Explore the Collection
                            <span className="home-hero__btn-arrow">
                                <IoArrowForwardOutline />
                            </span>
                        </a>
                        <a href="/collection" className="home-hero__btn home-hero__btn--outline">
                            Begin The Journey
                            <span className="home-hero__btn-circle">
                                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                    <circle cx="12" cy="12" r="10" />
                                    <polyline points="12 8 16 12 12 16" />
                                    <line x1="8" y1="12" x2="16" y2="12" />
                                </svg>
                            </span>
                        </a>
                    </div>
                </div>
            </div>

            {/* Scroll Indicator */}
            <div className="home-hero__scroll">
                <span className="home-hero__scroll-label">Scroll to Discover</span>
                <div className="home-hero__scroll-mouse">
                    <div className="home-hero__scroll-wheel" />
                </div>
            </div>
        </section>
    );
};

export default HomeHero;