import React, { useEffect, useRef } from "react";
import "./SacredPromiseSection.scss"; 

import ourpromiseImage from "../../../assets/images/about/ourpromise.jpg";

import icon1 from "../../../assets/images/about/ourpromise-icon1.png";
import icon2 from "../../../assets/images/about/ourpromise-icon2.png";
import icon3 from "../../../assets/images/about/ourpromise-icon3.png";
import icon4 from "../../../assets/images/about/ourpromise-icon4.png";

const promisePoints = [
    {
        icon: icon1,
        text: "Rooted in Indian heritage",
    },
    {
        icon: icon2,
        text: "Crafted with integrity",
    },
    {
        icon: icon3,
        text: "Elevated everyday rituals",
    },
    {
        icon: icon4,
        text: "Made for you and the planet",
    },
];

const SacredPromiseSection = () => {
    const sectionRef = useRef(null);

    useEffect(() => {
        const observer = new IntersectionObserver(
            ([entry]) => {
                if (entry.isIntersecting) {
                    sectionRef.current?.classList.add("sacred-promise--visible");
                    observer.disconnect();
                }
            },
            { threshold: 0.2 }
        );
        if (sectionRef.current) observer.observe(sectionRef.current);
        return () => observer.disconnect();
    }, []);

    return (
        <section className="sacred-promise-section" ref={sectionRef}>
            {/* IMAGE */}
            <div className="sacred-promise-image">
                <img
                    src={ourpromiseImage}
                    alt="Meditation"
                />
            </div>

            {/* CONTENT */}
            <div className="sacred-promise-content">
                <span className="sacred-promise-small-title">
                    OUR PROMISE
                </span>

                <h2>
                    MORE THAN A CANDLE,
                    <br />
                    IT'S A SACRED EXPERIENCE.
                </h2>

                <div className="sacred-promise-ornament">
                    <span className="sacred-promise-ornament-line" />
                    <svg className="sacred-promise-ornament-diamond" viewBox="0 0 20 10">
                        <polygon points="10,0 20,5 10,10 0,5" fill="#c9a84c" />
                    </svg>
                    <span className="sacred-promise-ornament-line" />
                </div>

                <p>
                    We are committed to creating products that are rooted in
                    tradition, crafted with integrity and designed to elevate
                    your everyday rituals.
                </p>
            </div>

            {/* POINTS */}
            <div className="sacred-promise-points">
                {promisePoints.map((item, index) => (
                    <div className="sacred-promise-point" key={index}>
                        <div className="sacred-promise-icon">
                            <img src={item.icon} alt={item.text} />
                        </div>
                        <p>{item.text}</p>
                    </div>
                ))}
            </div>
        </section>
    );
};

export default SacredPromiseSection;