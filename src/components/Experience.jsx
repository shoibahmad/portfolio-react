import React from 'react';
import './Experience.css';

const Experience = () => {
    const experiences = [
        {
            title: "Internship",
            company: "Deloitte Virtual Experience Program",
            date: "05/2025 – 07/2025"
        },
        {
            title: "Internship",
            company: "Deolang",
            date: "01/2025 – 06/2025"
        },
        {
            title: "IBM",
            company: "Edunet Foundation",
            date: "06/2025 – 07/2025"
        },
        {
            title: "Content Writing Internship",
            company: "Marpu Foundation",
            date: "06/2023 – 07/2023"
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

            <div className="wave-divider">
                <svg data-name="Layer 1" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1200 120" preserveAspectRatio="none">
                    <path d="M985.66,92.83C906.67,72,823.78,31,743.84,14.19c-82.26-17.34-168.06-16.33-250.45.39-57.84,11.73-114,31.07-172,41.86A600.21,600.21,0,0,1,0,27.35V120H1200V95.8C1132.19,118.92,1055.71,111.31,985.66,92.83Z" className="shape-fill"></path>
                </svg>
            </div>
        </section>
    );
};

export default Experience;
