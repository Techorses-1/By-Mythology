import React from 'react';
import './BrandStorySection.scss';
import img from "../../../assets/images/contact/contact.jpg";

const BrandStorySection = () => {
    const sacredImage = img;

    return (
        <div className="brand-story-section">
            <div className="brand-story-container">
                {/* Three Column Layout - All Images */}
                <div className="three-column-grid">

                    {/* COLUMN 1 - Image */}
                    <div className="image-column luxury-card">
                        <div className="image-container">
                            <img
                                src={sacredImage}
                                alt="Sacred Artwork"
                                className="sacred-image"
                            />
                        </div>
                    </div>

                    {/* COLUMN 2 - Image */}
                    <div className="image-column luxury-card">
                        <div className="image-container">
                            <img
                                src={sacredImage}
                                alt="Sacred Artwork"
                                className="sacred-image"
                            />
                        </div>
                    </div>

                    {/* COLUMN 3 - Image */}
                    <div className="image-column luxury-card">
                        <div className="image-container">
                            <img
                                src={sacredImage}
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