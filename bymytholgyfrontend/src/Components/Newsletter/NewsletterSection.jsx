import React, { useEffect, useRef, useState } from "react";
import axios from "axios";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import "./NewsletterSection.scss";
import newsletterBg from "../../assets/images/home/newsletter.png";

const NewsletterSection = () => {
    const sectionRef = useRef(null);
    const contentRef = useRef(null);
    const [email, setEmail] = useState("");
    const [isSubmitting, setIsSubmitting] = useState(false);

    useEffect(() => {
        const observer = new IntersectionObserver(
            ([entry]) => {
                if (entry.isIntersecting) {
                    sectionRef.current?.classList.add("newsletter-section--visible");
                    if (contentRef.current) {
                        contentRef.current.classList.add("newsletter-content--visible");
                    }
                    observer.disconnect();
                }
            },
            { threshold: 0.3 }
        );

        if (sectionRef.current) observer.observe(sectionRef.current);
        return () => observer.disconnect();
    }, []);

    const handleSubmit = async (e) => {
        e.preventDefault();
        
        // Validate email
        if (!email) {
            toast.error("Please enter your email address");
            return;
        }

        const emailRegex = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;
        if (!emailRegex.test(email)) {
            toast.error("Please enter a valid email address");
            return;
        }

        // Prevent double submission
        if (isSubmitting) return;
        
        setIsSubmitting(true);
        
        // Show loading toast
        const loadingToastId = toast.loading("Subscribing to newsletter...", {
            position: "top-right",
            autoClose: false,
            hideProgressBar: false,
            closeOnClick: false,
            pauseOnHover: true,
        });

        try {
            const response = await axios.post(
                `${import.meta.env.VITE_API_URL}/newsletter/subscribe`,
                { email, source: "homepage" },
                {
                    headers: { "Content-Type": "application/json" },
                    timeout: 30000,
                }
            );

            if (response.data.success) {
                toast.update(loadingToastId, {
                    render: response.data.message || "Successfully subscribed! Check your email for confirmation.",
                    type: "success",
                    isLoading: false,
                    autoClose: 5000,
                    closeOnClick: true,
                });
                setEmail(""); // Clear input on success
            }
        } catch (error) {
            console.error("Error subscribing:", error);
            
            let errorMessage = "Failed to subscribe. Please try again.";
            
            if (error.response?.data?.message) {
                errorMessage = error.response.data.message;
                // If already subscribed, still show error but clear input? No, keep email
                if (error.response.data.alreadySubscribed) {
                    // Don't clear email, user might want to use different email
                }
            } else if (error.code === "ECONNABORTED") {
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
    };

    return (
        <section
            className="newsletter-section"
            ref={sectionRef}
            style={{ backgroundImage: `url(${newsletterBg})` }}
        >
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

            <div className="newsletter-overlay"></div>

            <div className="newsletter-content" ref={contentRef}>
                <h2>JOIN THE RITUAL</h2>

                <p>
                    Join our inner circle for early access,<br />
                    exclusive offers and stories<br />
                    from the epic.
                </p>

                <form className="newsletter-form" onSubmit={handleSubmit}>
                    <div className="newsletter-input-wrapper">
                        <input
                            type="email"
                            className="newsletter-input"
                            placeholder="Your email address"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            disabled={isSubmitting}
                            required
                        />
                        <button 
                            type="submit" 
                            className={`newsletter-submit ${isSubmitting ? 'submitting' : ''}`}
                            disabled={isSubmitting}
                            aria-label="Subscribe"
                        >
                            {isSubmitting ? (
                                <span className="spinner"></span>
                            ) : (
                                <span>→</span>
                            )}
                        </button>
                    </div>
                </form>
            </div>
        </section>
    );
};

export default NewsletterSection;