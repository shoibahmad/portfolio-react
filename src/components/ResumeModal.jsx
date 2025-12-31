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
                                    <strong>Internship, Deloitte Virtual Experience Program</strong>
                                    <span>05/2025 – 07/2025</span>
                                </div>
                            </div>
                            <div className="resume-item">
                                <div className="resume-item-header">
                                    <strong>Internship, Deolang</strong>
                                    <span>01/2025 – 06/2025</span>
                                </div>
                            </div>
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
                            <div className="resume-item">
                                <div className="resume-item-header">
                                    <strong>ADR Risk Management</strong>
                                    <span>Project</span>
                                </div>
                                <p>A comprehensive healthcare solution for predicting and managing Adverse Drug Reactions (ADR). Technologies: HTML, CSS, JavaScript, Flask, Python.</p>
                            </div>
                            <div className="resume-item">
                                <div className="resume-item-header">
                                    <strong>Campus Grievance System</strong>
                                    <span>Project</span>
                                </div>
                                <p>A mobile-first application for streamlining grievance redressal in educational institutions. Technologies: Flutter, Dart, Firebase.</p>
                            </div>
                            <div className="resume-item">
                                <div className="resume-item-header">
                                    <strong>Code Analyzer Tool</strong>
                                    <span>Tool</span>
                                </div>
                                <p>A sophisticated static code analysis tool that helps developers identify code quality issues and security vulnerabilities. Technologies: React, Vite, Firebase.</p>
                            </div>
                            <div className="resume-item">
                                <div className="resume-item-header">
                                    <strong>Web Scraper Pro</strong>
                                    <span>Tool</span>
                                </div>
                                <p>An advanced web scraping dashboard for data extraction with visualization and export capabilities. Technologies: React, Vite, Firebase, Puppeteer.</p>
                            </div>
                            <div className="resume-item">
                                <div className="resume-item-header">
                                    <strong>Employee Salary Prediction</strong>
                                    <span>Project</span>
                                </div>
                                <p>A machine learning web application that predicts employee salaries using advanced regression models and data analytics.</p>
                            </div>
                            <div className="resume-item">
                                <div className="resume-item-header">
                                    <strong>Food POS Application</strong>
                                    <span>Project</span>
                                </div>
                                <p>A comprehensive Point of Sale system for food businesses with inventory management and order tracking capabilities.</p>
                            </div>
                            <div className="resume-item">
                                <div className="resume-item-header">
                                    <strong>IU CA Department App</strong>
                                    <span>Project</span>
                                </div>
                                <p>A comprehensive mobile application for the Computer Applications department, featuring student management and course tracking.</p>
                            </div>
                            <div className="resume-item">
                                <div className="resume-item-header">
                                    <strong>Finance Management System</strong>
                                    <span>Project</span>
                                </div>
                                <p>A personal finance tracking application with expense categorization, budget planning, and financial analytics.</p>
                            </div>
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
