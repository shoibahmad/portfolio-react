import React, { useState, useEffect } from 'react';
import './Projects.css';
import SkeletonProjectCard from './SkeletonProjectCard';

const Projects = () => {
    const [activeFilter, setActiveFilter] = useState('All');
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const timer = setTimeout(() => {
            setLoading(false);
        }, 3000);

        return () => clearTimeout(timer);
    }, []);

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
            title: "Lumina - Smart Inventory Management",
            category: "Mobile Apps",
            date: "Project",
            description: "Lumina is a modern, premium inventory management and Point of Sale (POS) application built with Flutter. It streamlines product tracking, sales recording, and business analytics with a beautiful, user-centric interface.",
            tech: ["Flutter", "Dart", "Firebase", "Cloudinary", "Provider"],
            image: "/images/lumina_dashboard.png",
            link: "#"
        },
        {
            title: "Code Scraper",
            category: "Web Dev",
            date: "Tool",
            description: "A specialized tool for scraping code and resources from websites/repositories. Automates the extraction process for easier analysis.",
            tech: ["React", "Node.js", "Puppeteer"],
            image: "/images/scraper.png",
            link: "https://github.com/shoibahmad/Code-Scraper"
        },
        {
            title: "Truth Guard AI (Misinformation)",
            category: "AI/ML",
            date: "Project",
            description: "A misinformation detector for news, photos, and videos. Built using a robust stack to verify authenticity and combat fake news.",
            tech: ["HTML", "CSS", "JavaScript", "Python", "FastAPI"],
            image: "/images/analyzer.png",
            link: "https://github.com/shoibahmad/Misinformation"
        },
        {
            title: "ADR Risk Predictor",
            category: "AI/ML",
            date: "Project",
            description: "Machine learning model designed to predict Adverse Drug Reactions (ADR), helping healthcare professionals assess potential risks.",
            tech: ["Python", "ML", "Flask"],
            image: "/images/adr.png",
            link: "https://github.com/shoibahmad/ADR-Risk-Predictor"
        },
        {
            title: "Food POS",
            category: "Mobile Apps",
            date: "App",
            description: "A Point of Sale system tailored for food businesses, managing orders, inventory, and sales efficienty.",
            tech: ["Flutter", "Dart", "Firebase"],
            image: "/images/Food.png",
            link: "https://github.com/shoibahmad/Food-POS"
        },
        {
            title: "IU CA (Cross Platform App)",
            category: "Mobile Apps",
            date: "App",
            description: "A comprehensive academic management mobile application for the university department. Handles student data, notices, and resources.",
            tech: ["Flutter", "Dart", "Firebase", "JSON"],
            image: "/images/iu_ca_app.png",
            link: "https://github.com/shoibahmad/IU-CA"
        },
        {
            title: "Code Analyzer Tool",
            category: "Web Dev",
            date: "Tool",
            description: "A sophisticated static code analysis tool that helps developers identify code quality issues, security vulnerabilities, and performance bottlenecks.",
            tech: ["React", "Vite", "Firebase", "Node.js"],
            image: "/images/analyzer.png",
            link: "https://github.com/shoibahmad/Code-Analyzer"
        },
        {
            title: "Employee Salary Predict",
            category: "AI/ML",
            date: "ML Project",
            description: "An intelligent machine learning web application designed to predict employee salaries with high accuracy utilizing advanced regression algorithms.",
            tech: ["Python", "Flask", "Scikit-learn", "Pandas"],
            image: "/images/salary.png",
            link: "https://github.com/shoibahmad/employee-salary-predictor"
        },
        {
            title: "Campus Grievance System",
            category: "Mobile Apps",
            date: "Project",
            description: "A mobile-first application designed to streamline the grievance redressal process in educational institutions. Students can lodge complaints and track status.",
            tech: ["Flutter", "Dart", "Firebase", "Android"],
            image: "/images/grievance.png",
            link: "https://github.com/shoibahmad/Campus-Grievance"
        },
        {
            title: "Finance Management System",
            category: "Web Dev",
            date: "Project",
            description: "A personal finance tracking application with expense categorization, budget planning, and financial analytics for better money management.",
            tech: ["React", "Node.js", "MongoDB"],
            image: "/images/Management.jpeg",
            link: "#"
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
                    {loading ? (
                        // Show 6 skeleton cards while loading
                        Array(6).fill(0).map((_, index) => (
                            <SkeletonProjectCard key={`skeleton-${index}`} />
                        ))
                    ) : (
                        filteredProjects.map((project, index) => (
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
                        ))
                    )}
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
