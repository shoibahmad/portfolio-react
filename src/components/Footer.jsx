import { Link } from 'react-router-dom';
import { BASICS } from '../data/profile';
import './Footer.css';

const NAV_LINKS = [
    { to: '/', label: 'Home' },
    { to: '/services', label: 'Services' },
    { to: '/projects', label: 'Projects' },
    { to: '/skills', label: 'Skills' },
    { to: '/experience', label: 'Experience' },
    { to: '/resume', label: 'Resume' }
];

const SOCIALS = [
    { href: BASICS.github, label: 'GitHub', icon: 'fab fa-github' },
    { href: BASICS.linkedin, label: 'LinkedIn', icon: 'fab fa-linkedin-in' },
    { href: BASICS.whatsapp, label: 'WhatsApp', icon: 'fab fa-whatsapp' },
    { href: `mailto:${BASICS.email}`, label: 'Email', icon: 'fas fa-envelope' }
];

const Footer = ({ onOpenLegal }) => {
    const currentYear = new Date().getFullYear();

    return (
        <footer className="footer">
            <div className="shell">
                <div className="footer__cta animate-on-scroll">
                    <div>
                        <h2 className="footer__cta-title">
                            Let&rsquo;s build something exceptional together.
                        </h2>
                        <p className="footer__cta-text">
                            Have an idea or a project in mind? It starts with a conversation.
                        </p>
                    </div>
                    <Link to="/contact" className="btn btn-primary btn-lg">
                        Get in touch
                    </Link>
                </div>

                <div className="footer__grid">
                    <div className="footer__brand">
                        <Link to="/" className="footer__logo">
                            shoib<span>.</span>dev
                        </Link>

                        <p className="footer__availability">
                            <span className="footer__availability-dot" aria-hidden="true" />
                            {BASICS.availability}
                        </p>

                        <p className="footer__desc">
                            Full-stack engineer shipping production systems end to end —
                            React and Next.js interfaces on REST API backends, with LLMs
                            integrated into real product workflows.
                        </p>
                    </div>

                    <nav className="footer__col" aria-label="Footer navigation">
                        <h3 className="label">Navigation</h3>
                        <ul>
                            {NAV_LINKS.map((link) => (
                                <li key={link.to}>
                                    <Link to={link.to} className="footer__link">
                                        {link.label}
                                    </Link>
                                </li>
                            ))}
                        </ul>
                    </nav>

                    <div className="footer__col">
                        <h3 className="label">Get in touch</h3>
                        <ul>
                            <li>
                                <a className="footer__link" href={`mailto:${BASICS.email}`}>
                                    {BASICS.email}
                                </a>
                            </li>
                            <li>
                                <a
                                    className="footer__link"
                                    href={BASICS.whatsapp}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                >
                                    {BASICS.whatsappLabel}
                                </a>
                            </li>
                            <li>
                                <span className="footer__muted">{BASICS.location}</span>
                            </li>
                        </ul>
                    </div>

                    <div className="footer__col">
                        <h3 className="label">Connect</h3>
                        <ul className="footer__socials">
                            {SOCIALS.map((social) => (
                                <li key={social.label}>
                                    <a
                                        href={social.href}
                                        aria-label={social.label}
                                        {...(social.href.startsWith('http')
                                            ? { target: '_blank', rel: 'noopener noreferrer' }
                                            : {})}
                                    >
                                        <i className={social.icon} aria-hidden="true" />
                                    </a>
                                </li>
                            ))}
                        </ul>
                    </div>
                </div>

                <div className="footer__bottom">
                    <p>&copy; {currentYear} {BASICS.name}. All rights reserved.</p>
                    <div className="footer__legal">
                        <button type="button" onClick={() => onOpenLegal('privacy')}>
                            Privacy policy
                        </button>
                        <button type="button" onClick={() => onOpenLegal('terms')}>
                            Terms of service
                        </button>
                    </div>
                </div>
            </div>
        </footer>
    );
};

export default Footer;
