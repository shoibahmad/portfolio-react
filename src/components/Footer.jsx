import React from 'react';
import './Footer.css';

const Footer = () => {
    return (
        <footer className="footer">
            <div className="container">
                <div className="footer-content">
                    <p>shoibsahmad@gmail.com</p>
                    <div className="social-links">
                        <a href="https://github.com/shoibahmad" target="_blank" aria-label="GitHub" rel="noopener noreferrer"><i className="fab fa-github"></i></a>
                        <a href="https://www.linkedin.com/in/shoib-ahmad-788096219/" target="_blank" aria-label="LinkedIn" rel="noopener noreferrer"><i className="fab fa-linkedin"></i></a>
                        <a href="mailto:shoibsahmad@gmail.com" aria-label="Email"><i className="fas fa-envelope"></i></a>
                    </div>
                </div>
                <div className="footer-bottom">
                    <p>&copy; 2025 Shoib Ahmad. All rights reserved.</p>
                </div>
            </div>
        </footer>
    );
};

export default Footer;
