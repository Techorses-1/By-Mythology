import React, { useEffect, useRef } from "react";
import "./OurStorySection.scss";
import storyImage from "../../../assets/images/home/hero.jpeg"; // update path as needed

const OurStorySection = () => {
    const sectionRef = useRef(null);

    useEffect(() => {
        const observer = new IntersectionObserver(
            ([entry]) => {
                if (entry.isIntersecting) {
                    sectionRef.current?.classList.add("our-story--visible");
                    observer.disconnect();
                }
            },
            { threshold: 0.2 }
        );
        if (sectionRef.current) observer.observe(sectionRef.current);
        return () => observer.disconnect();
    }, []);

    return (
        <section className="our-story-section" ref={sectionRef}>
            <div className="our-story-inner">

                {/* ── Left: Image ─────────────────────────────────── */}
                <div className="our-story-image-wrap">
                    <div className="our-story-image-frame">
                        <img src={storyImage} alt="The Epic — Ramayana painting" />
                    </div>
                </div>

                {/* ── Right: Content ──────────────────────────────── */}
                <div className="our-story-content">
                    <span className="our-story-label">OUR STORY</span>

                    <h2 className="our-story-heading">
                        The Epic. The Essence.<br />The Experience.
                    </h2>

                    <div className="our-story-ornament">
                        <span className="our-story-ornament-line" />
                        <svg className="our-story-ornament-diamond" viewBox="0 0 20 10">
                            <polygon points="10,0 20,5 10,10 0,5" fill="#c9a84c" />
                        </svg>
                        <span className="our-story-ornament-line" />
                    </div>

                    <div className="our-story-body">
                        <p>
                            The Ramayana is more than an epic—it is a guide to life.
                            Its characters, values and moments continue to illuminate our paths.
                        </p>
                        <p>
                            We wanted to capture that timeless wisdom in a form that can be
                            experienced every day.
                        </p>
                        <p>
                            Thus began our journey to create luxury scented candles that do
                            more than fragrance your space—they awaken emotions, memories
                            and a deeper connection to our roots.
                        </p>
                    </div>

                    <p className="our-story-signature">
                        — <em>The Ramayana Scented Candles Team</em>
                    </p>
                </div>

            </div>
        </section>
    );
};

export default OurStorySection;