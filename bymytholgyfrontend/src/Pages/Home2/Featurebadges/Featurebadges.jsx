import React, { useEffect, useRef } from "react";
import { PiFlowerLotus } from "react-icons/pi";
import { TbPackage } from "react-icons/tb";
import { LuTruck } from "react-icons/lu";
import { BsGift } from "react-icons/bs";
import { TbShieldHeart } from "react-icons/tb";
import "./FeatureBadges.scss";

const BADGES = [
    {
        id: 1,
        icon: <PiFlowerLotus />,
        label: "Premium\nQuality",
    },
    {
        id: 2,
        icon: <TbPackage />,
        label: "Secure\nPackaging",
    },
    {
        id: 3,
        icon: <LuTruck />,
        label: "Pan India\nShipping",
    },
    {
        id: 4,
        icon: <BsGift />,
        label: "Perfect For\nGifting",
    },
    {
        id: 5,
        icon: <TbShieldHeart />,
        label: "Made With\nLove",
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
                            <span className="feature-badges__icon">{badge.icon}</span>
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
                            <span className="feature-badges__marquee-icon">{badge.icon}</span>
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