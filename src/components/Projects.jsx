import React, { useState } from 'react';
import './Projects.css';

const Projects = () => {
    const [activeFilter, setActiveFilter] = useState('All');

    const handleMouseMove = (e) => {
        const { currentTarget: target } = e;
        const rect = target.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;

        target.style.setProperty('--mouse-x', `${x}px`);
        target.style.setProperty('--mouse-y', `${y}px`);
    };

    const projects = [
        {
            title: "ADR Risk Management",
            category: "AI/ML",
            date: "Project",
            description: "A comprehensive healthcare solution for predicting and managing Adverse Drug Reactions (ADR). The system analyzes patient history and drug interactions to prevent potential risks, providing real-time alerts to healthcare providers.",
            tech: ["HTML", "CSS", "JavaScript", "Flask", "Python"],
            image: "/images/adr.png",
            link: "https://github.com/shoibahmad/ADR-Risk-Predictor"
        },
        {
            title: "Campus Grievance System",
            category: "Mobile Apps",
            date: "Project",
            description: "A mobile-first application designed to streamline the grievance redressal process in educational institutions. Students can lodge complaints, track status, and communicate with administration transparently.",
            tech: ["Flutter", "Dart", "Firebase", "Android"],
            image: "/images/grievance.png",
            link: "https://github.com/shoibahmad/Campus-Grievance"
        },
        {
            title: "Code Analyzer Tool",
            category: "Web Dev",
            date: "Tool",
            description: "A sophisticated static code analysis tool that helps developers identify code quality issues, security vulnerabilities, and performance bottlenecks. Features include syntax highlighting, detailed reports, and fix suggestions.",
            tech: ["React", "Vite", "Firebase", "Node.js"],
            image: "/images/analyzer.png",
            link: "https://github.com/shoibahmad/Code-Analyzer"
        },
        {
            title: "Web Scraper Pro",
            category: "Web Dev",
            date: "Tool",
            description: "An advanced web scraping dashboard that allows users to configure, schedule, and monitor data extraction jobs. Includes data visualization, export options (CSV/JSON), and proxy management.",
            tech: ["React", "Vite", "Firebase", "Puppeteer"],
            image: "/images/scraper.png",
            link: "https://github.com/shoibahmad/Code-Scraper"
        },
        {
            title: "Employee Salary Predict",
            category: "AI/ML",
            date: "ML Project",
            description: "An intelligent machine learning web application designed to predict employee salaries with high accuracy. The system utilizes advanced regression algorithms including Linear Regression and Random Forest.",
            tech: ["Python", "Flask", "Scikit-learn", "Pandas"],
            image: "/images/salary.png",
            link: "https://github.com/shoibahmad/employee-salary-predictor"
        },
        {
            title: "Food POS Application",
            category: "Mobile Apps",
            date: "App",
            description: "A comprehensive Point of Sale (POS) system specifically designed for restaurants. Streamlines order management, inventory tracking, and sales analytics in real-time.",
            tech: ["Flutter", "Firebase", "Dart"],
            image: "/images/Food.png",
            link: "https://github.com/shoibahmad/Food-Runner"
        }
    ];

    const filteredProjects = activeFilter === 'All'
        ? projects
        : projects.filter(project => project.category === activeFilter);

    const categories = ['All', 'Web Dev', 'Mobile Apps', 'AI/ML'];

    return (
        <section id="projects" className="projects">
            <div className="container">
                <h2 className="section-title">Featured Projects</h2>

                <div className="projects-filter">
                    {categories.map((category) => (
                        <button
                            key={category}
                            className={`filter-btn ${activeFilter === category ? 'active' : ''}`}
                            onClick={() => setActiveFilter(category)}
                        >
                            {category}
                        </button>
                    ))}
                </div>

                <div className="projects-list">
                    {filteredProjects.map((project, index) => (
                        <div
                            key={index}
                            className="project-item spotlight-card animate-on-scroll"
                            style={{ transitionDelay: `${index * 100}ms` }}
                            onMouseMove={handleMouseMove}
                        >
                            <div className="project-image">
                                <div className="browser-mockup-header">
                                    <span className="sc-dot dot-red"></span>
                                    <span className="sc-dot dot-yellow"></span>
                                    <span className="sc-dot dot-green"></span>
                                </div>
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

            <div className="wave-divider">
                <svg data-name="Layer 1" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1200 120" preserveAspectRatio="none">
                    <path d="M985.66,92.83C906.67,72,823.78,31,743.84,14.19c-82.26-17.34-168.06-16.33-250.45.39-57.84,11.73-114,31.07-172,41.86A600.21,600.21,0,0,1,0,27.35V120H1200V95.8C1132.19,118.92,1055.71,111.31,985.66,92.83Z" className="shape-fill"></path>
                </svg>
            </div>
        </section>
    );
};

export default Projects;
