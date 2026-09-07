import React, { useEffect, useRef } from "react";
import { PiFlowerLotus } from "react-icons/pi";
import { TbFlame, TbShieldHeart } from "react-icons/tb";
import { LuFlaskConical } from "react-icons/lu";
import { BsBrush } from "react-icons/bs";
import "./CraftsmanSection.scss";
import FeatureBadges from "../Featurebadges/Featurebadges";

import whychoose1 from "../../../assets/images/home/whychooseus/whychoose1.jpg";
import whychoose2 from "../../../assets/images/home/whychooseus/whychoose2.jpg";
import whychoose3 from "../../../assets/images/home/whychooseus/whychoose3.jpg";
import whychoose4 from "../../../assets/images/home/whychooseus/whychoose4.jpg";
import whychoose5 from "../../../assets/images/home/whychooseus/whychoose5.jpg";


const CRAFT_BADGES = [
    { id: 1, icon: <PiFlowerLotus />, label: "Premium\nNatural Wax" },
    { id: 2, icon: <TbFlame />, label: "Wooden\nCrackling Wick" },
    { id: 3, icon: <LuFlaskConical />, label: "Hand Poured\nIn Small Batches" },
    { id: 4, icon: <BsBrush />, label: "Original Artwork\nBy Indian Artists" },
    { id: 5, icon: <TbShieldHeart />, label: "Collectible\nLuxury Quality" },
];

const GRID_IMAGES = [
    {
        id: 1,
        src: whychoose1,
        alt: "Wax being poured",
        gridArea: "img1",
    },
    {
        id: 2,
        src: whychoose2,
        alt: "Candle in glass",
        gridArea: "img2",
    },
    {
        id: 3,
        src: whychoose3,
        alt: "Indian artwork",
        gridArea: "img3",
    },
    {
        id: 4,
        src: whychoose4,
        alt: "Candle lid",
        gridArea: "img4",
    },
    {
        id: 5,
        src: whychoose5,
        alt: "Artist painting",
        gridArea: "img5",
    },
];

const CraftsmanSection = () => {
    const sectionRef = useRef(null);

    useEffect(() => {
        const observer = new IntersectionObserver(
            ([entry]) => {
                if (entry.isIntersecting) {
                    sectionRef.current?.classList.add("craftsman--visible");
                    observer.disconnect();
                }
            },
            { threshold: 0.12 }
        );
        if (sectionRef.current) observer.observe(sectionRef.current);
        return () => observer.disconnect();
    }, []);

    return (
        <section className="craftsman" ref={sectionRef}>
            <div className="craftsman__body">

                {/* ── Left: Text (30%) ──────────────────────────────────────────────── */}
                <div className="craftsman__left">
                    <h2 className="craftsman__heading">
                        Why Choose<br />Our Collection?
                    </h2>

                    <div className="craftsman__ornament">
                        <span className="craftsman__ornament-line" />
                        <svg className="craftsman__ornament-diamond" viewBox="0 0 20 10">
                            <polygon points="10,0 20,5 10,10 0,5" fill="#c9a84c" />
                        </svg>
                        <span className="craftsman__ornament-line" />
                    </div>

                    <p className="craftsman__desc">
                        Inspired by the divine journey of<br />
                        the Ramayana, each candle is more <br />
                        than a fragrance - it is an experience of<br />
                        spirituality, luxury, and storytelling.
                    </p>

                    <a href="/about" className="craftsman__cta">
                        Learn More
                    </a>
                </div>

                {/* ── Right: Image Grid (70%) ────────────────────────────────────────── */}
                <div className="craftsman__grid">
                    {GRID_IMAGES.map((img) => (
                        <div
                            key={img.id}
                            className={`craftsman__grid-item craftsman__grid-item--${img.gridArea}`}
                        >
                            <img
                                src={img.src}
                                alt={img.alt}
                                className="craftsman__grid-img"
                                loading="lazy"
                            />
                            <div className="craftsman__grid-overlay" />
                        </div>
                    ))}
                </div>

            </div>

            {/* ── Bottom Badges ──────────────────────────────────────────────── */}
            {/* <div className="craftsman__badges">
                <div className="craftsman__badges-inner">
                    {CRAFT_BADGES.map((badge, index) => (
                        <React.Fragment key={badge.id}>
                            <div className="craftsman__badge">
                                <span className="craftsman__badge-icon">{badge.icon}</span>
                                <p className="craftsman__badge-label">
                                    {badge.label.split("\n").map((line, i) => (
                                        <React.Fragment key={i}>
                                            {line}
                                            {i === 0 && <br />}
                                        </React.Fragment>
                                    ))}
                                </p>
                            </div>
                            {index < CRAFT_BADGES.length - 1 && (
                                <span className="craftsman__badge-divider" />
                            )}
                        </React.Fragment>
                    ))}
                </div>
            </div> */}
            <div>
                <FeatureBadges />
            </div>
        </section>
    );
};

export default CraftsmanSection;