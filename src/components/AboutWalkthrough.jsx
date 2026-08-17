import React, { Suspense, lazy, useEffect, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import { motion, useScroll, useTransform, useReducedMotion } from 'framer-motion';
import './AboutWalkthrough.css';

const WalkthroughScene = lazy(() => import('./three/WalkthroughScene'));

/**
 * The walkthrough chapters. `station` maps each chapter onto a depth in the 3D
 * scene, so the DOM copy and the camera are describing the same moment.
 */
const CHAPTERS = [
    {
        id: 'origin',
        kicker: 'CHAPTER 01',
        title: 'Lucknow, India',
        headline: 'Where the curiosity started.',
        body: 'An MCA scholar who found that the interesting problems were never the ones with textbook answers. Started pulling software apart to understand why it worked, and never really stopped.',
        facts: [
            { label: 'Based in', value: 'Lucknow, IN' },
            { label: 'Studying', value: 'MCA' }
        ],
        accent: '#FF6B00',
        icon: 'fas fa-location-dot'
    },
    {
        id: 'foundations',
        kicker: 'CHAPTER 02',
        title: 'Foundations',
        headline: 'Languages before frameworks.',
        body: 'Python, Java, C and C++ first — the layer where you learn what memory costs and why an algorithm choice matters. JavaScript and TypeScript came after, and landed on solid ground because of it.',
        facts: [
            { label: 'Core', value: 'Python · Java · C++' },
            { label: 'Web', value: 'JavaScript · TS' }
        ],
        accent: '#FF8C33',
        icon: 'fas fa-code'
    },
    {
        id: 'fullstack',
        kicker: 'CHAPTER 03',
        title: 'Full Stack',
        headline: 'Shipping the whole thing.',
        body: 'React and Next.js at the front, FastAPI and Flask behind it, Flutter when it needs to live in a pocket. Twelve or more projects taken from empty repository to something people actually use.',
        facts: [
            { label: 'Frontend', value: 'React 19 · Next.js' },
            { label: 'Backend', value: 'FastAPI · Flask' }
        ],
        accent: '#FFB573',
        icon: 'fas fa-layer-group'
    },
    {
        id: 'intelligence',
        kicker: 'CHAPTER 04',
        title: 'Intelligence',
        headline: 'Agents, retrieval, reasoning.',
        body: 'Multi-agent orchestration, RAG pipelines over pgvector, and multimodal analysis with Gemini. The part of the stack where the system stops following instructions and starts making decisions.',
        facts: [
            { label: 'Focus', value: 'Agents · RAG' },
            { label: 'Vectors', value: 'Supabase pgvector' }
        ],
        accent: '#FF6B00',
        icon: 'fas fa-brain'
    },
    {
        id: 'now',
        kicker: 'CHAPTER 05',
        title: 'Now',
        headline: 'Published, building, available.',
        body: 'Academic research in print, a portfolio of production systems behind it, and room for the next problem worth solving. If that sounds like something you have, the door is open.',
        facts: [
            { label: 'Research', value: 'Published' },
            { label: 'Status', value: 'Open to work' }
        ],
        accent: '#FF8C33',
        icon: 'fas fa-paper-plane'
    }
];

const N = CHAPTERS.length;

/**
 * One chapter panel.
 *
 * Split into its own component because each panel needs its own `useTransform`
 * calls — calling hooks inside a `.map()` callback would violate the rules of
 * hooks. Opacity and position are driven by MotionValues, so chapters crossfade
 * without React re-rendering on scroll.
 */
const Chapter = ({ chapter, index, progress }) => {
    const band = 1 / N;
    const start = index * band;
    const end = start + band;
    const fade = band * 0.28;

    const opacity = useTransform(
        progress,
        [start, start + fade, end - fade, end],
        [0, 1, 1, 0]
    );
    const y = useTransform(progress, [start, start + fade, end - fade, end], [40, 0, 0, -40]);
    const scale = useTransform(progress, [start, start + fade, end - fade, end], [0.96, 1, 1, 0.96]);

    // All five chapters stay in the accessibility tree even though only one is
    // visible at a time, so assistive tech and search engines get the whole story
    // rather than whichever fragment the scroll happens to be sitting on.
    return (
        <motion.article className="wt-chapter" style={{ opacity, y, scale }}>
            <span className="wt-kicker" style={{ color: chapter.accent }}>
                <i className={chapter.icon}></i> {chapter.kicker}
            </span>
            <h2 className="wt-title">{chapter.title}</h2>
            <h3 className="wt-headline" style={{ color: chapter.accent }}>{chapter.headline}</h3>
            <p className="wt-body">{chapter.body}</p>

            <div className="wt-facts">
                {chapter.facts.map((f) => (
                    <div className="wt-fact" key={f.label}>
                        <span className="wt-fact-label">{f.label}</span>
                        <span className="wt-fact-value">{f.value}</span>
                    </div>
                ))}
            </div>

            {chapter.id === 'now' && (
                <div className="wt-actions">
                    <Link to="/contact" className="wt-btn wt-btn-primary">
                        <i className="fas fa-paper-plane"></i> Get in touch
                    </Link>
                    <Link to="/projects" className="wt-btn wt-btn-ghost">
                        <i className="fas fa-play"></i> See the work
                    </Link>
                </div>
            )}
        </motion.article>
    );
};

/** Progress rail showing position through the walkthrough. */
const ProgressRail = ({ progress }) => {
    const scaleY = useTransform(progress, [0, 1], [0, 1]);
    return (
        <div className="wt-rail" aria-hidden="true">
            <motion.div className="wt-rail-fill" style={{ scaleY }} />
            {CHAPTERS.map((c, i) => (
                <span key={c.id} className="wt-rail-node" style={{ top: `${(i / (N - 1)) * 100}%` }} />
            ))}
        </div>
    );
};

const AboutWalkthrough = () => {
    const wrapperRef = useRef(null);
    const reduceMotion = useReducedMotion();
    const [scene, setScene] = useState(false);

    // 'start start' -> 'end end' spans exactly the window during which the inner
    // stage is stuck to the top of the viewport, so progress 0..1 maps precisely
    // onto the pinned portion of the scroll.
    const { scrollYProgress } = useScroll({
        target: wrapperRef,
        offset: ['start start', 'end end']
    });

    // Load the 3D only while the walkthrough is actually on screen, and tell the
    // global background corridor to stand down so only one WebGL context is ever
    // rendering at a time.
    useEffect(() => {
        const el = wrapperRef.current;
        if (!el || reduceMotion) return;

        const io = new IntersectionObserver(
            ([entry]) => {
                setScene(entry.isIntersecting);
                window.dispatchEvent(
                    new CustomEvent('walkthrough:visibility', { detail: entry.isIntersecting })
                );
            },
            { rootMargin: '200px 0px' }
        );

        io.observe(el);
        return () => {
            io.disconnect();
            window.dispatchEvent(new CustomEvent('walkthrough:visibility', { detail: false }));
        };
    }, [reduceMotion]);

    return (
        <section
            ref={wrapperRef}
            id="walkthrough"
            className="wt-wrapper"
            aria-label="A walkthrough about Shoib Ahmad"
        >
            {/* The stage stays pinned to the viewport while the wrapper scrolls past it */}
            <div className="wt-stage">
                <div className="wt-canvas-slot">
                    {scene && (
                        <Suspense fallback={null}>
                            <WalkthroughScene progress={scrollYProgress} />
                        </Suspense>
                    )}
                </div>

                <div className="wt-veil" />

                <div className="wt-content container">
                    <ProgressRail progress={scrollYProgress} />

                    <div className="wt-chapter-deck">
                        {CHAPTERS.map((chapter, i) => (
                            <Chapter
                                key={chapter.id}
                                chapter={chapter}
                                index={i}
                                progress={scrollYProgress}
                            />
                        ))}
                    </div>
                </div>

                <div className="wt-hint">
                    <i className="fas fa-chevron-down"></i>
                    <span>Keep scrolling</span>
                </div>
            </div>
        </section>
    );
};

export default AboutWalkthrough;
