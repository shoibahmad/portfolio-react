import React, { useState, useEffect } from 'react';
import { NavLink, Link } from 'react-router-dom';
import './Header.css';

const Header = ({ onToggleTerminal }) => {
    const [isScrolled, setIsScrolled] = useState(false);
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
    const [mode, setMode] = useState('human'); // 'human' | 'machine'

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
                {/* Left: Brand + Toggle Pill */}
                <div className="header-left">
                    <Link to="/" className="brand-logo" onClick={handleNavClick}>
                        <svg className="duck-logo-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                            <path d="M12 3a6 6 0 0 0-6 6v1a5 5 0 0 0 5 5h1a4 4 0 0 0 4-4v-1a5 5 0 0 0-5-5z" fill="#FFFFFF"/>
                            <circle cx="9" cy="8" r="1" fill="#111111"/>
                            <path d="M4 14c1 2 4 4 8 4s7-2 8-4" />
                            <path d="M7 11h-3a1 1 0 0 0-1 1c0 1 1 2 3 2" fill="#FF6B00"/>
                        </svg>
                        <span className="logo-text">SHOIB</span>
                    </Link>

                    <div className="mode-toggle-pill">
                        <button
                            type="button"
                            className={`toggle-option ${mode === 'human' ? 'active' : ''}`}
                            onClick={() => setMode('human')}
                        >
                            HUMAN
                        </button>
                        <button
                            type="button"
                            className={`toggle-option ${mode === 'machine' ? 'active' : ''}`}
                            onClick={() => {
                                setMode('machine');
                                if (onToggleTerminal) onToggleTerminal();
                            }}
                        >
                            MACHINE
                        </button>
                    </div>
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
                </nav>

                {/* Right: CTA link + User Pill */}
                <div className="header-right">
                    <Link to="/contact" className="cta-link-orange" onClick={handleNavClick}>
                        GET IN TOUCH <span className="cta-arrow">↗</span>
                    </Link>

                    <Link to="/contact" className="user-profile-pill" onClick={handleNavClick}>
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
