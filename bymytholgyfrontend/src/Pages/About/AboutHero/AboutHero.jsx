import React, { useEffect, useRef } from "react";
import "./AboutHero.scss";
import aboutHero from "../../../assets/images/home/hero.jpeg"; // Using same image for now

const AboutHero = () => {
    const heroRef = useRef(null);
    const contentRef = useRef(null);

    useEffect(() => {
        const timer = setTimeout(() => {
            if (contentRef.current) {
                contentRef.current.classList.add("about-hero__content--visible");
            }
        }, 100);
        return () => clearTimeout(timer);
    }, []);

    return (
        <section className="about-hero" ref={heroRef}>
            {/* Background Image */}
            <div className="about-hero__bg">
                <img
                    src={aboutHero}
                    alt="About Ramayana Candles"
                    className="about-hero__bg-img"
                />
                <div className="about-hero__overlay" />
                <div className="about-hero__overlay-left" />
            </div>

            {/* Content */}
            <div className="about-hero__inner">
                <div className="about-hero__content" ref={contentRef}>
                    {/* Eyebrow with Underline Ornament */}
                    <div className="about-hero__eyebrow-wrapper">
                        <p className="about-hero__eyebrow">
                            Our Story
                        </p>
                        {/* Underline Ornament */}
                        <div className="about-hero__eyebrow-ornament">
                            <span className="about-hero__eyebrow-ornament-line" />
                            <svg className="about-hero__eyebrow-ornament-diamond" viewBox="0 0 20 10">
                                <polygon points="10,0 20,5 10,10 0,5" fill="#c9a84c" />
                            </svg>
                            <span className="about-hero__eyebrow-ornament-line" />
                        </div>
                    </div>

                    {/* Heading */}
                    <h1 className="about-hero__heading">
                        <span className="about-hero__heading-line about-hero__heading-line--1">The</span>
                        <span className="about-hero__heading-line about-hero__heading-line--2">Ramayana,</span>
                        <span className="about-hero__heading-line about-hero__heading-line--3">Reimagined</span>
                        <span className="about-hero__heading-sub">Through Fragrance</span>
                    </h1>

                    {/* Description */}
                    <p className="about-hero__desc">
                        A collection of luxury scented candles inspired by timeless chapters
                        of the Ramayana. Each fragrance tells a story of devotion, courage,
                        love and dharma.
                    </p>

                    {/* CTAs */}
                    <div className="about-hero__ctas">
                        <a href="/collection" className="about-hero__btn about-hero__btn--primary">
                            Explore the Collection
                            <span className="about-hero__btn-arrow">→</span>
                        </a>
                        <a href="/collection" className="about-hero__btn about-hero__btn--outline">
                            Begin The Journey
                            <span className="about-hero__btn-circle">
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
            <div className="about-hero__scroll">
                <span className="about-hero__scroll-label">Scroll to Discover</span>
                <div className="about-hero__scroll-mouse">
                    <div className="about-hero__scroll-wheel" />
                </div>
            </div>
        </section>
    );
};

export default AboutHero;