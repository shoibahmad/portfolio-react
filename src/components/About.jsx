import React from 'react';
import { Link } from 'react-router-dom';
import { motion, useReducedMotion } from 'framer-motion';
import './About.css';

/**
 * The narrative section.
 *
 * The five chapters are a ruled list rather than the scroll-pinned WebGL
 * corridor they used to be — a pinned section hides four fifths of its own
 * content at any moment and costs five viewport-heights of scrolling to read
 * five short paragraphs.
 *
 * They keep the 3D arrival, though: each chapter is tilted back and pushed away
 * from the camera, then swings up onto the page as it scrolls into view. The
 * list shares one `perspective` so all five rotate toward the same vanishing
 * point and read as panels in one room. Only transform and opacity animate, so
 * the whole section still composites on the GPU.
 */

const CHAPTERS = [
    {
        id: 'origin',
        title: 'Lucknow, India',
        headline: 'Where the curiosity started.',
        body: 'A final-year MCA student at Jamia Hamdard who found that the interesting problems were never the ones with textbook answers. Started pulling software apart to understand why it worked, and never really stopped.',
        facts: [
            { label: 'Based in', value: 'Lucknow, IN' },
            { label: 'MCA CGPA', value: '8.10 / 10' }
        ]
    },
    {
        id: 'foundations',
        title: 'Foundations',
        headline: 'Fundamentals before frameworks.',
        body: 'Data structures, algorithms, OOP and system design first — the layer where you learn what a choice costs before a framework hides it. JavaScript and Python came after, and landed on solid ground because of it.',
        facts: [
            { label: 'Core', value: 'DSA · OOP · System design' },
            { label: 'Languages', value: 'JavaScript · Python' }
        ]
    },
    {
        id: 'fullstack',
        title: 'Full stack',
        headline: 'Shipping the whole thing.',
        body: 'React, Next.js and Tailwind at the front; FastAPI and Django REST Framework behind it. Asynchronous endpoints, clear service contracts, and auth flows that hold up once real people are using them.',
        facts: [
            { label: 'Frontend', value: 'React · Next.js · Vite' },
            { label: 'Backend', value: 'FastAPI · DRF · Flask' }
        ]
    },
    {
        id: 'intelligence',
        title: 'Intelligence',
        headline: 'Models inside real workflows.',
        body: 'Gemini and Claude integrated into product paths rather than demos — prompt design, model evaluation against task-level criteria, and pipeline integration. The part of the stack where the system stops following instructions and starts making judgements.',
        facts: [
            { label: 'Focus', value: 'LLM integration' },
            { label: 'Practice', value: 'Prompt design · evaluation' }
        ]
    },
    {
        id: 'now',
        title: 'Now',
        headline: 'Two platforms live, and still learning.',
        body: 'An examination-integrity platform in daily institutional use and an offline-first rural healthcare platform, both owned solo from requirements through deployment. Research in print behind them, and TypeScript and NestJS in front.',
        facts: [
            { label: 'Live', value: '2 platforms in use' },
            { label: 'Deepening', value: 'TypeScript · NestJS' }
        ]
    }
];

const About = () => {
    const reduceMotion = useReducedMotion();

    return (
        <section className="about section" id="about" aria-labelledby="about-title">
            <div className="shell">
                <div className="section-head">
                    <span className="section-kicker">Background</span>
                    <h2 className="section-title" id="about-title">
                        Five chapters, one throughline.
                    </h2>
                    <p className="section-lede">
                        From taking software apart out of curiosity to shipping systems that
                        make their own decisions.
                    </p>
                </div>

                <ol className="about-chapters">
                    {CHAPTERS.map((chapter, i) => (
                        <motion.li
                            className="about-chapter"
                            key={chapter.id}
                            id={chapter.id}
                            initial={
                                reduceMotion
                                    ? false
                                    : { opacity: 0, y: 56, rotateX: 24, z: -180 }
                            }
                            whileInView={{ opacity: 1, y: 0, rotateX: 0, z: 0 }}
                            /* One-shot rather than scroll-linked: a progress-driven
                               reveal on an element near the end of the document can
                               never finish its input range, and would sit
                               permanently half-rotated. */
                            viewport={{ once: true, amount: 0.3 }}
                            transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
                        >
                            <div className="about-chapter__index" aria-hidden="true">
                                {String(i + 1).padStart(2, '0')}
                            </div>

                            <div className="about-chapter__body">
                                <h3 className="about-chapter__title">{chapter.title}</h3>
                                <p className="about-chapter__headline">{chapter.headline}</p>
                                <p className="about-chapter__text">{chapter.body}</p>
                            </div>

                            <dl className="about-chapter__facts">
                                {chapter.facts.map((fact) => (
                                    <div className="about-fact" key={fact.label}>
                                        <dt className="about-fact__label">{fact.label}</dt>
                                        <dd className="about-fact__value">{fact.value}</dd>
                                    </div>
                                ))}
                            </dl>
                        </motion.li>
                    ))}
                </ol>

                <div className="about-cta">
                    <p className="about-cta__text">
                        Looking for someone to build the next one?
                    </p>
                    <div className="about-cta__actions">
                        <Link to="/contact" className="btn btn-primary">
                            Start a conversation
                        </Link>
                        <Link to="/projects" className="btn btn-outline">
                            See the work
                        </Link>
                    </div>
                </div>
            </div>
        </section>
    );
};

export default About;
