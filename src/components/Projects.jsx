import { useState, useMemo, useId } from 'react';
import ProjectModal from './ProjectModal';
import TiltCard from './ui/TiltCard';
import useMediaQuery from '../hooks/useMediaQuery';
import { PROJECTS, CATEGORIES } from '../data/projects';
import './Projects.css';

/**
 * Work index.
 *
 * Two layouts, chosen by viewport rather than by CSS, because they are genuinely
 * different structures:
 *
 *   wide   a master/detail reading room — index on the left, the selected
 *          project held open beside it
 *   narrow a single column of cards that open the full case study in a modal
 *
 * The master/detail pane cannot survive a phone: a sticky detail column next to
 * a nineteen-item list either scrolls two things at once or hides one of them.
 */

const TABS = [
    { id: 'architecture', label: 'Architecture' },
    { id: 'breakdown', label: 'Challenge & solution' },
    { id: 'learnings', label: 'Takeaways' }
];

const Projects = () => {
    const [activeFilter, setActiveFilter] = useState('All');
    const [searchQuery, setSearchQuery] = useState('');
    const [activeIndex, setActiveIndex] = useState(0);
    const [tab, setTab] = useState('architecture');
    const [selectedProject, setSelectedProject] = useState(null);

    const isWide = useMediaQuery('(min-width: 1024px)');
    const searchId = useId();

    const filtered = useMemo(() => {
        /* Search matched raw substrings, which meant the spelling had to be
           exact: "SecureEval" found nothing because the project is titled
           "Secure Eval", and "nextjs" missed "Next.js". Folding away spacing and
           punctuation on both sides makes those variants equivalent — product
           names are exactly the thing people type inconsistently. */
        const fold = (value) => value.toLowerCase().replace(/[^a-z0-9]/g, '');

        // Split on whitespace and require every token, so "react python" finds
        // projects using both rather than only that literal phrase.
        const tokens = searchQuery
            .trim()
            .split(/\s+/)
            .map(fold)
            .filter(Boolean);

        return PROJECTS.filter((project) => {
            const matchesCategory = activeFilter === 'All' || project.category === activeFilter;
            if (!matchesCategory) return false;
            if (tokens.length === 0) return true;

            const haystack = fold(
                `${project.title} ${project.description} ${project.category} ${project.tech.join(' ')}`
            );
            return tokens.every((token) => haystack.includes(token));
        });
    }, [activeFilter, searchQuery]);

    // Clamp rather than reset: if the list shrinks under the current selection,
    // holding the nearest valid index keeps the detail pane from flicking back to
    // the top of the list on every keystroke.
    const safeIndex = Math.min(activeIndex, Math.max(filtered.length - 1, 0));
    const activeProject = filtered[safeIndex];

    const resetSelection = () => setActiveIndex(0);

    const countFor = (category) =>
        category === 'All'
            ? PROJECTS.length
            : PROJECTS.filter((p) => p.category === category).length;

    const renderControls = () => (
        <div className="work__controls">
            <div className="work__search">
                <i className="fas fa-search" aria-hidden="true" />
                <label className="sr-only" htmlFor={searchId}>Search projects</label>
                <input
                    id={searchId}
                    type="search"
                    value={searchQuery}
                    placeholder="Search by name, description or technology"
                    onChange={(e) => {
                        setSearchQuery(e.target.value);
                        resetSelection();
                    }}
                />
                {searchQuery && (
                    <button
                        type="button"
                        className="work__search-clear"
                        onClick={() => { setSearchQuery(''); resetSelection(); }}
                        aria-label="Clear search"
                    >
                        <i className="fas fa-times" aria-hidden="true" />
                    </button>
                )}
            </div>

            <div className="work__filters" role="group" aria-label="Filter by category">
                {CATEGORIES.map((category) => (
                    <button
                        key={category}
                        type="button"
                        className={`work__filter ${activeFilter === category ? 'is-active' : ''}`}
                        aria-pressed={activeFilter === category}
                        onClick={() => { setActiveFilter(category); resetSelection(); }}
                    >
                        {category}
                        <span className="work__filter-count">{countFor(category)}</span>
                    </button>
                ))}
            </div>
        </div>
    );

    const renderEmpty = () => (
        <p className="work__empty">
            No projects match that search. Try a different term or clear the filter.
        </p>
    );

    /* ---- Wide: master / detail ------------------------------------------- */
    const renderIndex = () => (
        <ol className="work__index">
            {filtered.map((project, index) => (
                <li key={project.title}>
                    <button
                        type="button"
                        className={`work__index-item ${index === safeIndex ? 'is-active' : ''}`}
                        onClick={() => setActiveIndex(index)}
                        aria-current={index === safeIndex}
                    >
                        <span className="work__index-num">
                            {String(index + 1).padStart(2, '0')}
                        </span>
                        <span className="work__index-body">
                            <span className="work__index-title">{project.title}</span>
                            <span className="work__index-cat">{project.category}</span>
                        </span>
                        <i className="fas fa-arrow-right work__index-arrow" aria-hidden="true" />
                    </button>
                </li>
            ))}
        </ol>
    );

    const renderDetail = () => {
        if (!activeProject) return null;

        return (
            <article className="work__detail" aria-live="polite">
                <div className="work__detail-media">
                    <img
                        src={activeProject.image}
                        alt=""
                        loading="lazy"
                        decoding="async"
                    />
                </div>

                <div className="work__detail-body">
                    <div className="work__detail-meta">
                        <span className="chip chip-accent">{activeProject.category}</span>
                        <span className="work__detail-date">{activeProject.date}</span>
                    </div>

                    <h3 className="work__detail-title">{activeProject.title}</h3>
                    <p className="work__detail-desc">{activeProject.description}</p>

                    <div className="work__tabs" role="tablist" aria-label="Project detail">
                        {TABS.map((t) => (
                            <button
                                key={t.id}
                                type="button"
                                role="tab"
                                id={`tab-${t.id}`}
                                aria-selected={tab === t.id}
                                aria-controls={`panel-${t.id}`}
                                className={`work__tab ${tab === t.id ? 'is-active' : ''}`}
                                onClick={() => setTab(t.id)}
                            >
                                {t.label}
                            </button>
                        ))}
                    </div>

                    <div
                        className="work__panel"
                        role="tabpanel"
                        id={`panel-${tab}`}
                        aria-labelledby={`tab-${tab}`}
                        tabIndex={0}
                    >
                        {tab === 'architecture' && (
                            <ol className="work__pipeline">
                                {(activeProject.architecture || []).map((node) => (
                                    <li className="work__pipeline-node" key={node.step}>
                                        <i className={node.icon} aria-hidden="true" />
                                        <span>{node.step}</span>
                                    </li>
                                ))}
                            </ol>
                        )}

                        {tab === 'breakdown' && (
                            <div className="work__breakdown">
                                <section>
                                    <h4 className="label">The challenge</h4>
                                    <p>{activeProject.challenge || activeProject.description}</p>
                                </section>
                                <section>
                                    <h4 className="label">The solution</h4>
                                    <p>{activeProject.solution || activeProject.description}</p>
                                </section>
                            </div>
                        )}

                        {tab === 'learnings' && (
                            <ul className="work__learnings">
                                {(activeProject.learnings || [
                                    'Production-grade full stack deployment with modern APIs.'
                                ]).map((item) => (
                                    <li key={item}>{item}</li>
                                ))}
                            </ul>
                        )}
                    </div>

                    <div className="work__tech">
                        <h4 className="label">Built with</h4>
                        <ul className="work__tech-list">
                            {activeProject.tech.map((tech) => (
                                <li className="chip" key={tech}>{tech}</li>
                            ))}
                        </ul>
                    </div>

                    <div className="work__actions">
                        <button
                            type="button"
                            className="btn btn-primary"
                            onClick={() => setSelectedProject(activeProject)}
                        >
                            Full case study
                        </button>
                        {activeProject.link && activeProject.link !== '#' && (
                            <a
                                className="btn btn-outline"
                                href={activeProject.link}
                                target="_blank"
                                rel="noopener noreferrer"
                            >
                                <i className="fab fa-github" aria-hidden="true" />
                                Repository
                            </a>
                        )}
                    </div>
                </div>
            </article>
        );
    };

    /* ---- Narrow: card list ------------------------------------------------ */
    const renderCards = () => (
        <ul className="work__cards stage">
            {filtered.map((project) => (
                <li key={project.title}>
                    <TiltCard className="work__card card" max={4}>
                        <div className="work__card-media">
                            <img src={project.image} alt="" loading="lazy" decoding="async" />
                        </div>
                        <div className="work__card-body">
                            <div className="work__detail-meta">
                                <span className="chip chip-accent">{project.category}</span>
                            </div>
                            <h3 className="work__card-title">{project.title}</h3>
                            <p className="work__card-desc">{project.description}</p>
                            <ul className="work__tech-list">
                                {project.tech.slice(0, 4).map((tech) => (
                                    <li className="chip" key={tech}>{tech}</li>
                                ))}
                                {project.tech.length > 4 && (
                                    <li className="chip">+{project.tech.length - 4}</li>
                                )}
                            </ul>
                            <div className="work__actions">
                                <button
                                    type="button"
                                    className="btn btn-primary btn-sm"
                                    onClick={() => setSelectedProject(project)}
                                >
                                    Case study
                                </button>
                                {project.link && project.link !== '#' && (
                                    <a
                                        className="btn btn-outline btn-sm"
                                        href={project.link}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                    >
                                        <i className="fab fa-github" aria-hidden="true" />
                                        Code
                                    </a>
                                )}
                            </div>
                        </div>
                    </TiltCard>
                </li>
            ))}
        </ul>
    );

    return (
        <section className="work section" id="projects" aria-labelledby="work-title">
            <div className="shell">
                <div className="section-head">
                    <span className="section-kicker">Selected work</span>
                    <h2 className="section-title" id="work-title">
                        Engineered for impact and innovation.
                    </h2>
                    <p className="section-lede">
                        Nineteen shipped systems across web, mobile and applied AI. Pick one to
                        read its architecture, the problem it solved, and what it taught.
                    </p>
                </div>

                {renderControls()}

                {filtered.length === 0
                    ? renderEmpty()
                    : isWide
                        ? (
                            <div className="work__workspace">
                                <div className="work__index-pane">
                                    <div className="work__index-head">
                                        <span className="label">Index</span>
                                        <span className="label">{filtered.length} projects</span>
                                    </div>
                                    {renderIndex()}
                                </div>
                                {renderDetail()}
                            </div>
                        )
                        : renderCards()}
            </div>

            <ProjectModal
                project={selectedProject}
                isOpen={Boolean(selectedProject)}
                onClose={() => setSelectedProject(null)}
            />
        </section>
    );
};

export default Projects;
