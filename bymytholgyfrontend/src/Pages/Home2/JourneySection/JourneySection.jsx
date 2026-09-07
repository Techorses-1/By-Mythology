import React, { useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay, Navigation, Pagination, EffectFade } from "swiper/modules";
import "swiper/css";
import "swiper/css/effect-fade";
import "swiper/css/navigation";
import "swiper/css/pagination";
import "./JourneySection.scss";
import ctaImage from "../../../assets/images/home/slide1.jpg";
import ctaImage2 from "../../../assets/images/home/slide2.jpg";

const SLIDES = [
    {
        id: 1,
        title: "THE EPIC\nJOURNEY",
        subtitle: "FOLLOW THE EPIC",
        description: "From Ayodhya to Lanka,\nExplore the path of courage, \nlove and righteousness.",
        buttonText: "EXPLORE THE MAP",
        redirectTo: "/the-journey",
        bgImage: ctaImage,
    },
    {
        id: 2,
        title: "LIMITED EDITION\nCOLLECTOR SERIES",
        subtitle: "ANCIENT WISDOM",
        description: "Exclusive seasonal releases\nfor the true connoisseur.",
        buttonText: "VIEW COLLECTION",
        redirectTo: "/collection",
        bgImage: ctaImage2,
    },
];

const JourneySection = () => {
    const sectionRef = useRef(null);
    const navigate = useNavigate();

    useEffect(() => {
        const observer = new IntersectionObserver(
            ([entry]) => {
                if (entry.isIntersecting) {
                    sectionRef.current?.classList.add("journey-section--visible");
                    observer.disconnect();
                }
            },
            { threshold: 0.3 }
        );

        if (sectionRef.current) observer.observe(sectionRef.current);
        return () => observer.disconnect();
    }, []);

    const handleButtonClick = (redirectUrl) => {
        navigate(redirectUrl);
    };

    return (
        <section className="journey-section" ref={sectionRef}>
            <Swiper
                modules={[Autoplay, Navigation, Pagination, EffectFade]}
                effect="fade"
                fadeEffect={{ crossFade: true }}
                autoplay={{ delay: 5000, disableOnInteraction: false }}
                loop={true}
                speed={800}
                navigation={{
                    prevEl: ".journey-arrow--prev",
                    nextEl: ".journey-arrow--next",
                }}
                pagination={{
                    el: ".journey-dots",
                    clickable: true,
                    bulletClass: "journey-dot",
                    bulletActiveClass: "journey-dot--active",
                    renderBullet: (index, className) =>
                        `<button class="${className}" aria-label="Go to slide ${index + 1}"></button>`,
                }}
                className="journey-swiper"
            >
                {SLIDES.map((slide) => (
                    <SwiperSlide key={slide.id} className="journey-slide">
                        <div
                            className="journey-bg"
                            style={{ backgroundImage: `url(${slide.bgImage})` }}
                        />
                        <div className="journey-overlay" />
                        <div className="journey-content">
                            <div className="journey-header">
                                <span className="journey-small-title">{slide.subtitle}</span>
                                <div className="journey-ornament">
                                    <span className="journey-ornament-line" />
                                    <svg className="journey-ornament-diamond" viewBox="0 0 20 10">
                                        <polygon points="10,0 20,5 10,10 0,5" fill="#c9a84c" />
                                    </svg>
                                    <span className="journey-ornament-line" />
                                </div>
                            </div>
                            <h2>
                                {slide.title.split("\n").map((line, i, arr) => (
                                    <React.Fragment key={i}>
                                        {line}
                                        {i < arr.length - 1 && <br />}
                                    </React.Fragment>
                                ))}
                            </h2>
                            <p>
                                {slide.description.split("\n").map((line, i, arr) => (
                                    <React.Fragment key={i}>
                                        {line}
                                        {i < arr.length - 1 && <br />}
                                    </React.Fragment>
                                ))}
                            </p>
                            <button 
                                className="journey-btn"
                                onClick={() => handleButtonClick(slide.redirectTo)}
                            >
                                {slide.buttonText}
                                <span>→</span>
                            </button>
                        </div>
                    </SwiperSlide>
                ))}
            </Swiper>

            <button className="journey-arrow journey-arrow--prev" aria-label="Previous slide">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <polyline points="15 18 9 12 15 6" />
                </svg>
            </button>
            <button className="journey-arrow journey-arrow--next" aria-label="Next slide">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <polyline points="9 18 15 12 9 6" />
                </svg>
            </button>

            <div className="journey-dots" />
        </section>
    );
};

export default JourneySection;