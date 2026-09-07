import React, { useEffect, useRef } from "react";
import "./FeatureBadges.scss";

import icon1 from "../../../assets/images/home/morethancandle-icon1.png";
import icon2 from "../../../assets/images/home/morethancandle-icon2.png";
import icon3 from "../../../assets/images/home/morethancandle-icon3.png";
import icon4 from "../../../assets/images/home/morethancandle-icon4.png";
import icon5 from "../../../assets/images/home/morethancandle-icon5.png";

const BADGES = [
    {
        id: 1,
        icon: icon1,
        label: "Made With\nSoy Wax",
    },
    {
        id: 2,
        icon: icon2,
        label: "Better For\nHealth",
    },
    {
        id: 3,
        icon: icon3,
        label: "Vegan\nLead-Free",
    },
    {
        id: 4,
        icon: icon4,
        label: "Unbleached\nCotton",
    },
    {
        id: 5,
        icon: icon5,
        label: "Crafted with\nIntegrity",
    },
];

const FeatureBadges = () => {
    const marqueeRef = useRef(null);

    useEffect(() => {
        const marquee = marqueeRef.current;
        if (!marquee) return;

        let animationId = null;
        let position = 0;
        const speed = 0.3; // Slower speed (was 0.8)

        // Get total width of content
        const content = marquee.querySelector('.feature-badges__marquee-track');
        if (!content) return;

        // Duplicate content multiple times for true infinite
        const duplicateContent = () => {
            const items = content.innerHTML;
            content.innerHTML = items + items + items + items; // Multiple copies
        };
        duplicateContent();

        const animate = () => {
            position += speed;

            // Reset without jump - use modulo on actual content width
            const contentWidth = content.scrollWidth / 4; // Width of original content
            if (position >= contentWidth) {
                position = position - contentWidth;
            }

            content.style.transform = `translateX(-${position}px)`;
            animationId = requestAnimationFrame(animate);
        };

        animate();

        // Pause on hover
        const handleMouseEnter = () => {
            cancelAnimationFrame(animationId);
        };

        const handleMouseLeave = () => {
            const restartAnimate = () => {
                position += speed;
                const contentWidth = content.scrollWidth / 4;
                if (position >= contentWidth) {
                    position = position - contentWidth;
                }
                content.style.transform = `translateX(-${position}px)`;
                animationId = requestAnimationFrame(restartAnimate);
            };
            animationId = requestAnimationFrame(restartAnimate);
        };

        marquee.addEventListener('mouseenter', handleMouseEnter);
        marquee.addEventListener('mouseleave', handleMouseLeave);

        return () => {
            if (animationId) cancelAnimationFrame(animationId);
            marquee.removeEventListener('mouseenter', handleMouseEnter);
            marquee.removeEventListener('mouseleave', handleMouseLeave);
        };
    }, []);

    return (
        <div className="feature-badges">
            {/* Desktop & Tablet View - Static */}
            <div className="feature-badges__inner feature-badges__desktop">
                {BADGES.map((badge, index) => (
                    <React.Fragment key={badge.id}>
                        <div className="feature-badges__item">
                            <span className="feature-badges__icon">
                                <img src={badge.icon} alt={badge.label.replace("\n", " ")} />
                            </span>
                            <p className="feature-badges__label">
                                {badge.label.split("\n").map((line, i) => (
                                    <React.Fragment key={i}>
                                        {line}
                                        {i === 0 && <br />}
                                    </React.Fragment>
                                ))}
                            </p>
                        </div>
                        {index < BADGES.length - 1 && (
                            <span className="feature-badges__divider" />
                        )}
                    </React.Fragment>
                ))}
            </div>

            {/* Mobile View - True Infinite Marquee (No Jump/Flicker) */}
            <div className="feature-badges__marquee" ref={marqueeRef}>
                <div className="feature-badges__marquee-track">
                    {BADGES.map((badge, index) => (
                        <div className="feature-badges__marquee-item" key={badge.id}>
                            <span className="feature-badges__marquee-icon">
                                <img src={badge.icon} alt={badge.label.replace("\n", " ")} />
                            </span>
                            <p className="feature-badges__marquee-label">
                                {badge.label.split("\n").map((line, i) => (
                                    <React.Fragment key={i}>
                                        {line}
                                        {i === 0 && <br />}
                                    </React.Fragment>
                                ))}
                            </p>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default FeatureBadges;