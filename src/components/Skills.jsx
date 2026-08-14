import React, { useState } from 'react';
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
                { name: "Python", level: "Advanced", exp: "3+ yrs", icon: "fab fa-python", color: "#3776AB" },
                { name: "Java", level: "Advanced", exp: "3+ yrs", icon: "fab fa-java", color: "#007396" },
                { name: "C++", level: "Proficient", exp: "2+ yrs", icon: "fas fa-file-code", color: "#00599C" },
                { name: "C", level: "Proficient", exp: "2+ yrs", icon: "fas fa-terminal", color: "#A8B9CC" },
                { name: "Dart", level: "Proficient", exp: "2 yrs", icon: "fas fa-bullseye", color: "#0175C2" },
                { name: "Kotlin", level: "Intermediate", exp: "1 yr", icon: "fab fa-android", color: "#7F52FF" },
                { name: "JavaScript / TS", level: "Advanced", exp: "3+ yrs", icon: "fab fa-js", color: "#F7DF1E" }
            ]
        },
        {
            id: "frameworks",
            title: "Frameworks & AI/ML",
            icon: "fas fa-brain",
            tag: "Intelligent Systems",
            description: "Modern web frameworks, distributed backend APIs, and cutting-edge GenAI/Agent tools.",
            skills: [
                { name: "React 19", level: "Advanced", exp: "3+ yrs", icon: "fab fa-react", color: "#61DAFB" },
                { name: "Next.js 16", level: "Advanced", exp: "2+ yrs", icon: "fas fa-bolt", color: "#000000" },
                { name: "FastAPI", level: "Advanced", exp: "2+ yrs", icon: "fas fa-rocket", color: "#009688" },
                { name: "Flutter", level: "Proficient", exp: "2 yrs", icon: "fas fa-mobile-alt", color: "#02569B" },
                { name: "LangChain / LLMs", level: "Advanced", exp: "2 yrs", icon: "fas fa-microchip", color: "#FF6B00" },
                { name: "Flask", level: "Proficient", exp: "2 yrs", icon: "fas fa-flask", color: "#000000" },
                { name: "Vite", level: "Advanced", exp: "3 yrs", icon: "fas fa-magic", color: "#646CFF" }
            ]
        },
        {
            id: "cloud-data",
            title: "Database & Cloud DevOps",
            icon: "fas fa-server",
            tag: "Infrastructure",
            description: "Scalable databases, vector embeddings, cloud hosting, and automated pipelines.",
            skills: [
                { name: "Supabase / pgvector", level: "Advanced", exp: "2 yrs", icon: "fas fa-database", color: "#3ECF8E" },
                { name: "Firebase", level: "Advanced", exp: "3 yrs", icon: "fas fa-fire", color: "#FFCA28" },
                { name: "Docker", level: "Proficient", exp: "1.5 yrs", icon: "fab fa-docker", color: "#2496ED" },
                { name: "Linux / Bash", level: "Advanced", exp: "3+ yrs", icon: "fab fa-linux", color: "#FCC624" },
                { name: "Git / GitHub Actions", level: "Advanced", exp: "3+ yrs", icon: "fab fa-github", color: "#F05032" },
                { name: "REST & WebSockets", level: "Advanced", exp: "3 yrs", icon: "fas fa-network-wired", color: "#FF6B00" }
            ]
        },
        {
            id: "research",
            title: "Research & Specializations",
            icon: "fas fa-atom",
            tag: "Domain Mastery",
            description: "Scholarly publications, vector semantic retrieval, multi-agent workflows, and algorithms.",
            skills: [
                { name: "AI Agent Orchestration", level: "Expert", exp: "Specialty", icon: "fas fa-robot", color: "#FF6B00" },
                { name: "Vector Search & RAG", level: "Expert", exp: "Specialty", icon: "fas fa-vector-square", color: "#FF6B00" },
                { name: "Academic Research", level: "Published", exp: "Scholar", icon: "fas fa-graduation-cap", color: "#4B5563" },
                { name: "System Architecture", level: "Advanced", exp: "Architecture", icon: "fas fa-sitemap", color: "#FF6B00" },
                { name: "Multimodal AI Recon", level: "Advanced", exp: "Gemini Vision", icon: "fas fa-eye", color: "#4285F4" }
            ]
        }
    ];

    const allSkills = skillCategories.flatMap(c => c.skills);
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
                        <button
                            key={tab}
                            className={`skills-tab-btn ${activeTab === tab ? 'active' : ''}`}
                            onClick={() => setActiveTab(tab)}
                        >
                            {tab}
                        </button>
                    ))}
                </div>

                {/* Bento Grid layout */}
                <Spotlight className="skills-bento-grid">
                    {filteredCategories.map((category, index) => (
                        <div
                            key={category.id}
                            className={`bento-skill-card card-${category.id} spotlight-card animate-on-scroll is-visible`}
                            style={{ transitionDelay: `${index * 120}ms` }}
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
                                    <div key={idx} className="bento-skill-pill">
                                        <i className={skill.icon} style={{ color: skill.color }}></i>
                                        <div className="pill-info">
                                            <span className="pill-name">{skill.name}</span>
                                            <span className="pill-meta">{skill.level} • {skill.exp}</span>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    ))}
                </Spotlight>

                {/* Live GitHub Stats Component */}
                <GitHubStats />
            </div>
        </section>
    );
};

export default Skills;
