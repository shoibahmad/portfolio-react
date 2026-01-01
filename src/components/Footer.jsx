import React from 'react';
import './Footer.css';

const Footer = ({ onOpenLegal }) => {
    const currentYear = new Date().getFullYear();

    return (
        <footer className="footer">
            <div className="container">
                <div className="footer-grid">
                    {/* Brand Section */}
                    <div className="footer-brand animate-on-scroll">
                        <h3>Shoib Ahmad</h3>
                        <p className="tagline">Building digital experiences that matter.</p>
                        <p className="description">
                            A passionate Full Stack Developer & AI Enthusiast focused on creating interactive and efficient web applications.
                        </p>
                    </div>

                    {/* Quick Links */}
                    <div className="footer-links animate-on-scroll" style={{ transitionDelay: '100ms' }}>
                        <h4>Quick Links</h4>
                        <ul>
                            <li><a href="#home">Home</a></li>
                            <li><a href="#projects">Projects</a></li>
                            <li><a href="#skills">Skills</a></li>
                            <li><a href="#services">Services</a></li>
                            <li><a href="#contact">Contact</a></li>
                        </ul>
                    </div>

                    {/* Contact Info */}
                    <div className="footer-contact animate-on-scroll" style={{ transitionDelay: '200ms' }}>
                        <h4>Get In Touch</h4>
                        <ul>
                            <li>
                                <i className="fas fa-envelope"></i>
                                <a href="mailto:shoibsahmad@gmail.com">shoibsahmad@gmail.com</a>
                            </li>
                            <li>
                                <i className="fas fa-map-marker-alt"></i>
                                <span>Lucknow, India</span>
                            </li>
                        </ul>
                        <div className="social-links">
                            <a href="https://github.com/shoibahmad" target="_blank" aria-label="GitHub" rel="noopener noreferrer">
                                <i className="fab fa-github"></i>
                            </a>
                            <a href="https://www.linkedin.com/in/shoib-ahmad-788096219/" target="_blank" aria-label="LinkedIn" rel="noopener noreferrer">
                                <i className="fab fa-linkedin"></i>
                            </a>
                            <a href="https://wa.me/918853741966" target="_blank" aria-label="WhatsApp" rel="noopener noreferrer">
                                <i className="fab fa-whatsapp"></i>
                            </a>
                            <a href="mailto:shoibsahmad@gmail.com" aria-label="Email">
                                <i className="fas fa-envelope"></i>
                            </a>
                        </div>
                    </div>
                </div>

                <div className="footer-bottom animate-on-scroll" style={{ transitionDelay: '300ms' }}>
                    <div className="copyright">
                        <p>&copy; {currentYear} Shoib Ahmad. All rights reserved.</p>
                    </div>
                    <div className="footer-legal">
                        <p style={{ fontSize: '0.85rem', color: '#64748b', display: 'flex', gap: '1.5rem' }}>
                            <button
                                onClick={() => onOpenLegal('privacy')}
                                style={{ background: 'none', border: 'none', cursor: 'pointer', fontFamily: 'inherit', fontSize: 'inherit', padding: 0, color: '#64748b', transition: 'color 0.3s' }}
                                onMouseEnter={(e) => e.target.style.color = '#94a3b8'}
                                onMouseLeave={(e) => e.target.style.color = '#64748b'}
                            >
                                Privacy Policy
                            </button>
                            <button
                                onClick={() => onOpenLegal('terms')}
                                style={{ background: 'none', border: 'none', cursor: 'pointer', fontFamily: 'inherit', fontSize: 'inherit', padding: 0, color: '#64748b', transition: 'color 0.3s' }}
                                onMouseEnter={(e) => e.target.style.color = '#94a3b8'}
                                onMouseLeave={(e) => e.target.style.color = '#64748b'}
                            >
                                Terms of Service
                            </button>
                        </p>
                    </div>
                </div>
            </div>
        </footer>
    );
};

export default Footer;
