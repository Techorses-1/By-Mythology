import React from "react";

import {
    TbLeaf,
    TbHandStop,
    TbGift,
    TbHeart,
} from "react-icons/tb";

import "./EpicBanner.scss";

const bannerFeatures = [
    {
        icon: <TbLeaf />,
        title: "NATURAL\nINGREDIENTS",
    },

    {
        icon: <TbHandStop />,
        title: "HAND POURED\nIN SMALL BATCHES",
    },

    {
        icon: <TbGift />,
        title: "LUXURY\nPACKAGING",
    },

    {
        icon: <TbHeart />,
        title: "MADE\nWITH LOVE",
    },
];

const EpicBanner = () => {
    return (
        <section className="epic-banner">
            {/* LEFT CONTENT */}

            <div className="epic-banner__left">
                <div className="epic-banner__lotus">
                    ✦
                </div>

                <div className="epic-banner__content">
                    <h2>
                        MORE THAN A CANDLE. IT’S A CHAPTER OF THE EPIC.
                    </h2>

                    <p>
                        Hand poured in small batches using natural wax,
                        wooden wicks and original artworks inspired by
                        the Ramayana.
                    </p>
                </div>
            </div>

            {/* CENTER FEATURES */}

            <div className="epic-banner__features">
                {bannerFeatures.map((item, index) => (
                    <div className="epic-banner__feature" key={index}>
                        <div className="epic-banner__icon">
                            {item.icon}
                        </div>

                        <h4>
                            {item.title.split("\n").map((line, i) => (
                                <React.Fragment key={i}>
                                    {line}
                                    <br />
                                </React.Fragment>
                            ))}
                        </h4>
                    </div>
                ))}
            </div>

            {/* RIGHT CTA */}

            <div className="epic-banner__cta">
                <h3>
                    A PERFECT GIFT FOR
                    <br />
                    EVERY OCCASION
                </h3>

                <button>
                    EXPLORE GIFTING
                    <span>→</span>
                </button>
            </div>
        </section>
    );
};

export default EpicBanner;