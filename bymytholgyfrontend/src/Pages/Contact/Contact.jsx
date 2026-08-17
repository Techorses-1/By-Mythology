import React, { useRef } from 'react';
import ContactHero from './ContactHero/ContactHero';
import ContactForm from './ContactForm/ContactForm';
import BrandStorySection from './ContactInfo/BrandStorySection';
import ContactNewsletter from './NewsletterSection/ContactNewsletter';

const Contact = () => {
    const formRef = useRef(null);

    const scrollToForm = () => {
        if (formRef.current) {
            formRef.current.scrollIntoView({ 
                behavior: 'smooth',
                block: 'start'
            });
        }
    };

    return (
        <>
            <ContactHero scrollToForm={scrollToForm} />
            <div ref={formRef}>
                <ContactForm />
            </div>
            <BrandStorySection />
            <ContactNewsletter />
        </>
    );
};

export default Contact;