import React, { useState, useEffect } from 'react';
import { NavLink, Link } from 'react-router-dom';
import './Header.css';

const Header = ({ onToggleTerminal }) => {
    const [isScrolled, setIsScrolled] = useState(false);
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

    useEffect(() => {
        const handleScroll = () => {
            setIsScrolled(window.scrollY > 30);
        };

        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    const toggleMenu = () => {
        setIsMobileMenuOpen(!isMobileMenuOpen);
        document.body.style.overflow = !isMobileMenuOpen ? 'hidden' : '';
    };

    const handleNavClick = () => {
        setIsMobileMenuOpen(false);
        document.body.style.overflow = '';
    };

    const navItems = [
        { path: '/projects', label: 'PROJECTS' },
        { path: '/skills', label: 'SKILLS' },
        { path: '/experience', label: 'EXPERIENCE' },
        { path: '/services', label: 'SERVICES' },
        { path: '/resume', label: 'RESUME' }
    ];

    return (
        <header className={`header-wrapper ${isScrolled ? 'scrolled' : ''}`}>
            <div className="header-pill">
                {/* Left: Brand */}
                <div className="header-left">
                    <Link to="/" className="brand-logo" onClick={handleNavClick} aria-label="Shoib Ahmad - Home">
                        <svg className="brand-logo-icon" viewBox="0 0 36 36" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <defs>
                                <linearGradient id="logo-bg-grad" x1="0%" y1="0%" x2="100%" y2="100%">
                                    <stop offset="0%" stopColor="#242428" />
                                    <stop offset="100%" stopColor="#121214" />
                                </linearGradient>
                                <linearGradient id="logo-border-grad" x1="0%" y1="0%" x2="100%" y2="100%">
                                    <stop offset="0%" stopColor="rgba(255, 107, 0, 0.7)" />
                                    <stop offset="50%" stopColor="rgba(255, 255, 255, 0.15)" />
                                    <stop offset="100%" stopColor="rgba(255, 107, 0, 0.3)" />
                                </linearGradient>
                                <linearGradient id="logo-s-grad-1" x1="0%" y1="0%" x2="100%" y2="100%">
                                    <stop offset="0%" stopColor="#FFA14A" />
                                    <stop offset="100%" stopColor="#FF5E00" />
                                </linearGradient>
                                <linearGradient id="logo-accent-grad" x1="0%" y1="0%" x2="100%" y2="0%">
                                    <stop offset="0%" stopColor="#FFFFFF" />
                                    <stop offset="100%" stopColor="#FFB070" />
                                </linearGradient>
                            </defs>
                            {/* Background Squircle */}
                            <rect x="1.5" y="1.5" width="33" height="33" rx="9.5" fill="url(#logo-bg-grad)" stroke="url(#logo-border-grad)" strokeWidth="1.2" className="logo-base-rect" />
                            {/* Stylized S Monogram */}
                            <path
                                d="M24 10.5C24 9.12 22.88 8 21.5 8H15C12.24 8 10 10.24 10 13C10 15.76 12.24 18 15 18H21C23.76 18 26 20.24 26 23C26 25.76 23.76 28 21 28H14.5C13.12 28 12 26.88 12 25.5"
                                stroke="url(#logo-s-grad-1)"
                                strokeWidth="3"
                                strokeLinecap="round"
                                strokeLinejoin="round"
                            />
                            {/* Modern Glowing Nodes */}
                            <circle cx="21.5" cy="8" r="1.5" fill="url(#logo-accent-grad)" />
                            <circle cx="14.5" cy="28" r="1.5" fill="url(#logo-accent-grad)" />
                            <circle cx="18" cy="18" r="1.2" fill="#FFFFFF" opacity="0.9" />
                            {/* Terminal Angle Accents */}
                            <path d="M6.5 16.5L8 18L6.5 19.5" stroke="rgba(255, 107, 0, 0.45)" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round" />
                            <path d="M29.5 16.5L28 18L29.5 19.5" stroke="rgba(255, 107, 0, 0.45)" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round" />
                        </svg>
                        <span className="logo-text">SHOIB<span className="logo-accent-dot">.</span></span>
                    </Link>
                </div>

                {/* Center: Nav Menu */}
                <nav className={`nav-menu ${isMobileMenuOpen ? 'active' : ''}`}>
                    <ul>
                        {navItems.map((item) => (
                            <li key={item.label}>
                                <NavLink
                                    to={item.path}
                                    className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`}
                                    onClick={handleNavClick}
                                >
                                    {item.label}
                                </NavLink>
                            </li>
                        ))}
                    </ul>

                    {/* Prominent CTA in Mobile Menu */}
                    <Link to="/contact" className="mobile-drawer-cta" onClick={handleNavClick}>
                        <span>Let's Talk & Collaborate</span>
                        <i className="fas fa-arrow-right"></i>
                    </Link>
                </nav>

                {/* Right: Actions */}
                <div className="header-right">
                    <Link to="/contact" className="header-contact-btn" onClick={handleNavClick} title="Contact Shoib" aria-label="Contact">
                        <i className="fas fa-paper-plane"></i>
                        <span>Contact</span>
                    </Link>

                    <Link to="/contact" className="user-profile-pill" onClick={handleNavClick} title="Shoib Profile">
                        <span className="avatar-circle">S</span>
                        <span className="avatar-username">SHOIB SA..</span>
                    </Link>

                    <button
                        className="terminal-pill-btn"
                        onClick={onToggleTerminal}
                        title="Toggle CLI Terminal"
                        aria-label="Terminal"
                    >
                        <i className="fas fa-terminal"></i>
                    </button>

                    <button
                        className={`hamburger ${isMobileMenuOpen ? 'active' : ''}`}
                        onClick={toggleMenu}
                        aria-label="Toggle navigation menu"
                    >
                        <span></span>
                        <span></span>
                        <span></span>
                    </button>
                </div>
            </div>
        </header>
    );
};

export default Header;
