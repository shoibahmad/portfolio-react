import { CERTIFICATIONS } from '../data/profile';
import './Certifications.css';

const Certifications = () => (
    <section
        className="certifications section"
        id="certifications"
        aria-labelledby="certifications-title"
    >
        <div className="shell">
            <div className="section-head">
                <span className="section-kicker">Certifications</span>
                <h2 className="section-title" id="certifications-title">
                    Milestones along the way.
                </h2>
            </div>

            <ul className="certs">
                {CERTIFICATIONS.map((cert, index) => (
                    <li
                        className="certs__item animate-on-scroll"
                        key={cert.title}
                        style={{ transitionDelay: `${index * 100}ms` }}
                    >
                        <span className="certs__icon" aria-hidden="true">
                            <i className={cert.icon} />
                        </span>

                        <div className="certs__body">
                            <h3 className="certs__title">{cert.title}</h3>
                            <p className="certs__issuer">{cert.issuer}</p>
                            {cert.note && <p className="certs__note">{cert.note}</p>}
                        </div>

                        <div className="certs__meta">
                            <time className="certs__date">{cert.date}</time>
                            {/* Only credentials that publish a check URL get a link;
                                the rest simply have no affordance rather than a dead
                                one. */}
                            {cert.url && (
                                <a
                                    className="certs__verify"
                                    href={cert.url}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    aria-label={`Verify ${cert.title} credential${
                                        cert.credentialId ? ` ${cert.credentialId}` : ''
                                    }`}
                                >
                                    Verify
                                    <i className="fas fa-arrow-up-right-from-square" aria-hidden="true" />
                                </a>
                            )}
                        </div>
                    </li>
                ))}
            </ul>
        </div>
    </section>
);

export default Certifications;
