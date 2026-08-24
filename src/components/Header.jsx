import { useState, useEffect, useRef } from 'react';
import { NavLink, Link, useLocation } from 'react-router-dom';
import './Header.css';

const NAV_ITEMS = [
    { path: '/projects', label: 'Projects' },
    { path: '/skills', label: 'Skills' },
    { path: '/experience', label: 'Experience' },
    { path: '/services', label: 'Services' },
    { path: '/resume', label: 'Resume' }
];

const Header = ({ onToggleTerminal }) => {
    const [isScrolled, setIsScrolled] = useState(false);
    const location = useLocation();
    const toggleRef = useRef(null);

    /* The drawer stores the route it was opened on rather than a bare boolean.
       Navigating changes `location.pathname`, so the menu closes itself with no
       effect and no listener — which also covers back/forward navigation that
       no click handler would ever see. */
    const [openAtPath, setOpenAtPath] = useState(null);
    const isMenuOpen = openAtPath === location.pathname;
    const setIsMenuOpen = (next) => setOpenAtPath(next ? location.pathname : null);

    useEffect(() => {
        const handleScroll = () => setIsScrolled(window.scrollY > 16);
        handleScroll();
        window.addEventListener('scroll', handleScroll, { passive: true });
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    /* Lock the page behind the open drawer. Restoring the previous value rather
       than clearing it means this cannot stomp on a modal that already locked
       scrolling for its own reasons. */
    useEffect(() => {
        if (!isMenuOpen) return;

        const previous = document.body.style.overflow;
        document.body.style.overflow = 'hidden';

        const onKeyDown = (e) => {
            if (e.key === 'Escape') {
                setOpenAtPath(null);
                toggleRef.current?.focus();
            }
        };
        window.addEventListener('keydown', onKeyDown);

        return () => {
            document.body.style.overflow = previous;
            window.removeEventListener('keydown', onKeyDown);
        };
    }, [isMenuOpen]);

    return (
        <header className={`site-header ${isScrolled ? 'is-scrolled' : ''}`}>
            <div className="site-header__inner shell">
                <Link to="/" className="brand" aria-label="Shoib Ahmad — home">
                    <span className="brand__mark" aria-hidden="true">S</span>
                    <span className="brand__name">
                        Shoib Ahmad
                        <span className="brand__role">Full stack &amp; AI</span>
                    </span>
                </Link>

                <nav className="site-nav" aria-label="Primary">
                    <ul className="site-nav__list">
                        {NAV_ITEMS.map((item) => (
                            <li key={item.path}>
                                <NavLink
                                    to={item.path}
                                    className={({ isActive }) =>
                                        `site-nav__link ${isActive ? 'is-active' : ''}`
                                    }
                                >
                                    {item.label}
                                </NavLink>
                            </li>
                        ))}
                    </ul>
                </nav>

                <div className="site-header__actions">
                    <button
                        type="button"
                        className="icon-btn"
                        onClick={onToggleTerminal}
                        title="Toggle terminal"
                        aria-label="Toggle terminal"
                    >
                        <i className="fas fa-terminal" aria-hidden="true" />
                    </button>

                    <Link to="/contact" className="btn btn-primary btn-sm header-cta">
                        Contact
                    </Link>

                    <button
                        ref={toggleRef}
                        type="button"
                        className={`menu-toggle ${isMenuOpen ? 'is-open' : ''}`}
                        onClick={() => setIsMenuOpen(!isMenuOpen)}
                        aria-label={isMenuOpen ? 'Close menu' : 'Open menu'}
                        aria-expanded={isMenuOpen}
                        aria-controls="mobile-nav"
                    >
                        <span aria-hidden="true" />
                        <span aria-hidden="true" />
                    </button>
                </div>
            </div>

            {/* Mobile drawer. Rendered always and hidden with a transform so the
                links stay in the DOM for assistive tech and for the transition. */}
            <div
                className={`mobile-nav ${isMenuOpen ? 'is-open' : ''}`}
                id="mobile-nav"
                aria-hidden={!isMenuOpen}
                /* React 19 takes `inert` as a real boolean; an empty string is
                   coerced to false and warns. This keeps the closed drawer out
                   of the tab order and out of the accessibility tree. */
                inert={!isMenuOpen}
            >
                <nav aria-label="Mobile">
                    <ul className="mobile-nav__list">
                        {NAV_ITEMS.map((item) => (
                            <li key={item.path}>
                                <NavLink
                                    to={item.path}
                                    className={({ isActive }) =>
                                        `mobile-nav__link ${isActive ? 'is-active' : ''}`
                                    }
                                >
                                    {item.label}
                                </NavLink>
                            </li>
                        ))}
                    </ul>
                </nav>

                <Link to="/contact" className="btn btn-primary mobile-nav__cta">
                    Start a conversation
                </Link>
            </div>

            {/* Scrim closes the drawer on tap without swallowing keyboard focus */}
            <div
                className={`mobile-nav__scrim ${isMenuOpen ? 'is-open' : ''}`}
                onClick={() => setIsMenuOpen(false)}
                aria-hidden="true"
            />
        </header>
    );
};

export default Header;
