import React from 'react';

const Certifications = () => {
    const certifications = [
        {
            title: "Generative AI Foundation",
            date: "05/2025 – 06/2025"
        },
        {
            title: "Internship & Job Preparation",
            date: "02/2023 – 05/2023"
        },
        {
            title: "Android App Development",
            date: "02/2023 – 07/2023"
        }
    ];

    return (
        <section id="certifications" className="certifications">
            <div className="container">
                <h2 className="section-title">Trainings / Certifications</h2>
                <div className="certifications-list">
                    {certifications.map((cert, index) => (
                        <div key={index} className="certification-item animate-on-scroll" style={{ transitionDelay: `${index * 150}ms` }}>
                            <div className="cert-header">
                                <h3>{cert.title}</h3>
                                <span className="cert-date">{cert.date}</span>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
};

export default Certifications;
