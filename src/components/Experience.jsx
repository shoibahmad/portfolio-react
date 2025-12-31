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
                        <div key={index} className="experience-item">
                            <div className="exp-header">
                                <div>
                                    <h3>{exp.title}, <span className="company">{exp.company}</span></h3>
                                </div>
                                <div className="exp-meta">
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
