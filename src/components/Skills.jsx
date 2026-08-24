import { useState } from 'react';
import GitHubStats from './GitHubStats';
import { SKILL_GROUPS } from '../data/profile';
import './Skills.css';

/**
 * Capabilities.
 *
 * Grouped exactly as the CV groups them, and without proficiency meters. The
 * previous version drew a bar for every skill from a hand-assigned percentage —
 * numbers with no unit behind them, claiming a precision nobody can verify. A
 * named grouping says the same thing honestly.
 *
 * "Actively deepening" is kept as its own group rather than folded in with the
 * rest, because the distinction between what you ship with and what you are
 * still learning is the useful part.
 */

const TABS = ['All', ...SKILL_GROUPS.map((g) => g.title)];

const Skills = () => {
    const [activeTab, setActiveTab] = useState('All');

    const visible =
        activeTab === 'All'
            ? SKILL_GROUPS
            : SKILL_GROUPS.filter((g) => g.title === activeTab);

    return (
        <section className="skills section" id="skills" aria-labelledby="skills-title">
            <div className="shell">
                <div className="section-head">
                    <span className="section-kicker">Capabilities</span>
                    <h2 className="section-title" id="skills-title">
                        The stack behind the work.
                    </h2>
                    <p className="section-lede">
                        Interfaces, API backends, and the model integrations that sit
                        between them — plus the fundamentals underneath.
                    </p>
                </div>

                <div className="skills__tabs" role="group" aria-label="Filter skills">
                    {TABS.map((tab) => (
                        <button
                            key={tab}
                            type="button"
                            className={`skills__tab ${activeTab === tab ? 'is-active' : ''}`}
                            aria-pressed={activeTab === tab}
                            onClick={() => setActiveTab(tab)}
                        >
                            {tab}
                        </button>
                    ))}
                </div>

                <div className="skills__grid">
                    {visible.map((group) => (
                        <article
                            className={`skills__group card ${group.learning ? 'is-learning' : ''}`}
                            key={group.id}
                        >
                            <header className="skills__group-head">
                                <span className="skills__group-icon" aria-hidden="true">
                                    <i className={group.icon} />
                                </span>
                                <h3 className="skills__group-title">{group.title}</h3>
                                {group.learning && (
                                    <span className="skills__group-note">In progress</span>
                                )}
                            </header>

                            <ul className="skills__list">
                                {group.skills.map((skill) => (
                                    <li className="skills__pill" key={skill}>
                                        {skill}
                                    </li>
                                ))}
                            </ul>
                        </article>
                    ))}
                </div>

                <GitHubStats />
            </div>
        </section>
    );
};

export default Skills;
