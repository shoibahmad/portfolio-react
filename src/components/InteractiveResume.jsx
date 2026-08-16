import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import './InteractiveResume.css';
import Spotlight from './ui/Spotlight';

const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
        opacity: 1,
        transition: {
            staggerChildren: 0.12,
            delayChildren: 0.1
        }
    }
};

const itemVariants = {
    hidden: { opacity: 0, y: 24, scale: 0.98 },
    visible: {
        opacity: 1,
        y: 0,
        scale: 1,
        transition: { duration: 0.55, ease: [0.25, 1, 0.5, 1] }
    }
};

// 3D Tilt Card Component
const TiltCard = ({ children, className = "" }) => {
    const [tilt, setTilt] = useState({ rotateX: 0, rotateY: 0 });

    const handleMouseMove = (e) => {
        const rect = e.currentTarget.getBoundingClientRect();
        const x = e.clientX - rect.left - rect.width / 2;
        const y = e.clientY - rect.top - rect.height / 2;
        setTilt({
            rotateX: -(y / rect.height) * 8,
            rotateY: (x / rect.width) * 8
        });
    };

    const handleMouseLeave = () => {
        setTilt({ rotateX: 0, rotateY: 0 });
    };

    return (
        <motion.div
            className={`resume-card spotlight-card ${className}`}
            onMouseMove={handleMouseMove}
            onMouseLeave={handleMouseLeave}
            animate={{ rotateX: tilt.rotateX, rotateY: tilt.rotateY }}
            transition={{ type: "spring", stiffness: 350, damping: 25 }}
            style={{ transformStyle: 'preserve-3d' }}
            variants={itemVariants}
            whileHover={{ y: -4, scale: 1.01 }}
        >
            {children}
        </motion.div>
    );
};

