import React, { useState } from 'react';
import './InteractiveResume.css';
import Spotlight from './ui/Spotlight';

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

    const allSkills = Object.values(resumeData.skills).flat();

    return (
        <section className="interactive-resume">
            <div className="container">
                <h2 className="section-title">Interactive Resume</h2>
                <p className="section-subtitle">
                    Click to filter and explore my professional journey
                </p>

                {/* Filter Buttons */}
                <div className="resume-filters">
                    {filterOptions.map(option => (
                        <button
                            key={option.id}
                            className={`resume-filter-btn ${activeSection === option.id ? 'active' : ''}`}
                            onClick={() => setActiveSection(option.id)}
                        >
                            <i className={option.icon}></i>
                            <span>{option.label}</span>
                        </button>
                    ))}
                </div>

                {/* Skill Tags Filter */}
                {selectedSkills.length > 0 && (
                    <div className="active-filters">
                        <span className="filter-label">Filtering by:</span>
                        {selectedSkills.map(skill => (
                            <span key={skill} className="active-filter-tag">
                                {skill}
                                <button onClick={() => toggleSkillFilter(skill)}>
                                    <i className="fas fa-times"></i>
                                </button>
                            </span>
                        ))}
                    </div>
                )}

                <Spotlight className="resume-content">
                    {/* Experience Section */}
                    {(activeSection === 'all' || activeSection === 'experience') && (
                        <div className="resume-section">
                            <h3 className="resume-section-title">
                                <i className="fas fa-briefcase"></i>
                                Experience
                            </h3>
                            {resumeData.experience.map((exp, idx) => (
                                <div key={idx} className="resume-card spotlight-card">
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
                                            <span
                                                key={i}
                                                className={`skill-tag ${selectedSkills.includes(skill) ? 'highlighted' : ''}`}
                                                onClick={() => toggleSkillFilter(skill)}
                                            >
                                                {skill}
                                            </span>
                                        ))}
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}

                    {/* Education Section */}
                    {(activeSection === 'all' || activeSection === 'education') && (
                        <div className="resume-section">
                            <h3 className="resume-section-title">
                                <i className="fas fa-graduation-cap"></i>
                                Education
                            </h3>
                            {resumeData.education.map((edu, idx) => (
                                <div key={idx} className="resume-card spotlight-card">
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
                                </div>
                            ))}
                        </div>
                    )}

                    {/* Skills Section */}
                    {(activeSection === 'all' || activeSection === 'skills') && (
                        <div className="resume-section">
                            <h3 className="resume-section-title">
                                <i className="fas fa-code"></i>
                                Technical Skills
                            </h3>
                            {Object.entries(resumeData.skills).map(([category, skills]) => (
                                <div key={category} className="skills-category spotlight-card">
                                    <h4 className="skills-category-title">{category}</h4>
                                    <div className="resume-skills">
                                        {skills.map((skill, i) => (
                                            <span
                                                key={i}
                                                className={`skill-tag ${selectedSkills.includes(skill) ? 'highlighted' : ''}`}
                                                onClick={() => toggleSkillFilter(skill)}
                                            >
                                                {skill}
                                            </span>
                                        ))}
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </Spotlight>
            </div>
        </section>
    );
};

export default InteractiveResume;
