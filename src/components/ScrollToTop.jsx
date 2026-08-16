import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import './ScrollToTop.css';

const ScrollToTop = () => {
    const [isVisible, setIsVisible] = useState(false);
    const [scrollProgress, setScrollProgress] = useState(0);

    useEffect(() => {
        const handleScroll = () => {
            const totalScroll = document.documentElement.scrollHeight - window.innerHeight;
            const currentProgress = totalScroll > 0 ? (window.scrollY / totalScroll) * 100 : 0;
            setScrollProgress(currentProgress);
            setIsVisible(window.scrollY > 280);
        };

        window.addEventListener('scroll', handleScroll, { passive: true });
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    const scrollToTop = () => {
        window.scrollTo({
            top: 0,
            behavior: 'smooth'
        });
    };

    const radius = 22;
    const circumference = 2 * Math.PI * radius;
    const strokeDashoffset = circumference - (scrollProgress / 100) * circumference;

    return (
        <AnimatePresence>
            {isVisible && (
                <motion.button
                    className="scroll-to-top-btn"
                    onClick={scrollToTop}
                    aria-label="Scroll to top"
                    initial={{ opacity: 0, scale: 0.5, y: 20 }}
                    animate={{ opacity: 1, scale: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 0.5, y: 20 }}
                    whileHover={{ scale: 1.1, y: -4 }}
                    whileTap={{ scale: 0.9 }}
                    transition={{ type: "spring", stiffness: 400, damping: 25 }}
                >
                    <svg className="scroll-progress-ring" width="54" height="54">
                        <circle
                            className="ring-bg"
                            stroke="rgba(255, 107, 0, 0.15)"
                            strokeWidth="3.5"
                            fill="transparent"
                            r={radius}
                            cx="27"
                            cy="27"
                        />
                        <circle
                            className="ring-fill"
                            stroke="#FF6B00"
                            strokeWidth="3.5"
                            strokeDasharray={circumference}
                            style={{ strokeDashoffset }}
                            strokeLinecap="round"
                            fill="transparent"
                            r={radius}
                            cx="27"
                            cy="27"
                        />
                    </svg>
                    <div className="scroll-arrow-center">
                        <i className="fas fa-arrow-up"></i>
                    </div>
                </motion.button>
            )}
        </AnimatePresence>
    );
};

export default ScrollToTop;
