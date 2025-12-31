import React, { useEffect, useState } from 'react';
import './Preloader.css';

const Preloader = () => {
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        // Set a 3-second timer
        const timer = setTimeout(() => {
            setIsLoading(false);
        }, 3000);

        return () => clearTimeout(timer);
    }, []);

    if (!isLoading) return null;

    return (
        <div className={`preloader ${!isLoading ? 'fade-out' : ''}`}>
            <div className="preloader-logo">
                SA<span style={{ color: 'var(--accent)' }}>.</span>
            </div>
        </div>
    );
};

export default Preloader;
