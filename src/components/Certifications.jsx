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
                        </div>

                        <time className="certs__date">{cert.date}</time>
                    </li>
                ))}
            </ul>
        </div>
    </section>
);

export default Certifications;
