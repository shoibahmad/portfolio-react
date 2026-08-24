import { useEffect } from 'react';
import {
    BASICS,
    SUMMARY,
    SKILL_GROUPS,
    EXPERIENCE,
    EDUCATION,
    CERTIFICATIONS,
    PUBLICATIONS
} from '../data/profile';
import { PROJECTS } from '../data/projects';
import './ResumeModal.css';

/**
 * Printable CV sheet.
 *
 * Every line is rendered from the profile module rather than typed out here, so
 * this sheet cannot drift from the rest of the site the way it previously had —
 * it was still showing an old grade, an old phone number and a role list that no
 * other page agreed with.
 *
 * Projects are the CV's featured set, matched by title against the full
 * catalogue so the descriptions stay in one place.
 */

/** The CV leads with these; the rest of the catalogue stays on the site. */
const FEATURED_PROJECT_TITLES = [
    'Web Sonar — Advanced Web Intelligence Platform',
    'Truth Guard AI (Misinformation)',
    'Med-AI Vigi — ADR Risk Predictor',
    'AgentForge — gitagent Studio',
    'Mike AI — Smart Recruitment Platform'
];

/**
 * Resolve the featured titles against the catalogue.
 *
 * This used to end in `.filter(Boolean)`, which meant renaming a project silently
 * dropped it from the printed CV — exactly what happened when "ADR Risk
 * Predictor" became "Med-AI Vigi — ADR Risk Predictor". A miss is a wiring bug,
 * so it now says so in the console instead of quietly shortening the list.
 */
const featuredProjects = FEATURED_PROJECT_TITLES.map((title) => {
    const match = PROJECTS.find((p) => p.title === title);
    if (!match && import.meta.env.DEV) {
        console.warn(`[ResumeModal] featured project not found in catalogue: "${title}"`);
    }
    return match;
}).filter(Boolean);

const ResumeModal = ({ isOpen = false, onClose = () => {} }) => {
    useEffect(() => {
        if (!isOpen) return undefined;

        const previousOverflow = document.body.style.overflow;
        document.body.style.overflow = 'hidden';

        const onKeyDown = (e) => {
            if (e.key === 'Escape') onClose();
        };
        window.addEventListener('keydown', onKeyDown);

        return () => {
            document.body.style.overflow = previousOverflow;
            window.removeEventListener('keydown', onKeyDown);
        };
    }, [isOpen, onClose]);

    if (!isOpen) return null;

    return (
        <div className="resume-modal active" role="dialog" aria-modal="true" aria-label="Resume">
            <div className="resume-overlay" onClick={onClose}></div>
            <div className="resume-container">
                <div className="resume-header">
                    <a
                        className="btn btn-outline btn-sm"
                        href="/resume/Shoib_Ahmad_Resume.pdf"
                        download
                    >
                        Download PDF
                    </a>
                    <button
                        type="button"
                        className="btn btn-outline btn-sm"
                        onClick={() => window.print()}
                    >
                        Print
                    </button>
                    <button
                        type="button"
                        className="close-btn"
                        onClick={onClose}
                        aria-label="Close resume"
                    >
                        &times;
                    </button>
                </div>

                <div className="resume-content" id="resume-content">
                    <div className="resume-paper">
                        <div className="resume-top">
                            <h1 className="resume-name">{BASICS.name}</h1>
                            <p className="resume-role">
                                {BASICS.title} — {BASICS.specialties.join(' · ')}
                            </p>
                            <div className="resume-contact-info">
                                <span>
                                    <i className="fas fa-phone" aria-hidden="true" /> {BASICS.phone}
                                </span>
                                <a href={`mailto:${BASICS.email}`}>
                                    <i className="fas fa-envelope" aria-hidden="true" /> {BASICS.email}
                                </a>
                                <a href={BASICS.linkedin} target="_blank" rel="noopener noreferrer">
                                    <i className="fab fa-linkedin" aria-hidden="true" /> {BASICS.linkedinLabel}
                                </a>
                                <a href={BASICS.github} target="_blank" rel="noopener noreferrer">
                                    <i className="fab fa-github" aria-hidden="true" /> {BASICS.githubLabel}
                                </a>
                                <a href={BASICS.siteUrl} target="_blank" rel="noopener noreferrer">
                                    <i className="fas fa-globe" aria-hidden="true" /> {BASICS.site}
                                </a>
                            </div>
                        </div>

                        <div className="resume-section">
                            <h2 className="resume-section-title">Professional summary</h2>
                            <p>{SUMMARY}</p>
                        </div>

                        <div className="resume-section">
                            <h2 className="resume-section-title">Technical skills</h2>
                            <dl className="resume-skills-grid">
                                {SKILL_GROUPS.map((group) => (
                                    <div className="resume-skill-row" key={group.id}>
                                        <dt>{group.title}</dt>
                                        <dd>{group.skills.join(', ')}</dd>
                                    </div>
                                ))}
                            </dl>
                        </div>

                        <div className="resume-section">
                            <h2 className="resume-section-title">Professional experience</h2>
                            {EXPERIENCE.map((role) => (
                                <div className="resume-item" key={`${role.company}-${role.title}`}>
                                    <div className="resume-item-header">
                                        <strong>
                                            {role.title} — {role.company}
                                            {role.location ? `, ${role.location}` : ''}
                                        </strong>
                                        <span>{role.date}</span>
                                    </div>
                                    <ul className="resume-item-details">
                                        {role.highlights.map((point) => (
                                            <li key={point}>{point}</li>
                                        ))}
                                    </ul>
                                </div>
                            ))}
                        </div>

                        <div className="resume-section">
                            <h2 className="resume-section-title">Projects</h2>
                            {featuredProjects.map((project) => (
                                <div className="resume-item" key={project.title}>
                                    <div className="resume-item-header">
                                        <strong>{project.title}</strong>
                                        <span>{project.tech.slice(0, 4).join(', ')}</span>
                                    </div>
                                    <p className="resume-item-details">{project.description}</p>
                                </div>
                            ))}
                        </div>

                        <div className="resume-section">
                            <h2 className="resume-section-title">Education</h2>
                            {EDUCATION.map((entry) => (
                                <div className="resume-item" key={entry.degree}>
                                    <div className="resume-item-header">
                                        <strong>
                                            {entry.degree} — {entry.institution}, {entry.location}
                                        </strong>
                                        <span>{entry.date}</span>
                                    </div>
                                    <p className="resume-item-details">CGPA: {entry.cgpa}</p>
                                </div>
                            ))}
                        </div>

                        <div className="resume-section">
                            <h2 className="resume-section-title">
                                Certifications, publications &amp; achievements
                            </h2>
                            {CERTIFICATIONS.map((cert) => (
                                <div className="resume-item" key={cert.title}>
                                    <div className="resume-item-header">
                                        <strong>{cert.title} — {cert.issuer}</strong>
                                        <span>{cert.date}</span>
                                    </div>
                                </div>
                            ))}
                            {PUBLICATIONS.map((pub) => (
                                <div className="resume-item" key={pub.link}>
                                    <div className="resume-item-header">
                                        <strong>Publication: {pub.title}</strong>
                                        <span>{pub.date}</span>
                                    </div>
                                    <p className="resume-item-details">{pub.journal}</p>
                                </div>
                            ))}
                        </div>

                        <div className="resume-footer-text">
                            <p>
                                {BASICS.email} · {BASICS.phone} · {BASICS.site}
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ResumeModal;
