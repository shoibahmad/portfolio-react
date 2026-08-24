import { EDUCATION } from '../data/profile';
import './Education.css';

const Education = () => (
    <section className="education section" id="education" aria-labelledby="education-title">
        <div className="shell">
            <div className="section-head">
                <span className="section-kicker">Education</span>
                <h2 className="section-title" id="education-title">Formal grounding.</h2>
            </div>

            <ul className="education__list">
                {EDUCATION.map((entry, index) => (
                    <li
                        className="education__item animate-on-scroll"
                        key={entry.degree}
                        style={{ transitionDelay: `${index * 120}ms` }}
                    >
                        <div className="education__body">
                            <h3 className="education__degree">{entry.degree}</h3>
                            <p className="education__institution">{entry.institution}</p>
                        </div>

                        <dl className="education__meta">
                            <div>
                                <dt className="label">CGPA</dt>
                                <dd className="education__cgpa">{entry.cgpa}</dd>
                            </div>
                            <div>
                                <dt className="label">Years</dt>
                                <dd className="education__value">{entry.date}</dd>
                            </div>
                            <div>
                                <dt className="label">Location</dt>
                                <dd className="education__value">{entry.location}</dd>
                            </div>
                        </dl>
                    </li>
                ))}
            </ul>
        </div>
    </section>
);

export default Education;
