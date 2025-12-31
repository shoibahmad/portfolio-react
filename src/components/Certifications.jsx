import React from 'react';
import './Certifications.css';

const Certifications = () => {
    const certifications = [
        {
            title: "Generative AI Foundation",
            date: "05/2025 – 06/2025",
            issuer: "Advanced AI Training" // Added a placeholder issuer for better look
        },
        {
            title: "Internship & Job Preparation",
            date: "02/2023 – 05/2023",
            issuer: "Career Development"
        },
        {
            title: "Android App Development",
            date: "02/2023 – 07/2023",
            issuer: "Mobile Development Bootcamp"
        }
    ];

    return (
        <section id="certifications" className="certifications">
            <div className="container">
                <div className="section-header text-center">
                    <h2 className="section-title">Certifications</h2>
                    <p className="section-subtitle">Professional milestones and technical achievements</p>
                </div>

                <div className="certifications-list">
                    {certifications.map((cert, index) => (
                        <div key={index} className="certification-item animate-on-scroll" style={{ transitionDelay: `${index * 150}ms` }}>
                            <div className="cert-icon">
                                {/* Using different icons based on content if possible, or a generic premium one */}
                                <i className="fas fa-award"></i>
                            </div>
                            <div className="cert-content">
                                <div className="cert-header">
                                    <h3>{cert.title}</h3>
                                    <p className="cert-issuer">{cert.issuer}</p>
                                </div>
                            </div>
                            <div className="cert-date">
                                <i className="far fa-calendar-alt" style={{ marginRight: '8px' }}></i>
                                {cert.date}
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
};

export default Certifications;
