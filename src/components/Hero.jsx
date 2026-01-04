import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import './Hero.css';

const Hero = () => {
    const [typedText, setTypedText] = useState('');
    const roles = "Research Scholar | Full Stack Engineer | AI Specialist";

    useEffect(() => {
        let currentIndex = 0;
        const typingInterval = setInterval(() => {
            if (currentIndex <= roles.length) {
                setTypedText(roles.substring(0, currentIndex));
                currentIndex++;
            } else {
                clearInterval(typingInterval);
            }
        }, 50);

        return () => clearInterval(typingInterval);
    }, []);

    return (
        <section id="home" className="hero">
            <div className="container">
                <div className="hero-content">
                    <div className="hero-text">
                        <div className="academic-badge">Open Source Contributor & Tech Innovator</div>
                        <h1 className="hero-title">Shoib Ahmad</h1>
                        <p className="hero-subtitle">
                            {typedText}
                            <span className="cursor">|</span>
                        </p>
                        <p className="hero-description">
                            Specializing in Artificial Intelligence and Full Stack Development.
                            Dedicated to building scalable systems and advancing computational research.
                        </p>

                        <div className="hero-buttons">
                            <Link to="/projects" className="btn btn-primary">View Research & Projects</Link>
                            <a href="https://github.com/shoibahmad" target="_blank" rel="noopener noreferrer" className="btn btn-secondary">
                                <i className="fab fa-github"></i> GitHub
                            </a>
                            <button id="resume-btn" className="btn btn-secondary" onClick={() => document.getElementById('resume-modal')?.classList.add('active')}>
                                <i className="fas fa-file-alt"></i> CV / Resume
                            </button>
                        </div>

                        <div className="hero-contact">
                            <div className="contact-item">
                                <i className="fas fa-university"></i>
                                <span>Jamia Hamdard University</span>
                            </div>
                            <div className="contact-item">
                                <i className="fas fa-map-marker-alt"></i>
                                <span>New Delhi, India</span>
                            </div>
                        </div>
                    </div>
                    <div className="hero-image">
                        <div className="image-frame-academic">
                            <img src="/images/profile.jpg" alt="Shoib Ahmad" />
                        </div>
                    </div>
                </div>
            </div>

            <div className="wave-divider">
                <svg data-name="Layer 1" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1200 120" preserveAspectRatio="none">
                    <path d="M321.39,56.44c58-10.79,114.16-30.13,172-41.86,82.39-16.72,168.19-17.73,250.45-.39C823.78,31,906.67,72,985.66,92.83c70.05,18.48,146.53,26.09,214.34,3V0H0V27.35A600.21,600.21,0,0,0,321.39,56.44Z" className="shape-fill"></path>
                </svg>
            </div>
        </section>
    );
};

export default Hero;
