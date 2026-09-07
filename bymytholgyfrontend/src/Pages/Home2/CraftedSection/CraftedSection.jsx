import React, { useEffect, useRef } from "react";
import "./CraftedSection.scss";
import candle from "../../../assets/images/home/more-the-candle.jpg";
import icon1 from "../../../assets/images/home/morethancandle-icon1.png";
import icon2 from "../../../assets/images/home/morethancandle-icon2.png";
import icon3 from "../../../assets/images/home/morethancandle-icon3.png";
import icon4 from "../../../assets/images/home/morethancandle-icon4.png";

const features = [
    {
        icon: icon1,
        title: "NATURAL\nSOY WAX",
    },
    {
        icon: icon2,
        title: "Better For\nHealth",
    },
    {
        icon: icon3,
        title: "Vegan\nLead-Free",
    },
    {
        icon: icon4,
        title: "Unbleached\nCotton",
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
                    src={candle}
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
                                <img src={item.icon} alt={item.title.replace("\n", " ")} />
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