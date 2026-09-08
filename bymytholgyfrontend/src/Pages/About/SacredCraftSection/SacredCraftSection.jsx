import React from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay, Pagination } from "swiper/modules";
import "swiper/css";
import "swiper/css/pagination";

import { PiFlowerLotus } from "react-icons/pi";
import { GiLeafSwirl, GiAbstract050 } from "react-icons/gi";
import { TbHandClick } from "react-icons/tb";
import { HiOutlineGlobeAlt } from "react-icons/hi";

import icon1 from "../../../assets/images/about/topicon1.jpg"
import icon2 from "../../../assets/images/about/topicon2.jpg"
import icon3 from "../../../assets/images/about/topicon3.jpg"
import icon4 from "../../../assets/images/about/topicon4.jpg"
import icon5 from "../../../assets/images/about/topicon5.jpg"

import "./SacredCraftSection.scss";

const SACRED_ITEMS = [
    {
        id: 1,
        icon: <PiFlowerLotus />,
        title: "INSPIRED BY THE EPIC",
        description: "Each candle is inspired by a sacred chapter of the Ramayana.",
    },
    {
        id: 2,
        icon: <GiLeafSwirl />,
        title: "NATURAL & CLEAN",
        description: "Made with natural soy wax, clean fragrance oils and essential oils.",
    },
    {
        id: 3,
        icon: <TbHandClick />,
        title: "HANDCRAFTED",
        description: "Hand poured in small batches with love, intention and precision.",
    },
    {
        id: 4,
        icon: <GiAbstract050 />,
        title: "ARTISANAL ARTWORK",
        description: "Original artwork by Indian artists that bring each story to life.",
    },
    {
        id: 5,
        icon: <HiOutlineGlobeAlt />,
        title: "CONSCIOUS CHOICE",
        description: "Sustainable materials and eco-friendly packaging for a better planet.",
    },
];

const SacredCraftSection = () => {
    return (
        <section className="sacred-craft-section">

            {/* ── Desktop: static row ─────────────────────────────────── */}
            <div className="sacred-craft-wrapper sacred-craft-desktop">
                {SACRED_ITEMS.map((item, index) => (
                    <React.Fragment key={item.id}>
                        <div className="sacred-craft-card">
                            <div className="sacred-craft-icon">{item.icon}</div>
                            <h3 className="sacred-craft-title">{item.title}</h3>
                            <p className="sacred-craft-description">{item.description}</p>
                        </div>
                        {index !== SACRED_ITEMS.length - 1 && (
                            <span className="sacred-craft-divider" />
                        )}
                    </React.Fragment>
                ))}
            </div>

            {/* ── Tablet: 3 per view ──────────────────────────────────── */}
            <div className="sacred-craft-slider sacred-craft-tablet">
                <Swiper
                    modules={[Autoplay, Pagination]}
                    slidesPerView={3}
                    slidesPerGroup={1}
                    loop={true}
                    speed={600}
                    autoplay={{ delay: 3000, disableOnInteraction: false }}
                    pagination={{ clickable: true, el: ".sc-dots-tablet" }}
                    spaceBetween={0}
                >
                    {SACRED_ITEMS.map((item) => (
                        <SwiperSlide key={item.id}>
                            <div className="sacred-craft-card">
                                <div className="sacred-craft-icon">{item.icon}</div>
                                <h3 className="sacred-craft-title">{item.title}</h3>
                                <p className="sacred-craft-description">{item.description}</p>
                            </div>
                        </SwiperSlide>
                    ))}
                </Swiper>
                <div className="sc-dots-tablet sc-dots" />
            </div>

            {/* ── Mobile: 2 per view ──────────────────────────────────── */}
            <div className="sacred-craft-slider sacred-craft-mobile">
                <Swiper
                    modules={[Autoplay, Pagination]}
                    slidesPerView={2}
                    slidesPerGroup={1}
                    loop={true}
                    speed={600}
                    autoplay={{ delay: 3000, disableOnInteraction: false }}
                    pagination={{ clickable: true, el: ".sc-dots-mobile" }}
                    spaceBetween={0}
                >
                    {SACRED_ITEMS.map((item) => (
                        <SwiperSlide key={item.id}>
                            <div className="sacred-craft-card">
                                <div className="sacred-craft-icon">{item.icon}</div>
                                <h3 className="sacred-craft-title">{item.title}</h3>
                                <p className="sacred-craft-description">{item.description}</p>
                            </div>
                        </SwiperSlide>
                    ))}
                </Swiper>
                <div className="sc-dots-mobile sc-dots" />
            </div>

        </section>
    );
};

export default SacredCraftSection;