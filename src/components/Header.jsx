import React, { useState, useEffect } from 'react';
import { NavLink, Link } from 'react-router-dom';
import './Header.css';

const Header = () => {
    const [isScrolled, setIsScrolled] = useState(false);
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

    useEffect(() => {
        const handleScroll = () => {
            setIsScrolled(window.scrollY > 50);
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
        { path: '/', label: 'Home' },
        { path: '/services', label: 'Services' },
        { path: '/projects', label: 'Projects' },
        { path: '/skills', label: 'Skills' },
        { path: '/experience', label: 'Experience' },
        { path: '/contact', label: 'Contact' }
    ];

    return (
        <header className={`header ${isScrolled ? 'scrolled' : ''}`}>
            <div className="container header-container">
                <Link to="/" className="brand-logo" onClick={handleNavClick}>
                    <span className="logo-text">shoib<span className="logo-dot">.</span>dev</span>
                </Link>

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
                        <li>
                            {/* Mobile CTA */}
                            <Link to="/contact" className="mobile-resume-btn" onClick={handleNavClick}>
                                Let's Talk
                            </Link>
                        </li>
                    </ul>
                </nav>

                <div className="header-actions">
                    {/* Desktop CTA */}
                    <Link to="/contact" className="desktop-resume-btn">Let's Talk</Link>
                    <div className={`hamburger ${isMobileMenuOpen ? 'active' : ''}`} onClick={toggleMenu}>
                        <span></span>
                        <span></span>
                        <span></span>
                    </div>
                </div>
            </div>
        </header>
    );
};

export default Header;
