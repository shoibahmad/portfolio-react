import { EXPERIENCE } from '../data/profile';
import './Experience.css';

const Experience = () => (
    <section className="experience section" id="experience" aria-labelledby="experience-title">
        <div className="shell">
            <div className="section-head">
                <span className="section-kicker">Experience</span>
                <h2 className="section-title" id="experience-title">Where the work happened.</h2>
                <p className="section-lede">
                    Client engagements owned end to end — from ambiguous requirements
                    through to systems in daily institutional use.
                </p>
            </div>

            <ol className="timeline">
                {EXPERIENCE.map((role, index) => (
                    <li
                        className="timeline__item animate-on-scroll"
                        key={`${role.company}-${role.title}`}
                        style={{ transitionDelay: `${Math.min(index * 90, 360)}ms` }}
                    >
                        {/* `current` is derived from the date rather than stored
                            alongside it, so a role can never claim to be current
                            while its own end date says otherwise. */}
                        <span
                            className={`timeline__marker ${role.date.includes('Present') ? 'is-current' : ''}`}
                            aria-hidden="true"
                        />

                        <div className="timeline__body">
                            <h3 className="timeline__title">{role.title}</h3>
                            <p className="timeline__company">
                                {role.company}
                                {role.location && (
                                    <span className="timeline__place"> · {role.location}</span>
                                )}
                            </p>
                            {role.summary && (
                                <p className="timeline__summary">{role.summary}</p>
                            )}
                        </div>

                        <p className="timeline__date">
                            {role.date}
                            {role.date.includes('Present') && (
                                <span className="timeline__badge">Current</span>
                            )}
                        </p>
                    </li>
                ))}
            </ol>
        </div>
    </section>
);

export default Experience;
