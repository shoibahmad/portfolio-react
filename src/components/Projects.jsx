import React, { useState, useEffect } from 'react';
import './Projects.css';
import SkeletonProjectCard from './SkeletonProjectCard';
import ProjectModal from './ProjectModal';
import Spotlight from './ui/Spotlight';

const Projects = () => {
    const [activeFilter, setActiveFilter] = useState('All');
    const [loading, setLoading] = useState(true);
    const [selectedProject, setSelectedProject] = useState(null);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [searchQuery, setSearchQuery] = useState('');

    useEffect(() => {
        const timer = setTimeout(() => {
            setLoading(false);
        }, 3000);

        return () => clearTimeout(timer);
    }, []);

    useEffect(() => {
        if (!loading) {
            const observer = new IntersectionObserver((entries) => {
                entries.forEach((entry) => {
                    if (entry.isIntersecting) {
                        entry.target.classList.add('is-visible');
                    }
                });
            }, {
                threshold: 0.1,
                rootMargin: '0px 0px -50px 0px'
            });

            const hiddenElements = document.querySelectorAll('.project-item.animate-on-scroll');
            hiddenElements.forEach((el) => observer.observe(el));

            return () => observer.disconnect();
        }
    }, [loading, activeFilter]);

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
            title: "AgentForge — gitagent Studio",
            category: "Web Dev",
            date: "Project",
            description: "A polished, 100% client-side studio for building, validating, and packaging AI agents in the gitagent format. A 5-step guided builder generates agent.yaml, SOUL.md, RULES.md, and skill definitions with a live VS Code-style editor, in-browser spec validation, one-click ZIP download, and shareable URL state — no backend, no sign-up.",
            challenge: "Defining AI agents in the gitagent spec requires hand-writing YAML and Markdown files with strict schema rules. Developers had no visual tooling to build, validate, and package agents without deep knowledge of the spec format or risk of producing invalid repositories.",
            solution: "Built a Next.js 16 App Router SPA with TypeScript and a custom AgentContext using useReducer for typed state management. The 5-step builder maps directly to each output file. Step 5 renders a VS Code-style editor with highlight.js syntax highlighting, a full spec compliance validator with jump-to-step navigation, JSZip for client-side ZIP bundling, and Base64 URL encoding for shareable agent configs. Zero data leaves the browser.",
            learnings: ["Client-side ZIP generation with JSZip — no server upload required", "Base64 URL state encoding for shareable, server-free configuration links", "Building a spec compliance validator with scored pass/warn/fail reporting", "useReducer + createContext for complex multi-step form state management", "VS Code-style file tree editor with highlight.js YAML and Markdown rendering"],
            tech: ["Next.js", "TypeScript", "Tailwind CSS", "Framer Motion", "JSZip", "highlight.js"],
            image: "/images/agentforge.svg",
            link: "https://github.com/shoibahmad/agentforge",
            architecture: [
                { step: "5-Step Builder", icon: "fas fa-list-ol" },
                { step: "AgentContext", icon: "fas fa-cogs" },
                { step: "Validator", icon: "fas fa-check-double" },
                { step: "JSZip", icon: "fas fa-file-archive" },
                { step: "gitagent Repo", icon: "fas fa-robot" }
            ]
        },
        {
            title: "Mike AI — Smart Recruitment Platform",
            category: "AI/ML",
            date: "Project",
            description: "A premium AI-driven recruitment intelligence platform that uses Gemini embeddings and pgvector semantic search to rank candidates by true experience-role fit — not keywords. Features a drag-and-drop Kanban pipeline, live talent pool analytics with draggable widgets, and an enterprise-grade glassmorphism dark UI.",
            challenge: "Traditional recruitment tools rely on keyword filters that miss qualified candidates whose experience doesn't match exact phrasing. Recruiters also lack a unified view combining AI match scoring, pipeline management, and talent analytics in one cohesive interface.",
            solution: "Built a React 19 + Vite frontend with pure CSS glassmorphism and canvas-confetti for pipeline celebrations. The FastAPI backend uses LangChain with Gemini 2.5 Flash for semantic matching and Gemini Text Embedding (gemini-embedding-004) stored in Supabase pgvector for high-dimensional similarity search. Match results include AI-generated Pros & Cons with visual skill, experience, and role-fit breakdowns.",
            learnings: ["Vector-based semantic search with pgvector and Gemini embeddings for candidate ranking", "LangChain + Gemini 2.5 Flash for structured AI match insight generation", "Drag-and-drop Kanban with real-time Supabase persistence and stage-specific themes", "Draggable analytics widgets with live CRUD re-calculation of talent pool stats"],
            tech: ["React", "FastAPI", "Gemini AI", "Supabase", "LangChain", "pgvector", "Python", "Vite"],
            image: "/images/mike_ai.svg",
            link: "https://github.com/shoibahmad/mike-ai",
            architecture: [
                { step: "Job Description", icon: "fas fa-file-alt" },
                { step: "Embeddings", icon: "fas fa-vector-square" },
                { step: "pgvector", icon: "fas fa-database" },
                { step: "Gemini Match", icon: "fas fa-brain" },
                { step: "Kanban Board", icon: "fas fa-columns" }
            ]
        },
        {
            title: "PriceRadar — Market Triangulation Engine",
            category: "AI/ML",
            date: "Project",
            description: "A high-fidelity market intelligence platform that scrapes real-time pricing data across Amazon, Flipkart, Meesho, and Snapdeal. Features multimodal image recon via Gemini Vision for OCR-driven product identification, AI merchant trust validation, market volatility analytics, and a brutalist design aesthetic built for operational speed.",
            challenge: "Consumers and operators lack a unified tool to compare prices across major Indian e-commerce platforms in real-time. Existing tools are slow, single-platform, and offer no AI-driven deal intelligence or vendor reliability scoring.",
            solution: "Built a Next.js 16 + React 19 frontend with TanStack Query for real-time data streaming and Framer Motion for premium micro-animations. The FastAPI backend runs multi-threaded Playwright scrapers across 4 retail nodes with async SQLAlchemy for persistence. Gemini 2.5 Flash handles image-based product identification via drag-and-drop recon, query optimization, and merchant trust analysis. Docker Compose containerizes the full stack.",
            learnings: ["Multi-threaded Playwright scraping across fortified retail nodes with header rotation", "Gemini 2.5 multimodal pipeline for OCR-driven product identification from images", "TanStack Query v5 for real-time price stream caching and synchronization", "Async SQLAlchemy 2.0 + Aiosqlite for non-blocking database operations", "Brutalist design system with Tailwind CSS 4.0 and high-contrast aesthetics"],
            tech: ["Next.js", "React", "FastAPI", "Gemini AI", "Playwright", "Firebase", "Tailwind CSS", "Docker"],
            image: "/images/priceradar.svg",
            link: "https://github.com/shoibahmad/priceradar",
            architecture: [
                { step: "Image/Query", icon: "fas fa-search" },
                { step: "Playwright", icon: "fas fa-robot" },
                { step: "4 Retailers", icon: "fas fa-store" },
                { step: "Gemini 2.5", icon: "fas fa-brain" },
                { step: "Price Intel", icon: "fas fa-chart-line" }
            ]
        },
        {
            title: "ResuMind AI — Resume Intelligence Engine",
            category: "AI/ML",
            date: "Project",
            description: "A premium AI-powered career trajectory engine that audits resumes like a top-tier technical recruiter. Features ATS readability scoring, job description match analysis, a 'Shadow Recruiter' visual audit powered by Gemini Vision, predictive 10-year career roadmaps, salary coaching, and dynamic interview prep.",
            challenge: "Most resume tools do shallow keyword matching and return generic feedback. Candidates have no visibility into how ATS systems parse their profile, how a recruiter visually scans their layout in 6 seconds, or what strategic gaps are blocking their next role.",
            solution: "Built a FastAPI backend serving Gemini 2.5 Flash for both vision and text analysis. The vision pipeline audits typography, whitespace, and visual hierarchy. The text pipeline runs ATS parsing, JD match scoring, missing skills detection, salary range estimation, and generates personalized interview questions. Firebase handles auth and Firestore stores analysis history. Deployed on Render via render.yaml.",
            learnings: ["Using Gemini Vision for document layout and visual hierarchy analysis", "ATS parsing logic and keyword gap detection against job descriptions", "Predictive career roadmap generation with salary milestones using LLMs", "Unified FastAPI + static frontend served from a single Render web service"],
            tech: ["Python", "FastAPI", "Gemini AI", "Firebase", "JavaScript", "Lottie"],
            image: "/images/resumind.svg",
            link: "https://github.com/shoibahmad/Resume-Analyzer",
            architecture: [
                { step: "Resume PDF", icon: "fas fa-file-pdf" },
                { step: "FastAPI", icon: "fas fa-server" },
                { step: "Gemini Vision", icon: "fas fa-eye" },
                { step: "NLP Analysis", icon: "fas fa-brain" },
                { step: "Career Report", icon: "fas fa-road" }
            ]
        },
        {
            title: "Aura — Advanced Sentiment Intelligence Platform",
            category: "AI/ML",
            date: "Project",
            description: "A full-stack NLP-powered web application for real-time sentiment analysis, emotion detection, sarcasm scoring, toxicity filtering, and AI-driven text insights. Supports individual text analysis, bulk CSV/TXT uploads, interactive dashboards, and Gemini AI-powered personality profiling.",
            challenge: "Sentiment analysis tools are often shallow — returning just positive/negative labels with no deeper context. The challenge was to build a multi-dimensional NLP pipeline that goes beyond polarity to detect emotions, sarcasm, toxicity, named entities, and aspect-level sentiment, all while making results human-readable through generative AI.",
            solution: "Built a FastAPI backend orchestrating TextBlob, NRCLex, SpaCy, and LangDetect in a unified analysis pipeline. Integrated Gemini 2.5 Flash for conversational explanations and multi-tone text rewrites. The Vanilla JS + Tailwind frontend features three portals — User, Dashboard, and Admin — with Chart.js visualizations, word clouds, and Firebase Auth for session management.",
            learnings: ["Building a multi-library NLP pipeline (TextBlob + NRCLex + SpaCy) in a single API call", "Heuristic sarcasm detection using tone-emoji contradictions and polarity-emotion mismatch", "Gemini AI for psychological personality profiling from analysis history", "Bulk file analysis with CSV/TXT parsing and aggregate summaries", "Admin panel with platform-wide analytics, user management, and CSV export"],
            tech: ["Python", "FastAPI", "Gemini AI", "Firebase", "SpaCy", "TextBlob", "Tailwind CSS", "Chart.js"],
            image: "/images/aura.svg",
            link: "https://github.com/shoibahmad/aura",
            architecture: [
                { step: "Text Input", icon: "fas fa-keyboard" },
                { step: "NLP Pipeline", icon: "fas fa-brain" },
                { step: "FastAPI", icon: "fas fa-server" },
                { step: "Gemini 2.5", icon: "fas fa-magic" },
                { step: "Dashboard", icon: "fas fa-chart-pie" }
            ]
        },
        {
            title: "Web Sonar — Advanced Web Intelligence Platform",
            category: "AI/ML",
            date: "MCA Final Year Project",
            description: "A cutting-edge web analysis platform that fuses headless browser automation with Google Gemini 2.5 AI. Delivers deep X-ray insights into any website — from visual regression time-travel to dark pattern detection, privacy compliance, and full AI-powered strategic reports across 30 analysis modules.",
            challenge: "Modern websites are complex ecosystems of tech stacks, security postures, accessibility gaps, and dark patterns. No single tool could provide a holistic, AI-augmented view. The challenge was to build a unified platform that runs 24+ backend analyzers in parallel, integrates multiple AI services, and presents results in a clean, real-time dashboard.",
            solution: "Built a React 18 + Vite SPA with Firebase Auth and Firestore for user management. The FastAPI backend orchestrates 24 analyzer modules using Selenium and Playwright for headless scraping, Gemini 2.5 Flash for AI insights, Wayback Machine API for time-travel regression, APScheduler for cron monitoring, and ReportLab for PDF exports. Also ships a Chrome Extension (MV3) for one-click scanning.",
            learnings: ["Orchestrating 24 parallel async analyzers with FastAPI", "Integrating Gemini 2.5 for RAG-style site chat and AI critique", "Building a Chrome Extension (Manifest V3) with popup UI", "Wayback Machine API for visual regression time-travel", "APScheduler cron jobs with Slack/Discord/Email alert webhooks"],
            tech: ["React", "FastAPI", "Python", "Gemini AI", "Firebase", "Selenium", "Playwright", "Tailwind CSS"],
            image: "/images/web_sonar.svg",
            link: "https://github.com/shoibahmad/web-sonar",
            architecture: [
                { step: "URL Input", icon: "fas fa-globe" },
                { step: "Selenium/PW", icon: "fas fa-robot" },
                { step: "24 Analyzers", icon: "fas fa-microscope" },
                { step: "Gemini 2.5", icon: "fas fa-brain" },
                { step: "Dashboard", icon: "fas fa-chart-bar" }
            ]
        },
        {
            title: "Smart Health Appointment System",
            category: "AI/ML",
            date: "Academic Project",
            description: "A full-stack appointment scheduling system with AI-powered symptom analysis. Uses a Naive Bayes classifier to analyze natural language symptoms and recommend the appropriate medical department, followed by smart slot booking.",
            challenge: "Patients often don't know which medical department to visit for their symptoms, leading to wrong bookings and wasted time. The challenge was to build an intelligent triage system that understands natural language and maps symptoms to the right specialist.",
            solution: "Built a React + Vite frontend with client-side routing and premium animations on the landing page. The FastAPI backend runs a Naive Bayes ML pipeline that processes symptom text, predicts the relevant department, and returns available appointment slots for booking.",
            learnings: ["Naive Bayes text classification for medical NLP", "Integrating a Python ML pipeline with a FastAPI REST backend", "Building multi-step UX flows with React Router"],
            tech: ["React", "Vite", "FastAPI", "Python", "Naive Bayes", "React Router"],
            image: "/images/smart_health.svg",
            link: "#",
            architecture: [
                { step: "Patient", icon: "fas fa-user-injured" },
                { step: "React UI", icon: "fab fa-react" },
                { step: "FastAPI", icon: "fas fa-server" },
                { step: "Naive Bayes", icon: "fas fa-brain" },
                { step: "Slot Booking", icon: "fas fa-calendar-check" }
            ]
        },
        {
            title: "Lumina - Smart Inventory Management",
            category: "Mobile Apps",
            date: "Project",
            description: "Lumina is a modern, premium inventory management and Point of Sale (POS) application built with Flutter. It streamlines product tracking, sales recording, and business analytics with a beautiful, user-centric interface.",
            challenge: "Small businesses often struggle with real-time inventory tracking and disconnected sales systems, leading to stock discrepancies and revenue leakage. The challenge was to build a cohesive offline-first mobile solution that handles complex data synchronization seamlessly.",
            solution: "Designed a robust Flutter architecture using Provider for efficient state management and Firebase for real-time cloud sync. The app features a custom-built barcode scanner, dynamic sales charting, and an intuitive POS interface that works flawlessly on tablet and mobile form factors.",
            learnings: ["Implementing offline-first data persistence with local caching", "Complex state management with Provider pattern", "Optimizing large list rendering for inventory items"],
            tech: ["Flutter", "Dart", "Firebase", "Cloudinary", "Provider"],
            image: "/images/lumina.svg",
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
            image: "/images/ruralhealth.svg",
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
            image: "/images/secureeval.svg",
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
            image: "/images/scraper.svg",
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
            image: "/images/misinformation.svg",
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
            image: "/images/adr.svg",
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
            image: "/images/food_pos.svg",
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
            image: "/images/iu_ca.svg",
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
            image: "/images/code_analyzer.svg",
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
            image: "/images/salary.svg",
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
            image: "/images/grievance.svg",
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
            image: "/images/finance.svg",
            link: "#",
            architecture: [
                { step: "User", icon: "fas fa-user" },
                { step: "React Dashboard", icon: "fas fa-columns" },
                { step: "Express API", icon: "fas fa-server" },
                { step: "MongoDB", icon: "fas fa-database" }
            ]
        }
    ];

    const filteredProjects = projects.filter(project => {
        const matchesCategory = activeFilter === 'All' || project.category === activeFilter;
        const matchesSearch = searchQuery === '' || 
            project.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
            project.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
            project.tech.some(tech => tech.toLowerCase().includes(searchQuery.toLowerCase()));
        return matchesCategory && matchesSearch;
    });

    const categories = ['All', 'Web Dev', 'Mobile Apps', 'AI/ML'];

    // Extract all unique technologies for tag cloud
    const allTechnologies = [...new Set(projects.flatMap(p => p.tech))];
    const techCount = {};
    projects.forEach(project => {
        project.tech.forEach(tech => {
            techCount[tech] = (techCount[tech] || 0) + 1;
        });
    });

    return (
        <section id="projects" className="projects">
            <div className="container">
                <h2 className="section-title">Featured Projects</h2>

                {/* Search Bar */}
                <div className="projects-search">
                    <div className="search-wrapper">
                        <i className="fas fa-search search-icon"></i>
                        <input
                            type="text"
                            placeholder="Search projects by name, description, or technology..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className="search-input"
                        />
                        {searchQuery && (
                            <button 
                                className="search-clear"
                                onClick={() => setSearchQuery('')}
                                aria-label="Clear search"
                            >
                                <i className="fas fa-times"></i>
                            </button>
                        )}
                    </div>
                </div>

                {/* Tags Cloud */}
                <div className="tags-cloud">
                    <h3 className="tags-title">Popular Technologies</h3>
                    <div className="tags-wrapper">
                        {allTechnologies.sort((a, b) => techCount[b] - techCount[a]).map((tech, idx) => (
                            <button
                                key={idx}
                                className={`tag-item ${searchQuery.toLowerCase() === tech.toLowerCase() ? 'active' : ''}`}
                                style={{ 
                                    fontSize: `${0.85 + (techCount[tech] * 0.1)}rem`,
                                    opacity: 0.6 + (techCount[tech] * 0.1)
                                }}
                                onClick={() => setSearchQuery(tech)}
                            >
                                {tech}
                                <span className="tag-count">{techCount[tech]}</span>
                            </button>
                        ))}
                    </div>
                </div>

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

                {/* Results count */}
                <div className="projects-results">
                    <p>Showing {filteredProjects.length} of {projects.length} projects</p>
                </div>

                <Spotlight className="projects-list">
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
                                data-category={project.category}
                                style={{ transitionDelay: `${index * 100}ms` }}
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
                </Spotlight>
            </div>

            <ProjectModal
                project={selectedProject}
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
            />

        </section>
    );
};

export default Projects;
