import React, { useState } from 'react';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import axios from 'axios';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import './ContactForm.scss';
import {
    FiMail,
    FiPhone,
    FiMapPin,
    FiArrowRight,
    FiShield
} from 'react-icons/fi';
import {
    FaWhatsapp,
    FaInstagram,
    FaFacebookF,
    FaPinterestP,
    FaYoutube
} from 'react-icons/fa';

const ContactForm = () => {
    const [isSubmitting, setIsSubmitting] = useState(false);

    // Formik validation schema - ALL FIELDS REQUIRED
    const validationSchema = Yup.object({
        name: Yup.string()
            .min(2, 'Name must be at least 2 characters')
            .required('Name is required'),
        email: Yup.string()
            .email('Invalid email address')
            .required('Email is required'),
        phone: Yup.string()
            .matches(/^[6-9]\d{9}$/, 'Please enter a valid 10-digit mobile number starting with 6-9')
            .required('Phone number is required'),
        subject: Yup.string()
            .required('Please select a subject'),
        message: Yup.string()
            .min(10, 'Message must be at least 10 characters')
            .required('Message is required')
    });

    // Formik configuration
    const formik = useFormik({
        initialValues: {
            name: '',
            email: '',
            phone: '',
            subject: '',
            message: ''
        },
        validationSchema: validationSchema,
        onSubmit: async (values, { resetForm }) => {
            // Prevent double submission
            if (isSubmitting) return;
            
            setIsSubmitting(true);
            
            // Show loading toast
            const loadingToastId = toast.loading('Sending your message...', {
                position: "top-right",
                autoClose: false,
                hideProgressBar: false,
                closeOnClick: false,
                pauseOnHover: true,
                draggable: true,
            });

            try {
                const response = await axios.post(
                    `${import.meta.env.VITE_API_URL}/contact/submit`,
                    values,
                    {
                        headers: {
                            'Content-Type': 'application/json',
                        },
                        timeout: 30000, // 30 seconds timeout
                    }
                );

                if (response.data.success) {
                    // Update loading toast to success
                    toast.update(loadingToastId, {
                        render: response.data.message || "Thank you for your message! We'll respond within 24 hours.",
                        type: "success",
                        isLoading: false,
                        autoClose: 5000,
                        closeOnClick: true,
                    });
                    
                    // Reset form on success
                    resetForm();
                } else {
                    toast.update(loadingToastId, {
                        render: response.data.message || "Something went wrong. Please try again.",
                        type: "error",
                        isLoading: false,
                        autoClose: 5000,
                        closeOnClick: true,
                    });
                }
            } catch (error) {
                console.error("Error submitting form:", error);
                
                let errorMessage = "Failed to send message. Please try again.";
                
                if (error.response?.data?.message) {
                    errorMessage = error.response.data.message;
                } else if (error.code === 'ECONNABORTED') {
                    errorMessage = "Request timed out. Please check your connection and try again.";
                } else if (!navigator.onLine) {
                    errorMessage = "You appear to be offline. Please check your internet connection.";
                }
                
                toast.update(loadingToastId, {
                    render: errorMessage,
                    type: "error",
                    isLoading: false,
                    autoClose: 5000,
                    closeOnClick: true,
                });
            } finally {
                setIsSubmitting(false);
            }
        }
    });

    return (
        <div className="contact-page">
            {/* Toast Container for notifications */}
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

            <div className="contact-container">
                {/* LEFT COLUMN - Contact Form */}
                <div className="contact-left">
                    <div className="section-header">
                        <h2 className="section-title">SEND US A MESSAGE</h2>
                        <div className="section-ornament">
                            <span className="section-ornament-line" />
                            <svg className="section-ornament-diamond" viewBox="0 0 20 10">
                                <polygon points="10,0 20,5 10,10 0,5" fill="#c9a84c" />
                            </svg>
                            <span className="section-ornament-line" />
                        </div>
                    </div>

                    <form onSubmit={formik.handleSubmit} className="contact-form">
                        <div className="form-row">
                            <div className="form-group">
                                <input
                                    type="text"
                                    name="name"
                                    placeholder="Your Name *"
                                    value={formik.values.name}
                                    onChange={formik.handleChange}
                                    onBlur={formik.handleBlur}
                                    disabled={isSubmitting}
                                    className={`form-input ${formik.touched.name && formik.errors.name ? 'error' : ''}`}
                                />
                                {formik.touched.name && formik.errors.name && (
                                    <span className="error-message">{formik.errors.name}</span>
                                )}
                            </div>
                            <div className="form-group">
                                <input
                                    type="email"
                                    name="email"
                                    placeholder="Email Address *"
                                    value={formik.values.email}
                                    onChange={formik.handleChange}
                                    onBlur={formik.handleBlur}
                                    disabled={isSubmitting}
                                    className={`form-input ${formik.touched.email && formik.errors.email ? 'error' : ''}`}
                                />
                                {formik.touched.email && formik.errors.email && (
                                    <span className="error-message">{formik.errors.email}</span>
                                )}
                            </div>
                        </div>

                        <div className="form-group full-width">
                            <input
                                type="tel"
                                name="phone"
                                placeholder="Phone Number *"
                                value={formik.values.phone}
                                onChange={formik.handleChange}
                                onBlur={formik.handleBlur}
                                disabled={isSubmitting}
                                className={`form-input ${formik.touched.phone && formik.errors.phone ? 'error' : ''}`}
                            />
                            {formik.touched.phone && formik.errors.phone && (
                                <span className="error-message">{formik.errors.phone}</span>
                            )}
                        </div>

                        <div className="form-group full-width">
                            <select
                                name="subject"
                                value={formik.values.subject}
                                onChange={formik.handleChange}
                                onBlur={formik.handleBlur}
                                disabled={isSubmitting}
                                className={`form-select ${formik.touched.subject && formik.errors.subject ? 'error' : ''}`}
                            >
                                <option value="">Select Subject *</option>
                                <option value="product-inquiry">Product Inquiry</option>
                                <option value="order-status">Order Status</option>
                                <option value="wholesale">Wholesale Inquiry</option>
                                <option value="collaboration">Collaboration</option>
                                <option value="other">Other</option>
                            </select>
                            {formik.touched.subject && formik.errors.subject && (
                                <span className="error-message">{formik.errors.subject}</span>
                            )}
                        </div>

                        <div className="form-group full-width">
                            <textarea
                                name="message"
                                placeholder="Your Message *"
                                value={formik.values.message}
                                onChange={formik.handleChange}
                                onBlur={formik.handleBlur}
                                disabled={isSubmitting}
                                rows="5"
                                className={`form-textarea ${formik.touched.message && formik.errors.message ? 'error' : ''}`}
                            />
                            {formik.touched.message && formik.errors.message && (
                                <span className="error-message">{formik.errors.message}</span>
                            )}
                        </div>

                        <button 
                            type="submit" 
                            className={`submit-btn ${isSubmitting ? 'submitting' : ''}`} 
                            disabled={isSubmitting}
                        >
                            {isSubmitting ? (
                                <>
                                    <span className="spinner"></span>
                                    SENDING...
                                </>
                            ) : (
                                <>
                                    SEND MESSAGE
                                    <FiArrowRight className="btn-icon" />
                                </>
                            )}
                        </button>

                        <div className="security-note">
                            <FiShield className="shield-icon" />
                            <span>Your information is secure and will only be used to respond to your inquiry.</span>
                        </div>
                    </form>
                </div>

                {/* VERTICAL DIVIDER */}
                <div className="vertical-divider"></div>

                {/* RIGHT COLUMN - Contact Info */}
                <div className="contact-right">
                    <div className="section-header">
                        <h2 className="section-title">GET IN TOUCH</h2>
                        <div className="section-ornament">
                            <span className="section-ornament-line" />
                            <svg className="section-ornament-diamond" viewBox="0 0 20 10">
                                <polygon points="10,0 20,5 10,10 0,5" fill="#c9a84c" />
                            </svg>
                            <span className="section-ornament-line" />
                        </div>
                    </div>

                    <div className="contact-info-list">
                        {/* Email */}
                        <div className="contact-item">
                            <div className="contact-icon">
                                <FiMail />
                            </div>
                            <div className="contact-details">
                                <h4>EMAIL US</h4>
                                <p>We usually respond within 24 hours.</p>
                                <a href="mailto:care@luxuryperfume.com" className="contact-link">
                                    care@luxuryperfume.com
                                </a>
                            </div>
                        </div>
                        <div className="contact-divider"></div>

                        {/* Phone */}
                        <div className="contact-item">
                            <div className="contact-icon">
                                <FiPhone />
                            </div>
                            <div className="contact-details">
                                <h4>CALL US</h4>
                                <p>For urgent assistance.</p>
                                <a href="tel:+919876543210" className="contact-link phone-number">
                                    +91 98765 43210
                                </a>
                            </div>
                        </div>
                        <div className="contact-divider"></div>

                        {/* WhatsApp */}
                        <div className="contact-item">
                            <div className="contact-icon">
                                <FaWhatsapp />
                            </div>
                            <div className="contact-details">
                                <h4>WHATSAPP</h4>
                                <p>Message us directly.</p>
                                <a
                                    href="https://wa.me/919876543210"
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="contact-link phone-number"
                                >
                                    +91 98765 43210
                                </a>
                            </div>
                        </div>
                        <div className="contact-divider"></div>

                        {/* Visit Us */}
                        <div className="contact-item">
                            <div className="contact-icon">
                                <FiMapPin />
                            </div>
                            <div className="contact-details">
                                <h4>VISIT US</h4>
                                <p>Office Location</p>
                                <a
                                    href="https://maps.google.com/?q=Vadodara+Gujarat"
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="contact-link"
                                >
                                    Vadodara, Gujarat
                                </a>
                            </div>
                        </div>
                        <div className="contact-divider"></div>

                        {/* Social Media */}
                        <div className="contact-item social-item">
                            <div className="contact-icon">
                                <FaInstagram />
                            </div>
                            <div className="contact-details social-details">
                                <h4>FOLLOW OUR JOURNEY</h4>
                                <div className="social-row">
                                    <div className="social-text">
                                        <p>Stay connected for stories,</p>
                                        <p>launches and updates</p>
                                    </div>
                                    <div className="social-icons">
                                        <a href="https://instagram.com" target="_blank" rel="noopener noreferrer" className="social-link">
                                            <FaInstagram />
                                        </a>
                                        <a href="https://facebook.com" target="_blank" rel="noopener noreferrer" className="social-link">
                                            <FaFacebookF />
                                        </a>
                                        <a href="https://pinterest.com" target="_blank" rel="noopener noreferrer" className="social-link">
                                            <FaPinterestP />
                                        </a>
                                        <a href="https://youtube.com" target="_blank" rel="noopener noreferrer" className="social-link">
                                            <FaYoutube />
                                        </a>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ContactForm;