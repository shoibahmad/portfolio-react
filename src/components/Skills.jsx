import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import './Skills.css';
import Spotlight from './ui/Spotlight';
import GitHubStats from './GitHubStats';

const Skills = () => {
    const [activeTab, setActiveTab] = useState('All');

    const skillCategories = [
        {
            id: "languages",
            title: "Core & Languages",
            icon: "fas fa-code",
            tag: "Foundational",
            description: "Object-oriented, functional, and system-level languages for high-performance software.",
            skills: [
                { name: "Python", level: "Advanced", pct: 95, icon: "fab fa-python", color: "#3776AB" },
                { name: "Java", level: "Advanced", pct: 90, icon: "fab fa-java", color: "#007396" },
                { name: "C++", level: "Proficient", pct: 85, icon: "fas fa-file-code", color: "#00599C" },
                { name: "C", level: "Proficient", pct: 82, icon: "fas fa-terminal", color: "#A8B9CC" },
                { name: "Dart", level: "Proficient", pct: 85, icon: "fas fa-bullseye", color: "#0175C2" },
                { name: "Kotlin", level: "Intermediate", pct: 75, icon: "fab fa-android", color: "#7F52FF" },
                { name: "JavaScript / TS", level: "Advanced", pct: 94, icon: "fab fa-js", color: "#F7DF1E" }
            ]
        },
        {
            id: "frameworks",
            title: "Frameworks & AI/ML",
            icon: "fas fa-brain",
            tag: "Intelligent Systems",
            description: "Modern web frameworks, distributed backend APIs, and cutting-edge GenAI/Agent tools.",
            skills: [
                { name: "React 19", level: "Advanced", pct: 96, icon: "fab fa-react", color: "#61DAFB" },
                { name: "Next.js 16", level: "Advanced", pct: 92, icon: "fas fa-bolt", color: "#000000" },
                { name: "FastAPI", level: "Advanced", pct: 94, icon: "fas fa-rocket", color: "#009688" },
                { name: "Flutter", level: "Proficient", pct: 86, icon: "fas fa-mobile-alt", color: "#02569B" },
                { name: "LangChain / LLMs", level: "Advanced", pct: 92, icon: "fas fa-microchip", color: "#FF6B00" },
                { name: "Flask", level: "Proficient", pct: 88, icon: "fas fa-flask", color: "#333333" },
                { name: "Vite", level: "Advanced", pct: 95, icon: "fas fa-magic", color: "#646CFF" }
            ]
        },
        {
            id: "cloud-data",
            title: "Database & Cloud DevOps",
            icon: "fas fa-server",
            tag: "Infrastructure",
            description: "Scalable databases, vector embeddings, cloud hosting, and automated pipelines.",
            skills: [
                { name: "Supabase / pgvector", level: "Advanced", pct: 92, icon: "fas fa-database", color: "#3ECF8E" },
                { name: "Firebase", level: "Advanced", pct: 90, icon: "fas fa-fire", color: "#FFCA28" },
                { name: "Docker", level: "Proficient", pct: 82, icon: "fab fa-docker", color: "#2496ED" },
                { name: "Linux / Bash", level: "Advanced", pct: 88, icon: "fab fa-linux", color: "#FCC624" },
                { name: "Git / GitHub Actions", level: "Advanced", pct: 95, icon: "fab fa-github", color: "#F05032" },
                { name: "REST & WebSockets", level: "Advanced", pct: 94, icon: "fas fa-network-wired", color: "#FF6B00" }
            ]
        },
        {
            id: "research",
            title: "Research & Specializations",
            icon: "fas fa-atom",
            tag: "Domain Mastery",
            description: "Scholarly publications, vector semantic retrieval, multi-agent workflows, and algorithms.",
            skills: [
                { name: "AI Agent Orchestration", level: "Expert", pct: 96, icon: "fas fa-robot", color: "#FF6B00" },
                { name: "Vector Search & RAG", level: "Expert", pct: 94, icon: "fas fa-vector-square", color: "#FF6B00" },
                { name: "Academic Research", level: "Published", pct: 95, icon: "fas fa-graduation-cap", color: "#4B5563" },
                { name: "System Architecture", level: "Advanced", pct: 90, icon: "fas fa-sitemap", color: "#FF6B00" },
                { name: "Multimodal AI Recon", level: "Advanced", pct: 92, icon: "fas fa-eye", color: "#4285F4" }
            ]
        }
    ];

    const tabs = ['All', 'Core & Languages', 'Frameworks & AI/ML', 'Database & Cloud DevOps', 'Research & Specializations'];

    const filteredCategories = activeTab === 'All'
        ? skillCategories
        : skillCategories.filter(c => c.title === activeTab);

    return (
        <section id="skills" className="skills-section">
            <div className="container">
                {/* Header with PRDUCK aesthetic */}
                <div className="skills-header text-center">
                    <div className="skills-badge">
                        <span className="badge-dot"></span>
                        CAPABILITIES & STACK
                    </div>
                    <h2 className="section-title">
                        Engineered for <span className="hero-title-accent">Intelligence & Scale.</span>
                    </h2>
                    <p className="section-subtitle">
                        An exhaustive breakdown of programming languages, modern frameworks, cloud architectures, and machine intelligence tooling I deploy in production.
                    </p>
                </div>

                {/* Filter Tabs */}
                <div className="skills-tabs">
                    {tabs.map((tab) => (
                        <motion.button
                            key={tab}
                            className={`skills-tab-btn ${activeTab === tab ? 'active' : ''}`}
                            onClick={() => setActiveTab(tab)}
                            whileHover={{ scale: 1.04, y: -1 }}
                            whileTap={{ scale: 0.96 }}
                        >
                            {tab}
                        </motion.button>
                    ))}
                </div>

                {/* Bento Grid layout */}
                <Spotlight className="skills-bento-grid">
                    <AnimatePresence mode="popLayout">
                        {filteredCategories.map((category, index) => (
                            <motion.div
                                key={category.id}
                                layout
                                initial={{ opacity: 0, y: 20, scale: 0.98 }}
                                animate={{ opacity: 1, y: 0, scale: 1 }}
                                exit={{ opacity: 0, scale: 0.95 }}
                                transition={{ duration: 0.4, delay: index * 0.08 }}
                                className={`bento-skill-card card-${category.id} spotlight-card`}
                            >
                                <div className="bento-card-header">
                                    <div className="bento-icon-wrapper">
                                        <i className={category.icon}></i>
                                    </div>
                                    <div className="bento-header-text">
                                        <span className="bento-tag">{category.tag}</span>
                                        <h3>{category.title}</h3>
                                    </div>
                                </div>

                                <p className="bento-desc">{category.description}</p>

                                <div className="bento-skills-list">
                                    {category.skills.map((skill, idx) => (
                                        <motion.div
                                            key={idx}
                                            className="bento-skill-pill"
                                            whileHover={{ y: -3, scale: 1.02 }}
                                            transition={{ type: "spring", stiffness: 400, damping: 20 }}
                                        >
                                            <i className={skill.icon} style={{ color: skill.color }}></i>
                                            <div className="pill-info">
                                                <div className="pill-row">
                                                    <span className="pill-name">{skill.name}</span>
                                                    <span className="pill-meta">{skill.level}</span>
                                                </div>
                                                <div className="skill-meter-bg">
                                                    <motion.div
                                                        className="skill-meter-fill"
                                                        initial={{ width: 0 }}
                                                        whileInView={{ width: `${skill.pct}%` }}
                                                        viewport={{ once: true }}
                                                        transition={{ duration: 1, delay: 0.1 + idx * 0.05, ease: "easeOut" }}
                                                        style={{
                                                            background: `linear-gradient(90deg, ${skill.color}, #FF6B00)`
                                                        }}
                                                    />
                                                </div>
                                            </div>
                                        </motion.div>
                                    ))}
                                </div>
                            </motion.div>
                        ))}
                    </AnimatePresence>
                </Spotlight>

                {/* Live GitHub Stats Component */}
                <GitHubStats />
            </div>
        </section>
    );
};

export default Skills;
