import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import './Hero.css';

const Hero = () => {
    const [time, setTime] = useState('');

    useEffect(() => {
        const updateTime = () => {
            const options = { timeZone: 'Asia/Kolkata', hour: '2-digit', minute: '2-digit', hour12: true };
            setTime(new Intl.DateTimeFormat('en-US', options).format(new Date()));
        };
        updateTime();
        const interval = setInterval(updateTime, 60000);
        return () => clearInterval(interval);
    }, []);
    // Animation Variants
    const containerVariants = {
        hidden: { opacity: 0 },
        visible: {
            opacity: 1,
            transition: {
                staggerChildren: 0.1,
                delayChildren: 0.2
            }
        }
    };

    const itemVariants = {
        hidden: { opacity: 0, y: 20 },
        visible: {
            opacity: 1,
            y: 0,
            transition: { duration: 0.6, ease: "easeOut" }
        }
    };

    return (
        <section id="home" className="hero">
            <div className="container">
                <div className="hero-content">
                    <motion.div
                        className="hero-text"
                        variants={containerVariants}
                        initial="hidden"
                        animate="visible"
                    >
                        <motion.div variants={itemVariants} className="hero-breadcrumbs">
                            <Link to="/">Home</Link> <i className="fas fa-chevron-right"></i>
                            <Link to="/portfolio">Portfolio</Link> <i className="fas fa-chevron-right"></i>
                            <span className="current">Shoib Ahmad</span>
                        </motion.div>

                        <motion.div variants={itemVariants} className="status-badge-container">
                            <div className="availability-pulse">
                                <span className="pulse-dot"></span>
                                <span className="pulse-text">Available for work</span>
                            </div>
                            <div className="local-time">
                                <i className="far fa-clock"></i> Lucknow, India — {time}
                            </div>
                        </motion.div>

                        <motion.h1 variants={itemVariants} className="hero-title">
                            Shoib Ahmad: The Complete<br />
                            Guide to Scalable Software
                        </motion.h1>

                        <motion.p variants={itemVariants} className="hero-description">
                            Shoib is a dedicated Full Stack Developer and AI Researcher. You will start with the fundamentals — building responsive interfaces, designing robust APIs, and integrating intelligent AI models. Then you will explore complex cloud architectures, automate workflows, and connect systems through advanced protocols. Whether you are an employer, collaborator, or curious visitor, this portfolio gives you everything you need to collaborate effectively with Shoib.
                        </motion.p>

                        <motion.div variants={itemVariants} className="hero-stats">
                            <span className="stat-item"><i className="fas fa-book-open"></i> 12+ Projects</span>
                            <span className="stat-item"><i className="far fa-clock"></i> ~3 years exp.</span>
                            <span className="stat-item"><i className="fas fa-layer-group"></i> Full Stack</span>
                            <span className="stat-item"><i className="fas fa-graduation-cap"></i> MCA Scholar</span>
                        </motion.div>

                        <motion.div variants={itemVariants} className="hero-buttons">
                            <Link to="/projects" className="btn btn-primary">
                                <i className="fas fa-play"></i>
                                <span>View My Work</span>
                            </Link>
                        </motion.div>
                    </motion.div>

                    <motion.div
                        className="hero-visuals-wrapper"
                        initial={{ opacity: 0, x: 30 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.8, delay: 0.4, ease: "easeOut" }}
                    >
                        <div className="hero-portrait">
                            <img src="/images/profile.jpg" alt="Shoib Ahmad" />
                        </div>
                        <div className="details-card">
                            <h3>Developer Details</h3>
                            <ul className="details-list">
                                <li>
                                    <div className="detail-label"><i className="fas fa-layer-group"></i> Level</div>
                                    <div className="detail-value">Intermediate / Advanced</div>
                                </li>
                                <li>
                                    <div className="detail-label"><i className="fas fa-book-open"></i> Projects</div>
                                    <div className="detail-value">12+ Completed</div>
                                </li>
                                <li>
                                    <div className="detail-label"><i className="far fa-clock"></i> Experience</div>
                                    <div className="detail-value">~3 Years</div>
                                </li>
                                <li>
                                    <div className="detail-label"><i className="fas fa-bolt"></i> Focus</div>
                                    <div className="detail-value">AI + Full Stack</div>
                                </li>
                                <li>
                                    <div className="detail-label"><i className="fas fa-play"></i> Stack</div>
                                    <div className="detail-value">React, Python, Flutter</div>
                                </li>
                                <li>
                                    <div className="detail-label"><i className="far fa-check-circle"></i> Availability</div>
                                    <div className="detail-value">Open to Work</div>
                                </li>
                            </ul>
                        </div>
                    </motion.div>
                </div>
            </div>
        </section>
    );
};

export default Hero;
