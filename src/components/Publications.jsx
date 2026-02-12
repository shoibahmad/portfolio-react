import React from 'react';
import './Publications.css';
import { motion } from 'framer-motion';

const Publications = () => {
    const publications = [
        {
            title: "IU CA Cross Platform App: A Comprehensive University Management Solution",
            journal: "International Journal of Science and Advanced Technology (IJSAT)",
            year: "2025",
            authors: "Shoib Ahmad",
            link: "https://www.ijsat.org/research-paper.php?id=9262",
            status: "Published",
            date: "14/11/2025",
            abstract: "A cross-platform solution addressing modern university management challenges through unified digital interfaces."
        }
    ];

    const containerVariants = {
        hidden: { opacity: 0 },
        visible: {
            opacity: 1,
            transition: {
                staggerChildren: 0.2
            }
        }
    };

    const cardVariants = {
        hidden: { opacity: 0, y: 30 },
        visible: {
            opacity: 1,
            y: 0,
            transition: { duration: 0.6 }
        }
    };

    return (
        <section id="publications" className="publications">
            <div className="container">
                <div className="section-header">
                    <h2 className="section-title">Selected <span className="text-gradient-blue">Publications</span></h2>
                    <p className="section-subtitle">Research contributions and academic papers advancing the field of Computer Science.</p>
                </div>

                <motion.div
                    className="publications-grid"
                    variants={containerVariants}
                    initial="hidden"
                    whileInView="visible"
                    viewport={{ once: true, margin: "-100px" }}
                >
                    {publications.map((pub, index) => (
                        <motion.article key={index} className="pub-card glass-panel" variants={cardVariants}>
                            <div className="pub-year-badge">{pub.year}</div>

                            <div className="pub-content">
                                <div className="pub-meta-top">
                                    <span className="pub-journal"><i className="fas fa-book-open"></i> {pub.journal}</span>
                                </div>

                                <h3 className="pub-title">
                                    <a href={pub.link} target="_blank" rel="noopener noreferrer">
                                        {pub.title}
                                    </a>
                                </h3>

                                {pub.abstract && <p className="pub-abstract">{pub.abstract}</p>}

                                <div className="pub-footer">
                                    <span className="pub-authors"><i className="fas fa-user-edit"></i> {pub.authors}</span>
                                    <div className="pub-actions">
                                        <a href={pub.link} className="btn-icon" target="_blank" rel="noopener noreferrer" title="Read Paper">
                                            <i className="fas fa-external-link-alt"></i>
                                        </a>
                                        <span className={`status-badge ${pub.status.toLowerCase()}`}>
                                            {pub.status}
                                        </span>
                                    </div>
                                </div>
                            </div>

                            <div className="card-glow"></div>
                        </motion.article>
                    ))}
                </motion.div>
            </div>
        </section>
    );
};

export default Publications;
