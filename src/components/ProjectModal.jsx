import React, { useEffect, useState } from 'react';
import ReactDOM from 'react-dom';
import './ProjectModal.css';

const ProjectModal = ({ project, isOpen, onClose }) => {
    const [active, setActive] = useState(false);

    useEffect(() => {
        if (isOpen) {
            setActive(true);
            document.body.style.overflow = 'hidden';
        } else {
            setActive(false);
            document.body.style.overflow = '';
        }
    }, [isOpen]);

    if (!project) return null;

    // Default data if specific fields aren't present
    const challenge = project.challenge || "The primary challenge was to create a scalable, user-centric solution that addresses specific efficiency bottlenecks in the target domain. This required a deep understanding of user workflows and performance constraints.";
    const solution = project.solution || "We engineered a robust architecture leveraging modern frameworks to ensure real-time data processing and a seamless user experience. Key focus was placed on modular design and clean code principles.";
    const keyLearnings = project.learnings || ["Advanced state management techniques", "Performance optimization for high-traffic scenarios", "Integration of third-party APIs with error handling"];

    return ReactDOM.createPortal(
        <div className={`project-modal-overlay ${active ? 'active' : ''}`} onClick={(e) => {
            if (e.target === e.currentTarget) onClose();
        }}>
            <div className={`project-modal-container`}>
                <div className="project-modal-header">
                    <h2>{project.title}</h2>
                    <button className="close-modal-btn" onClick={onClose}>
                        <i className="fas fa-times"></i>
                    </button>
                </div>

                <div className="project-modal-content">
                    <div className="modal-hero">
                        <img src={project.image} alt={project.title} />
                        <div className="modal-hero-overlay">
                            <div className="modal-badges">
                                <span className="modal-badge">{project.category}</span>
                                <span className="modal-badge">{project.date}</span>
                            </div>
                        </div>
                    </div>

                    <div className="modal-body">
                        <div className="case-study-section">
                            <h3><i className="fas fa-mountain"></i> The Challenge</h3>
                            <p>{challenge}</p>
                        </div>

                        <div className="case-study-section">
                            <h3><i className="fas fa-lightbulb"></i> The Solution</h3>
                            <p>{solution}</p>
                            <div className="architecture-block">
                                {project.architecture && project.architecture.length > 0 ? (
                                    <div className="architecture-flow">
                                        {project.architecture.map((node, i) => (
                                            <React.Fragment key={i}>
                                                <div className="arch-node">
                                                    <div className="arch-icon">
                                                        <i className={node.icon}></i>
                                                    </div>
                                                    <span className="arch-label">{node.step}</span>
                                                </div>
                                                {i < project.architecture.length - 1 && (
                                                    <div className="arch-arrow">
                                                        <i className="fas fa-long-arrow-alt-right"></i>
                                                    </div>
                                                )}
                                            </React.Fragment>
                                        ))}
                                    </div>
                                ) : (
                                    <>
                                        <i className="fas fa-layer-group" style={{ fontSize: '2rem', marginBottom: '1rem', color: 'var(--text-muted)' }}></i>
                                        <p>System Architecture & Data Flow</p>
                                    </>
                                )}
                            </div>
                        </div>

                        <div className="case-study-section">
                            <h3><i className="fas fa-code"></i> Tech Stack & Tools</h3>
                            <div className="tech-stack-grid">
                                {project.tech.map((tech, idx) => (
                                    <div key={idx} className="tech-tag">
                                        <i className="fas fa-check-circle" style={{ color: 'var(--accent)', fontSize: '0.8rem' }}></i>
                                        {tech}
                                    </div>
                                ))}
                            </div>
                        </div>

                        <div className="case-study-section">
                            <h3><i className="fas fa-brain"></i> Key Learnings</h3>
                            <ul style={{ paddingLeft: '20px', color: 'var(--text-secondary)' }}>
                                {keyLearnings.map((learning, idx) => (
                                    <li key={idx} style={{ marginBottom: '0.5rem' }}>{learning}</li>
                                ))}
                            </ul>
                        </div>
                    </div>
                </div>

                <div className="modal-footer">
                    <a href={project.link} target="_blank" rel="noopener noreferrer" className="btn btn-secondary">
                        <i className="fab fa-github"></i> Repository
                    </a>
                    <a href={project.link} target="_blank" rel="noopener noreferrer" className="btn btn-primary">
                        <i className="fas fa-external-link-alt"></i> Live Demo
                    </a>
                </div>
            </div>
        </div>,
        document.body
    );
};

export default ProjectModal;
