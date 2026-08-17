import React, { useEffect, useRef } from "react";
import "./CollectionHero.scss";

const CollectionHero = () => {
    const heroRef = useRef(null);
    const contentRef = useRef(null);

    useEffect(() => {
        const timer = setTimeout(() => {
            if (contentRef.current) {
                contentRef.current.classList.add("collection-hero__content--visible");
            }
        }, 100);
        return () => clearTimeout(timer);
    }, []);

    return (
        <section className="collection-hero" ref={heroRef}>
            {/* RIGHT SIDE DESIGN */}
            <div className="collection-hero__right-design"></div>

            {/* CONTENT */}
            <div className="collection-hero__content" ref={contentRef}>
                <h1>THE COLLECTION</h1>

                <div className="collection-hero__ornament">
                    <span className="collection-hero__ornament-line" />
                    <svg className="collection-hero__ornament-diamond" viewBox="0 0 20 10">
                        <polygon points="10,0 20,5 10,10 0,5" fill="#c9a84c" />
                    </svg>
                    <span className="collection-hero__ornament-line" />
                </div>

                <p>
                    Five timeless chapters. Five unique fragrances.
                    <br />
                    Each candle is a story of devotion, courage and dharma.
                </p>
            </div>
        </section>
    );
};

export default CollectionHero;