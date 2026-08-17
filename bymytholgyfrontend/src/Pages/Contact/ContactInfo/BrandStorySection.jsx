import React from 'react';
import './BrandStorySection.scss';
import { FiMail, FiClock, FiShield } from 'react-icons/fi';
import { GiLotus } from "react-icons/gi";
import img from "../../../assets/images/contact/contact-info.png";

const BrandStorySection = () => {
    const sacredImage = img;

    return (
        <div className="brand-story-section">
            <div className="brand-story-container">



                {/* Three Column Layout */}
                <div className="three-column-grid">

                    {/* COLUMN 1 - Promise Section */}
                    <div className="promise-column luxury-card">
                        <div className="promise-header">
                            <h3 className="promise-subtitle">OUR PROMISE TO YOU</h3>
                            <div className="section-ornament">
                                <span className="section-ornament-line" />
                                <svg className="section-ornament-diamond" viewBox="0 0 20 10">
                                    <polygon points="10,0 20,5 10,10 0,5" fill="#c9a84c" />
                                </svg>
                                <span className="section-ornament-line" />
                            </div>
                        </div>

                        <div className="promise-items">
                            <div className="promise-item">
                                <div className="promise-icon">
                                    <FiMail />
                                </div>
                                <div className="promise-content">
                                    <h4>WE RESPOND WITH CARE</h4>
                                    <p>Every message is important to us.</p>
                                </div>
                            </div>

                            <div className="promise-item">
                                <div className="promise-icon">
                                    <FiClock />
                                </div>
                                <div className="promise-content">
                                    <h4>WE RESPECT YOUR TIME</h4>
                                    <p>We strive to reply within 24 hours.</p>
                                </div>
                            </div>

                            <div className="promise-item">
                                <div className="promise-icon">
                                    <FiShield />
                                </div>
                                <div className="promise-content">
                                    <h4>WE VALUE YOUR TRUST</h4>
                                    <p>Your privacy and satisfaction are our top priorities.</p>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* COLUMN 2 - Sacred Artwork Image */}
                    <div className="image-column luxury-card">
                        <div className="image-container">
                            <img
                                src={sacredImage}
                                alt="Sacred Artwork"
                                className="sacred-image"
                            />
                        </div>
                    </div>

                    {/* COLUMN 3 - Story Section */}
                    <div className="story-column luxury-card">
                        <div className="story-content">
                            <h3 className="story-title">INSPIRED BY THE EPIC</h3>
                            <div className="story-ornament">
                                <span className="section-ornament-line" />
                                <svg className="section-ornament-diamond" viewBox="0 0 20 10">
                                    <polygon points="10,0 20,5 10,10 0,5" fill="#c9a84c" />
                                </svg>
                                <span className="section-ornament-line" />
                            </div>

                            <div className="story-text">
                                <p>The Ramayana teaches us that every conversation can be an act of connection, understanding and kindness.</p>
                                <p>We carry that spirit into every interaction with you.</p>
                            </div>

                            <div className="lotus-icon">
                                <GiLotus />
                            </div>

                            <div className="virtues">
                                <span>Faith</span>
                                <span>Devotion</span>
                                <span>Connection</span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default BrandStorySection;