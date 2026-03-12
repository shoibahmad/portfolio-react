import React, { useState } from 'react';
import './InteractiveResume.css';

const InteractiveResume = () => {
    const [activeSection, setActiveSection] = useState('all');
    const [selectedSkills, setSelectedSkills] = useState([]);

    const resumeData = {
        experience: [

        ],
        education: [
            {
                degree: "Master of Computer Applications (MCA)",
                institution: "Jamia Hamdard University",
                period: "2023 - Present",
                location: "New Delhi, India",
                skills: ["Computer Science", "Algorithms", "Data Structures"]
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

                <div className="resume-content">
                    {/* Experience Section */}
                    {(activeSection === 'all' || activeSection === 'experience') && (
                        <div className="resume-section">
                            <h3 className="resume-section-title">
                                <i className="fas fa-briefcase"></i>
                                Experience
                            </h3>
                            {resumeData.experience.map((exp, idx) => (
                                <div key={idx} className="resume-card">
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
                                <div key={idx} className="resume-card">
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
                                <div key={category} className="skills-category">
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
                </div>
            </div>
        </section>
    );
};

export default InteractiveResume;
