import React, { useRef } from 'react';
import './Spotlight.css';

const Spotlight = ({ children, className = '' }) => {
    const containerRef = useRef(null);

    const handleMouseMove = (e) => {
        if (!containerRef.current) return;
        const cards = containerRef.current.getElementsByClassName('spotlight-card');
        for (const card of cards) {
            const rect = card.getBoundingClientRect();
            const x = e.clientX - rect.left;
            const y = e.clientY - rect.top;
            card.style.setProperty('--mouse-x', `${x}px`);
            card.style.setProperty('--mouse-y', `${y}px`);
        }
    };

    return (
        <div ref={containerRef} onMouseMove={handleMouseMove} className={`spotlight-container ${className}`}>
            {children}
        </div>
    );
};

export default Spotlight;
