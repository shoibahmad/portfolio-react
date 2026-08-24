import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import TiltCard from './ui/TiltCard';
import ResumeModal from './ResumeModal';
import { EXPERIENCE, EDUCATION, SKILL_GROUPS } from '../data/profile';
import './InteractiveResume.css';

/* Experience and education come from the CV; the skill matrix is the CV's own
   grouping, flattened to the shape this page renders. */
const RESUME = {
    experience: EXPERIENCE.map((role) => ({
        title: role.title,
        company: role.company,
        period: role.date,
        location: role.location,
        description: role.summary,
        skills: role.skills
    })),
    education: EDUCATION.map((entry) => ({
        title: entry.degree,
        company: entry.institution,
        period: entry.date,
        location: `${entry.location} · CGPA ${entry.cgpa}`,
        skills: entry.skills
    })),
    skills: Object.fromEntries(SKILL_GROUPS.map((group) => [group.title, group.skills]))
};

const FILTERS = [
    { id: 'all', label: 'All' },
    { id: 'experience', label: 'Experience' },
    { id: 'education', label: 'Education' },
    { id: 'skills', label: 'Skills' }
];

const InteractiveResume = () => {
    const [activeSection, setActiveSection] = useState('all');
    const [highlighted, setHighlighted] = useState([]);
    const [isSheetOpen, setIsSheetOpen] = useState(false);

    /* Selecting a skill highlights it everywhere it appears rather than filtering
       entries out. On a CV, hiding roles because they lack a tag removes exactly
       the context that makes the remaining ones legible. */
    const toggleSkill = (skill) => {
        setHighlighted((prev) =>
            prev.includes(skill) ? prev.filter((s) => s !== skill) : [...prev, skill]
        );
    };

    const renderSkills = (skills) => (
        <ul className="resume__tags">
            {skills.map((skill) => (
                <li key={skill}>
                    <button
                        type="button"
                        className={`resume__tag ${highlighted.includes(skill) ? 'is-on' : ''}`}
                        onClick={() => toggleSkill(skill)}
                        aria-pressed={highlighted.includes(skill)}
                    >
                        {skill}
                    </button>
                </li>
            ))}
        </ul>
    );

    const renderEntries = (entries) =>
        entries.map((entry) => (
            <TiltCard className="resume__entry card" key={`${entry.company}-${entry.title}`} max={3}>
                <div className="resume__entry-head">
                    <div>
                        <h4 className="resume__entry-title">{entry.title}</h4>
                        <p className="resume__entry-org">{entry.company}</p>
                    </div>
                    <span className="resume__entry-period">{entry.period}</span>
                </div>

                <p className="resume__entry-location">{entry.location}</p>

                {entry.description && (
                    <p className="resume__entry-desc">{entry.description}</p>
                )}

                {entry.skills && renderSkills(entry.skills)}
            </TiltCard>
        ));

    const showExperience = activeSection === 'all' || activeSection === 'experience';
    const showEducation = activeSection === 'all' || activeSection === 'education';
    const showSkills = activeSection === 'all' || activeSection === 'skills';

    return (
        <section className="resume section" id="resume" aria-labelledby="resume-title">
            <div className="shell">
                <div className="section-head">
                    <span className="section-kicker">Curriculum vitae</span>
                    <h2 className="section-title" id="resume-title">
                        An interactive career timeline.
                    </h2>
                    <p className="section-lede">
                        Filter by section, or select any technology to trace it across every
                        role and degree it appears in.
                    </p>
                </div>

                <div className="resume__toolbar">
                    <div className="resume__filters" role="group" aria-label="Filter resume sections">
                        {FILTERS.map((option) => (
                            <button
                                key={option.id}
                                type="button"
                                className={`resume__filter ${activeSection === option.id ? 'is-active' : ''}`}
                                aria-pressed={activeSection === option.id}
                                onClick={() => setActiveSection(option.id)}
                            >
                                {option.label}
                            </button>
                        ))}
                    </div>

                    <button
                        type="button"
                        className="btn btn-outline btn-sm"
                        onClick={() => setIsSheetOpen(true)}
                    >
                        View printable CV
                    </button>
                </div>

                <AnimatePresence initial={false}>
                    {highlighted.length > 0 && (
                        <motion.div
                            className="resume__active"
                            initial={{ opacity: 0, height: 0 }}
                            animate={{ opacity: 1, height: 'auto' }}
                            exit={{ opacity: 0, height: 0 }}
                            transition={{ duration: 0.25, ease: [0.22, 1, 0.36, 1] }}
                        >
                            <span className="label">Highlighting</span>
                            {highlighted.map((skill) => (
                                <span className="resume__active-tag" key={skill}>
                                    {skill}
                                    <button
                                        type="button"
                                        onClick={() => toggleSkill(skill)}
                                        aria-label={`Stop highlighting ${skill}`}
                                    >
                                        <i className="fas fa-times" aria-hidden="true" />
                                    </button>
                                </span>
                            ))}
                            <button
                                type="button"
                                className="resume__active-clear"
                                onClick={() => setHighlighted([])}
                            >
                                Clear all
                            </button>
                        </motion.div>
                    )}
                </AnimatePresence>

                <div className="resume__body stage">
                    {showExperience && (
                        <section className="resume__block">
                            <h3 className="resume__block-title">Professional experience</h3>
                            <div className="resume__entries">{renderEntries(RESUME.experience)}</div>
                        </section>
                    )}

                    {showEducation && (
                        <section className="resume__block">
                            <h3 className="resume__block-title">Academic education</h3>
                            <div className="resume__entries">{renderEntries(RESUME.education)}</div>
                        </section>
                    )}

                    {showSkills && (
                        <section className="resume__block">
                            <h3 className="resume__block-title">Technical skills</h3>
                            <div className="resume__matrix">
                                {Object.entries(RESUME.skills).map(([category, skills]) => (
                                    <div className="resume__matrix-cell card" key={category}>
                                        <h4 className="label">{category}</h4>
                                        {renderSkills(skills)}
                                    </div>
                                ))}
                            </div>
                        </section>
                    )}
                </div>
            </div>

            <ResumeModal isOpen={isSheetOpen} onClose={() => setIsSheetOpen(false)} />
        </section>
    );
};

export default InteractiveResume;
