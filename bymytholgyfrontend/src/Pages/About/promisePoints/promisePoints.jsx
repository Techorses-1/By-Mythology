import React, { useEffect, useRef } from "react";
import {
    TbHandStop,
    TbFlame,
    TbCube,
} from "react-icons/tb";
import {
    GiLotus,
} from "react-icons/gi";
import "./SacredPromiseSection.scss";

const promisePoints = [
    {
        icon: <TbHandStop />,
        text: "Rooted in Indian heritage",
    },
    {
        icon: <GiLotus />,
        text: "Crafted with integrity",
    },
    {
        icon: <TbFlame />,
        text: "Elevated everyday rituals",
    },
    {
        icon: <TbCube />,
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
                    src="https://images.unsplash.com/photo-1506126613408-eca07ce68773?q=80&w=1600&auto=format&fit=crop"
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
                            {item.icon}
                        </div>
                        <p>{item.text}</p>
                    </div>
                ))}
            </div>
        </section>
    );
};

export default SacredPromiseSection;