const InteractiveResume = () => {
    const [activeSection, setActiveSection] = useState('all');
    const [selectedSkills, setSelectedSkills] = useState([]);

    const resumeData = {
        experience: [
            {
                title: "Lead Full Stack Developer",
                company: "RuralHealth AI",
                period: "Jan 2026 – Present",
                location: "Remote",
                description: "Digital health screening tool for rural areas using Gemini AI for analysis and OpenAI Whisper for voice vitals.",
                skills: ["React", "Django", "Gemini AI"]
            },
            {
                title: "Frontend Developer",
                company: "Price Radar",
                period: "Aug 2025 – Dec 2025",
                location: "Remote",
                description: "Built the high-fidelity UI/UX platform incorporating dark mode glassmorphism and real-time state synchronization.",
                skills: ["React", "CSS", "Frontend"]
            },
            {
                title: "Security & AI Engineer",
                company: "Secure Eval",
                period: "Mar 2025 – Jul 2025",
                location: "Remote",
                description: "AI-powered proctoring platform with real-time cheating detection and automated behavioral analysis.",
                skills: ["React", "FastAPI", "Computer Vision"]
            },
            {
                title: "Machine Learning Engineer",
                company: "ADR Risk Predictor",
                period: "Sep 2024 – Feb 2025",
                location: "Remote",
                description: "Machine learning model predicting adverse drug reactions based on patient history and vitals.",
                skills: ["Python", "Scikit-learn", "Flask"]
            },
            {
                title: "Software Engineer",
                company: "Resume Analyzer",
                period: "Apr 2024 – Aug 2024",
                location: "Remote",
                description: "Developed automated resume parsing and matching system using NLP.",
                skills: ["Python", "NLP", "React"]
            }
        ],
        education: [
            {
                degree: "Master's of Computer Application (MCA)",
                institution: "Jamia Hamdard University",
                period: "08/2024 - Present",
                location: "New Delhi, India",
                skills: ["Computer Science", "Algorithms", "Data Structures"]
            },
            {
                degree: "Bachelor of Computer Applications (BCA)",
                institution: "Integral University Lucknow",
                period: "2021 - 2024",
                location: "Lucknow, India",
                skills: ["Programming", "DBMS", "Software Engineering"]
            }
        ],
        skills: {
            "Programming": ["Python", "Java", "C++", "Dart", "JavaScript"],
            "Frameworks": ["React", "Flutter", "Flask", "FastAPI", "Next.js"],
            "AI/ML": ["Machine Learning", "Deep Learning", "NLP", "Computer Vision"],
            "Tools": ["Git", "Firebase", "Linux", "Docker"]
        }
    };

    const filterOptions = [
        { id: 'all', label: 'All', icon: 'fas fa-th' },
        { id: 'experience', label: 'Experience', icon: 'fas fa-briefcase' },
        { id: 'education', label: 'Education', icon: 'fas fa-graduation-cap' },
        { id: 'skills', label: 'Skills', icon: 'fas fa-code' }
    ];

    const toggleSkillFilter = (skill) => {
        setSelectedSkills(prev =>
            prev.includes(skill)
                ? prev.filter(s => s !== skill)
                : [...prev, skill]
        );
    };

    return (
        <section className="interactive-resume">
            <div className="container">
                {/* Section Header with floating badges */}
                <motion.div
                    className="resume-header text-center"
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.6 }}
                >
                    <div className="resume-badge">
                        <span className="badge-dot"></span>
                        CURRICULUM VITAE & CAREER
                    </div>
                    <h2 className="section-title">
                        Interactive <span className="hero-title-accent">Career Timeline.</span>
                    </h2>
                    <p className="section-subtitle">
                        Filter, explore, and inspect each milestone, university degree, and technical capability.
                    </p>
                </motion.div>

                {/* Filter Buttons with Spring Animations */}
                <motion.div
                    className="resume-filters"
                    initial={{ opacity: 0, y: 15 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.5, delay: 0.1 }}
                >
                    {filterOptions.map(option => (
                        <motion.button
                            key={option.id}
                            className={`resume-filter-btn ${activeSection === option.id ? 'active' : ''}`}
                            onClick={() => setActiveSection(option.id)}
                            whileHover={{ scale: 1.05, y: -2 }}
                            whileTap={{ scale: 0.95 }}
                        >
                            <i className={option.icon}></i>
                            <span>{option.label}</span>
                        </motion.button>
                    ))}
                </motion.div>

                {/* Active Skill Filters Pill */}
                <AnimatePresence>
                    {selectedSkills.length > 0 && (
                        <motion.div
                            className="active-filters"
                            initial={{ opacity: 0, height: 0, scale: 0.95 }}
                            animate={{ opacity: 1, height: 'auto', scale: 1 }}
                            exit={{ opacity: 0, height: 0, scale: 0.95 }}
                            transition={{ duration: 0.3 }}
                        >
                            <span className="filter-label">Filtering by:</span>
                            {selectedSkills.map(skill => (
                                <motion.span
                                    key={skill}
                                    className="active-filter-tag"
                                    initial={{ opacity: 0, scale: 0.8 }}
                                    animate={{ opacity: 1, scale: 1 }}
                                    exit={{ opacity: 0, scale: 0.8 }}
                                >
                                    {skill}
                                    <button onClick={() => toggleSkillFilter(skill)}>
                                        <i className="fas fa-times"></i>
                                    </button>
                                </motion.span>
                            ))}
                        </motion.div>
                    )}
                </AnimatePresence>

                <Spotlight className="resume-content">
                    {/* Experience Section */}
                    {(activeSection === 'all' || activeSection === 'experience') && (
                        <motion.div
                            className="resume-section"
                            variants={containerVariants}
                            initial="hidden"
                            whileInView="visible"
                            viewport={{ once: true, margin: "-50px" }}
                        >
                            <motion.h3 className="resume-section-title" variants={itemVariants}>
                                <i className="fas fa-briefcase"></i>
                                Professional Experience
                            </motion.h3>
                            {resumeData.experience.map((exp, idx) => (
                                <TiltCard key={idx}>
                                    <div className="resume-card-header">
                                        <div>
                                            <h4>{exp.title}</h4>
                                            <p className="company">{exp.company}</p>
                                        </div>
                                        <span className="period">{exp.period}</span>
                                    </div>
                                    <p className="location">
                                        <i className="fas fa-map-marker-alt"></i>
                                        {exp.location}
                                    </p>
                                    <p className="description">{exp.description}</p>
                                    <div className="resume-skills">
                                        {exp.skills.map((skill, i) => (
                                            <motion.span
                                                key={i}
                                                className={`skill-tag ${selectedSkills.includes(skill) ? 'highlighted' : ''}`}
                                                onClick={() => toggleSkillFilter(skill)}
                                                whileHover={{ scale: 1.08, y: -2 }}
                                                whileTap={{ scale: 0.95 }}
                                            >
                                                {skill}
                                            </motion.span>
                                        ))}
                                    </div>
                                </TiltCard>
                            ))}
                        </motion.div>
                    )}

                    {/* Education Section */}
                    {(activeSection === 'all' || activeSection === 'education') && (
                        <motion.div
                            className="resume-section"
                            variants={containerVariants}
                            initial="hidden"
                            whileInView="visible"
                            viewport={{ once: true, margin: "-50px" }}
                        >
                            <motion.h3 className="resume-section-title" variants={itemVariants}>
                                <i className="fas fa-graduation-cap"></i>
                                Academic Education
                            </motion.h3>
                            {resumeData.education.map((edu, idx) => (
                                <TiltCard key={idx}>
                                    <div className="resume-card-header">
                                        <div>
                                            <h4>{edu.degree}</h4>
                                            <p className="company">{edu.institution}</p>
                                        </div>
                                        <span className="period">{edu.period}</span>
                                    </div>
                                    <p className="location">
                                        <i className="fas fa-map-marker-alt"></i>
                                        {edu.location}
                                    </p>
                                    <div className="resume-skills">
                                        {edu.skills && edu.skills.map((skill, i) => (
                                            <motion.span
                                                key={i}
                                                className="skill-tag"
                                                whileHover={{ scale: 1.08, y: -2 }}
                                            >
                                                {skill}
                                            </motion.span>
                                        ))}
                                    </div>
                                </TiltCard>
                            ))}
                        </motion.div>
                    )}

                    {/* Skills Section */}
                    {(activeSection === 'all' || activeSection === 'skills') && (
                        <motion.div
                            className="resume-section"
                            variants={containerVariants}
                            initial="hidden"
                            whileInView="visible"
                            viewport={{ once: true, margin: "-50px" }}
                        >
                            <motion.h3 className="resume-section-title" variants={itemVariants}>
                                <i className="fas fa-code"></i>
                                Technical Skills Matrix
                            </motion.h3>
                            <div className="skills-category-grid">
                                {Object.entries(resumeData.skills).map(([category, skills]) => (
                                    <motion.div
                                        key={category}
                                        className="skills-category spotlight-card"
                                        variants={itemVariants}
                                        whileHover={{ y: -4 }}
                                    >
                                        <h4 className="skills-category-title">{category}</h4>
                                        <div className="resume-skills">
                                            {skills.map((skill, i) => (
                                                <motion.span
                                                    key={i}
                                                    className={`skill-tag ${selectedSkills.includes(skill) ? 'highlighted' : ''}`}
                                                    onClick={() => toggleSkillFilter(skill)}
                                                    whileHover={{ scale: 1.08, y: -2 }}
                                                    whileTap={{ scale: 0.95 }}
                                                >
                                                    {skill}
                                                </motion.span>
                                            ))}
                                        </div>
                                    </motion.div>
                                ))}
                            </div>
                        </motion.div>
                    )}
                </Spotlight>
            </div>
        </section>
    );
};

export default InteractiveResume;
