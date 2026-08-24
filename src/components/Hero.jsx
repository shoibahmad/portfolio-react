import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence, useReducedMotion } from 'framer-motion';
import HeroVisual from './three/HeroVisual';
import TiltCard from './ui/TiltCard';
import { BASICS, ROLES, FACTS, LEDE } from '../data/profile';
import './Hero.css';

/* The rotating word is absolutely positioned so the outgoing and incoming roles
   can cross-fade in the same place. That takes it out of flow, so the slot has
   no width of its own — it is sized by rendering the longest role invisibly
   behind it. A hard-coded `ch` width would clip as soon as the copy changed. */
const LONGEST_ROLE = ROLES.reduce((a, b) => (b.length > a.length ? b : a), '');

const Hero = () => {
    const [time, setTime] = useState('');
    const [roleIndex, setRoleIndex] = useState(0);
    const reduceMotion = useReducedMotion();

    useEffect(() => {
        const updateTime = () => {
            const options = {
                timeZone: 'Asia/Kolkata',
                hour: '2-digit',
                minute: '2-digit',
                hour12: true
            };
            setTime(new Intl.DateTimeFormat('en-US', options).format(new Date()));
        };
        updateTime();
        const interval = setInterval(updateTime, 60000);
        return () => clearInterval(interval);
    }, []);

    useEffect(() => {
        if (reduceMotion) return;
        const timer = setInterval(() => {
            setRoleIndex((prev) => (prev + 1) % ROLES.length);
        }, 3200);
        return () => clearInterval(timer);
    }, [reduceMotion]);

    const container = {
        hidden: { opacity: 0 },
        visible: {
            opacity: 1,
            transition: { staggerChildren: 0.08, delayChildren: 0.05 }
        }
    };

    const item = {
        hidden: { opacity: 0, y: 18 },
        visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: [0.22, 1, 0.36, 1] } }
    };

    return (
        <section className="hero" id="home" aria-labelledby="hero-title">
            <div className="shell hero__shell">
                <motion.div
                    className="hero__text"
                    variants={container}
                    initial="hidden"
                    animate="visible"
                >
                    <motion.div className="hero__meta" variants={item}>
                        <span className="hero__status">
                            <span className="hero__status-dot" aria-hidden="true" />
                            Available for work
                        </span>
                        <span className="hero__time">
                            {BASICS.location} · {time}
                        </span>
                    </motion.div>

                    <motion.h1 className="hero__title" id="hero-title" variants={item}>
                        Understand what your software
                        <span className="hero__title-accent"> can become.</span>
                    </motion.h1>

                    {/* The rotating role sits below the headline rather than inside it.
                        Animating a word inside an h1 reflows the heading on every
                        change, which visibly nudges the paragraph beneath it. */}
                    <motion.p className="hero__role" variants={item}>
                        <span className="hero__role-label">{BASICS.name} —</span>
                        <span className="hero__role-slot">
                            <span className="hero__role-sizer" aria-hidden="true">
                                {LONGEST_ROLE}
                            </span>
                            <AnimatePresence mode="wait" initial={false}>
                                <motion.span
                                    key={ROLES[roleIndex]}
                                    className="hero__role-value"
                                    initial={reduceMotion ? false : { opacity: 0, y: 10 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    exit={reduceMotion ? { opacity: 1 } : { opacity: 0, y: -10 }}
                                    transition={{ duration: 0.3, ease: 'easeOut' }}
                                >
                                    {ROLES[roleIndex]}
                                </motion.span>
                            </AnimatePresence>
                        </span>
                    </motion.p>

                    <motion.p className="hero__lede" variants={item}>{LEDE}</motion.p>

                    <motion.div className="hero__actions" variants={item}>
                        <Link to="/projects" className="btn btn-primary btn-lg">
                            Explore projects
                        </Link>
                        <Link to="/contact" className="btn btn-outline btn-lg">
                            Get in touch
                        </Link>
                    </motion.div>

                    <motion.dl className="hero__facts" variants={item}>
                        {FACTS.map((fact) => (
                            <div className="hero__fact" key={fact.label}>
                                <dt className="hero__fact-value">{fact.value}</dt>
                                <dd className="hero__fact-label">{fact.label}</dd>
                            </div>
                        ))}
                    </motion.dl>
                </motion.div>

                <motion.div
                    className="hero__visual stage"
                    initial={reduceMotion ? false : { opacity: 0, scale: 0.94 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.9, delay: 0.15, ease: [0.22, 1, 0.36, 1] }}
                >
                    {/* Two layers on purpose. The portrait is the subject and sits
                        in front; the rendered form is the backdrop it occludes.
                        Real overlap between a DOM element and the canvas is what
                        makes the pair read as one composition with depth rather
                        than as a photo next to a widget. */}
                    <div className="hero__composition">
                        <div className="hero__object-layer" aria-hidden="true">
                            <HeroVisual />
                        </div>

                        <TiltCard className="hero__portrait" max={6} lift={4} depth={24}>
                            <img
                                src="/images/profile.jpg"
                                alt={BASICS.name}
                                width="1600"
                                height="1600"
                                /* Above the fold on every route that renders the
                                   hero, so it must not be lazy. */
                                fetchPriority="high"
                                decoding="async"
                            />
                        </TiltCard>
                    </div>
                </motion.div>
            </div>
        </section>
    );
};

export default Hero;
