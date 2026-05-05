import React, { useState } from 'react';
import emailjs from '@emailjs/browser';
import Swal from 'sweetalert2';
import './Contact.css';

const Contact = () => {
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        message: ''
    });
    const [isSubmitting, setIsSubmitting] = useState(false);

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsSubmitting(true);

        const templateParams = {
            from_name: formData.name,
            reply_to: formData.email,
            message: formData.message,
            current_date: new Date().toLocaleString()
        };

        const autoReplyParams = {
            to_name: formData.name,
            to_email: formData.email,
            from_name: formData.name,
            message: formData.message,
            reply_to: 'shoibsahmad@gmail.com'
        };

        try {
            await emailjs.init('W-1fxkwC0rOyOEvqa');

            // Send main email
            await emailjs.send('service_jo38u8b', 'template_jkspt2b', templateParams);

            // Send auto-reply
            try {
                await emailjs.send('service_jo38u8b', 'template_kmut55i', autoReplyParams);
            } catch (err) {
                console.error("Auto-reply failed", err);
            }

            Swal.fire({
                title: 'Message Sent! ✉️',
                text: "Thank you for reaching out! I'll get back to you within 24-48 hours.",
                icon: 'success',
                confirmButtonColor: '#c15f3c',
                confirmButtonText: 'Great!',
                timer: 3000
            });

            setFormData({ name: '', email: '', message: '' });

        } catch (error) {
            console.error('Error:', error);
            Swal.fire({
                title: 'Message Received!',
                text: 'Thank you! Please contact me directly at shoibsahmad@gmail.com',
                icon: 'info',
                confirmButtonColor: '#c15f3c'
            });
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <section id="contact" className="contact">
            <div className="container">
                <h2 className="section-title">Contact</h2>
                <div className="contact-content">
                    <div className="contact-info animate-on-scroll">
                        <h3>Let's Connect</h3>
                        <p>I'm always open to discussing new opportunities, innovative projects, and collaborations.</p>
                        <div className="contact-details">
                            <div className="contact-detail-item">
                                <i className="fas fa-envelope"></i>
                                <div>
                                    <h4>Email</h4>
                                    <p>shoibsahmad@gmail.com</p>
                                </div>
                            </div>

                            <div className="contact-detail-item">
                                <i className="fas fa-map-marker-alt"></i>
                                <div>
                                    <h4>Location</h4>
                                    <p>Lucknow, India</p>
                                </div>
                            </div>
                            <div className="contact-detail-item">
                                <i className="fab fa-linkedin"></i>
                                <div>
                                    <h4>LinkedIn</h4>
                                    <p><a href="https://www.linkedin.com/in/shoib-ahmad-788096219/" target="_blank" rel="noopener noreferrer">linkedin.com/in/shoib-ahmad-788096219/</a></p>
                                </div>
                            </div>
                            <div className="contact-detail-item">
                                <i className="fab fa-whatsapp"></i>
                                <div>
                                    <h4>WhatsApp</h4>
                                    <p><a href="https://wa.me/918853741966" target="_blank" rel="noopener noreferrer">+91 8853741966</a></p>
                                </div>
                            </div>
                        </div>
                    </div>
                    <form id="contact-form" className="contact-form animate-on-scroll" style={{ transitionDelay: '200ms' }} onSubmit={handleSubmit}>
                        <h3>Send a Message</h3>
                        <div className="form-group">
                            <label htmlFor="name">Name</label>
                            <input
                                type="text"
                                id="name"
                                name="name"
                                value={formData.name}
                                onChange={handleChange}
                                required
                            />
                        </div>
                        <div className="form-group">
                            <label htmlFor="email">Email</label>
                            <input
                                type="email"
                                id="email"
                                name="email"
                                value={formData.email}
                                onChange={handleChange}
                                required
                            />
                        </div>
                        <div className="form-group">
                            <label htmlFor="message">Message</label>
                            <textarea
                                id="message"
                                name="message"
                                rows="5"
                                value={formData.message}
                                onChange={handleChange}
                                required
                            ></textarea>
                        </div>
                        <button
                            type="submit"
                            className="btn btn-primary"
                            disabled={isSubmitting}
                            style={{
                                transform: isSubmitting ? 'scale(0.95)' : 'scale(1)',
                                transition: 'all 0.3s'
                            }}
                        >
                            {isSubmitting ? (
                                <><i className="fas fa-spinner fa-spin"></i> Sending...</>
                            ) : (
                                'Send Message'
                            )}
                        </button>
                    </form>
                </div>
            </div>
        </section>
    );
};

export default Contact;
