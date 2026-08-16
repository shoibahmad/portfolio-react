import React, { useEffect, useState, useRef } from 'react';
import './CustomCursor.css';

const CustomCursor = () => {
    const dotRef = useRef(null);
    const ringRef = useRef(null);
    const [isVisible, setIsVisible] = useState(false);
    const [isHovered, setIsHovered] = useState(false);
    const [isClicking, setIsClicking] = useState(false);

    useEffect(() => {
        // Disable on touch screens
        if (window.matchMedia('(pointer: coarse)').matches) {
            return;
        }

        let mouseX = -100;
        let mouseY = -100;
        let ringX = -100;
        let ringY = -100;
        let animationFrameId;

        const handleMouseMove = (e) => {
            mouseX = e.clientX;
            mouseY = e.clientY;
            if (!isVisible) setIsVisible(true);

            if (dotRef.current) {
                dotRef.current.style.transform = `translate3d(${mouseX}px, ${mouseY}px, 0)`;
            }
        };

        const handleMouseDown = () => setIsClicking(true);
        const handleMouseUp = () => setIsClicking(false);

        const handleMouseLeave = () => {
            setIsVisible(false);
        };

        const handleMouseEnter = () => {
            setIsVisible(true);
        };

        // Smooth trailing loop for ring
        const renderRing = () => {
            const ease = 0.18;
            ringX += (mouseX - ringX) * ease;
            ringY += (mouseY - ringY) * ease;

            if (ringRef.current) {
                ringRef.current.style.transform = `translate3d(${ringX}px, ${ringY}px, 0)`;
            }

            animationFrameId = requestAnimationFrame(renderRing);
        };

        renderRing();

        // Check hover over interactive elements
        const handleElementHover = (e) => {
            const target = e.target;
            const interactive = target.closest('a, button, input, textarea, select, .btn, .project-card, .stat-card, .skill-card-item, .category-tab, .filter-tab, .publication-card, .service-card, .timeline-card');
            setIsHovered(!!interactive);
        };

        window.addEventListener('mousemove', handleMouseMove);
        window.addEventListener('mousedown', handleMouseDown);
        window.addEventListener('mouseup', handleMouseUp);
        document.addEventListener('mouseleave', handleMouseLeave);
        document.addEventListener('mouseenter', handleMouseEnter);
        document.addEventListener('mouseover', handleElementHover);

        return () => {
            window.removeEventListener('mousemove', handleMouseMove);
            window.removeEventListener('mousedown', handleMouseDown);
            window.removeEventListener('mouseup', handleMouseUp);
            document.removeEventListener('mouseleave', handleMouseLeave);
            document.removeEventListener('mouseenter', handleMouseEnter);
            document.removeEventListener('mouseover', handleElementHover);
            cancelAnimationFrame(animationFrameId);
        };
    }, [isVisible]);

    return (
        <div className={`custom-cursor-container ${isVisible ? 'visible' : ''} ${isHovered ? 'hovered' : ''} ${isClicking ? 'clicking' : ''}`} aria-hidden="true">
            <div ref={ringRef} className="cursor-ring" />
            <div ref={dotRef} className="cursor-dot" />
        </div>
    );
};

export default CustomCursor;
