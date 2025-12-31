import React, { useEffect, useState } from 'react';
import './Hero.css';

const Hero = () => {
    const [typedText, setTypedText] = useState('');
    const roles = "Software Engineer | Flutter Developer | AI & ML Enthusiast";

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
                        <h1 className="hero-title">Shoib Ahmad</h1>
                        <p className="hero-subtitle">
                            {typedText}
                            <span className="cursor">|</span>
                        </p>
                        <div className="hero-contact">
                            <div className="contact-item">
                                <i className="fas fa-envelope"></i>
                                <span>shoibsahmad@gmail.com</span>
                            </div>
                            <div className="contact-item">
                                <i className="fas fa-map-marker-alt"></i>
                                <span>Lucknow</span>
                            </div>
                            <div className="contact-item">
                                <i className="fab fa-linkedin"></i>
                                <a href="https://www.linkedin.com/in/shoib-ahmad-788096219/" target="_blank" rel="noopener noreferrer">
                                    LinkedIn Profile
                                </a>
                            </div>
                        </div>
                        <div className="hero-buttons">
                            <a href="#contact" className="btn btn-primary">Get In Touch</a>
                            <a href="https://github.com/shoibahmad" target="_blank" rel="noopener noreferrer" className="btn btn-secondary">
                                <i className="fab fa-github"></i> GitHub
                            </a>
                            <button id="resume-btn" className="btn btn-secondary" onClick={() => document.getElementById('resume-modal')?.classList.add('active')}>
                                <i className="fas fa-file-alt"></i> Resume
                            </button>
                        </div>
                    </div>
                    <div className="hero-image">
                        <img src="/images/profile.jpg" alt="Shoib Ahmad" />
                    </div>
                </div>
            </div>
        </section>
    );
};

export default Hero;
