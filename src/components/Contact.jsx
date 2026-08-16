import React, { useState } from 'react';
import { motion } from 'framer-motion';
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
                confirmButtonColor: '#FF6B00',
                confirmButtonText: 'Great!',
                timer: 3500
            });

            setFormData({ name: '', email: '', message: '' });

        } catch (error) {
            console.error('Error:', error);
            Swal.fire({
                title: 'Message Received!',
                text: 'Thank you! Please contact me directly at shoibsahmad@gmail.com',
                icon: 'info',
                confirmButtonColor: '#FF6B00'
            });
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <section id="contact" className="contact">
            <div className="container">
                <div className="contact-header text-center">
                    <div className="contact-badge">
                        <span className="badge-dot"></span>
                        GET IN TOUCH
                    </div>
                    <h2 className="section-title">
                        Let's Build Something <span className="hero-title-accent">Exceptional.</span>
                    </h2>
                    <p className="section-subtitle">
                        I'm always open to discussing new opportunities, high-impact projects, or AI engineering collaborations.
                    </p>
                </div>

                <div className="contact-content">
                    <motion.div
                        className="contact-info spotlight-card"
                        initial={{ opacity: 0, x: -30 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.6 }}
                    >
                        <h3>Connect Directly</h3>
                        <p>Have an ambitious project in mind, an open role, or need architectural consultation? Reach out across any channel.</p>
                        
                        <div className="contact-details">
                            <motion.a
                                href="mailto:shoibsahmad@gmail.com"
                                className="contact-detail-item"
                                whileHover={{ x: 6 }}
                                transition={{ type: "spring", stiffness: 350 }}
                            >
                                <div className="contact-icon-box">
                                    <i className="fas fa-envelope"></i>
                                </div>
                                <div>
                                    <h4>Email</h4>
                                    <p>shoibsahmad@gmail.com</p>
                                </div>
                            </motion.a>

                            <motion.div
                                className="contact-detail-item"
                                whileHover={{ x: 6 }}
                                transition={{ type: "spring", stiffness: 350 }}
                            >
                                <div className="contact-icon-box">
                                    <i className="fas fa-map-marker-alt"></i>
                                </div>
                                <div>
                                    <h4>Location</h4>
                                    <p>Lucknow, India (Open to Remote / Relocation)</p>
                                </div>
                            </motion.div>

                            <motion.a
                                href="https://www.linkedin.com/in/shoib-ahmad-788096219/"
                                target="_blank"
                                rel="noopener noreferrer"
                                className="contact-detail-item"
                                whileHover={{ x: 6 }}
                                transition={{ type: "spring", stiffness: 350 }}
                            >
                                <div className="contact-icon-box">
                                    <i className="fab fa-linkedin"></i>
                                </div>
                                <div>
                                    <h4>LinkedIn</h4>
                                    <p>linkedin.com/in/shoib-ahmad</p>
                                </div>
                            </motion.a>

                            <motion.a
                                href="https://wa.me/918853741966"
                                target="_blank"
                                rel="noopener noreferrer"
                                className="contact-detail-item"
                                whileHover={{ x: 6 }}
                                transition={{ type: "spring", stiffness: 350 }}
                            >
                                <div className="contact-icon-box">
                                    <i className="fab fa-whatsapp"></i>
                                </div>
                                <div>
                                    <h4>WhatsApp</h4>
                                    <p>+91 8853741966</p>
                                </div>
                            </motion.a>
                        </div>
                    </motion.div>

                    <motion.form
                        id="contact-form"
                        className="contact-form spotlight-card"
                        onSubmit={handleSubmit}
                        initial={{ opacity: 0, x: 30 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.6, delay: 0.15 }}
                    >
                        <h3>Send a Direct Message</h3>
                        <div className="form-group">
                            <label htmlFor="name">Your Name</label>
                            <input
                                type="text"
                                id="name"
                                name="name"
                                placeholder="e.g. Alex Morgan"
                                value={formData.name}
                                onChange={handleChange}
                                required
                            />
                        </div>
                        <div className="form-group">
                            <label htmlFor="email">Email Address</label>
                            <input
                                type="email"
                                id="email"
                                name="email"
                                placeholder="alex@company.com"
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
                                placeholder="Tell me about your project, timeline, or idea..."
                                value={formData.message}
                                onChange={handleChange}
                                required
                            ></textarea>
                        </div>
                        <motion.button
                            type="submit"
                            className="btn btn-primary contact-submit-btn"
                            disabled={isSubmitting}
                            whileHover={{ scale: 1.02, y: -2 }}
                            whileTap={{ scale: 0.98 }}
                        >
                            {isSubmitting ? (
                                <><i className="fas fa-spinner fa-spin"></i> Sending Message...</>
                            ) : (
                                <><i className="fas fa-paper-plane"></i> Send Message</>
                            )}
                        </motion.button>
                    </motion.form>
                </div>
            </div>
        </section>
    );
};

export default Contact;
