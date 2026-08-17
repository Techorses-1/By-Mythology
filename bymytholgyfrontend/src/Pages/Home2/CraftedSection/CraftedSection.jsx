import React, { useEffect, useRef } from "react";
import { PiFlowerLotus, PiHandsClapping, PiPaintBrush } from "react-icons/pi";
import { GiBowenKnot, GiCandleFlame, GiWoodCabin } from "react-icons/gi";
import { TbToolsKitchen2, TbStars } from "react-icons/tb";
import { BsDroplet } from "react-icons/bs";
import "./CraftedSection.scss";

const features = [
    {
        icon: <PiFlowerLotus />,
        title: "NATURAL\nSOY WAX",
    },
    {
        icon: <GiCandleFlame />,
        title: "WOODEN\nCRACKLING WICK",
    },
    {
        icon: <TbToolsKitchen2 />,
        title: "HAND POURED\nIN SMALL BATCHES",
    },
    {
        icon: <PiPaintBrush />,
        title: "ORIGINAL ARTWORK\nBY INDIAN ARTISTS",
    },
];

const CraftedSection = () => {
    const sectionRef = useRef(null);
    const contentRef = useRef(null);

    useEffect(() => {
        const observer = new IntersectionObserver(
            ([entry]) => {
                if (entry.isIntersecting) {
                    sectionRef.current?.classList.add("crafted-section--visible");
                    observer.disconnect();
                }
            },
            { threshold: 0.2 }
        );

        if (sectionRef.current) observer.observe(sectionRef.current);
        return () => observer.disconnect();
    }, []);

    return (
        <section className="crafted-section" ref={sectionRef}>
            {/* LEFT IMAGE */}
            <div className="crafted-left">
                <img
                    src="https://images.unsplash.com/photo-1603006905003-be475563bc59?q=80&w=1974&auto=format&fit=crop"
                    alt="Handcrafted Candle"
                />
                <div className="crafted-left-overlay"></div>
            </div>

            {/* RIGHT CONTENT */}
            <div className="crafted-right" ref={contentRef}>
                <div className="crafted-header">
                    <span className="crafted-small-title">CRAFTED WITH DEVOTION</span>
                    <div className="crafted-ornament">
                        <span className="crafted-ornament-line" />
                        <svg className="crafted-ornament-diamond" viewBox="0 0 20 10">
                            <polygon points="10,0 20,5 10,10 0,5" fill="#c9a84c" />
                        </svg>
                        <span className="crafted-ornament-line" />
                    </div>
                </div>

                <h2>
                    More Than 
                    
                    A Candle
                </h2>

                <p>
                    The Ramayan Collection is not just a fragrance experience - it is a spiritual journey.
Every candle is crafted to bring peace, devotion, and timeless storytelling into your home while honoring the sacred legacy of
the Ramayan.
                </p>

                <div className="crafted-features">
                    {features.map((item, index) => (
                        <div className="crafted-feature" key={index}>
                            <div className="crafted-icon">
                                {item.icon}
                            </div>
                            <h4>
                                {item.title.split("\n").map((line, i) => (
                                    <span key={i}>
                                        {line}
                                        <br />
                                    </span>
                                ))}
                            </h4>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
};

export default CraftedSection;