import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import './Hero.css';

const Hero = () => {
    const [typedText, setTypedText] = useState('');
    const fullText = "AI Specialist | Full Stack Engineer";


    useEffect(() => {
        let currentIndex = 0;
        const typingInterval = setInterval(() => {
            if (currentIndex <= fullText.length) {
                setTypedText(fullText.substring(0, currentIndex));
                currentIndex++;
            } else {
                clearInterval(typingInterval);
            }
        }, 50);

        return () => clearInterval(typingInterval);
    }, []);

    // Animation Variants
    const containerVariants = {
        hidden: { opacity: 0 },
        visible: {
            opacity: 1,
            transition: {
                staggerChildren: 0.2,
                delayChildren: 0.3
            }
        }
    };

    const itemVariants = {
        hidden: { opacity: 0, y: 30 },
        visible: {
            opacity: 1,
            y: 0,
            transition: { duration: 0.8, ease: "easeOut" }
        }
    };

    return (
        <section id="home" className="hero">
            {/* Background elements removed for better mobile experience */}


            <div className="container">
                <div className="hero-content">
                    <motion.div
                        className="hero-text"
                        variants={containerVariants}
                        initial="hidden"
                        animate="visible"
                    >
                        <motion.div variants={itemVariants} className="badge-wrapper">
                            <span className="academic-badge">
                                <i className="fas fa-rocket"></i> Innovating at the Edge of AI
                            </span>
                        </motion.div>

                        <motion.h1 variants={itemVariants} className="hero-title">
                            Hello, I'm <br />
                            <span className="text-gradient-gold">Shoib Ahmad</span>
                        </motion.h1>

                        <motion.div variants={itemVariants} className="hero-subtitle-wrapper">
                            <p className="hero-subtitle">
                                {typedText}
                                <span className="cursor">|</span>
                            </p>
                        </motion.div>

                        <motion.p variants={itemVariants} className="hero-description">
                            Bridging the gap between <strong>advanced research</strong> and <strong>scalable software</strong>.
                            Specializing in deep learning, distributed systems, and building intuitive digital experiences.
                        </motion.p>

                        <motion.div variants={itemVariants} className="hero-buttons">
                            <Link to="/projects" className="btn btn-primary">
                                <span>View My Work</span>
                                <i className="fas fa-arrow-right"></i>
                            </Link>
                            <a href="https://github.com/shoibahmad" target="_blank" rel="noopener noreferrer" className="btn btn-secondary">
                                <i className="fab fa-github"></i> GitHub
                            </a>

                        </motion.div>

                        <motion.div variants={itemVariants} className="hero-contact">
                            <div className="contact-item">
                                <span className="icon-box"><i className="fas fa-university"></i></span>
                                <div>
                                    <span className="label">MCA Scholar</span>
                                    <span className="value">Jamia Hamdard University</span>
                                </div>
                            </div>
                            <div className="contact-divider"></div>
                            <div className="contact-item">
                                <span className="icon-box"><i className="fas fa-map-marker-alt"></i></span>
                                <div>
                                    <span className="label">Based in</span>
                                    <span className="value">New Delhi, India</span>
                                </div>
                            </div>
                        </motion.div>
                    </motion.div>

                    <motion.div
                        className="hero-image-wrapper"
                        initial={{ opacity: 0, x: 50 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ duration: 1, delay: 0.5, ease: "easeOut" }}
                    >
                        <div className="image-container-premium">
                            <div className="image-frame">
                                <img src="/images/profile.jpg" alt="Shoib Ahmad" />
                            </div>
                            <div className="floating-card card-1">
                                <i className="fas fa-code"></i>
                                <span>Full Stack</span>
                            </div>
                            <div className="floating-card card-2">
                                <i className="fas fa-brain"></i>
                                <span>AI Research</span>
                            </div>
                        </div>
                    </motion.div>
                </div>
            </div>
        </section>
    );
};

export default Hero;
