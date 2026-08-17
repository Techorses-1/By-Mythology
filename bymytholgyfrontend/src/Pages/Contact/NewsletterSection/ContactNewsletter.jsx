import React, { useState } from 'react';
import axios from 'axios';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import './ContactNewsletter.scss';
import { FiArrowRight } from 'react-icons/fi';
import newsletterImg from "../../../assets/images/contact/news-contact.png";

const ContactNewsletter = () => {
  const [email, setEmail] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubscribe = async () => {
    // Validate email
    if (!email) {
      toast.error('Please enter your email address');
      return;
    }

    const emailRegex = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;
    if (!emailRegex.test(email)) {
      toast.error('Please enter a valid email address');
      return;
    }

    // Prevent double submission
    if (isSubmitting) return;
    
    setIsSubmitting(true);
    
    // Show loading toast
    const loadingToastId = toast.loading('Subscribing...', {
      position: "top-right",
      autoClose: false,
      hideProgressBar: false,
    });

    try {
      const response = await axios.post(
        `${import.meta.env.VITE_API_URL}/newsletter/subscribe`,
        { email, source: "website" },
        {
          headers: { 'Content-Type': 'application/json' },
          timeout: 30000,
        }
      );

      if (response.data.success) {
        toast.update(loadingToastId, {
          render: response.data.message || "Successfully subscribed to newsletter! Check your email.",
          type: "success",
          isLoading: false,
          autoClose: 5000,
        });
        setEmail(''); // Clear input on success
      }
    } catch (error) {
      console.error("Error subscribing:", error);
      
      let errorMessage = "Failed to subscribe. Please try again.";
      
      if (error.response?.data?.message) {
        errorMessage = error.response.data.message;
      } else if (!navigator.onLine) {
        errorMessage = "You appear to be offline. Please check your internet connection.";
      }
      
      toast.update(loadingToastId, {
        render: errorMessage,
        type: "error",
        isLoading: false,
        autoClose: 5000,
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      handleSubscribe();
    }
  };

  return (
    <div className="contact-newsletter-section">
      <ToastContainer
        position="top-right"
        autoClose={5000}
        hideProgressBar={false}
        newestOnTop={true}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="dark"
        toastStyle={{
          background: '#0f0f0f',
          color: '#f5f0e8',
          border: '1px solid #c9a84c',
          borderRadius: '10px',
        }}
      />

      <div className="contact-newsletter-container">
        
        {/* LEFT - Product Image */}
        <div className="contact-newsletter-image">
          <img 
            src={newsletterImg} 
            alt="Luxury Product"
          />
        </div>

        {/* CENTER - Content */}
        <div className="contact-newsletter-content">
          <h2 className="contact-newsletter-title">STAY CONNECTED</h2>
          <p className="contact-newsletter-description">
            Join our newsletter to receive updates on new chapters, exclusive offers and more.
          </p>
        </div>

        {/* RIGHT - Form */}
        <div className="contact-newsletter-form">
          <div className="contact-newsletter-form-group">
            <input 
              type="email" 
              placeholder="Enter your email address"
              className="contact-newsletter-input"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              onKeyPress={handleKeyPress}
              disabled={isSubmitting}
            />
            <button 
              className={`contact-newsletter-btn ${isSubmitting ? 'submitting' : ''}`}
              onClick={handleSubscribe}
              disabled={isSubmitting}
            >
              {isSubmitting ? <span className="spinner"></span> : <FiArrowRight />}
            </button>
          </div>
          <p className="contact-newsletter-disclaimer">
            No spam. Only stories, launches and offers.
          </p>
        </div>

      </div>
    </div>
  );
};

export default ContactNewsletter;