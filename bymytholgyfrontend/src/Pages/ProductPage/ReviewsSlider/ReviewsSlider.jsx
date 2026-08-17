// ReviewsSlider.jsx
import React from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, Autoplay } from "swiper/modules";
import "swiper/css";
import "swiper/css/navigation";
import "./ReviewsSlider.scss";
import { IoIosArrowRoundBack, IoIosArrowRoundForward } from "react-icons/io";

const ReviewsSlider = () => {
  // Dummy reviews data
  const reviewsData = [
    {
      id: 1,
      name: "Aditya Sharma",
      city: "Mumbai",
      rating: 5,
      review: "Absolutely divine! The fragrance lasts all day and evolves beautifully. Every compliment I receive confirms this was worth every penny.",
    },
    {
      id: 2,
      name: "Priya Mehta",
      city: "Delhi",
      rating: 5,
      review: "The most luxurious perfume I've ever owned. The notes blend perfectly and it smells like pure elegance in a bottle.",
    },
    {
      id: 3,
      name: "Rahul Verma",
      city: "Bangalore",
      rating: 4,
      review: "Exceptional quality and longevity. A signature scent that truly stands out. Highly recommended for special occasions.",
    },
    {
      id: 4,
      name: "Neha Singh",
      city: "Kolkata",
      rating: 5,
      review: "This perfume is an olfactory masterpiece. The heart notes are intoxicating and the dry down is pure perfection.",
    },
    {
      id: 5,
      name: "Vikram Malhotra",
      city: "Chennai",
      rating: 5,
      review: "Finally found my signature scent. The craftsmanship is evident in every spray. Worth every rupee!",
    },
    {
      id: 6,
      name: "Anjali Nair",
      city: "Hyderabad",
      rating: 4,
      review: "Beautiful composition that gets better with time. Projects well without being overwhelming. Truly premium.",
    }
  ];

  const renderStars = (rating) => {
    const stars = [];
    for (let i = 1; i <= 5; i++) {
      stars.push(
        <span key={i} className={`star ${i <= rating ? 'filled' : 'empty'}`}>★</span>
      );
    }
    return stars;
  };

  // Refs for navigation
  const prevRef = React.useRef(null);
  const nextRef = React.useRef(null);

  return (
    <div className="reviews-slider-section">
      <div className="section-header">
        {/* <span className="gold-accent-title"></span> */}
        <h2 className="section-title">SACRED EXPERIENCES SHARED</h2>
        <div className="section-ornament">
            <span className="section-ornament-line" />
            <svg className="section-ornament-diamond" viewBox="0 0 20 10">
              <polygon points="10,0 20,5 10,10 0,5" fill="#c9a84c" />
            </svg>
            <span className="section-ornament-line" />
          </div>
      </div>

      <div className="reviews-slider-wrapper">
        <Swiper
          modules={[Navigation, Autoplay]}
          spaceBetween={24}
          slidesPerView={1}
          loop={true}
          autoplay={{
            delay: 4000,
            disableOnInteraction: false,
            pauseOnMouseEnter: true
          }}
          speed={800}
          navigation={{
            prevEl: prevRef.current,
            nextEl: nextRef.current,
          }}
          onBeforeInit={(swiper) => {
            swiper.params.navigation.prevEl = prevRef.current;
            swiper.params.navigation.nextEl = nextRef.current;
          }}
          breakpoints={{
            640: {
              slidesPerView: 1,
              spaceBetween: 20
            },
            768: {
              slidesPerView: 2,
              spaceBetween: 24
            },
            1024: {
              slidesPerView: 3,
              spaceBetween: 24
            }
          }}
          className="reviews-card-swiper"
        >
          {reviewsData.map((review) => (
            <SwiperSlide key={review.id}>
              <div className="review-card">
                <div className="quote-icon">“</div>
                <div className="stars-container">
                  {renderStars(review.rating)}
                </div>
                <div className="review-content">
                  <p>"{review.review}"</p>
                </div>
                <div className="reviewer-info">
                  <div className="reviewer-name">{review.name}</div>
                  <div className="reviewer-city">{review.city}</div>
                </div>
              </div>
            </SwiperSlide>
          ))}
        </Swiper>

        {/* Both arrows at bottom right */}
        {/* <div className="slider-nav-container">
          <button className="slider-nav-btn" ref={prevRef}>
            <IoIosArrowRoundBack size={28} />
          </button>
          <button className="slider-nav-btn" ref={nextRef}>
            <IoIosArrowRoundForward size={28} />
          </button>
        </div> */}
      </div>
    </div>
  );
};

export default ReviewsSlider;