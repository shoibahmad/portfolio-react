import React from 'react';
import './Projects.css';

const Projects = () => {
    const projects = [
        {
            title: "ADR Risk Management",
            date: "Project",
            description: "A comprehensive healthcare solution for predicting and managing Adverse Drug Reactions (ADR). The system analyzes patient history and drug interactions to prevent potential risks, providing real-time alerts to healthcare providers.",
            tech: ["HTML", "CSS", "JavaScript", "Flask", "Python"],
            image: "/images/adr.png",
            link: "https://github.com/shoibahmad/ADR-Risk-Predictor"
        },
        {
            title: "Campus Grievance System",
            date: "Project",
            description: "A mobile-first application designed to streamline the grievance redressal process in educational institutions. Students can lodge complaints, track status, and communicate with administration transparently.",
            tech: ["Flutter", "Dart", "Firebase", "Android"],
            image: "/images/grievance.png",
            link: "https://github.com/shoibahmad/Campus-Grievance"
        },
        {
            title: "Code Analyzer Tool",
            date: "Tool",
            description: "A sophisticated static code analysis tool that helps developers identify code quality issues, security vulnerabilities, and performance bottlenecks. Features include syntax highlighting, detailed reports, and fix suggestions.",
            tech: ["React", "Vite", "Firebase", "Node.js"],
            image: "/images/analyzer.png",
            link: "https://github.com/shoibahmad/Code-Analyzer"
        },
        {
            title: "Web Scraper Pro",
            date: "Tool",
            description: "An advanced web scraping dashboard that allows users to configure, schedule, and monitor data extraction jobs. Includes data visualization, export options (CSV/JSON), and proxy management.",
            tech: ["React", "Vite", "Firebase", "Puppeteer"],
            image: "/images/scraper.png",
            link: "https://github.com/shoibahmad/Code-Scraper"
        },
        {
            title: "Employee Salary Predict",
            date: "ML Project",
            description: "An intelligent machine learning web application designed to predict employee salaries with high accuracy. The system utilizes advanced regression algorithms including Linear Regression and Random Forest.",
            tech: ["Python", "Flask", "Scikit-learn", "Pandas"],
            image: "/images/salary.png",
            link: "https://github.com/shoibahmad/employee-salary-predictor"
        },
        {
            title: "Food POS Application",
            date: "App",
            description: "A comprehensive Point of Sale (POS) system specifically designed for restaurants. Streamlines order management, inventory tracking, and sales analytics in real-time.",
            tech: ["Flutter", "Firebase", "Dart"],
            image: "/images/Food.png",
            link: "https://github.com/shoibahmad/Food-Runner"
        }
    ];

    return (
        <section id="projects" className="projects">
            <div className="container">
                <h2 className="section-title">Featured Projects</h2>
                <div className="projects-list">
                    {projects.map((project, index) => (
                        <div key={index} className="project-item">
                            <div className="project-image">
                                <img src={project.image} alt={project.title} loading="lazy" />
                            </div>
                            <div className="project-details">
                                <div className="project-header">
                                    <h3>{project.title}</h3>
                                    <span className="project-date">{project.date}</span>
                                </div>
                                <p>{project.description}</p>
                                <div className="project-tech">
                                    {project.tech.map((tech, idx) => (
                                        <span key={idx}>{tech}</span>
                                    ))}
                                </div>
                                <a href={project.link} target="_blank" rel="noopener noreferrer" className="project-link">
                                    View Project <i className="fas fa-arrow-right" style={{ marginLeft: '8px', fontSize: '0.8em' }}></i>
                                </a>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
};

export default Projects;
