import { RevealGroup } from './ui/Reveal';
import { PUBLICATIONS } from '../data/profile';
import './Publications.css';

const Publications = () => (
    <section
        className="publications section"
        id="publications"
        aria-labelledby="publications-title"
    >
        <div className="shell">
            <div className="section-head">
                <span className="section-kicker">Research</span>
                <h2 className="section-title" id="publications-title">
                    Selected publications.
                </h2>
                <p className="section-lede">
                    Peer-reviewed contributions advancing applied computer science.
                </p>
            </div>

            <RevealGroup className="publications__list">
                {PUBLICATIONS.map((pub) => (
                    <article className="publication card" key={pub.link}>
                        <div className="publication__rail">
                            <span className="publication__year">{pub.year}</span>
                            <span className="publication__status">{pub.status}</span>
                        </div>

                        <div className="publication__body">
                            <p className="publication__journal">{pub.journal}</p>

                            <h3 className="publication__title">
                                {/* The whole card is not a link: the title is the single
                                    unambiguous target, which keeps the card selectable and
                                    keeps one clear announcement for screen readers. */}
                                <a href={pub.link} target="_blank" rel="noopener noreferrer">
                                    {pub.title}
                                    <i className="fas fa-arrow-up-right-from-square" aria-hidden="true" />
                                </a>
                            </h3>

                            <p className="publication__abstract">{pub.abstract}</p>

                            <p className="publication__authors">{pub.authors}</p>
                        </div>
                    </article>
                ))}
            </RevealGroup>
        </div>
    </section>
);

export default Publications;
