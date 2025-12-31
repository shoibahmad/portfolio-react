import React from 'react';
import './Education.css';

const Education = () => {
    const education = [
        {
            degree: "Master's of Computer Application (MCA)",
            institution: "Jamia Hamdard University",
            cgpa: "CGPA: 8.77/10",
            date: "08/2024 – Present",
            location: "Delhi"
        },
        {
            degree: "Bachelor of Computer Applications (BCA)",
            institution: "Integral University Lucknow",
            cgpa: "CGPA: 9.10/10",
            date: "2021 – 2024",
            location: "Lucknow"
        }
    ];

    return (
        <section id="education" className="education">
            <div className="container">
                <h2 className="section-title">Education</h2>
                <div className="education-list">
                    {education.map((edu, index) => (
                        <div key={index} className="education-item animate-on-scroll" style={{ transitionDelay: `${index * 150}ms` }}>
                            <div className="edu-header">
                                <div>
                                    <h3>{edu.degree}</h3>
                                    <p className="institution">{edu.institution}</p>
                                    <p className="cgpa">{edu.cgpa}</p>
                                </div>
                                <div className="edu-meta">
                                    <span className="edu-date">{edu.date}</span>
                                    <span className="edu-location">{edu.location}</span>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
};

export default Education;
