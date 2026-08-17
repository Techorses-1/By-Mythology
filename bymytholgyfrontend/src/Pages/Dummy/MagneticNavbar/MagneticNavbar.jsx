import { useEffect, useRef, useState } from "react";
import { gsap } from "gsap";
import "./MagneticNavbar.scss";

const MagneticNavbar = () => {
    const zoneRef = useRef(null);
    const btnRef = useRef(null);
    const iconRef = useRef(null);
    const tlRef = useRef(null);
    const isOpenRef = useRef(false);
    const enterEndTimeRef = useRef(0);
    const [isOpen, setIsOpen] = useState(false);

    useEffect(() => {
        const initMenu = () => {
            tlRef.current && tlRef.current.revert();

            gsap.set("#mnav__overlay", { visibility: "hidden" });
            gsap.set(".mnav__bg", { opacity: 0 });
            gsap.set(".mnav__login", { opacity: 0, y: 8 });

            const tl = gsap.timeline({ paused: true })
                .set("#mnav__overlay", { visibility: "visible", pointerEvents: "auto" })

                .to(".mnav__bg", {
                    opacity: 1, duration: 0.4, ease: "power2.out"
                }, 0)

                .fromTo(".mnav__panel",
                    { x: "110%", y: 0, rotation: 0 },
                    { x: "0%", duration: 0.6, ease: "back.out", stagger: 0.1 },
                    0
                )

                .fromTo(".mnav__navitem",
                    { opacity: 0, x: -20 },
                    { opacity: 1, x: 0, duration: 1.2, ease: "expo.out", stagger: 0.03 },
                    0.1
                )

                .fromTo(".mnav__bar--top",
                    { attr: { x1: 3, y1: 7, x2: 17, y2: 7 } },
                    { attr: { x1: 5, y1: 5, x2: 15, y2: 15 }, duration: 0.35, ease: "back.out(1.4)" },
                    0.06
                )
                .fromTo(".mnav__bar--bot",
                    { attr: { x1: 3, y1: 13, x2: 17, y2: 13 } },
                    { attr: { x1: 15, y1: 5, x2: 5, y2: 15 }, duration: 0.35, ease: "back.out(1.4)" },
                    0.06
                )

                .to(".mnav__login", {
                    opacity: 1, y: 0, duration: 0.3, ease: "power3.out"
                }, 0.4)

                .addPause();

            enterEndTimeRef.current = tl.duration();

            tl
                .to(".mnav__bar--top", {
                    attr: { x1: 3, y1: 7, x2: 17, y2: 7 }, duration: 0.2, ease: "power3.in"
                })
                .to(".mnav__bar--bot", {
                    attr: { x1: 3, y1: 13, x2: 17, y2: 13 }, duration: 0.2, ease: "power3.in"
                }, "<")

                .to(".mnav__panel", {
                    y: "110vh",
                    rotation: "random(-25, 25)",
                    duration: 1,
                    ease: "power3.in",
                    stagger: { from: "end", each: 0.02 }
                }, "<")

                .to(".mnav__bg", {
                    opacity: 0, duration: 0.3, ease: "power2.in"
                }, "<0.1")

                .set("#mnav__overlay", { visibility: "hidden", pointerEvents: "none" });

            tlRef.current = tl;
        };

        initMenu();

        const toggle = () => {
            isOpenRef.current = !isOpenRef.current;
            setIsOpen(isOpenRef.current);
            const tl = tlRef.current;
            const enterEnd = enterEndTimeRef.current;

            if (isOpenRef.current) {
                if (tl.time() >= enterEnd) {
                    tl.timeScale(1).restart();
                } else {
                    tl.timeScale(1).play();
                }
            } else {
                if (tl.time() < enterEnd) {
                    tl.timeScale(1.5).reverse();
                } else {
                    tl.timeScale(1).play();
                }
            }
        };

        const btn = btnRef.current;
        btn.addEventListener("click", toggle);

        const bgEl = document.querySelector(".mnav__bg");
        const bgHandler = () => { if (isOpenRef.current) toggle(); };
        bgEl.addEventListener("click", bgHandler);

        const keyHandler = (e) => {
            if (e.key === "Escape" && isOpenRef.current) {
                toggle();
                btn.focus();
            }
        };
        document.addEventListener("keydown", keyHandler);

        // magnetic
        const zone = zoneRef.current;
        const btnEl = btnRef.current;
        const iconEl = iconRef.current;
        const strength = 0.4;
        const labelStrength = 0.24;

        const onMouseMove = (e) => {
            const rect = zone.getBoundingClientRect();
            const mapX = gsap.utils.mapRange(rect.left, rect.right, -rect.width / 2, rect.width / 2, e.clientX);
            const mapY = gsap.utils.mapRange(rect.top, rect.bottom, -rect.height / 2, rect.height / 2, e.clientY);
            gsap.to(btnEl, { x: mapX * strength, y: mapY * strength, duration: 0.4, ease: "power2.out", overwrite: true });
            gsap.to(iconEl, { x: mapX * labelStrength, y: mapY * labelStrength, duration: 0.4, ease: "power2.out", overwrite: true });
        };

        const onMouseLeave = () => {
            gsap.to(btnEl, { x: 0, y: 0, duration: 0.7, ease: "elastic.out(1, 0.4)", overwrite: true });
            gsap.to(iconEl, { x: 0, y: 0, duration: 0.7, ease: "elastic.out(1, 0.4)", overwrite: true });
        };

        zone.addEventListener("mousemove", onMouseMove);
        zone.addEventListener("mouseleave", onMouseLeave);

        return () => {
            btn.removeEventListener("click", toggle);
            bgEl.removeEventListener("click", bgHandler);
            document.removeEventListener("keydown", keyHandler);
            zone.removeEventListener("mousemove", onMouseMove);
            zone.removeEventListener("mouseleave", onMouseLeave);
            tlRef.current && tlRef.current.revert();
        };
    }, []);

    return (
        <>
            <nav className="mnav">
                <div className="mnav__logo">
                    coco<span>nat</span>
                </div>

                <div className="mnav__zone" ref={zoneRef}>
                    <button
                        className="mnav__btn"
                        ref={btnRef}
                        aria-label={isOpen ? "Close menu" : "Open menu"}
                        aria-expanded={isOpen}
                    >
                        <span className="mnav__icon" ref={iconRef}>
                            <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
                                <line className="mnav__bar mnav__bar--top" x1="3" y1="7" x2="17" y2="7" stroke="#1a1a1a" strokeWidth="1.5" strokeLinecap="round" />
                                <line className="mnav__bar mnav__bar--mid" x1="3" y1="13" x2="17" y2="13" stroke="#1a1a1a" strokeWidth="1.5" strokeLinecap="round" />
                                <line className="mnav__bar mnav__bar--bot" x1="3" y1="13" x2="17" y2="13" stroke="#1a1a1a" strokeWidth="1.5" strokeLinecap="round" />
                            </svg>
                        </span>
                    </button>
                </div>
            </nav>

            {/* Menu overlay */}
            <div className="mnav__overlay" id="mnav__overlay">
                <div className="mnav__bg" />

                {/* Top panel - white */}
                <div className="mnav__panel mnav__panel--top">
                    <ul className="mnav__list">
                        {["Tools", "About", "Showcase", "Community", "Learn", "Docs"].map((item) => (
                            <li className="mnav__navitem" key={item}>
                                <a className="mnav__navlink" href="#">{item}</a>
                            </li>
                        ))}
                    </ul>
                    <div className="mnav__login">Login / Create Account</div>
                </div>

                
            </div>
        </>
    );
};

export default MagneticNavbar;