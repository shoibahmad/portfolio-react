import React from 'react';
import { motion } from 'framer-motion';
import './Services.css';
import Spotlight from './ui/Spotlight';

const Services = () => {
    const services = [
        {
            icon: "fa-mobile-screen-button",
            title: "Flutter & Mobile Apps",
            tag: "CROSS-PLATFORM",
            description: "Building high-performance, cross-platform mobile applications for iOS and Android using Flutter. Specialized in beautiful glassmorphism UIs and 60fps smooth animations."
        },
        {
            icon: "fa-react",
            title: "React & Next.js Architecture",
            tag: "FULL STACK WEB",
            description: "Developing dynamic, responsive, and fast-loading single-page web applications (SPAs) with modern React 19 / Next.js ecosystems, custom hooks, and scalable state management."
        },
        {
            icon: "fa-robot",
            title: "GenAI & Agentic Systems",
            tag: "INTELLIGENT AI",
            description: "End-to-end AI orchestration: LangChain RAG pipelines, pgvector high-dimensional similarity search, multi-agent workflows, and custom Gemini / LLM integrations."
        }
    ];

    return (
        <section id="services" className="services">
            <div className="container">
                <div className="section-header text-center">
                    <div className="services-badge">
                        <span className="badge-dot"></span>
                        EXPERTISE & SERVICES
                    </div>
                    <h2 className="section-title">
                        Solutions Engineered with <span className="hero-title-accent">Precision.</span>
                    </h2>
                    <p className="section-subtitle">Areas of technical mastery, architecture, and production delivery</p>
                </div>
                <Spotlight className="services-grid">
                    {services.map((service, index) => (
                        <motion.div
                            key={index}
                            className="service-card research-card spotlight-card"
                            initial={{ opacity: 0, y: 30 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ duration: 0.5, delay: index * 0.15 }}
                            whileHover={{ y: -8, scale: 1.02 }}
                        >
                            <div className="card-border-glow"></div>
                            <div className="service-tag">{service.tag}</div>
                            <div className="service-icon">
                                <i className={`fas ${service.icon}`}></i>
                            </div>
                            <h3>{service.title}</h3>
                            <p>{service.description}</p>
                            <div className="card-footer-line"></div>
                        </motion.div>
                    ))}
                </Spotlight>
            </div>
        </section>
    );
};

export default Services;
