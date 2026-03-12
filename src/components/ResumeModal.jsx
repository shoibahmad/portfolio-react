import React, { useEffect } from 'react';
import './ResumeModal.css';

const ResumeModal = () => {
    useEffect(() => {
        const modal = document.getElementById('resume-modal');
        const closeBtn = document.getElementById('close-resume');
        const overlay = document.querySelector('.resume-overlay');

        const closeModal = () => {
            modal?.classList.remove('active');
            document.body.style.overflow = '';
        };

        closeBtn?.addEventListener('click', closeModal);
        overlay?.addEventListener('click', closeModal);

        return () => {
            closeBtn?.removeEventListener('click', closeModal);
            overlay?.removeEventListener('click', closeModal);
        };
    }, []);

    const projects = [
        {
            title: "Lumina - Smart Inventory Management",
            type: "Mobile App",
            description: "Offline-first Flutter inventory app with barcode scanning, dynamic sales charting, and real-time Firebase sync.",
            tech: "Flutter, Firebase, Provider"
        },
        {
            title: "RuralHealth AI",
            type: "AI/ML Project",
            description: "Digital health screening tool for rural areas using Gemini AI for analysis and OpenAI Whisper for voice vitals.",
            tech: "React, Django, Gemini AI"
        },
        {
            title: "Secure Eval",
            type: "AI/ML Project",
            description: "AI-powered proctoring platform with real-time cheating detection and automated behavioral analysis.",
            tech: "React, FastAPI, Computer Vision"
        },
        {
            title: "Code Scraper",
            type: "Tool",
            description: "Node.js automation tool using Puppeteer to scrape and structure code from documentation sites.",
            tech: "Node.js, Puppeteer"
        },
        {
            title: "Truth Guard AI",
            type: "AI/ML Project",
            description: "Multi-modal misinformation detector verifying news text and images using hybrid ML models.",
            tech: "FastAPI, Python, NLP"
        },
        {
            title: "ADR Risk Predictor",
            type: "AI/ML Project",
            description: "Machine learning model predicting adverse drug reactions based on patient history and vitals.",
            tech: "Python, Scikit-learn, Flask"
        },
        {
            title: "Food POS",
            type: "Mobile App",
            description: "High-contrast tablet POS system for food businesses with real-time kitchen syncing.",
            tech: "Flutter, Firebase"
        },
        {
            title: "IU CA (Cross Platform App)",
            type: "Mobile App",
            description: "Centralized university management app for notices, resources, and attendance tracking.",
            tech: "Flutter, Firebase"
        },
        {
            title: "Code Analyzer Tool",
            type: "Web Tool",
            description: "Client-side static analysis tool using AST parsing to detect code quality issues in real-time.",
            tech: "React, Vite, AST"
        },
        {
            title: "Employee Salary Predict",
            type: "ML Project",
            description: "Salary prediction web app using regression algorithms to estimate fair market value.",
            tech: "Python, Flask, Pandas"
        },
        {
            title: "Campus Grievance System",
            type: "Mobile App",
            description: "Ticket-based mobile app for streamlining student grievance redressal and tracking.",
            tech: "Flutter, Firebase"
        },
        {
            title: "Finance Management System",
            type: "Web App",
            description: "Personal finance dashboard for expense tracking, categorization, and visual analytics.",
            tech: "React, Node.js, MongoDB"
        }
    ];

    return (
        <div id="resume-modal" className="resume-modal">
            <div className="resume-overlay"></div>
            <div className="resume-container">
                <div className="resume-header">
                    <h2>Resume</h2>
                    <button id="close-resume" className="close-btn">&times;</button>
                </div>
                <div className="resume-content" id="resume-content">
                    <div className="resume-paper">
                        <div className="resume-top">
                            <h1 className="resume-name">Shoib Ahmad</h1>
                            <div className="resume-contact-info">
                                <span><i className="fas fa-envelope"></i> shoibsahmad@gmail.com</span>
                                <span><i className="fas fa-map-marker-alt"></i> Lucknow</span>
                                <span><i className="fab fa-linkedin"></i> linkedin.com/in/shoib-ahmad-788096219/</span>
                            </div>
                        </div>

                        <div className="resume-section">
                            <h2 className="resume-section-title">Profile</h2>
                            <p>"I'm a highly motivated and disciplined graduate with a strong academic background, eager to apply my skills to a software engineering career"</p>
                        </div>

                        <div className="resume-section">
                            <h2 className="resume-section-title">Work Experience</h2>


                            <div className="resume-item">
                                <div className="resume-item-header">
                                    <strong>IBM, Edunet Foundation</strong>
                                    <span>06/2025 – 07/2025</span>
                                </div>
                            </div>
                            <div className="resume-item">
                                <div className="resume-item-header">
                                    <strong>Content Writing Internship, Marpu Foundation</strong>
                                    <span>06/2023 – 07/2023</span>
                                </div>
                            </div>
                        </div>

                        <div className="resume-section">
                            <h2 className="resume-section-title">Education</h2>
                            <div className="resume-item">
                                <div className="resume-item-header">
                                    <strong>Master's of Computer Application (MCA)</strong>
                                    <span>08/2024 – Present | Delhi</span>
                                </div>
                                <div className="resume-item-details">
                                    <p>Jamia Hamdard University</p>
                                    <p>CGPA: 8.77/10</p>
                                </div>
                            </div>
                            <div className="resume-item">
                                <div className="resume-item-header">
                                    <strong>Bachelor of Computer Applications (BCA)</strong>
                                    <span>2021 – 2024 | Lucknow</span>
                                </div>
                                <div className="resume-item-details">
                                    <p>Integral University Lucknow</p>
                                    <p>CGPA: 9.50/10</p>
                                </div>
                            </div>
                        </div>

                        <div className="resume-section">
                            <h2 className="resume-section-title">Skills</h2>
                            <div className="resume-skills-grid">
                                <div>
                                    <strong>Programming Languages:</strong>
                                    <p>C Programming, C++ Programming, Java, Dart, Python, Kotlin</p>
                                </div>
                                <div>
                                    <strong>Frameworks & Technologies:</strong>
                                    <p>React, Next.js, Vite, Flutter, Flask, FastAPI, XML</p>
                                </div>
                                <div>
                                    <strong>Database & Tools:</strong>
                                    <p>DBMS, Firebase, GitHub, Linux</p>
                                </div>
                                <div>
                                    <strong>Other Skills:</strong>
                                    <p>Research and Analytics, English Proficiency</p>
                                </div>
                            </div>
                        </div>

                        <div className="resume-section">
                            <h2 className="resume-section-title">Projects</h2>
                            {projects.map((project, index) => (
                                <div className="resume-item" key={index}>
                                    <div className="resume-item-header">
                                        <strong>{project.title}</strong>
                                        <span>{project.type}</span>
                                    </div>
                                    <p>{project.description}</p>
                                    <p style={{ fontSize: '0.85rem', marginTop: '0.3rem', color: 'var(--text-muted)' }}>
                                        <i className="fas fa-code" style={{ marginRight: '5px' }}></i>
                                        {project.tech}
                                    </p>
                                </div>
                            ))}
                        </div>

                        <div className="resume-section">
                            <h2 className="resume-section-title">Trainings / Certifications</h2>
                            <div className="resume-item">
                                <div className="resume-item-header">
                                    <strong>Generative AI Foundation</strong>
                                    <span>05/2025 – 06/2025</span>
                                </div>
                            </div>
                            <div className="resume-item">
                                <div className="resume-item-header">
                                    <strong>Internship & Job Preparation</strong>
                                    <span>02/2023 – 05/2023</span>
                                </div>
                            </div>
                            <div className="resume-item">
                                <div className="resume-item-header">
                                    <strong>Android App Development</strong>
                                    <span>02/2023 – 07/2023</span>
                                </div>
                            </div>
                        </div>

                        <div className="resume-footer-text">
                            <p>shoibsahmad@gmail.com</p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ResumeModal;
