import React from "react";
import "./CandleMakingSection.scss";

import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation } from "swiper/modules";

import "swiper/css";
import "swiper/css/navigation";

import making1 from "../../../assets/images/about/making1.jpg";
import making2 from "../../../assets/images/about/making2.jpg";
import making3 from "../../../assets/images/about/making3.jpg";
import making4 from "../../../assets/images/about/making4.jpg";
import making5 from "../../../assets/images/about/making5.jpg";
import making6 from "../../../assets/images/about/making6.jpg";
import { IoArrowBack, IoArrowForward } from "react-icons/io5";

const candleSteps = [
    {
        id: "01",
        title: "CLEAN INGREDIENTS",
        description:
            "We use natural soy wax, clean fragrance oils and essential oils.",
        image: making1,
    },
    {
        id: "02",
        title: "HAND POURED",
        description:
            "Poured in small batches to ensure the highest quality and care.",
        image: making2,
    },
    {
        id: "03",
        title: "WOODEN WICK",
        description:
            "Crackling wooden wick for a warm, comforting ambience.",
        image: making3,
    },
    {
        id: "04",
        title: "ORIGINAL ARTWORK",
        description:
            "Each label features original paintings by Indian artists.",
        image: making4,
    },
    {
        id: "05",
        title: "LUXURY FINISH",
        description:
            "Gold embossed lids and premium packaging for a luxurious experience.",
        image: making5,
    },
    {
        id: "06",
        title: "PERFECTLY PACKAGED",
        description:
            "Carefully packed to be a perfect gift for every occasion.",
        image: making6,
    },
];

const CandleMakingSection = () => {
    return (
        <section className="candle-making-section">
            {/* HEADING WITH ORNAMENT */}
            <div className="candle-making-heading">
                <span>THE MAKING OF EACH CANDLE</span>

                <div className="candle-making-ornament">
                    <span className="candle-making-ornament-line" />
                    <svg className="candle-making-ornament-diamond" viewBox="0 0 20 10">
                        <polygon points="10,0 20,5 10,10 0,5" fill="#c9a84c" />
                    </svg>
                    <span className="candle-making-ornament-line" />
                </div>

                <p>
                    Thoughtfully crafted. Consciously created.
                </p>
            </div>

            {/* DESKTOP VIEW */}
            <div className="candle-making-desktop">
                {candleSteps.map((item) => (
                    <div className="candle-making-card" key={item.id}>
                        <div className="candle-making-image">
                            <img src={item.image} alt={item.title} />
                        </div>

                        <div className="candle-making-content">
                            <h5>{item.id}</h5>
                            <h3>{item.title}</h3>
                            <p>{item.description}</p>
                        </div>
                    </div>
                ))}
            </div>

            {/* MOBILE + TABLET SLIDER */}
            <div className="candle-making-slider-wrapper">
                <Swiper
                    modules={[Navigation]}
                    navigation={{
                        nextEl: ".candle-next",
                        prevEl: ".candle-prev",
                    }}
                    loop={true}
                    speed={900}
                    spaceBetween={20}
                    slidesPerView={2}
                    breakpoints={{
                        768: {
                            slidesPerView: 3,
                        },
                    }}
                    className="candle-making-swiper"
                >
                    {candleSteps.map((item) => (
                        <SwiperSlide key={item.id}>
                            <div className="candle-making-card">
                                <div className="candle-making-image">
                                    <img src={item.image} alt={item.title} />
                                </div>

                                <div className="candle-making-content">
                                    <h5>{item.id}</h5>
                                    <h3>{item.title}</h3>
                                    <p>{item.description}</p>
                                </div>
                            </div>
                        </SwiperSlide>
                    ))}
                </Swiper>

                {/* ARROWS AFTER THE SWIPER */}
                <div className="candle-making-arrows">
                    <button className="candle-prev">
                        <IoArrowBack />
                    </button>
                    <button className="candle-next">
                        <IoArrowForward />
                    </button>
                </div>
            </div>
        </section>
    );
};

export default CandleMakingSection;