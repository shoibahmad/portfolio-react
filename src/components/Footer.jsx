import React from 'react';
import { Link } from 'react-router-dom';
import './Footer.css';

const Footer = ({ onOpenLegal }) => {
    const currentYear = new Date().getFullYear();

    return (
        <footer className="footer">
            <div className="container">
                {/* Modern CTA Banner */}
                <div className="footer-cta animate-on-scroll">
                    <div className="footer-cta-content">
                        <h2>Let's build something exceptional together</h2>
                        <p>Have an idea or a project in mind? Let's collaborate to make it reality.</p>
                    </div>
                    <div className="footer-cta-action">
                        <Link to="/contact" className="btn-cta-footer">
                            Get In Touch <i className="fas fa-arrow-right"></i>
                        </Link>
                    </div>
                </div>

                <div className="footer-grid">
                    {/* Brand Section */}
                    <div className="footer-brand animate-on-scroll" style={{ transitionDelay: '50ms' }}>
                        <Link to="/" className="footer-logo">
                            <span className="logo-text">shoib<span className="logo-dot">.</span>dev</span>
                        </Link>
                        <p className="tagline">Building digital experiences that matter.</p>
                        <p className="description">
                            A passionate Full Stack Developer & AI Enthusiast focused on creating interactive, clean, and high-performance web applications.
                        </p>
                    </div>

                    {/* Quick Links */}
                    <div className="footer-links animate-on-scroll" style={{ transitionDelay: '100ms' }}>
                        <h4>Navigation</h4>
                        <ul>
                            <li><Link to="/">Home</Link></li>
                            <li><Link to="/services">Services</Link></li>
                            <li><Link to="/projects">Projects</Link></li>
                            <li><Link to="/skills">Skills</Link></li>
                            <li><Link to="/experience">Experience</Link></li>
                        </ul>
                    </div>

                    {/* Contact Info */}
                    <div className="footer-contact animate-on-scroll" style={{ transitionDelay: '150ms' }}>
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
                    </div>

                    {/* Connect Section */}
                    <div className="footer-social animate-on-scroll" style={{ transitionDelay: '200ms' }}>
                        <h4>Connect</h4>
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

                <div className="footer-bottom animate-on-scroll" style={{ transitionDelay: '250ms' }}>
                    <div className="copyright">
                        <p>&copy; {currentYear} Shoib Ahmad. All rights reserved.</p>
                    </div>
                    <div className="footer-legal">
                        <button onClick={() => onOpenLegal('privacy')}>Privacy Policy</button>
                        <button onClick={() => onOpenLegal('terms')}>Terms of Service</button>
                    </div>
                </div>
            </div>
        </footer>
    );
};

export default Footer;
