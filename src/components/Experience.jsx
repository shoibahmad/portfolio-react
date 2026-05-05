import React from 'react';
import './Experience.css';

const Experience = () => {
    const experiences = [
        {
            title: "Lead Full Stack Developer",
            company: "RuralHealth AI",
            date: "Jan 2026 – Present"
        },
        {
            title: "Frontend Developer",
            company: "Price Radar",
            date: "Aug 2025 – Dec 2025"
        },
        {
            title: "Security & AI Engineer",
            company: "Secure Eval",
            date: "Mar 2025 – Jul 2025"
        },
        {
            title: "Machine Learning Engineer",
            company: "ADR Risk Predictor",
            date: "Sep 2024 – Feb 2025"
        },
        {
            title: "Software Engineer",
            company: "Resume Analyzer",
            date: "Apr 2024 – Aug 2024"
        }
    ];

    return (
        <section id="experience" className="experience">
            <div className="container">
                <h2 className="section-title">Work Experience</h2>
                <div className="experience-list">
                    {experiences.map((exp, index) => (
                        <div key={index} className="experience-item animate-on-scroll" style={{ transitionDelay: `${index * 150}ms` }}>
                            <div className="exp-card">
                                <div className="exp-header">
                                    <h3>{exp.title}</h3>
                                    <span className="company">{exp.company}</span>
                                    <span className="exp-date">{exp.date}</span>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>

        </section>
    );
};

export default Experience;
