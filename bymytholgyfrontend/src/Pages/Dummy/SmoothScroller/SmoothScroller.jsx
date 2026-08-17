import { useEffect, useRef } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { ScrollSmoother } from "gsap/ScrollSmoother";
import "./SmoothScroller.scss";
import BentoGallery from "../gsap/BentoGallery";
import MotionPathGallery from "../MotionPathGallery/MotionPathGallery";

gsap.registerPlugin(ScrollTrigger, ScrollSmoother);

const SmoothScroller = () => {
    const wrapperRef = useRef(null);
    const smootherRef = useRef(null);

    useEffect(() => {
        const ctx = gsap.context(() => {

            smootherRef.current = ScrollSmoother.create({
                wrapper: "#ss__wrapper",
                content: "#ss__content",
                smooth: 2,
                effects: true,
                normalizeScroll: true,
            });

            // ── HERO ──
            const heroTl = gsap.timeline({ delay: 0.2 });
            heroTl
                .from(".ss__hero-tag", { opacity: 0, y: 20, duration: 0.8, ease: "power3.out" })
                .from(".ss__hero-title .ss__word", {
                    opacity: 0, y: 80, rotateX: -40,
                    transformOrigin: "top center",
                    stagger: 0.08, duration: 1, ease: "expo.out",
                }, "-=0.4")
                .from(".ss__hero-sub", { opacity: 0, y: 24, duration: 0.8, ease: "power3.out" }, "-=0.5")
                .from(".ss__hero-cta", { opacity: 0, y: 16, duration: 0.6, ease: "power3.out" }, "-=0.4")
                .from(".ss__hero-line", { scaleX: 0, transformOrigin: "left center", duration: 1.2, ease: "expo.out" }, "-=0.8")
                .from(".ss__hero-bg-num", { opacity: 0, y: 60, duration: 1.4, ease: "expo.out" }, 0.1);

            // ── gray→black words ──
            document.querySelectorAll(".ss__reveal-word").forEach((word) => {
                gsap.fromTo(word,
                    { color: "#c8c8c8" },
                    {
                        color: "#111111", ease: "none",
                        scrollTrigger: { trigger: word, start: "top 80%", end: "top 40%", scrub: true },
                    }
                );
            });

            // ── text heading chars ──
            gsap.from(".ss__text-heading .ss__char", {
                opacity: 0, y: 60, rotateZ: 4, stagger: 0.025, duration: 0.9, ease: "expo.out",
                scrollTrigger: { trigger: ".ss__text-section", start: "top 70%" },
            });

            // ── marquee ──
            gsap.to(".ss__marquee-inner", { x: "-50%", duration: 18, ease: "none", repeat: -1 });

            // ── stats ──
            gsap.from(".ss__stat", {
                opacity: 0, y: 40, stagger: 0.12, duration: 0.9, ease: "expo.out",
                scrollTrigger: { trigger: ".ss__stats", start: "top 75%" },
            });

            // ── parallax heading ──
            gsap.from(".ss__parallax-heading .ss__char", {
                opacity: 0, y: 50, stagger: 0.03, duration: 1, ease: "expo.out",
                scrollTrigger: { trigger: ".ss__parallax-section", start: "top 70%" },
            });
            gsap.from(".ss__parallax-body", {
                opacity: 0, y: 30, duration: 1, ease: "power3.out",
                scrollTrigger: { trigger: ".ss__parallax-section", start: "top 60%" },
            });
            ScrollTrigger.create({
                trigger: ".ss__parallax-img-wrap",
                pin: true, start: "center center", end: "+=300",
            });

            // ── QUOTE section ──
            gsap.from(".ss__quote-line", {
                scaleX: 0, transformOrigin: "left center", duration: 1.4, ease: "expo.out",
                scrollTrigger: { trigger: ".ss__quote-section", start: "top 75%" },
            });
            gsap.from(".ss__quote-text .ss__word", {
                opacity: 0, y: 50, stagger: 0.06, duration: 1, ease: "expo.out",
                scrollTrigger: { trigger: ".ss__quote-section", start: "top 65%" },
            });
            gsap.from(".ss__quote-author", {
                opacity: 0, y: 20, duration: 0.8, ease: "power3.out",
                scrollTrigger: { trigger: ".ss__quote-section", start: "top 55%" },
            });

            // ── PROCESS steps ──
            gsap.from(".ss__step", {
                opacity: 0, x: -40, stagger: 0.15, duration: 1, ease: "expo.out",
                scrollTrigger: { trigger: ".ss__process-section", start: "top 70%" },
            });
            gsap.from(".ss__process-heading .ss__char", {
                opacity: 0, y: 40, stagger: 0.025, duration: 0.9, ease: "expo.out",
                scrollTrigger: { trigger: ".ss__process-section", start: "top 75%" },
            });

            // ── HORIZONTAL CARDS scroll ──
            const hCards = document.querySelector(".ss__hscroll-track");
            if (hCards) {
                const totalWidth = hCards.scrollWidth - hCards.parentElement.offsetWidth;
                gsap.to(hCards, {
                    x: -totalWidth,
                    ease: "none",
                    scrollTrigger: {
                        trigger: ".ss__hscroll-section",
                        start: "top top",
                        end: () => `+=${totalWidth}`,
                        scrub: 1,
                        pin: true,
                    },
                });
            }

            // ── CLOSING ──
            gsap.from(".ss__closing-section", {
                opacity: 0, y: 40, duration: 1.2, ease: "power3.out",
                scrollTrigger: { trigger: ".ss__closing-section", start: "top 75%" },
            });

        }, wrapperRef);

        // ── CTA hover ──
        const cta = document.querySelector(".ss__hero-cta");
        if (cta) {
            cta.addEventListener("mouseenter", () => {
                gsap.to(".ss__cta-line", { scaleX: 1, duration: 0.4, ease: "power3.out" });
            });
            cta.addEventListener("mouseleave", () => {
                gsap.to(".ss__cta-line", { scaleX: 0, transformOrigin: "right center", duration: 0.3, ease: "power3.in" });
            });
        }

        return () => ctx.revert();
    }, []);

    const splitWords = (text) =>
        text.split(" ").map((word, i) => (
            <span className="ss__word" key={i} style={{ display: "inline-block", overflow: "hidden", marginRight: "0.25em" }}>
                {word}
            </span>
        ));

    const splitChars = (text) =>
        text.split("").map((char, i) => (
            <span className="ss__char" key={i} style={{ display: "inline-block" }}>
                {char === " " ? "\u00A0" : char}
            </span>
        ));

    const revealWords = (text) =>
        text.split(" ").map((word, i) => (
            <span className="ss__reveal-word" key={i} style={{ display: "inline", color: "#c8c8c8" }}>
                {word}{" "}
            </span>
        ));

    const hCards = [
        { num: "01", title: "Material", desc: "Only what the hand can verify. Stone, brass, linen, oak." },
        { num: "02", title: "Form", desc: "Shape determined by use. Nothing added without reason." },
        { num: "03", title: "Time", desc: "Each object takes as long as it takes. No production lines." },
        { num: "04", title: "Finish", desc: "The last 10% is where craft separates itself from manufacture." },
        { num: "05", title: "Legacy", desc: "Built to be passed on. The opposite of disposable." },
    ];

    const steps = [
        { num: "01", title: "Conception", desc: "Every object begins as a question, not an answer." },
        { num: "02", title: "Prototyping", desc: "Dozens of iterations before a single one leaves the studio." },
        { num: "03", title: "Material sourcing", desc: "We visit every supplier. No exceptions." },
        { num: "04", title: "Production", desc: "Small batch. Hands involved at every stage." },
    ];

    return (
        <div id="ss__wrapper" ref={wrapperRef}>
            <div id="ss__content">

                {/* ── HERO ── */}
                <section className="ss__hero">
                    <span className="ss__hero-bg-num">I</span>
                    <span className="ss__hero-tag">Est. 2024</span>
                    <div className="ss__hero-line" />
                    <h1 className="ss__hero-title">
                        {splitWords("Craft that endures.")}
                    </h1>
                    <p className="ss__hero-sub">Premium objects for considered living.</p>
                    <a href="#" className="ss__hero-cta">
                        Explore collection
                        <span className="ss__cta-line" />
                    </a>
                    <div className="ss__hero-scroll-hint">
                        <span>scroll</span>
                        <div className="ss__scroll-bar"><div className="ss__scroll-thumb" /></div>
                    </div>
                </section>

                {/* ── TEXT SECTION ── */}
                <section className="ss__text-section">
                    <div className="ss__text-inner">
                        <h2 className="ss__text-heading">{splitChars("Everything considered.")}</h2>
                        <p className="ss__text-body">
                            {revealWords("We believe the objects around you shape how you think. Each piece is drawn from the idea that restraint is not limitation — it is the highest form of intention. Nothing is here by accident. Every curve, every material, every weight.")}
                        </p>
                    </div>
                </section>

                {/* ── MARQUEE ── */}
                <div className="ss__marquee">
                    <div className="ss__marquee-inner">
                        {["Timeless", "Considered", "Refined", "Minimal", "Enduring", "Precise",
                            "Timeless", "Considered", "Refined", "Minimal", "Enduring", "Precise"].map((w, i) => (
                                <span key={i}>{w} <em>·</em></span>
                            ))}
                    </div>
                </div>

                {/* ── STATS ── */}
                <div className="ss__stats">
                    {[
                        { num: "12+", label: "Years of craft" },
                        { num: "340", label: "Objects made" },
                        { num: "60", label: "Countries reached" },
                    ].map((s, i) => (
                        <div className="ss__stat" key={i}>
                            <span className="ss__stat-num">{s.num}</span>
                            <span className="ss__stat-label">{s.label}</span>
                        </div>
                    ))}
                </div>

                {/* ── QUOTE SECTION ── */}
                <section className="ss__quote-section">
                    <div className="ss__quote-line" />
                    <blockquote className="ss__quote-text">
                        {splitWords("To make well is the most radical act left.")}
                    </blockquote>
                    <p className="ss__quote-author">— Studio founder, 2019</p>
                </section>

                {/* ── HORIZONTAL SCROLL CARDS ── */}
                <section className="ss__hscroll-section">
                    <div className="ss__hscroll-track">
                        <div className="ss__hscroll-label">
                            <span>{splitChars("The principles.")}</span>
                        </div>
                        {hCards.map((c, i) => (
                            <div className="ss__hcard" key={i}>
                                <span className="ss__hcard-num">{c.num}</span>
                                <h3 className="ss__hcard-title">{c.title}</h3>
                                <p className="ss__hcard-desc">{c.desc}</p>
                            </div>
                        ))}
                    </div>
                </section>

                {/* ── PARALLAX SECTION ── */}
                <section className="ss__parallax-section">
                    <div className="ss__parallax-img-wrap">
                        <img
                            className="ss__parallax-img"
                            src="https://assets.codepen.io/16327/2D-keyframe-2.png"
                            data-speed="0.8"
                            alt="craft object"
                        />
                    </div>
                    <div className="ss__parallax-text">
                        <h2 className="ss__parallax-heading">{splitChars("Made to last.")}</h2>
                        <p className="ss__parallax-body">
                            Every object in our collection is built around a single idea: that it should outlast the moment it was made for. No trends. No seasons. Just form following function, honestly.
                        </p>
                    </div>
                </section>

                {/* ── PROCESS SECTION ── */}
                <section className="ss__process-section">
                    <div className="ss__process-left">
                        <h2 className="ss__process-heading">{splitChars("How we work.")}</h2>
                        <p className="ss__process-sub">
                            {revealWords("A process built around slowness. Every decision is deliberate. Nothing is rushed.")}
                        </p>
                    </div>
                    <div className="ss__process-right">
                        {steps.map((s, i) => (
                            <div className="ss__step" key={i}>
                                <span className="ss__step-num">{s.num}</span>
                                <div className="ss__step-content">
                                    <h4 className="ss__step-title">{s.title}</h4>
                                    <p className="ss__step-desc">{s.desc}</p>
                                </div>
                            </div>
                        ))}
                    </div>
                </section>

                {/* ── CLOSING ── */}
                <section className="ss__closing-section">
                    <p className="ss__closing-text">
                        {revealWords("The world does not need more things. It needs better ones. Objects that ask you to slow down. To notice. To keep. We make those things.")}
                    </p>
                </section>

                <section>
                    <BentoGallery />
                    <MotionPathGallery />
                </section>

                <div className="ss__footer">
                    <span>© 2024 Studio</span>
                    <span>All objects. All rights.</span>
                </div>

            </div>
        </div>
    );
};

export default SmoothScroller;