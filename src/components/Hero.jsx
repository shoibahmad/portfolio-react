import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence, useScroll, useTransform } from 'framer-motion';
import './Hero.css';

const ROLES = [
    { title: "Full Stack Architect", icon: "fas fa-layer-group" },
    { title: "GenAI & Agent Engineer", icon: "fas fa-robot" },
    { title: "AI/ML Research Scholar", icon: "fas fa-brain" },
    { title: "Open Source Creator", icon: "fab fa-github" }
];

const Hero = () => {
    const [time, setTime] = useState('');
    const [roleIndex, setRoleIndex] = useState(0);
    const [portraitTilt, setPortraitTilt] = useState({ rotateX: 0, rotateY: 0 });
    const [detailsTilt, setDetailsTilt] = useState({ rotateX: 0, rotateY: 0 });

    const { scrollY } = useScroll();
    const textY = useTransform(scrollY, [0, 500], [0, 45]);
    const visualY = useTransform(scrollY, [0, 500], [0, 75]);
    // Fades out, but not so far that it reads as broken mid-scroll
    const heroOpacity = useTransform(scrollY, [0, 620], [1, 0.45]);
    const indicatorOpacity = useTransform(scrollY, [0, 150], [1, 0]);

    // NOTE: the hero deliberately has no scroll-linked rotateX / translateZ / scale.
    // Applying a 3D transform to this container makes the browser rasterise the
    // whole subtree once and then resample it through the transform, which visibly
    // softens the headline text and the portrait while scrolling. Depth here is
    // carried by the parallax offsets below and by the WebGL layer behind the page,
    // both of which are free of that cost.

    useEffect(() => {
        const updateTime = () => {
            const options = { timeZone: 'Asia/Kolkata', hour: '2-digit', minute: '2-digit', hour12: true };
            setTime(new Intl.DateTimeFormat('en-US', options).format(new Date()));
        };
        updateTime();
        const interval = setInterval(updateTime, 60000);
        return () => clearInterval(interval);
    }, []);

    // Role switcher interval
    useEffect(() => {
        const roleTimer = setInterval(() => {
            setRoleIndex((prev) => (prev + 1) % ROLES.length);
        }, 3200);
        return () => clearInterval(roleTimer);
    }, []);

    // 3D Tilt handlers
    const handlePortraitMouseMove = (e) => {
        const rect = e.currentTarget.getBoundingClientRect();
        const x = e.clientX - rect.left - rect.width / 2;
        const y = e.clientY - rect.top - rect.height / 2;
        setPortraitTilt({
            rotateX: -(y / rect.height) * 18,
            rotateY: (x / rect.width) * 18
        });
    };

    const handlePortraitMouseLeave = () => {
        setPortraitTilt({ rotateX: 0, rotateY: 0 });
    };

    const handleDetailsMouseMove = (e) => {
        const rect = e.currentTarget.getBoundingClientRect();
        const x = e.clientX - rect.left - rect.width / 2;
        const y = e.clientY - rect.top - rect.height / 2;
        setDetailsTilt({
            rotateX: -(y / rect.height) * 12,
            rotateY: (x / rect.width) * 12
        });
    };

    const handleDetailsMouseLeave = () => {
        setDetailsTilt({ rotateX: 0, rotateY: 0 });
    };

    const scrollToNext = () => {
        const nextSection = document.getElementById('publications') || document.querySelector('section:nth-of-type(2)');
        if (nextSection) {
            nextSection.scrollIntoView({ behavior: 'smooth' });
        } else {
            window.scrollBy({ top: window.innerHeight * 0.85, behavior: 'smooth' });
        }
    };

    // Animation Variants
    const containerVariants = {
        hidden: { opacity: 0 },
        visible: {
            opacity: 1,
            transition: {
                staggerChildren: 0.12,
                delayChildren: 0.15
            }
        }
    };

    const itemVariants = {
        hidden: { opacity: 0, y: 24 },
        visible: {
            opacity: 1,
            y: 0,
            transition: { duration: 0.65, ease: [0.25, 1, 0.5, 1] }
        }
    };

    return (
        <section id="home" className="hero">
            <div className="container">
                <motion.div
                    className="hero-content"
                    style={{ opacity: heroOpacity }}
                >
                    <motion.div
                        className="hero-text"
                        variants={containerVariants}
                        initial="hidden"
                        animate="visible"
                        style={{ y: textY }}
                    >
                        <motion.div variants={itemVariants} className="hero-breadcrumbs">
                            <Link to="/">Home</Link> <i className="fas fa-chevron-right"></i>
                            <Link to="/projects">Portfolio</Link> <i className="fas fa-chevron-right"></i>
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

                        {/* Animated Dynamic Role Badge */}
                        <motion.div variants={itemVariants} className="hero-role-carousel">
                            <span className="role-label">Specializing in</span>
                            <div className="role-slider-box">
                                <AnimatePresence mode="wait">
                                    <motion.span
                                        key={ROLES[roleIndex].title}
                                        initial={{ opacity: 0, y: 16, filter: 'blur(4px)' }}
                                        animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
                                        exit={{ opacity: 0, y: -16, filter: 'blur(4px)' }}
                                        transition={{ duration: 0.35, ease: "easeOut" }}
                                        className="role-title-dynamic"
                                    >
                                        <i className={`${ROLES[roleIndex].icon} role-icon`}></i>
                                        {ROLES[roleIndex].title}
                                    </motion.span>
                                </AnimatePresence>
                            </div>
                        </motion.div>

                        <motion.h1 variants={itemVariants} className="hero-title">
                            Understand what your software <span className="hero-title-accent">can become.</span>
                        </motion.h1>

                        <motion.p variants={itemVariants} className="hero-description">
                            Shoib is a dedicated Full Stack Developer and AI Researcher. You will start with the fundamentals — building responsive interfaces, designing robust APIs, and integrating intelligent AI models. Then you will explore complex cloud architectures, automate workflows, and connect systems through advanced protocols.
                        </motion.p>

                        <motion.div variants={itemVariants} className="hero-stats">
                            <motion.span className="stat-item" whileHover={{ scale: 1.05, y: -2 }} transition={{ type: 'spring', stiffness: 400 }}>
                                <i className="fas fa-book-open"></i> <strong>12+</strong> Projects
                            </motion.span>
                            <motion.span className="stat-item" whileHover={{ scale: 1.05, y: -2 }} transition={{ type: 'spring', stiffness: 400 }}>
                                <i className="far fa-clock"></i> <strong>~1</strong> Yrs Exp.
                            </motion.span>
                            <motion.span className="stat-item" whileHover={{ scale: 1.05, y: -2 }} transition={{ type: 'spring', stiffness: 400 }}>
                                <i className="fas fa-layer-group"></i> <strong>Full</strong> Stack
                            </motion.span>
                            <motion.span className="stat-item" whileHover={{ scale: 1.05, y: -2 }} transition={{ type: 'spring', stiffness: 400 }}>
                                <i className="fas fa-graduation-cap"></i> <strong>MCA</strong> Scholar
                            </motion.span>
                        </motion.div>

                        <motion.div variants={itemVariants} className="hero-buttons">
                            <Link to="/projects" className="btn btn-primary hero-cta-btn">
                                <i className="fas fa-play"></i>
                                <span>Explore Projects</span>
                                <span className="btn-glow-trail"></span>
                            </Link>
                            <Link to="/contact" className="btn btn-outline hero-cta-btn-alt">
                                <i className="fas fa-paper-plane"></i>
                                <span>Let's Talk</span>
                            </Link>
                        </motion.div>
                    </motion.div>

                    <motion.div
                        className="hero-visuals-wrapper"
                        initial={{ opacity: 0, x: 40 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.85, delay: 0.35, ease: [0.25, 1, 0.5, 1] }}
                        style={{ y: visualY }}
                    >
                        {/* 3D Interactive Portrait Container */}
                        <div className="hero-portrait-stage">
                            {/* Floating Orbiting Pills */}
                            <motion.div
                                className="floating-badge badge-top-left"
                                animate={{ y: [0, -8, 0], rotate: [-2, 2, -2] }}
                                transition={{ duration: 4.5, repeat: Infinity, ease: "easeInOut" }}
                            >
                                <span className="badge-icon">⚡</span>
                                <span className="badge-text">12+ Live Apps</span>
                            </motion.div>

                            <motion.div
                                className="floating-badge badge-bottom-right"
                                animate={{ y: [0, 8, 0], rotate: [2, -2, 2] }}
                                transition={{ duration: 5, repeat: Infinity, ease: "easeInOut", delay: 0.5 }}
                            >
                                <span className="badge-icon">✨</span>
                                <span className="badge-text">Agentic AI & RAG</span>
                            </motion.div>

                            <motion.div
                                className="hero-portrait"
                                onMouseMove={handlePortraitMouseMove}
                                onMouseLeave={handlePortraitMouseLeave}
                                animate={{
                                    rotateX: portraitTilt.rotateX,
                                    rotateY: portraitTilt.rotateY
                                }}
                                transition={{ type: "spring", stiffness: 350, damping: 25 }}
                                style={{ transformStyle: 'preserve-3d' }}
                            >
                                <div className="portrait-glare"></div>
                                <img src="/images/profile.jpg" alt="Shoib Ahmad" />
                                <div className="portrait-shine-layer"></div>
                            </motion.div>
                        </div>

                        {/* 3D Interactive Details Card */}
                        <motion.div
                            className="details-card spotlight-card glass-interactive"
                            onMouseMove={handleDetailsMouseMove}
                            onMouseLeave={handleDetailsMouseLeave}
                            animate={{
                                rotateX: detailsTilt.rotateX,
                                rotateY: detailsTilt.rotateY
                            }}
                            transition={{ type: "spring", stiffness: 350, damping: 25 }}
                            style={{ transformStyle: 'preserve-3d' }}
                        >
                            <h3>Developer Highlights</h3>
                            <ul className="details-list">
                                <motion.li whileHover={{ x: 4 }} transition={{ type: 'spring', stiffness: 300 }}>
                                    <div className="detail-label"><i className="fas fa-layer-group"></i> Level</div>
                                    <div className="detail-value">Intermediate / Advanced</div>
                                </motion.li>
                                <motion.li whileHover={{ x: 4 }} transition={{ type: 'spring', stiffness: 300 }}>
                                    <div className="detail-label"><i className="fas fa-book-open"></i> Projects</div>
                                    <div className="detail-value">12+ Completed</div>
                                </motion.li>
                                <motion.li whileHover={{ x: 4 }} transition={{ type: 'spring', stiffness: 300 }}>
                                    <div className="detail-label"><i className="far fa-clock"></i> Experience</div>
                                    <div className="detail-value">~1 Years</div>
                                </motion.li>
                                <motion.li whileHover={{ x: 4 }} transition={{ type: 'spring', stiffness: 300 }}>
                                    <div className="detail-label"><i className="fas fa-bolt"></i> Focus</div>
                                    <div className="detail-value">AI + Full Stack</div>
                                </motion.li>
                                <motion.li whileHover={{ x: 4 }} transition={{ type: 'spring', stiffness: 300 }}>
                                    <div className="detail-label"><i className="fas fa-play"></i> Stack</div>
                                    <div className="detail-value">React, Python, Flutter</div>
                                </motion.li>
                                <motion.li whileHover={{ x: 4 }} transition={{ type: 'spring', stiffness: 300 }}>
                                    <div className="detail-label"><i className="far fa-check-circle"></i> Availability</div>
                                    <div className="detail-value highlight-avail">Open to Work</div>
                                </motion.li>
                            </ul>
                        </motion.div>
                    </motion.div>
                </motion.div>

                {/* Animated Scroll Down Indicator */}
                <motion.div
                    className="hero-scroll-indicator"
                    onClick={scrollToNext}
                    style={{ opacity: indicatorOpacity }}
                    whileHover={{ scale: 1.08, y: 2 }}
                    whileTap={{ scale: 0.95 }}
                >
                    <div className="scroll-mouse-icon">
                        <span className="scroll-wheel-dot"></span>
                    </div>
                    <span className="scroll-label">Scroll to explore</span>
                    <i className="fas fa-chevron-down scroll-arrow-down"></i>
                </motion.div>
            </div>
        </section>
    );
};

export default Hero;
