import React from 'react';
import './BrandStorySection.scss';
import img1 from "../../../assets/images/contact/contact1.jpg";
import img2 from "../../../assets/images/contact/contact2.jpg";
import img3 from "../../../assets/images/contact/contact3.jpg";

const BrandStorySection = () => {
    

    return (
        <div className="brand-story-section">
            <div className="brand-story-container">
                {/* Three Column Layout - All Images */}
                <div className="three-column-grid">

                    {/* COLUMN 1 - Image */}
                    <div className="image-column luxury-card">
                        <div className="image-container">
                            <img
                                src={img1}
                                alt="Sacred Artwork"
                                className="sacred-image"
                            />
                        </div>
                    </div>

                    {/* COLUMN 2 - Image */}
                    <div className="image-column luxury-card">
                        <div className="image-container">
                            <img
                                src={img2}
                                alt="Sacred Artwork"
                                className="sacred-image"
                            />
                        </div>
                    </div>

                    {/* COLUMN 3 - Image */}
                    <div className="image-column luxury-card">
                        <div className="image-container">
                            <img
                                src={img3}
                                alt="Sacred Artwork"
                                className="sacred-image"
                            />
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default BrandStorySection;