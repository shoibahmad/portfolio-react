import { useEffect, useState } from 'react';
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
                    initial={{ opacity: 0, y: 12 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: 12 }}
                    whileHover={{ y: -3 }}
                    whileTap={{ y: 0 }}
                    transition={{ duration: 0.25, ease: [0.22, 1, 0.36, 1] }}
                >
                    <svg className="scroll-progress-ring" viewBox="0 0 54 54" aria-hidden="true">
                        <circle
                            className="ring-bg"
                            r={radius}
                            cx="27"
                            cy="27"
                        />
                        <circle
                            className="ring-fill"
                            strokeDasharray={circumference}
                            style={{ strokeDashoffset }}
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
