import React, { useEffect, useState } from 'react';
import './Preloader.css';

const Preloader = () => {
    const [visible, setVisible] = useState(true);

    useEffect(() => {
        const timer = setTimeout(() => {
            setVisible(false);
        }, 2800); // Wait slightly longer than CSS animation
        return () => clearTimeout(timer);
    }, []);

    if (!visible) return null;

    return (
        <div className="preloader-overlay">
            <div className="preloader-container">
                <span className="loader-text">SA</span>
                <div className="loader-ring"></div>
            </div>
        </div>
    );
};

export default Preloader;
