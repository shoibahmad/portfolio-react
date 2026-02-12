import React, { useState, useEffect } from 'react';
import './Projects.css';
import SkeletonProjectCard from './SkeletonProjectCard';
import ProjectModal from './ProjectModal';

const Projects = () => {
    const [activeFilter, setActiveFilter] = useState('All');
    const [loading, setLoading] = useState(true);
    const [selectedProject, setSelectedProject] = useState(null);
    const [isModalOpen, setIsModalOpen] = useState(false);

    useEffect(() => {
        const timer = setTimeout(() => {
            setLoading(false);
        }, 3000);

        return () => clearTimeout(timer);
    }, []);

    const openModal = (project) => {
        setSelectedProject(project);
        setIsModalOpen(true);
    };

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
            challenge: "Small businesses often struggle with real-time inventory tracking and disconnected sales systems, leading to stock discrepancies and revenue leakage. The challenge was to build a cohesive offline-first mobile solution that handles complex data synchronization seamlessly.",
            solution: "Designed a robust Flutter architecture using Provider for efficient state management and Firebase for real-time cloud sync. The app features a custom-built barcode scanner, dynamic sales charting, and an intuitive POS interface that works flawlessly on tablet and mobile form factors.",
            learnings: ["Implementing offline-first data persistence with local caching", "Complex state management with Provider pattern", "Optimizing large list rendering for inventory items"],
            tech: ["Flutter", "Dart", "Firebase", "Cloudinary", "Provider"],
            image: "/images/lumina_dashboard.png",
            link: "#",
            architecture: [
                { step: "User", icon: "fas fa-user-circle" },
                { step: "Flutter UI", icon: "fas fa-mobile-alt" },
                { step: "State Mgmt", icon: "fas fa-code-branch" },
                { step: "Firebase", icon: "fas fa-cloud" },
                { step: "Analytics", icon: "fas fa-chart-line" }
            ]
        },
        {
            title: "RuralHealth AI",
            category: "AI/ML",
            date: "Project",
            description: "A production-ready Digital Health Survey & Risk Screening Tool designed for community health workers to screen rural populations for health risks using WHO algorithms, AI-powered voice vitals, and intelligent analysis.",
            challenge: "Rural communities face severe healthcare gaps with limited access to trained professionals. Community health workers need a simple yet powerful digital tool to perform accurate screenings without deep medical expertise, while handling low-connectivity environments.",
            solution: "Built a full-stack application with a React + TypeScript frontend and a Django REST backend. Integrated Google Gemini AI for intelligent health analysis, OpenAI Whisper for voice-based vitals input, and Tesseract OCR for document scanning. Firebase handles authentication and real-time data sync.",
            learnings: ["Integrating multiple AI services (Gemini, Whisper, OCR) into a unified pipeline", "Designing offline-capable health screening workflows", "Building role-based access for health workers and administrators"],
            tech: ["React", "TypeScript", "Django", "Firebase", "Gemini AI", "Tailwind CSS"],
            image: "/images/ruralhealth.png",
            link: "https://github.com/shoibahmad/RuralHealth",
            architecture: [
                { step: "Health Worker", icon: "fas fa-user-nurse" },
                { step: "React UI", icon: "fab fa-react" },
                { step: "Django API", icon: "fas fa-server" },
                { step: "Gemini AI", icon: "fas fa-brain" },
                { step: "Risk Report", icon: "fas fa-file-medical-alt" }
            ]
        },
        {
            title: "Secure Eval",
            category: "AI/ML",
            date: "Project",
            description: "An AI-powered secure online examination platform with real-time cheating detection, automated proctoring, and comprehensive admin analytics to ensure academic integrity.",
            challenge: "Online exams are vulnerable to cheating through tab-switching, screen sharing, and unauthorized tools. Traditional proctoring is expensive and unscalable. The goal was to build an automated, AI-driven proctoring system that is both effective and resource-efficient.",
            solution: "Developed a full-stack platform with a React frontend and Python FastAPI backend. The system monitors student behavior in real-time — tracking tab switches, browser focus, and suspicious activity patterns. Admins get a comprehensive dashboard with session history, analytics, and AI-generated analysis of exam integrity.",
            learnings: ["Real-time browser event monitoring and anomaly detection", "Building secure exam delivery with anti-cheat mechanisms", "Admin dashboard design with session analytics and AI insights"],
            tech: ["React", "Python", "FastAPI", "Firebase", "Gemini AI", "JavaScript"],
            image: "/images/secureeval.png",
            link: "https://github.com/shoibahmad/Cheating-tracker",
            architecture: [
                { step: "Student", icon: "fas fa-user-graduate" },
                { step: "Exam UI", icon: "fas fa-laptop" },
                { step: "FastAPI", icon: "fas fa-server" },
                { step: "AI Monitor", icon: "fas fa-eye" },
                { step: "Admin Panel", icon: "fas fa-chart-pie" }
            ]
        },
        {
            title: "Code Scraper",
            category: "Web Dev",
            date: "Tool",
            description: "A specialized tool for scraping code and resources from websites/repositories. Automates the extraction process for easier analysis.",
            challenge: "Developers often spend hours manually copying code snippets from documentation or repositories for analysis, which is error-prone and tedious. The goal was to automate this extraction while respecting structure and formatting.",
            solution: "Built a Node.js automation tool using Puppeteer to navigate pages headless-ly. It intelligently identifies code blocks, preserves syntax highlighting context, and packages extracted resources into structured files for immediate developer use.",
            learnings: ["Headless browser orchestration with Puppeteer", "DOM manipulation and traversal strategies", "Handling async/await flows for scraping pipelines"],
            tech: ["React", "Node.js", "Puppeteer"],
            image: "/images/scraper.png",
            link: "https://github.com/shoibahmad/Code-Scraper",
            architecture: [
                { step: "Dev User", icon: "fas fa-laptop-code" },
                { step: "React UI", icon: "fab fa-react" },
                { step: "Node API", icon: "fab fa-node-js" },
                { step: "Puppeteer", icon: "fas fa-robot" },
                { step: "Code Files", icon: "fas fa-file-code" }
            ]
        },
        {
            title: "Truth Guard AI (Misinformation)",
            category: "AI/ML",
            date: "Project",
            description: "A misinformation detector for news, photos, and videos. Built using a robust stack to verify authenticity and combat fake news.",
            challenge: "The rapid spread of fake news across multi-modal media (text and images) creates a trust deficit. Existing tools often focus only on text. The challenge was to integrate differing AI models to verify both textual claims and image authenticity.",
            solution: "Developed a hybrid API using FastAPI that routes content to specialized models. Text is analyzed via NLP transformers for sentiment and fact-checking, while images undergo error level analysis. The React frontend presents a unified 'Truth Score'.",
            learnings: ["Integrating Python ML models with a modern Web Stack", "Handling multi-modal data inputs (Text + Image)", "API latency optimization for ML inference"],
            tech: ["HTML", "CSS", "JavaScript", "Python", "FastAPI"],
            image: "/images/analyzer.png",
            link: "https://github.com/shoibahmad/Misinformation",
            architecture: [
                { step: "User Input", icon: "fas fa-keyboard" },
                { step: "FastAPI", icon: "fas fa-server" },
                { step: "NLP Model", icon: "fas fa-brain" },
                { step: "Validation", icon: "fas fa-check-double" },
                { step: "Truth Score", icon: "fas fa-percentage" }
            ]
        },
        {
            title: "ADR Risk Predictor",
            category: "AI/ML",
            date: "Project",
            description: "Machine learning model designed to predict Adverse Drug Reactions (ADR), helping healthcare professionals assess potential risks.",
            challenge: "Adverse Drug Reactions are a leading cause of hospitalization, yet predicting them is complex due to varied patient histories. We needed a model that could interpret patient attributes and flag high-risk scenarios accurately.",
            solution: "Trained a supervised learning model on anonymized medical datasets using Scikit-learn. The model helps clinicians by outputting risk probabilities based on drug combinations and patient vitals, served via a lightweight Flask API.",
            learnings: ["Data preprocessing for healthcare datasets", "Classification algorithms & model tuning", "Ethical considerations in AI healthcare"],
            tech: ["Python", "ML", "Flask"],
            image: "/images/adr.png",
            link: "https://github.com/shoibahmad/ADR-Risk-Predictor",
            architecture: [
                { step: "Patient Data", icon: "fas fa-file-medical" },
                { step: "Flask API", icon: "fas fa-server" },
                { step: "ML Model", icon: "fas fa-microchip" },
                { step: "Risk Analysis", icon: "fas fa-exclamation-triangle" },
                { step: "Report", icon: "fas fa-file-medical-alt" }
            ]
        },
        {
            title: "Food POS",
            category: "Mobile Apps",
            date: "App",
            description: "A Point of Sale system tailored for food businesses, managing orders, inventory, and sales efficienty.",
            challenge: "Fast-paced food environments require zero-latency interfaces. Generic POS systems are often too cluttered. The challenge was to design a UI that minimizes 'time-to-ticket' for cashiers.",
            solution: "Created a simplified, high-contrast Flutter interface optimized for tablets. It features 'Quick Add' grid layouts, instant order modification, and background syncing to ensuring the kitchen display is always up to date.",
            learnings: ["UX design for high-stress environments", "Optimizing touch targets and workflows", "Real-time database triggers"],
            tech: ["Flutter", "Dart", "Firebase"],
            image: "/images/Food.png",
            link: "https://github.com/shoibahmad/Food-POS",
            architecture: [
                { step: "Staff", icon: "fas fa-user-tie" },
                { step: "POS Tablet", icon: "fas fa-tablet-alt" },
                { step: "Orders DB", icon: "fas fa-database" },
                { step: "Kitchen View", icon: "fas fa-utensils" }
            ]
        },
        {
            title: "IU CA (Cross Platform App)",
            category: "Mobile Apps",
            date: "App",
            description: "A comprehensive academic management mobile application for the university department. Handles student data, notices, and resources.",
            challenge: "University communication was fragmented across physical boards and WhatsApp groups. Students missed crucial updates. The plan was to centralize all academic comms into a single, official app.",
            solution: "Launched a centralized mobile portal comprising Notice Boards, Attendance Tracking, and Resource Sharing. Implemented role-based access control (RBAC) so professors can push updates that students receive instantly via notifications.",
            learnings: ["Role-Based Access Control (RBAC)", "Push Notification Services integration", "Designing for large user bases (Students)"],
            tech: ["Flutter", "Dart", "Firebase", "JSON"],
            image: "/images/iu_ca_app.png",
            link: "https://github.com/shoibahmad/IU-CA",
            architecture: [
                { step: "Student", icon: "fas fa-user-graduate" },
                { step: "App UI", icon: "fas fa-mobile" },
                { step: "Firebase", icon: "fas fa-cloud" },
                { step: "Notices", icon: "fas fa-bell" }
            ]
        },
        {
            title: "Code Analyzer Tool",
            category: "Web Dev",
            date: "Tool",
            description: "A sophisticated static code analysis tool that helps developers identify code quality issues, security vulnerabilities, and performance bottlenecks.",
            challenge: "Developers often ship code with subtle bugs or style violations. Running full CI/CD pipelines for small checks is slow. We needed a lightweight, client-side tool for instant feedback.",
            solution: "Implemented an Abstract Syntax Tree (AST) parser in the browser. It tokenizes JavaScript code in real-time to detect anti-patterns and suggest ES6+ modernizations without sending code to a server.",
            learnings: ["Abstract Syntax Trees (AST) logic", "Compiler theory basics", "Client-side file processing performance"],
            tech: ["React", "Vite", "Firebase", "Node.js"],
            image: "/images/analyzer.png",
            link: "https://github.com/shoibahmad/Code-Analyzer",
            architecture: [
                { step: "Source Code", icon: "fas fa-code" },
                { step: "Parser", icon: "fas fa-filter" },
                { step: "AST Analysis", icon: "fas fa-tree" },
                { step: "Report UI", icon: "fas fa-clipboard-list" }
            ]
        },
        {
            title: "Employee Salary Predict",
            category: "AI/ML",
            date: "ML Project",
            description: "An intelligent machine learning web application designed to predict employee salaries with high accuracy utilizing advanced regression algorithms.",
            challenge: "Salary negotiations are often based on intuition rather than data. Both HR and candidates lacked a transparent baseline. The aim was to use data science to output fair market value estimates.",
            solution: "Built a regression pipeline using Pandas for data cleaning and Scikit-learn for modeling. The system analyzes years of experience, test scores, and interview performance to predict a precise salary figure.",
            learnings: ["Regression analysis techniques", "Feature Engineering and selection", "Deploying ML to a web interface"],
            tech: ["Python", "Flask", "Scikit-learn", "Pandas"],
            image: "/images/salary.png",
            link: "https://github.com/shoibahmad/employee-salary-predictor",
            architecture: [
                { step: "Emp Data", icon: "fas fa-users" },
                { step: "Preprocessing", icon: "fas fa-cogs" },
                { step: "Regression", icon: "fas fa-chart-bar" },
                { step: "Prediction", icon: "fas fa-dollar-sign" }
            ]
        },
        {
            title: "Campus Grievance System",
            category: "Mobile Apps",
            date: "Project",
            description: "A mobile-first application designed to streamline the grievance redressal process in educational institutions. Students can lodge complaints and track status.",
            challenge: "Traditional grievance redressal was opaque and paper-based, leading to unresolved student issues. A digital, transparent tracking system was required to ensure accountability.",
            solution: "Developed a ticket-based mobile app where students lodge complaints that are auto-assigned to department heads. Features include status tracking, anonymous reporting, and admin escalation workflows.",
            learnings: ["Workflow automation logic", "Ticket status state machines", "Anonymous data handling"],
            tech: ["Flutter", "Dart", "Firebase", "Android"],
            image: "/images/grievance.png",
            link: "https://github.com/shoibahmad/Campus-Grievance",
            architecture: [
                { step: "Student", icon: "fas fa-user" },
                { step: "App Input", icon: "fas fa-edit" },
                { step: "Admin Panel", icon: "fas fa-user-shield" },
                { step: "Resolution", icon: "fas fa-check" }
            ]
        },
        {
            title: "Finance Management System",
            category: "Web Dev",
            date: "Project",
            description: "A personal finance tracking application with expense categorization, budget planning, and financial analytics for better money management.",
            challenge: "Tracking expenses across multiple accounts manually is error-prone. Users fail to stick to budgets without visualization. The goal was to make personal finance visual and automatic.",
            solution: "Created a React-based dashboard that aggregates expense data into clean charts. Users can set monthly caps, view spending vs budget, and categorize transactions for better financial health insights.",
            learnings: ["Data Visualization with Chart.js", "CRUD operations with MongoDB", "Authentication and secure data storage"],
            tech: ["React", "Node.js", "MongoDB"],
            image: "/images/Management.jpeg",
            link: "#",
            architecture: [
                { step: "User", icon: "fas fa-user" },
                { step: "React Dashboard", icon: "fas fa-columns" },
                { step: "Express API", icon: "fas fa-server" },
                { step: "MongoDB", icon: "fas fa-database" }
            ]
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
                                    <button
                                        onClick={() => openModal(project)}
                                        className="project-link"
                                        style={{ width: '100%', border: 'none', cursor: 'pointer', display: 'flex', justifyContent: 'center', alignItems: 'center' }}
                                    >
                                        View Case Study <i className="fas fa-arrow-right" style={{ marginLeft: '8px', fontSize: '0.8em' }}></i>
                                    </button>
                                </div>
                            </div>
                        ))
                    )}
                </div>
            </div>

            <ProjectModal
                project={selectedProject}
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
            />

            <div className="wave-divider">
                <svg data-name="Layer 1" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1200 120" preserveAspectRatio="none">
                    <path d="M985.66,92.83C906.67,72,823.78,31,743.84,14.19c-82.26-17.34-168.06-16.33-250.45.39-57.84,11.73-114,31.07-172,41.86A600.21,600.21,0,0,1,0,27.35V120H1200V95.8C1132.19,118.92,1055.71,111.31,985.66,92.83Z" className="shape-fill"></path>
                </svg>
            </div>
        </section>
    );
};

export default Projects;
