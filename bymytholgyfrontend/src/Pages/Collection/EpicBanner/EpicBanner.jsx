import React from "react";
import "./EpicBanner.scss";

import mainicon from "../../../assets/images/collection/main-icon.png";
import icon1 from "../../../assets/images/collection/icon1.png";
import icon2 from "../../../assets/images/collection/icon2.png";
import icon3 from "../../../assets/images/collection/icon3.png";
import icon4 from "../../../assets/images/collection/icon4.png";

const bannerFeatures = [
    {
        icon: icon1,
        title: "NATURAL\nINGREDIENTS",
    },
    {
        icon: icon2,
        title: "HAND POURED\nIN SMALL BATCHES",
    },
    {
        icon: icon3,
        title: "LUXURY\nPACKAGING",
    },
    {
        icon: icon4,
        title: "MADE\nWITH LOVE",
    },
];

const EpicBanner = () => {
    return (
        <section className="epic-banner">
            {/* LEFT CONTENT */}
            <div className="epic-banner__left">
                <div className="epic-banner__lotus">
                    <img src={mainicon} alt="Main Icon" />
                </div>

                <div className="epic-banner__content">
                    <h2>
                        MORE THAN A CANDLE. IT'S A CHAPTER OF THE EPIC.
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
                            <img src={item.icon} alt={item.title.replace("\n", " ")} />
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